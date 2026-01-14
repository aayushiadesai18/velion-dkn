import React, { useState } from "react";

function QaPage({ user, onBack }) {
  const [question, setQuestion] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    setStatus("Sending...");
    try {
      await fetch("http://localhost:4000/qa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": user.id,
        },
        body: JSON.stringify({ question, context: "" }),
      });
      setStatus("Request sent!");
      setQuestion("");
    } catch {
      setStatus("Failed to send");
    }
  };

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: "2rem 0",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #020617 0%, #0f766e 40%, #06b6d4 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          background: "rgba(15,23,42,0.9)",
          borderRadius: "1.5rem",
          padding: "1.5rem 2rem 2rem",
          color: "white",
        }}
      >
        <button
          onClick={onBack}
          style={{
            marginBottom: "1rem",
            background: "transparent",
            color: "#cbd5f5",
            border: "none",
            cursor: "pointer",
          }}
        >
          ← Back to dashboard
        </button>

        <h1 style={{ marginBottom: "0.25rem" }}>Submit QA Request</h1>
        <p style={{ marginTop: 0, color: "#cbd5f5", fontSize: "0.9rem" }}>
          Ask Knowledge Champions when you cannot find the answer in existing
          knowledge.
        </p>

        <div
          style={{
            marginTop: "1.2rem",
            background: "#f8fafc",
            borderRadius: "1rem",
            padding: "1.5rem",
            color: "#0f172a",
          }}
        >
          <p style={{ marginBottom: "0.75rem", color: "#475569" }}>
            Describe what you need help with, <strong>{user.name}</strong>.
          </p>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
            style={{
              width: "100%",
              minHeight: "140px",
              padding: "0.75rem",
              borderRadius: "0.75rem",
              border: "1px solid #cbd5f5",
              resize: "vertical",
            }}
          />

          <button
            onClick={handleSubmit}
            style={{
              marginTop: "0.9rem",
              padding: "0.6rem 1.2rem",
              borderRadius: "999px",
              border: "none",
              background:
             "linear-gradient(135deg, #020617 0%, #0f766e 40%, #06b6d4 100%)",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Send request
          </button>

          {status && (
            <p
              style={{
                marginTop: "0.6rem",
                fontSize: "0.85rem",
                color: "#64748b",
              }}
            >
              {status}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default QaPage;
