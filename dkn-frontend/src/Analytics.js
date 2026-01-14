import React, { useEffect, useState } from "react";

function AnalyticsPage({ user, onBack }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function loadAnalytics() {
      try {
        const res = await fetch("http://localhost:4000/analytics", {
  headers: {
    "x-user-id": user.id.toString(),  
  },


        });
        if (!res.ok) {
          console.error("Failed to load analytics");
          setStats(null);
        } else {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error(e);
        setStats(null);
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, [user]);

  const cards = stats
    ? [
        { label: "Total users", value: stats.total_users },
        { label: "Total knowledge items", value: stats.total_knowledge },
        { label: "Pending QA requests", value: stats.pending_qa },
        { label: "Approved items", value: stats.approved_items },
      ]
    : [];

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

        <h1>Analytics</h1>

        {loading ? (
          <p>Loading...</p>
        ) : !stats ? (
          <p>Could not load analytics.</p>
        ) : (
          <div
            style={{
              marginTop: "1rem",
              background: "#f8fafc",
              borderRadius: "1rem",
              padding: "1.5rem",
              color: "#0f172a",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              {cards.map((c) => (
                <div
                  key={c.label}
                  style={{
                    flex: "1 1 180px",
                    padding: "1rem 1.2rem",
                    borderRadius: "0.9rem",
                    border: "1px solid #e2e8f0",
                    background: "#ffffff",
                    boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      color: "#64748b",
                    }}
                  >
                    {c.label}
                  </p>
                  <h2 style={{ marginTop: "0.3rem" }}>{c.value}</h2>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnalyticsPage;
