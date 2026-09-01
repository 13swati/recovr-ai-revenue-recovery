from datetime import datetime

from sqlalchemy import Column, Integer, Numeric, String, DateTime
from database import Base


class RecoveryAction(Base):
    __tablename__ = "recovery_actions"

    action_id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    payment_id = Column(
        Integer,
        nullable=False
    )

    action_type = Column(
        String(50),
        nullable=False
    )

    confidence = Column(
        Numeric(5, 4),
        nullable=True
    )

    policy_decision = Column(
        String(20),
        nullable=False
    )

    execution_status = Column(
        String(30),
        nullable=False
    )

    outcome = Column(
        String(255),
        nullable=True
    )

    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow
    )