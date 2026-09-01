from sqlalchemy import Column, Integer, String, DateTime
from database import Base


class Customer(Base):
    __tablename__ = "customers"

    customer_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    phone = Column(String(20), nullable=False)
    created_at = Column(DateTime, nullable=True)