from sqlalchemy.orm import Session

from models.payment import Payment
from models.subscription import Subscription


def analyze_customer(customer_id: int, db: Session):
    """
    Analyze a customer's historical payment behavior
    and calculate their revenue profile.
    """

    # -------------------------------------------------
    # Get customer's payments
    # -------------------------------------------------

    payments = (
        db.query(Payment)
        .filter(Payment.customer_id == customer_id)
        .all()
    )

    # -------------------------------------------------
    # Basic payment statistics
    # -------------------------------------------------

    total_payments = len(payments)

    successful_payments = [
        payment
        for payment in payments
        if payment.status == "success"
    ]

    failed_payments = [
        payment
        for payment in payments
        if payment.status == "failed"
    ]

    successful_count = len(successful_payments)
    failed_count = len(failed_payments)

    # -------------------------------------------------
    # Revenue calculation
    # -------------------------------------------------

    total_revenue = sum(
        float(payment.amount)
        for payment in successful_payments
    )

    total_transaction_value = sum(
        float(payment.amount)
        for payment in payments
    )

    # -------------------------------------------------
    # Success rate
    # -------------------------------------------------

    if total_payments > 0:
        success_rate = successful_count / total_payments
    else:
        success_rate = 0

    # -------------------------------------------------
    # Average payment
    # -------------------------------------------------

    if total_payments > 0:
        average_payment = (
            total_transaction_value / total_payments
        )
    else:
        average_payment = 0

    # -------------------------------------------------
    # Subscription information
    # -------------------------------------------------

    subscription = (
        db.query(Subscription)
        .filter(
            Subscription.customer_id == customer_id
        )
        .first()
    )

    subscription_value = 0
    plan_name = None

    if subscription:
        subscription_value = float(
            subscription.amount
        )
        plan_name = subscription.plan_name

    # -------------------------------------------------
    # Customer value classification
    # -------------------------------------------------

    if total_revenue >= 25000:
        customer_value = "high"

    elif total_revenue >= 10000:
        customer_value = "medium"

    else:
        customer_value = "low"

    # -------------------------------------------------
    # Customer reliability
    # -------------------------------------------------

    if success_rate >= 0.90:
        reliability = "excellent"

    elif success_rate >= 0.70:
        reliability = "good"

    elif success_rate >= 0.50:
        reliability = "moderate"

    else:
        reliability = "poor"

    # -------------------------------------------------
    # Recovery priority
    # -------------------------------------------------

    if (
        customer_value == "high"
        and reliability in ["excellent", "good"]
    ):
        recovery_priority = "very_high"

    elif customer_value == "high":
        recovery_priority = "high"

    elif (
        customer_value == "medium"
        and reliability in ["excellent", "good"]
    ):
        recovery_priority = "high"

    elif customer_value == "medium":
        recovery_priority = "medium"

    else:
        recovery_priority = "low"

    return {
        "customer_id": customer_id,

        "payment_history": {
            "total_payments": total_payments,
            "successful_payments": successful_count,
            "failed_payments": failed_count,
            "success_rate": round(
                success_rate,
                2
            )
        },

        "revenue": {
            "total_revenue": round(
                total_revenue,
                2
            ),
            "total_transaction_value": round(
                total_transaction_value,
                2
            ),
            "average_payment": round(
                average_payment,
                2
            )
        },

        "subscription": {
            "plan_name": plan_name,
            "amount": subscription_value
        },

        "customer_profile": {
            "customer_value": customer_value,
            "reliability": reliability,
            "recovery_priority": recovery_priority
        }
    }