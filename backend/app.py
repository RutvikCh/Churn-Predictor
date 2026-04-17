from flask import Flask, request, jsonify
from flask_cors import CORS
from model_loader import load_model, predict

app = Flask(__name__)
CORS(app)

load_model()

@app.route("/predict", methods=["POST"])
def predict_churn():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No input data"}), 400

    required = [
        "credit_score", "age", "tenure", "balance",
        "num_of_products", "has_cr_card", "is_active_member",
        "estimated_salary", "geography", "gender"
    ]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    try:
        result = predict(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True, port=5000)