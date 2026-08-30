from sqlalchemy import (
    Column,
    Integer,
    Float,
    Boolean,
    String,
    DateTime
)

from datetime import datetime

from app.database import Base


# ==================================================
# TRANSACTION MODEL
# ==================================================

class Transaction(Base):

    __tablename__ = "transactions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    amount = Column(
        Float,
        nullable=False
    )

    transaction_frequency = Column(
        Integer,
        default=0
    )

    account_age = Column(
        Integer,
        default=0
    )

    new_device = Column(
        Boolean,
        default=False
    )

    foreign_location = Column(
        Boolean,
        default=False
    )

    location_mismatch = Column(
        Boolean,
        default=False
    )

    failed_attempts = Column(
        Integer,
        default=0
    )

    transaction_hour = Column(
        Integer,
        default=12
    )

    risk_score = Column(
        Integer,
        nullable=False
    )

    risk_level = Column(
        String,
        nullable=False
    )

    decision = Column(
        String,
        nullable=False
    )

    ml_risk_score = Column(
        Integer,
        default=0
    )

    fraud_probability = Column(
        Float,
        default=0
    )

    reasons = Column(
        String,
        default=""
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )


# ==================================================
# USER MODEL
# ==================================================

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        index=True,
        nullable=False
    )

    password = Column(
        String,
        nullable=False
    )