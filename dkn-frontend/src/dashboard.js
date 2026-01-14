import React, { useState } from "react";

function Dashboard({ user, onNavigate }) {
  const [activeSection, setActiveSection] = useState(null);

  const cardBase = {
    padding: "1.1rem 1.3rem",
    borderRadius: "0.9rem",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
    cursor: "pointer",
    minWidth: "190px",
    textAlign: "left",
    color: "#0f172a",
  };

  const wrapHover = (style, color) => ({
    ...style,
    borderLeft: `4px solid ${color}`,
  });

  const onHover = (e, color) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 14px 30px rgba(15,23,42,0.18)";
    e.currentTarget.style.borderColor = color;
  };

  const onLeave = (e) => {
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = "0 8px 20px rgba(15,23,42,0.08)";
    e.currentTarget.style.borderColor = "#e2e8f0";
  };

  const isChampion = user.role === "KNOWLEDGE_CHAMPION";
  const isAdmin = user.role === "SYSTEM_ADMIN";
  const isConsultant = user.role === "CONSULTANT";

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
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>Velion DKN</h1>
            <p
              style={{
                marginTop: "0.3rem",
                color: "#cbd5f5",
                fontSize: "0.9rem",
              }}
            >
              Your Digital Knowledge Network
            </p>
          </div>
          <div
            style={{
              padding: "0.5rem 0.9rem",
              borderRadius: "999px",
              background: "rgba(15,23,42,0.8)",
              border: "1px solid #1d4ed8",
              fontSize: "0.85rem",
            }}
          >
            <strong>{user.name}</strong> · {user.role}
          </div>
        </header>

        <div
          style={{
            background: "#f8fafc",
            borderRadius: "1rem",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >

            {user.role === "NEW_EMPLOYEE" && (
              <div
                style={wrapHover(cardBase, "#38bdf8")}
                onMouseEnter={(e) => onHover(e, "#38bdf8")}
                onMouseLeave={onLeave}
                onClick={() => onNavigate("ONBOARDING")}
              >
                <h3>Onboarding</h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Complete essential learning resources.
                </p>
              </div>

            )}

            {user.role !== "SYSTEM_ADMIN" && (
              <div
                style={wrapHover(cardBase, "#38bdf8")}
                onMouseEnter={(e) => onHover(e, "#38bdf8")}
                onMouseLeave={onLeave}
                onClick={() => onNavigate("SEARCH")}
              >
                <h3>Search Knowledge</h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Find approved knowledge items.
                </p>
              </div>
            )}

            {(isConsultant || isChampion) && (
              <div
                style={wrapHover(cardBase, "#a855f7")}
                onMouseEnter={(e) => onHover(e, "#a855f7")}
                onMouseLeave={onLeave}
                onClick={() => onNavigate("UPLOAD KNOWLEDGE")}
              >
                <h3>Upload Knowledge</h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Contribute new items for review.
                </p>
              </div>
            )}


            {!isAdmin &&
              (isChampion ? (
                <div
                  style={wrapHover(cardBase, "#ec4899")}
                  onMouseEnter={(e) => onHover(e, "#ec4899")}
                  onMouseLeave={onLeave}
                  onClick={() => onNavigate("CHAMPION")}
                >
                  <h3>Champion QA</h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Answer open QA requests.
                  </p>
                </div>
              ) : (
                <div
                  style={wrapHover(cardBase, "#f97316")}
                  onMouseEnter={(e) => onHover(e, "#f97316")}
                  onMouseLeave={onLeave}
                  onClick={() => onNavigate("QA")}
                >
                  <h3>QA Requests</h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Ask Knowledge Champions for help.
                  </p>
                </div>
              ))}


            {isChampion && (
              <div
                style={wrapHover(cardBase, "#eab308")}
                onMouseEnter={(e) => onHover(e, "#eab308")}
                onMouseLeave={onLeave}
                onClick={() => onNavigate("REVIEW PENDING")}
              >
                <h3>Review Pending</h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  Approve or refine submitted content.
                </p>
              </div>
            )}


            {(user.role === "EXECUTIVE") && (
              <div
                style={wrapHover(cardBase, "#0ea5e9")}
                onMouseEnter={(e) => onHover(e, "#0ea5e9")}
                onMouseLeave={onLeave}
                onClick={() => onNavigate("ANALYTICS")}
              >
                <h3>Analytics</h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  See usage and knowledge gaps.
                </p>
              </div>
            )}


            {isAdmin && (
              <>
                <div
                  style={wrapHover(cardBase, "#f97316")}
                  onMouseEnter={(e) => onHover(e, "#f97316")}
                  onMouseLeave={onLeave}
                  onClick={() => onNavigate("AUDITLOGS")}
                >
                  <h3>Audit Logs</h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Track changes for compliance.
                  </p>
                </div>

                <div
                  style={wrapHover(cardBase, "#22c55e")}
                  onMouseEnter={(e) => onHover(e, "#22c55e")}
                  onMouseLeave={onLeave}
                  onClick={() => onNavigate("MANAGEUSERS")}
                >
                  <h3>Manage Users</h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    Configure roles and permissions.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
