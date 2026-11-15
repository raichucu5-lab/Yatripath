from fastapi import FastAPI
from fastapi .middleware.cors import CORSMiddleware
from pydantic import BaseModel 
from fastapi import HTTPException
import bcrypt
from fastapi import Depends
from sqlalchemy.orm import Session
from database import Base, engine, get_db, User, Station


app=FastAPI()
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/item/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}

app.add_middleware(
CORSMiddleware,
allow_origins=["http://127.0.0.1:5500" ,"http://localhost:5500"],
allow_methods=["*"],
allow_headers=["*"],
)

class LoginIn(BaseModel):
    email:str
    password:str

class RegisterIn(BaseModel):
     full_name:str
     email:str
     password:str
     date_of_birth: str | None = None
     phone: str | None = None


@app.post("/auth/register", status_code=201)
def register(data: RegisterIn, db: Session = Depends(get_db)):
    if len(data.password) < 8:
        raise HTTPException(status_code=422, detail="Password must be at least 8 characters")
    if db.query(User).filter_by(email=data.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")
    hashed = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    db.add(User(full_name=data.full_name, email=data.email, password_hash=hashed,
                date_of_birth=data.date_of_birth, phone=data.phone))
    db.commit()
    return {"ok": True}


@app.post("/auth/login")
def login(data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter_by(email=data.email).first()
    if not user or not bcrypt.checkpw(data.password.encode(), user.password_hash.encode()):
        raise HTTPException(status_code=401, detail="Wrong email or password")
    return {"access_token": "dev-token", "name": user.full_name, "role": user.role}

@app.get("/stations")
def list_stations(db: Session = Depends(get_db)):
    rows = db.query(Station).order_by(Station.city).all()
    return [{"id": s.id, "name": s.name, "city": s.city, "type": s.type} for s in rows]