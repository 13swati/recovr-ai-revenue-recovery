from sqlalchemy import Column, Integer, Numeric, String
from database import Base


class Payment(Base):
    __tablename__ = "payments"

    payment_id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(String(20), nullable=False)
    failure_reason = Column(String(100), nullable=True)
    payment_method = Column(String(50), nullable=False)