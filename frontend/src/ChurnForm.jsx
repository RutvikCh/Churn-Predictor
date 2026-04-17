import React, { useState } from "react";

const initial = {
  credit_score: 600,
  age: 35,
  tenure: 3,
  balance: 50000,
  num_of_products: 2,
  has_cr_card: 1,
  is_active_member: 1,
  estimated_salary: 80000,
  geography: "France",
  gender: "Male",
};

export default function ChurnForm({ onSubmit, loading }) {
  const [form, setForm] = useState(initial);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const fields = [
    { key: "credit_score", label: "Credit Score", type: "number", min: 300, max: 900 },
    { key: "age", label: "Age", type: "number", min: 18, max: 100 },
    { key: "tenure", label: "Tenure (years)", type: "number", min: 0, max: 10 },
    { key: "balance", label: "Balance ($)", type: "number" },
    { key: "num_of_products", label: "Number of Products", type: "number", min: 1, max: 4 },
    { key: "estimated_salary", label: "Estimated Salary ($)", type: "number" },
  ];

  return (
    <div>
      <div style={styles.grid}>
        {fields.map(({ key, label, type, min, max }) => (
          <div key={key} style={styles.field}>
            <label style={styles.label}>{label}</label>
            <input
              type={type}
              min={min}
              max={max}
              value={form[key]}
              onChange={(e) => set(key, Number(e.target.value))}
              style={styles.input}
            />
          </div>
        ))}

        <div style={styles.field}>
          <label style={styles.label}>Geography</label>
          <select
            value={form.geography}
            onChange={(e) => set("geography", e.target.value)}
            style={styles.input}
          >
            {["France", "Germany", "Spain"].map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Gender</label>
          <select
            value={form.gender}
            onChange={(e) => set("gender", e.target.value)}
            style={styles.input}
          >
            <option>Male</option>
            <option>Female</option>
          </select>
        </div>
      </div>

      <div style={styles.toggleRow}>
        {[
          { key: "has_cr_card", label: "Has Credit Card" },
          { key: "is_active_member", label: "Active Member" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => set(key, form[key] === 1 ? 0 : 1)}
            style={{
              ...styles.toggle,
              background: form[key] === 1 ? "#0ea5e9" : "#334155",
            }}
          >
            {form[key] === 1 ? "✓" : "✗"} {label}
          </button>
        ))}
      </div>

      <button
        onClick={() => onSubmit(form)}
        disabled={loading}
        style={styles.submit}
      >
        {loading ? "Predicting..." : "Predict Churn →"}
      </button>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginBottom: "1rem",
  },
  field: { display: "flex", flexDirection: "column", gap: "0.3rem" },
  label: { fontSize: "0.8rem", color: "#94a3b8", fontWeight: 600 },
  input: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "0.5rem",
    color: "#f1f5f9",
    padding: "0.6rem 0.8rem",
    fontSize: "0.95rem",
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  },
  toggleRow: { display: "flex", gap: "1rem", marginBottom: "1.5rem" },
  toggle: {
    flex: 1,
    padding: "0.6rem",
    borderRadius: "0.5rem",
    border: "none",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "0.85rem",
    transition: "background 0.2s",
  },
  submit: {
    width: "100%",
    padding: "0.9rem",
    background: "linear-gradient(90deg, #0ea5e9, #6366f1)",
    border: "none",
    borderRadius: "0.75rem",
    color: "#fff",
    fontWeight: 800,
    fontSize: "1rem",
    cursor: "pointer",
    letterSpacing: "0.05em",
  },
};