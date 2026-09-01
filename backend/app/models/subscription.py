from sqlalchemy import Column, Integer, Numeric, String, DateTime
from database import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    subscription_id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, nullable=False)
    plan_name = Column(String(100), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    billing_cycle = Column(String(20), nullable=False)
    status = Column(String(20), nullable=False)
    created_at = Column(DateTime, nullable=True)