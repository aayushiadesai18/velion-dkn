import React, { useEffect, useState } from "react";

function AuditLogsPage({ user, onBack }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;        
    async function loadLogs() {
      try {
        const res = await fetch("http://localhost:4000/audit-logs", {
          headers: {
            "x-user-id": user.id,
          },
        });
        if (!res.ok) {
          console.error("Failed to load logs");
          setEvents([]);
        } else {
          const data = await res.json();
          setEvents(data);
        }
      } catch (e) {
        console.error(e);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, [user.id]);
if (!user) {
    return (
      <div>
        <p>Please select a user before viewing audit logs.</p>
        <button onClick={onBack}>Back</button>
      </div>
    );
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

        <h1>Audit logs</h1>

        {loading ? (
          <p>Loading...</p>
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
            {events.map((e) => (
              <div
                key={e.id}
                style={{
                  padding: "0.8rem 1rem",
                  borderRadius: "0.7rem",
                  border: "1px solid #e2e8f0",
                  background: "#ffffff",
                  marginBottom: "0.6rem",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.8rem",
                    color: "#64748b",
                  }}
                >
                  {e.created_at} · {e.user_name}
                </p>
                <p style={{ margin: "0.2rem 0 0" }}>{e.action}</p>
                {e.details && (
                  <p style={{ margin: "0.1rem 0 0", fontSize: "0.85rem" }}>
                    {e.details}
                  </p>
                )}
              </div>
            ))}
            {events.length === 0 && <p>No audit events found.</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuditLogsPage;
