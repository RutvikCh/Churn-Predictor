import React, { useState } from "react";
import ChurnForm from "./ChurnForm";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("http://localhost:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Prediction failed");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const riskColor = {
    High: "#ef4444",
    Medium: "#f97316",
    Low: "#22c55e",
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>⚡ Churn Predictor</h1>
        <p style={styles.subtitle}>ANN-powered customer churn analysis</p>

        <ChurnForm onSubmit={handlePredict} loading={loading} />

        {error && <div style={styles.error}>⚠ {error}</div>}

        {result && (
          <div style={styles.result}>
            <div style={{ ...styles.badge, background: riskColor[result.risk] }}>
              {result.risk} Risk
            </div>
            <h2 style={styles.prediction}>{result.prediction}</h2>
            <div style={styles.prob}>
              <div
                style={{
                  ...styles.bar,
                  width: `${result.churn_probability}%`,
                  background: riskColor[result.risk],
                }}
              />
            </div>
            <p style={styles.probText}>
              Churn Probability: <strong>{result.churn_probability}%</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "2rem",
  },
  card: {
    background: "#1e293b",
    borderRadius: "1.5rem",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "600px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
    color: "#f1f5f9",
  },
  title: { fontSize: "2rem", fontWeight: 800, margin: 0, color: "#38bdf8" },
  subtitle: { color: "#94a3b8", marginBottom: "2rem" },
  error: {
    background: "#450a0a",
    color: "#fca5a5",
    padding: "1rem",
    borderRadius: "0.75rem",
    marginTop: "1rem",
  },
  result: {
    marginTop: "2rem",
    background: "#0f172a",
    borderRadius: "1rem",
    padding: "1.5rem",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    padding: "0.25rem 1rem",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: 700,
    color: "#fff",
    marginBottom: "0.75rem",
  },
  prediction: { fontSize: "1.75rem", fontWeight: 800, margin: "0.5rem 0" },
  prob: {
    background: "#1e293b",
    borderRadius: "999px",
    height: "12px",
    overflow: "hidden",
    margin: "1rem 0",
  },
  bar: { height: "100%", borderRadius: "999px", transition: "width 0.5s ease" },
  probText: { color: "#94a3b8", fontSize: "0.95rem" },
};