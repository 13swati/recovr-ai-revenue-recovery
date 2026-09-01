import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# -----------------------------------------
# 1. Load training data
# -----------------------------------------

data = pd.read_csv("training_data.csv")

print("Training data loaded")
print(data.head())


# -----------------------------------------
# 2. Separate features and target
# -----------------------------------------

X = data.drop("recovery_success", axis=1)
y = data["recovery_success"]


# -----------------------------------------
# 3. Identify categorical columns
# -----------------------------------------

categorical_features = [
    "customer_value",
    "failure_reason",
    "recovery_priority"
]


# -----------------------------------------
# 4. Preprocessing
# -----------------------------------------

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        )
    ],
    remainder="passthrough"
)


# -----------------------------------------
# 5. Create ML model
# -----------------------------------------

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42
)


# -----------------------------------------
# 6. Create pipeline
# -----------------------------------------

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# -----------------------------------------
# 7. Split dataset
# -----------------------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# -----------------------------------------
# 8. Train model
# -----------------------------------------

pipeline.fit(X_train, y_train)


# -----------------------------------------
# 9. Evaluate model
# -----------------------------------------

predictions = pipeline.predict(X_test)

accuracy = accuracy_score(
    y_test,
    predictions
)

print("\nModel Accuracy:", accuracy)

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        predictions,
        zero_division=0
    )
)


# -----------------------------------------
# 10. Save model
# -----------------------------------------

joblib.dump(
    pipeline,
    "recovery_model.pkl"
)

print("\nModel saved successfully!")
print("File: recovery_model.pkl")