def detect_payment_failure(payment):
    """
    Automatically determines whether a payment has failed
    and whether recovery is required.
    """

    status = (payment.status or "").strip().lower()

    failed_statuses = {
        "failed",
        "failure",
        "declined",
        "blocked",
        "cancelled",
        "canceled"
    }

    is_failed = status in failed_statuses

    return {
        "payment_id": payment.payment_id,
        "status": payment.status,
        "is_failed": is_failed,
        "recovery_required": is_failed,
        "reason": payment.failure_reason
    }