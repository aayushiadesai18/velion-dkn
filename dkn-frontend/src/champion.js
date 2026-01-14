import React, { useEffect, useState } from "react";

function ChampionPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    fetch("http://localhost:4000/qa")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  function handleChange(id, value) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSave(id) {
    const answer = answers[id] || "";
    await fetch(`http://localhost:4000/qa/${id}/answer`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, answer, status: "ANSWERED" } : q
      )
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem 0",
        background: "linear-gradient(135deg, #020617 0%, #0f766e 40%, #06b6d4 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          background: "rgba(15,23,42,0.95)",
          borderRadius: "1.5rem",
          padding: "1.5rem 2rem 2rem",
          color: "white",
        }}
      >
        <h1>Champion QA</h1>
        <div style={{ marginTop: "1rem", background: "#f8fafc", borderRadius: "1rem", padding: "1.5rem" }}>
          {questions.map((q) => (
            <div
              key={q.id}
              style={{
                padding: "1.1rem 1.3rem",
                borderRadius: "0.9rem",
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
                marginBottom: "1rem",
                 color: "#0f172a", 
              }}
            >
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
                QA #{q.id} · Status: {q.status}
              </p>
              <h3 style={{ marginTop: "0.3rem" }}>{q.question}</h3>
              <textarea
                rows={3}
                value={answers[q.id] ?? q.answer ?? ""}
                onChange={(e) => handleChange(q.id, e.target.value)}
                style={{
                  width: "100%",
                  marginTop: "0.5rem",
                  padding: "0.6rem 0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #cbd5f5",
                  resize: "vertical",
                }}
                placeholder="Type your answer here..."
              />
              <button
                onClick={() => handleSave(q.id)}
                style={{
                  marginTop: "0.6rem",
                  padding: "0.5rem 1rem",
                  borderRadius: "999px",
                  border: "none",
                  background:
                    "linear-gradient(135deg, #020617 0%, #0f766e 40%, #06b6d4 100%)",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Save answer
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
}

export default ChampionPage;
