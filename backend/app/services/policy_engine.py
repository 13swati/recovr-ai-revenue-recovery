def validate_action(action, context):

    payment = context["payment"]
    attempts = context["payment_attempts"]

    attempt_count = len(attempts)

    # Never retry a successful payment
    if payment.status == "success":
        return {
            "decision": "blocked",
            "reason": "Payment is already successful"
        }

    # Retry policy
    if action == "retry":

        if attempt_count >= 3:
            return {
                "decision": "blocked",
                "reason": "Maximum retry limit reached"
            }

        return {
            "decision": "allowed",
            "reason": "Retry is within allowed limit"
        }

    # Payment link is generally safe
    if action == "payment_link":
        return {
            "decision": "allowed",
            "reason": "Customer can complete payment manually"
        }

    # Escalation
    if action == "escalate":
        return {
            "decision": "allowed",
            "reason": "Manual review is required"
        }

    return {
        "decision": "blocked",
        "reason": "Unknown recovery action"
    }