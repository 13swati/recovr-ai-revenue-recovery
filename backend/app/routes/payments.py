from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db

from models.payment import Payment
from models.customer import Customer
from models.subscription import Subscription
from models.payment_attempt import PaymentAttempt
from models.recovery_action import RecoveryAction

from ml.predictor import predict_recovery

from services.failure_detector import detect_payment_failure
from services.customer_intelligence import analyze_customer
from services.scoring_engine import calculate_recovery_score
from services.recovery_engine import analyze_payment
from services.policy_engine import validate_action
from services.action_executor import execute_action


router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


# =========================================================
# BUILD PAYMENT CONTEXT
# =========================================================

def build_payment_context(
    payment_id: int,
    db: Session
):

    payment = (
        db.query(Payment)
        .filter(Payment.payment_id == payment_id)
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    customer = (
        db.query(Customer)
        .filter(
            Customer.customer_id == payment.customer_id
        )
        .first()
    )

    subscription = (
        db.query(Subscription)
        .filter(
            Subscription.customer_id == payment.customer_id
        )
        .first()
    )

    attempts = (
        db.query(PaymentAttempt)
        .filter(
            PaymentAttempt.payment_id == payment_id
        )
        .order_by(
            PaymentAttempt.attempt_number
        )
        .all()
    )

    recovery_actions = (
        db.query(RecoveryAction)
        .filter(
            RecoveryAction.payment_id == payment_id
        )
        .order_by(
            RecoveryAction.action_id
        )
        .all()
    )

    return {
        "payment": payment,
        "customer": customer,
        "subscription": subscription,
        "payment_attempts": attempts,
        "recovery_actions": recovery_actions
    }


# =========================================================
# GET ALL PAYMENTS
# =========================================================

@router.get("/")
def get_payments(
    db: Session = Depends(get_db)
):

    payments = db.query(Payment).all()

    return payments


# =========================================================
# GET SINGLE PAYMENT
# =========================================================

@router.get("/{payment_id}")
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db)
):

    payment = (
        db.query(Payment)
        .filter(Payment.payment_id == payment_id)
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    return {
        "payment_id": payment.payment_id,
        "customer_id": payment.customer_id,
        "amount": float(payment.amount),
        "status": payment.status,
        "failure_reason": payment.failure_reason,
        "payment_method": payment.payment_method
    }


# =========================================================
# GET PAYMENT CONTEXT
# =========================================================

@router.get("/{payment_id}/context")
def get_payment_context(
    payment_id: int,
    db: Session = Depends(get_db)
):

    return build_payment_context(
        payment_id,
        db
    )


# =========================================================
# GET RECOVERY HISTORY
# =========================================================

@router.get("/{payment_id}/recovery-history")
def get_recovery_history(
    payment_id: int,
    db: Session = Depends(get_db)
):

    payment = (
        db.query(Payment)
        .filter(
            Payment.payment_id == payment_id
        )
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    recovery_actions = (
        db.query(RecoveryAction)
        .filter(
            RecoveryAction.payment_id == payment_id
        )
        .order_by(
            RecoveryAction.action_id
        )
        .all()
    )

    return {
        "payment_id": payment_id,
        "total_actions": len(recovery_actions),

        "recovery_history": [
            {
                "action_id": action.action_id,
                "action_type": action.action_type,
                "confidence": float(action.confidence)
                if action.confidence is not None
                else None,
                "policy_decision": action.policy_decision,
                "execution_status": action.execution_status,
                "outcome": action.outcome,
                "created_at": action.created_at
            }
            for action in recovery_actions
        ]
    }


# =========================================================
# ANALYZE PAYMENT
# =========================================================

@router.post("/{payment_id}/analyze")
def analyze_payment_recovery(
    payment_id: int,
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # 1. Build payment context
    # -----------------------------------------------------

    context = build_payment_context(
        payment_id,
        db
    )

    payment = context["payment"]

    # -----------------------------------------------------
    # 1.1 AUTOMATIC FAILURE DETECTION
    # -----------------------------------------------------

    failure = detect_payment_failure(payment)

    if not failure["is_failed"]:
        return {
            "payment_id": payment.payment_id,
            "status": payment.status,
            "recovery_required": False,
            "failure_reason": failure["reason"],
            "message": "Payment is not failed. Recovery analysis is not required."
        }

    # -----------------------------------------------------
    # 2. Customer Intelligence
    # -----------------------------------------------------

    customer_profile = analyze_customer(
        payment.customer_id,
        db
    )

    context["customer_profile"] = customer_profile

    # -----------------------------------------------------
    # 3. ML Prediction
    # -----------------------------------------------------

    ml_prediction = predict_recovery(
        context
    )

    # -----------------------------------------------------
    # 4. Recovery Score
    # -----------------------------------------------------

    recovery_profile = calculate_recovery_score(
        context
    )

    # -----------------------------------------------------
    # 5. Recovery Engine
    # -----------------------------------------------------

    recommendation = analyze_payment(
        context
    )

    # -----------------------------------------------------
    # 6. Policy Engine
    # -----------------------------------------------------

    policy = validate_action(
        recommendation["action"],
        context
    )

    # -----------------------------------------------------
    # 7. Final Response
    # -----------------------------------------------------

    return {
        "payment_id": payment_id,
        "status": payment.status,
        "recovery_required": True,
        "failure_reason": payment.failure_reason,

        "ml_prediction": ml_prediction,

        "recovery_profile": recovery_profile,

        "customer_profile": customer_profile,

        "recommendation": recommendation,

        "policy": policy
    }


# =========================================================
# RECOVER PAYMENT
# =========================================================

@router.post("/{payment_id}/recover")
def recover_payment(
    payment_id: int,
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # 1. Build payment context
    # -----------------------------------------------------

    context = build_payment_context(
        payment_id,
        db
    )

    payment = context["payment"]

    # -----------------------------------------------------
    # 1.1 AUTOMATIC FAILURE DETECTION
    # -----------------------------------------------------

    failure = detect_payment_failure(payment)

    if not failure["is_failed"]:
        return {
            "payment_id": payment.payment_id,
            "status": payment.status,
            "recovery_required": False,
            "failure_reason": failure["reason"],

            "execution": {
                "status": "SKIPPED",
                "message": (
                    "Payment is not failed. "
                    "Recovery action was not executed."
                )
            }
        }

    # -----------------------------------------------------
    # 2. Customer Intelligence
    # -----------------------------------------------------

    customer_profile = analyze_customer(
        payment.customer_id,
        db
    )

    context["customer_profile"] = customer_profile

    # -----------------------------------------------------
    # 3. ML Prediction
    # -----------------------------------------------------

    ml_prediction = predict_recovery(
        context
    )

    # -----------------------------------------------------
    # 4. Recovery Score
    # -----------------------------------------------------

    recovery_profile = calculate_recovery_score(
        context
    )

    # -----------------------------------------------------
    # 5. Recovery Engine
    # -----------------------------------------------------

    recommendation = analyze_payment(
        context
    )

    # -----------------------------------------------------
    # 6. Policy Engine
    # -----------------------------------------------------

    policy = validate_action(
        recommendation["action"],
        context
    )

    # -----------------------------------------------------
    # 7. Execute Action
    # -----------------------------------------------------

    execution = execute_action(
        payment=payment,
        recommendation=recommendation,
        policy=policy,
        db=db
    )

    # -----------------------------------------------------
    # 8. Persist Recovery Action
    # -----------------------------------------------------

    recovery_action = RecoveryAction(
        payment_id=payment.payment_id,
        action_type=recommendation["action"],
        confidence=recommendation["confidence"],
        policy_decision=policy["decision"],
        execution_status=execution["status"],
        outcome=execution["message"]
    )

    db.add(recovery_action)
    db.commit()
    db.refresh(recovery_action)

    # -----------------------------------------------------
    # 9. Update Execution Action ID
    # -----------------------------------------------------

    execution["action_id"] = recovery_action.action_id

    # -----------------------------------------------------
    # 10. Final Response
    # -----------------------------------------------------

    return {
        "payment_id": payment_id,
        "status": payment.status,
        "recovery_required": True,
        "failure_reason": payment.failure_reason,

        "ml_prediction": ml_prediction,

        "recovery_profile": recovery_profile,

        "customer_profile": customer_profile,

        "recommendation": recommendation,

        "policy": policy,

        "execution": execution,

        "recovery_action": {
            "action_id": recovery_action.action_id,
            "action_type": recovery_action.action_type,
            "confidence": float(
                recovery_action.confidence
            )
            if recovery_action.confidence is not None
            else None,
            "policy_decision": recovery_action.policy_decision,
            "execution_status": recovery_action.execution_status,
            "outcome": recovery_action.outcome,
            "created_at": recovery_action.created_at
        }
    }