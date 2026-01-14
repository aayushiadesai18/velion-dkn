import React, { useEffect, useState } from "react";

function ReviewPendingPage({ user, onBack }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return; // guard

    async function loadPending() {
      try {
        const res = await fetch("http://localhost:4000/knowledge/pending", {
          headers: { "x-user-id": user.id.toString() },
        });
        if (!res.ok) {
          console.error("Failed to load pending items");
          setItems([]);
        } else {
          const data = await res.json();
          setItems(data);
        }
      } catch (e) {
        console.error(e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadPending();
  }, [user]);

  async function handleDecision(id, action) {
    try {
      const res = await fetch(
        `http://localhost:4000/knowledge/${id}/${action}`,
        {
          method: "POST",
          headers: { "x-user-id": user.id.toString() },
        }
      );
      if (!res.ok) return;
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem 0",
        background:
          "linear-gradient(135deg, #020617 0%, #0f766e 40%, #06b6d4 100%)",
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
        <button
          onClick={onBack}
          style={{
            marginBottom: "1rem",
            padding: "0.3rem 0.8rem",
            borderRadius: "999px",
            border: "1px solid #cbd5f5",
            background: "transparent",
            color: "white",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          ← Back to dashboard
        </button>

        <h1>Review pending knowledge</h1>

        <div
          style={{
            marginTop: "1rem",
            background: "#f8fafc",
            borderRadius: "1rem",
            padding: "1.5rem",
            color: "#0f172a",
          }}
        >
          {loading ? (
            <p>Loading...</p>
          ) : items.length === 0 ? (
            <p>No items waiting for review.</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  marginBottom: "1rem",
                  padding: "0.9rem 1rem",
                  borderRadius: "0.9rem",
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                }}
              >
                <h3 style={{ margin: 0 }}>{item.title}</h3>
                <p
                  style={{
                    margin: "0.2rem 0 0.5rem",
                    fontSize: "0.8rem",
                    color: "#64748b",
                  }}
                >
                  Submitted by {item.owner_name}
                </p>
                <p style={{ marginTop: 0 }}>{item.content}</p>
                <div style={{ marginTop: "0.5rem" }}>
                  <button
                    onClick={() => handleDecision(item.id, "approve")}
                    style={{
                      marginRight: "0.5rem",
                      padding: "0.3rem 0.8rem",
                      borderRadius: "999px",
                      border: "none",
                      background: "#22c55e",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecision(item.id, "reject")}
                    style={{
                      padding: "0.3rem 0.8rem",
                      borderRadius: "999px",
                      border: "none",
                      background: "#ef4444",
                      color: "white",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ReviewPendingPage;
