def calculate_recovery_score(context):
    """
    Calculate the recovery priority score for a failed payment.

    Score range: 0 - 100
    """

    payment = context["payment"]
    customer = context["customer"]
    subscription = context["subscription"]
    attempts = context["payment_attempts"]

    score = 0

    # -------------------------------------------------
    # 1. Payment value
    # -------------------------------------------------

    amount = float(payment.amount)

    if amount >= 10000:
        score += 30
    elif amount >= 5000:
        score += 25
    elif amount >= 1000:
        score += 20
    elif amount >= 500:
        score += 15
    else:
        score += 10

    # -------------------------------------------------
    # 2. Failure reason
    # -------------------------------------------------

    failure_reason = payment.failure_reason

    if failure_reason == "transient_failure":
        score += 10

    elif failure_reason == "insufficient_funds":
        score += 20

    elif failure_reason == "expired_card":
        score += 25

    elif failure_reason == "payment_method_issue":
        score += 20

    else:
        score += 10

    # -------------------------------------------------
    # 3. Number of payment attempts
    # -------------------------------------------------

    attempt_count = len(attempts)

    if attempt_count == 0:
        score += 5

    elif attempt_count == 1:
        score += 10

    elif attempt_count == 2:
        score += 15

    else:
        score += 20

    # -------------------------------------------------
    # 4. Subscription value
    # -------------------------------------------------

    if subscription:

        subscription_amount = float(subscription.amount)

        if subscription_amount >= 5000:
            score += 15

        elif subscription_amount >= 1000:
            score += 10

        else:
            score += 5

    # -------------------------------------------------
    # Keep score between 0 and 100
    # -------------------------------------------------

    score = min(score, 100)

    # -------------------------------------------------
    # Priority classification
    # -------------------------------------------------

    if score >= 70:
        priority = "high"

    elif score >= 40:
        priority = "medium"

    else:
        priority = "low"

    return {
        "score": score,
        "priority": priority,
        "payment_amount": amount,
        "failure_reason": failure_reason,
        "attempt_count": attempt_count
    }