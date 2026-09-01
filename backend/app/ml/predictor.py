import os

import joblib
import pandas as pd

from .feature_engineering import build_ml_features


# -----------------------------------------
# Load trained model
# -----------------------------------------

MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "recovery_model.pkl"
)

model = joblib.load(MODEL_PATH)


# -----------------------------------------
# Predict recovery success
# -----------------------------------------

def predict_recovery(context):

    # Build ML features
    features = build_ml_features(
        context
    )

    # Convert to DataFrame
    input_data = pd.DataFrame([
        features
    ])

    # Predict probability
    probability = model.predict_proba(
        input_data
    )[0][1]

    # Predict class
    prediction = model.predict(
        input_data
    )[0]

    # -----------------------------------------
    # Determine risk
    # -----------------------------------------

    if probability >= 0.70:
        risk_level = "low"

    elif probability >= 0.40:
        risk_level = "medium"

    else:
        risk_level = "high"

    return {
        "recovery_probability": round(
            float(probability),
            4
        ),

        "predicted_success": bool(
            prediction
        ),

        "risk_level": risk_level
    }