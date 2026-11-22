import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import Base, engine, get_db, User, Station, Route, RouteClass

load_dotenv()

JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET is missing in backend/.env")
JWT_ALGO = "HS256"
TOKEN_HOURS = 24 * 7  # token valid for 7 days

app = FastAPI()
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500",
            "http://127.0.0.1:5501", "http://localhost:5501"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- helpers ----------
def create_token(user: User) -> str:
    payload = {
        "sub": str(user.id),
        "role": user.role,
        "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_HOURS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGO)


def get_current_user(
    authorization: str | None = Header(None),
    db: Session = Depends(get_db),
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization[7:]
    try:
        data = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired, please log in again")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.get(User, int(data["sub"]))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


# ---------- schemas ----------
class LoginIn(BaseModel):
    email: str
    password: str


class RegisterIn(BaseModel):
    full_name: str
    email: str
    password: str
    date_of_birth: str | None = None
    phone: str | None = None


# ---------- routes ----------
@app.get("/")
def read_root():
    return {"status": "ok"}


@app.post("/auth/register", status_code=201)
def register(data: RegisterIn, db: Session = Depends(get_db)):
    email = data.email.strip().lower()
    if len(data.password) < 8:
        raise HTTPException(status_code=422, detail="Password must be at least 8 characters")
    if db.query(User).filter_by(email=email).first():
        raise HTTPException(status_code=409, detail="Email already registered")
    hashed = bcrypt.hashpw(data.password.encode(), bcrypt.gensalt()).decode()
    db.add(User(full_name=data.full_name.strip(), email=email, password_hash=hashed,
                date_of_birth=data.date_of_birth, phone=data.phone))
    db.commit()
    return {"ok": True}


@app.post("/auth/login")
def login(data: LoginIn, db: Session = Depends(get_db)):
    email = data.email.strip().lower()
    user = db.query(User).filter_by(email=email).first()
    if not user or not bcrypt.checkpw(data.password.encode(), user.password_hash.encode()):
        raise HTTPException(status_code=401, detail="Wrong email or password")
    return {"access_token": create_token(user), "name": user.full_name, "role": user.role}


@app.get("/auth/me")
def me(user: User = Depends(get_current_user)):
    return {"id": user.id, "name": user.full_name, "email": user.email,
            "phone": user.phone, "role": user.role}


@app.get("/stations")
def list_stations(db: Session = Depends(get_db)):
    rows = db.query(Station).order_by(Station.city).all()
    return [{"id": s.id, "name": s.name, "city": s.city, "type": s.type} for s in rows]



@app.get("/search")
def search(origin: str, destination: str, transport: str = "all", db: Session = Depends(get_db)):
    q = db.query(Route).filter(
        func.lower(Route.origin) == origin.strip().lower(),
        func.lower(Route.destination) == destination.strip().lower(),
    )
    if transport in ("train", "bus", "flight"):
        q = q.filter(Route.transport == transport)
    result = []
    for r in q.order_by(Route.depart_time).all():
        classes = (db.query(RouteClass).filter_by(route_id=r.id)
                   .order_by(RouteClass.price).all())
        result.append({
            "id": r.id, "transport": r.transport, "operator": r.operator,
            "origin": r.origin, "destination": r.destination,
            "depart_time": r.depart_time, "arrive_time": r.arrive_time,
            "duration_min": r.duration_min,
            "classes": [{"code": c.code, "label": c.label, "price": c.price, "seats": c.seats}
                        for c in classes],
        })
    return result