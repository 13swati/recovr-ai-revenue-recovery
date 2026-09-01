def analyze_payment(context):

    payment = context["payment"]
    attempts = context["payment_attempts"]

    attempt_count = len(attempts)

    failure_reason = payment.failure_reason

    # Rule 1: Retryable transient failure
    if failure_reason == "transient_failure":
        return {
            "action": "retry",
            "confidence": 0.90,
            "reason": "Transient payment failure may succeed on retry"
        }

    # Rule 2: Insufficient funds
    if failure_reason == "insufficient_funds":

        if attempt_count >= 3:
            return {
                "action": "payment_link",
                "confidence": 0.92,
                "reason": "Retry limit reached for insufficient funds"
            }

        return {
            "action": "retry",
            "confidence": 0.85,
            "reason": "Insufficient funds may be temporary"
        }

    # Rule 3: Expired card
    if failure_reason == "expired_card":
        return {
            "action": "payment_link",
            "confidence": 0.95,
            "reason": "Customer needs to update payment method"
        }

    # Rule 4: Payment method issue
    if failure_reason == "payment_method_issue":
        return {
            "action": "payment_link",
            "confidence": 0.88,
            "reason": "Payment method requires customer intervention"
        }

    # Default
    return {
        "action": "escalate",
        "confidence": 0.60,
        "reason": "Failure reason requires manual review"
    }