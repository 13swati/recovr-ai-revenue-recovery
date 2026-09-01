
def execute_action(
    payment,
    recommendation,
    policy,
    db
):
    """
    Execute an approved recovery action.

    The recovery decision is made by the Recovery Engine
    and Policy Engine.

    This function only executes the approved action
    and returns the execution result.

    RecoveryAction database persistence is handled
    by the payments route.
    """

    action = recommendation.get("action")

    # =========================================================
    # 1. BLOCKED ACTION
    # =========================================================

    if policy.get("decision", "").lower() != "allowed":

        return {
            "action_id": None,
            "action": action,
            "status": "not_executed",
            "message": policy.get(
                "reason",
                "Recovery action is not allowed."
            )
        }

    # =========================================================
    # 2. PAYMENT LINK
    # =========================================================

    if action == "payment_link":

        payment_link = (
            f"https://recovr-demo.local/pay/"
            f"{payment.payment_id}"
        )

        return {
            "action_id": None,
            "action": "payment_link",
            "status": "completed",
            "message": "Payment link generated",
            "payment_link": payment_link
        }

    # =========================================================
    # 3. RETRY PAYMENT
    # =========================================================

    if action == "retry":

        # -----------------------------------------------------
        # Demo-safe retry execution
        # -----------------------------------------------------
        #
        # In a production system this is where we would call
        # the payment gateway API.
        #
        # For now we simulate the gateway retry so that the
        # recovery workflow can be tested safely.
        #

        return {
            "action_id": None,
            "action": "retry",
            "status": "simulated",
            "message": (
                "Payment retry initiated successfully."
            ),
            "payment_id": payment.payment_id
        }

    # =========================================================
    # 4. CONTACT CUSTOMER
    # =========================================================

    if action == "contact_customer":

        return {
            "action_id": None,
            "action": "contact_customer",
            "status": "completed",
            "message": (
                "Customer contact action created."
            ),
            "customer_id": payment.customer_id
        }

    # =========================================================
    # 5. ESCALATE
    # =========================================================

    if action == "escalate":

        return {
            "action_id": None,
            "action": "escalate",
            "status": "completed",
            "message": (
                "Payment escalated for manual review."
            ),
            "payment_id": payment.payment_id
        }

    # =========================================================
    # 6. NO ACTION
    # =========================================================

    if action == "no_action":

        return {
            "action_id": None,
            "action": "no_action",
            "status": "skipped",
            "message": (
                "No recovery action is required."
            )
        }

    # =========================================================
    # 7. UNKNOWN ACTION
    # =========================================================

    return {
        "action_id": None,
        "action": action,
        "status": "not_executed",
        "message": (
            f"Unknown recovery action: {action}"
        )
    }
