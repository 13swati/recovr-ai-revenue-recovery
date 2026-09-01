def build_ml_features(context):
    """
    Convert payment context into features required
    by the ML recovery prediction model.
    """

    payment = context["payment"]
    attempts = context["payment_attempts"]
    subscription = context["subscription"]

    # -----------------------------------------
    # Payment features
    # -----------------------------------------

    payment_amount = float(payment.amount)

    attempt_count = len(attempts)

    failure_reason = (
        payment.failure_reason
        or "unknown"
    )

    # -----------------------------------------
    # Customer features
    # -----------------------------------------

    customer_profile = context.get(
        "customer_profile",
        {}
    )

    payment_history = customer_profile.get(
        "payment_history",
        {}
    )

    total_payments = payment_history.get(
        "total_payments",
        0
    )

    successful_payments = payment_history.get(
        "successful_payments",
        0
    )

    # Calculate success rate
    if total_payments > 0:
        success_rate = (
            successful_payments / total_payments
        )
    else:
        success_rate = 0.0

    # -----------------------------------------
    # Customer value
    # -----------------------------------------

    if payment_amount >= 3000:
        customer_value = "high"

    elif payment_amount >= 1500:
        customer_value = "medium"

    else:
        customer_value = "low"

    # -----------------------------------------
    # Subscription
    # -----------------------------------------

    if subscription:
        subscription_amount = float(
            subscription.amount
        )
    else:
        subscription_amount = payment_amount

    # -----------------------------------------
    # Recovery priority
    # -----------------------------------------

    if payment_amount >= 2000 or attempt_count >= 3:
        recovery_priority = "high"

    elif payment_amount >= 1000:
        recovery_priority = "medium"

    else:
        recovery_priority = "low"

    # -----------------------------------------
    # Return features
    # -----------------------------------------

    return {
        "payment_amount": payment_amount,
        "attempt_count": attempt_count,
        "success_rate": success_rate,
        "customer_value": customer_value,
        "subscription_amount": subscription_amount,
        "failure_reason": failure_reason,
        "recovery_priority": recovery_priority
    }