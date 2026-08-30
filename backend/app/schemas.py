from pydantic import BaseModel, Field


# ==================================================
# TRANSACTION REQUEST
# ==================================================

class TransactionRequest(BaseModel):

    amount: float = Field(
        gt=0
    )

    transaction_frequency: int = Field(
        default=0,
        ge=0
    )

    account_age: int = Field(
        default=0,
        ge=0
    )

    new_device: bool = False

    foreign_location: bool = False

    location_mismatch: bool = False

    failed_attempts: int = Field(
        default=0,
        ge=0
    )

    transaction_hour: int = Field(
        default=12,
        ge=0,
        le=23
    )


# ==================================================
# RISK RESPONSE
# ==================================================

class RiskResponse(BaseModel):

    risk_score: int

    risk_level: str

    decision: str

    reasons: list[str]

    ml_risk_score: int

    fraud_probability: float


# ==================================================
# TRANSACTION HISTORY
# ==================================================

class TransactionHistoryResponse(BaseModel):

    id: int

    amount: float

    transaction_frequency: int

    account_age: int

    new_device: bool

    foreign_location: bool

    location_mismatch: bool

    failed_attempts: int

    transaction_hour: int

    risk_score: int

    risk_level: str

    decision: str

    ml_risk_score: int

    fraud_probability: float

    reasons: list[str]

    created_at: str


# ==================================================
# TRANSACTION STATISTICS
# ==================================================

class TransactionStatsResponse(BaseModel):

    total_transactions: int

    approved: int

    review: int

    blocked: int

    high_risk_percentage: float

    average_risk_score: float