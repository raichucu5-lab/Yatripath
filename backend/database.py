import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, String ,ForeignKey
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Mapped, mapped_column

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))
SessionLocal = sessionmaker(bind=engine)

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)
    full_name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(120), unique=True)
    password_hash: Mapped[str] = mapped_column(String(100))
    date_of_birth: Mapped[str | None] = mapped_column(String(20))
    phone: Mapped[str | None] = mapped_column(String(30))
    role: Mapped[str] = mapped_column(String(20), default="traveller")


class Station(Base):
    __tablename__ = "stations"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    city: Mapped[str] = mapped_column(String(100))
    type: Mapped[str] = mapped_column(String(20))


class Route(Base):
    __tablename__ = "routes"
    id: Mapped[int] = mapped_column(primary_key=True)
    transport: Mapped[str] = mapped_column(String(10))      # train / bus / flight
    operator: Mapped[str] = mapped_column(String(100))
    origin: Mapped[str] = mapped_column(String(100))
    destination: Mapped[str] = mapped_column(String(100))
    depart_time: Mapped[str] = mapped_column(String(5))     # "06:30"
    arrive_time: Mapped[str] = mapped_column(String(5))
    duration_min: Mapped[int]


class RouteClass(Base):
    __tablename__ = "route_classes"
    id: Mapped[int] = mapped_column(primary_key=True)
    route_id: Mapped[int] = mapped_column(ForeignKey("routes.id"))
    code: Mapped[str] = mapped_column(String(30))           # "3a", "economy"
    label: Mapped[str] = mapped_column(String(60))
    price: Mapped[int]
    seats: Mapped[int]

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()