import pandas as pd
from tensorflow import keras
import joblib

model = None
scaler = None

FEATURE_COLUMNS = [
    "CreditScore",
    "Age",
    "Tenure",
    "Balance",
    "NumOfProducts",
    "HasCrCard",
    "IsActiveMember",
    "EstimatedSalary",
    "Germany",
    "Spain",
    "Male"
]

def load_model():
    global model, scaler
    model = keras.models.load_model("churn_model.h5")
    scaler = joblib.load("scaler.pkl")
    print("Model and scaler loaded successfully!")

def predict(data):
    row = {
        "CreditScore": data["credit_score"],
        "Age": data["age"],
        "Tenure": data["tenure"],
        "Balance": data["balance"],
        "NumOfProducts": data["num_of_products"],
        "HasCrCard": data["has_cr_card"],
        "IsActiveMember": data["is_active_member"],
        "EstimatedSalary": data["estimated_salary"],
        "Germany": 1 if data["geography"] == "Germany" else 0,
        "Spain": 1 if data["geography"] == "Spain" else 0,
        "Male": 1 if data["gender"] == "Male" else 0
    }

    df = pd.DataFrame([row], columns=FEATURE_COLUMNS)

    X = scaler.transform(df)

    prob = float(model.predict(X, verbose=0)[0][0])

    return {
        "churn_probability": round(prob * 100, 2),
        "prediction": "Will Churn" if prob >= 0.5 else "Will Stay",
        "risk": "High" if prob >= 0.70 else "Medium" if prob >= 0.30 else "Low"
    }