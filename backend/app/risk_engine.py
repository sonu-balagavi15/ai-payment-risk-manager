import os
import joblib


# ==================================================
# LOAD ML MODEL
# ==================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "ml",
    "fraud_model.joblib"
)

model = joblib.load(MODEL_PATH)


# ==================================================
# RISK CALCULATION
# ==================================================

def calculate_risk(transaction):

    # ------------------------------------------------
    # Get transaction values safely
    # ------------------------------------------------

    amount = float(getattr(transaction, "amount", 0) or 0)

    transaction_frequency = int(
        getattr(transaction, "transaction_frequency", 0) or 0
    )

    account_age = int(
        getattr(transaction, "account_age", 0) or 0
    )

    new_device = bool(
        getattr(transaction, "new_device", False)
    )

    foreign_location = bool(
        getattr(transaction, "foreign_location", False)
    )

    location_mismatch = bool(
        getattr(transaction, "location_mismatch", False)
    )

    failed_attempts = int(
        getattr(transaction, "failed_attempts", 0) or 0
    )

    transaction_hour = int(
        getattr(transaction, "transaction_hour", 12) or 12
    )


    # ==================================================
    # RULE-BASED RISK SCORE
    # ==================================================

    score = 0
    reasons = []


    # --------------------------------------------------
    # Transaction amount
    # --------------------------------------------------

    if amount >= 100000:
        score += 30
        reasons.append(
            "Very high transaction amount"
        )

    elif amount >= 50000:
        score += 25
        reasons.append(
            "High transaction amount"
        )

    elif amount >= 20000:
        score += 15
        reasons.append(
            "Above-average transaction amount"
        )


    # --------------------------------------------------
    # Transaction frequency
    # --------------------------------------------------

    if transaction_frequency >= 40:
        score += 20
        reasons.append(
            "Very high transaction frequency"
        )

    elif transaction_frequency >= 20:
        score += 15
        reasons.append(
            "High transaction frequency"
        )

    elif transaction_frequency >= 10:
        score += 8
        reasons.append(
            "Elevated transaction frequency"
        )


    # --------------------------------------------------
    # Account age
    # --------------------------------------------------

    if account_age <= 7:
        score += 20
        reasons.append(
            "Very new account"
        )

    elif account_age <= 30:
        score += 15
        reasons.append(
            "Recently created account"
        )

    elif account_age <= 90:
        score += 8
        reasons.append(
            "Relatively new account"
        )


    # --------------------------------------------------
    # New device
    # --------------------------------------------------

    if new_device:
        score += 15
        reasons.append(
            "Transaction from a new device"
        )


    # --------------------------------------------------
    # Foreign transaction
    # --------------------------------------------------

    if foreign_location:
        score += 15
        reasons.append(
            "Transaction from a foreign or unusual location"
        )


    # --------------------------------------------------
    # Location mismatch
    # --------------------------------------------------

    if location_mismatch:
        score += 15
        reasons.append(
            "User location differs from usual location"
        )


    # --------------------------------------------------
    # Failed attempts
    # --------------------------------------------------

    if failed_attempts >= 5:
        score += 20
        reasons.append(
            "Multiple failed payment attempts"
        )

    elif failed_attempts >= 3:
        score += 12
        reasons.append(
            "Several failed payment attempts"
        )


    # --------------------------------------------------
    # Unusual transaction hour
    # --------------------------------------------------

    if transaction_hour < 5 or transaction_hour >= 23:
        score += 10
        reasons.append(
            "Transaction made during unusual hours"
        )


    # ==================================================
    # ML PREDICTION
    # ==================================================

    try:

        features = [[
            amount,
            int(new_device),
            int(foreign_location),
            failed_attempts,
            transaction_hour
        ]]

        fraud_probability = (
            model.predict_proba(features)[0][1]
        )

        ml_risk_score = round(
            fraud_probability * 100
        )

    except Exception:

        fraud_probability = 0.0
        ml_risk_score = 0


    # ==================================================
    # COMBINE RULE + ML
    # ==================================================

    # Rules are given more importance because they
    # explicitly represent the application's
    # transaction risk indicators.

    combined_score = round(
        (score * 0.75)
        +
        (ml_risk_score * 0.25)
    )

    combined_score = min(
        combined_score,
        100
    )


    # ==================================================
    # RISK LEVEL + DECISION
    # ==================================================

    if combined_score >= 70:

        risk_level = "HIGH"
        decision = "BLOCK"

    elif combined_score >= 40:

        risk_level = "MEDIUM"
        decision = "REVIEW"

    else:

        risk_level = "LOW"
        decision = "APPROVE"


    # ==================================================
    # DEFAULT REASON
    # ==================================================

    if not reasons:

        reasons.append(
            "No major risk indicators detected"
        )


    # ==================================================
    # RETURN RESULT
    # ==================================================

    return {

        "risk_score": combined_score,

        "risk_level": risk_level,

        "decision": decision,

        "reasons": reasons,

        "ml_risk_score": ml_risk_score,

        "fraud_probability": round(
            fraud_probability * 100,
            2
        )
    }