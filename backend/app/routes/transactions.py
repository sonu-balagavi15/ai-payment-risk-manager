from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Transaction

from app.schemas import (
    TransactionRequest,
    RiskResponse,
    TransactionHistoryResponse,
    TransactionStatsResponse
)

from app.risk_engine import calculate_risk
from app.routes.auth import get_current_user


router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)


# ==================================================
# ANALYZE TRANSACTION
# ==================================================

@router.post(
    "/analyze",
    response_model=RiskResponse
)
def analyze_transaction(
    transaction: TransactionRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    # Run AI + rule engine
    result = calculate_risk(transaction)

    # Save transaction
    db_transaction = Transaction(
        amount=transaction.amount,

        transaction_frequency=(
            transaction.transaction_frequency
        ),

        account_age=(
            transaction.account_age
        ),

        new_device=(
            transaction.new_device
        ),

        foreign_location=(
            transaction.foreign_location
        ),

        location_mismatch=(
            transaction.location_mismatch
        ),

        failed_attempts=(
            transaction.failed_attempts
        ),

        transaction_hour=(
            transaction.transaction_hour
        ),

        risk_score=result["risk_score"],

        risk_level=result["risk_level"],

        decision=result["decision"],

        ml_risk_score=result[
            "ml_risk_score"
        ],

        fraud_probability=result[
            "fraud_probability"
        ],

        reasons="|".join(
            result["reasons"]
        )
    )

    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)

    return result


# ==================================================
# TRANSACTION HISTORY
# ==================================================

@router.get(
    "/history",
    response_model=list[
        TransactionHistoryResponse
    ]
)
def get_transaction_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    transactions = (
        db.query(Transaction)
        .order_by(
            Transaction.id.desc()
        )
        .limit(50)
        .all()
    )

    result = []

    for transaction in transactions:

        result.append({

            "id": transaction.id,

            "amount": transaction.amount,

            "transaction_frequency": (
                transaction.transaction_frequency
            ),

            "account_age": (
                transaction.account_age
            ),

            "new_device": (
                transaction.new_device
            ),

            "foreign_location": (
                transaction.foreign_location
            ),

            "location_mismatch": (
                transaction.location_mismatch
            ),

            "failed_attempts": (
                transaction.failed_attempts
            ),

            "transaction_hour": (
                transaction.transaction_hour
            ),

            "risk_score": (
                transaction.risk_score
            ),

            "risk_level": (
                transaction.risk_level
            ),

            "decision": (
                transaction.decision
            ),

            "ml_risk_score": (
                transaction.ml_risk_score
            ),

            "fraud_probability": (
                transaction.fraud_probability
            ),

            "reasons": (
                transaction.reasons.split("|")
                if transaction.reasons
                else []
            ),

            "created_at": (
                transaction.created_at.isoformat()
            )
        })

    return result


# ==================================================
# TRANSACTION STATISTICS
# ==================================================

@router.get(
    "/stats",
    response_model=TransactionStatsResponse
)
def get_transaction_stats(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):

    total = (
        db.query(Transaction)
        .count()
    )

    approved = (
        db.query(Transaction)
        .filter(
            Transaction.decision == "APPROVE"
        )
        .count()
    )

    review = (
        db.query(Transaction)
        .filter(
            Transaction.decision == "REVIEW"
        )
        .count()
    )

    blocked = (
        db.query(Transaction)
        .filter(
            Transaction.decision == "BLOCK"
        )
        .count()
    )

    high_risk = (
        db.query(Transaction)
        .filter(
            Transaction.risk_level == "HIGH"
        )
        .count()
    )

    if total > 0:

        high_risk_percentage = round(
            (high_risk / total) * 100,
            2
        )

        transactions = (
            db.query(Transaction)
            .all()
        )

        average_risk_score = round(
            sum(
                transaction.risk_score
                for transaction in transactions
            ) / total,
            2
        )

    else:

        high_risk_percentage = 0

        average_risk_score = 0

    return {

        "total_transactions": total,

        "approved": approved,

        "review": review,

        "blocked": blocked,

        "high_risk_percentage": (
            high_risk_percentage
        ),

        "average_risk_score": (
            average_risk_score
        )
    }
