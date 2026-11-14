from fastapi import FastAPI
from fastapi .middleware.cors import CORSMiddleware
from pydantic import BaseModel 
from fastapi import HTTPException


app=FastAPI()

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

users = {} 
class RegisterIn(BaseModel):
     full_name:str
     email:str
     password:str
     date_of_birth: str | None = None
     phone: str | None = None


@app.post("/auth/register", status_code=201)
def register(data: RegisterIn):
    if data.email in users:
        raise HTTPException(status_code=409, detail="Email already registered")
    users[data.email] = data
    return {"ok": True}

@app.post("/auth/login")
def login(data: LoginIn):
    user = users.get(data.email)
    if not user or user.password != data.password:
        raise HTTPException(status_code=401, detail="Wrong email or password")
    return {"access_token": "dev-token", "name": user.full_name, "role": "traveller"}