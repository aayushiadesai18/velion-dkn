import React from "react";

const users = [
  { id: 1, name: "Stefan", email: "stefan@velion.com", role: "EMPLOYEE" },
  { id: 2, name: "Elena", email: "elena@velion.com", role: "NEW_EMPLOYEE" },
  { id: 3, name: "Caroline", email: "caroline@velion.com", role: "CONSULTANT" },
  { id: 4, name: "Bonnie", email: "bonnie@velion.com", role: "KNOWLEDGE_CHAMPION" },
  { id: 5, name: "Damon", email: "damon@velion.com", role: "EXECUTIVE" },
  { id: 6, name: "Klaus", email: "klaus@velion.com", role: "GOVERNANCE_COUNCIL" },
  { id: 7, name: "Katherine", email: "katherine@velion.com", role: "SYSTEM_ADMIN" },

];

function ManageUsersPage({ onBack }) {
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

        <h1>Manage users</h1>
        <div
          style={{
            marginTop: "1rem",
            background: "#f8fafc",
            borderRadius: "1rem",
            padding: "1.5rem",
            color: "#0f172a",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Name</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Email</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ padding: "0.5rem", borderTop: "1px solid #e2e8f0" }}>
                    {u.name}
                  </td>
                  <td style={{ padding: "0.5rem", borderTop: "1px solid #e2e8f0" }}>
                    {u.email}
                  </td>
                  <td style={{ padding: "0.5rem", borderTop: "1px solid #e2e8f0" }}>
                    {u.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
      </div>
    </div>
  );
}

export default ManageUsersPage;
