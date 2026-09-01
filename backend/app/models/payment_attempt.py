from sqlalchemy import Column, Integer, String, DateTime
from database import Base


class PaymentAttempt(Base):
    __tablename__ = "payment_attempts"

    attempt_id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(Integer, nullable=False)
    attempt_number = Column(Integer, nullable=False)
    status = Column(String(20), nullable=False)
    failure_reason = Column(String(100), nullable=True)
    attempted_at = Column(DateTime, nullable=True)
    