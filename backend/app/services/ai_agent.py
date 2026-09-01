from services.recovery_engine import analyze_payment


def run_ai_agent(context):
    """
    Main AI Revenue Recovery Agent.

    Receives complete payment context,
    analyzes the failed payment,
    and returns a recovery recommendation.
    """

    recommendation = analyze_payment(context)

    return {
        "agent": "Recovr AI Revenue Recovery Agent",
        "recommendation": recommendation
    }