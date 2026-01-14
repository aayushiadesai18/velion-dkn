import React, { useState } from "react";
import Dashboard from "./dashboard.js";
import QaPage from "./QaPage.js";
import SearchPageList from "./SearchPage.js"
import ChampionPage from "./champion.js";
import OnboardingPage from "./onboarding.js";
import ReviewPendingPage from "./Reviewpending.js";
import AnalyticsPage from "./Analytics.js";
import AuditLogsPage from "./Auditlogs.js";
import ManageUsersPage from "./Manageusers.js";
import UploadKnowledgePage from "./UploadKnowledge.js";
function App() {
  const [email, setEmail] = useState("damon@velion.com");
  const [password, setPassword] = useState("password");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState("DASHBOARD");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Login failed");
        return;
      }
      const data = await res.json();
      setUser(data);
    } catch {
      setError("Could not connect to backend");
    }
  };

  if (user && currentPage === "QA") {
    return <QaPage user={user} onBack={() => setCurrentPage("DASHBOARD")} />;
  }
  if (user && currentPage === "SEARCH") {
    return <SearchPageList user={user} onBack={() => setCurrentPage("DASHBOARD")} />;
  }
  if (user && user.role === "KNOWLEDGE_CHAMPION" && currentPage === "CHAMPION") {
    return <ChampionPage user={user} onBack={() => setCurrentPage("DASHBOARD")} />;
  }

  if (user && currentPage === "ONBOARDING") {
    return <OnboardingPage onBack={() => setCurrentPage("DASHBOARD")} />;
  }
  if (user && currentPage === "REVIEW PENDING") {
    return <ReviewPendingPage onBack={() => setCurrentPage("DASHBOARD")} user={user} />;
  }
  if (user && currentPage === "ANALYTICS") {
  return (
    <AnalyticsPage
      user={user}
      onBack={() => setCurrentPage("DASHBOARD")}
    />
  );
}

 if (user && currentPage === "AUDITLOGS") {
  return (
    <AuditLogsPage
      user={user}
      onBack={() => setCurrentPage("DASHBOARD")}
    />
  );
}

  if (user && currentPage === "MANAGEUSERS") {
    return <ManageUsersPage onBack={() => setCurrentPage("DASHBOARD")} />;
  }
  if (user && currentPage === "UPLOAD KNOWLEDGE") {
  return (
    <UploadKnowledgePage
      user={user}
      onBack={() => setCurrentPage("DASHBOARD")}
    />
  );
}

  if (user) {
    return <Dashboard user={user} onNavigate={setCurrentPage} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #020617 0%, #0f766e 40%, #06b6d4 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "2rem 2.5rem",
          borderRadius: "1rem",
          boxShadow: "0 20px 40px rgba(15,23,42,0.4)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h1 style={{ marginBottom: "0.5rem", color: "#0f172a" }}>
          Velion DKN
        </h1>
        <p style={{ marginTop: 0, marginBottom: "1.5rem", color: "#64748b" }}>
          Sign in to access the Digital Knowledge Network.
        </p>

        <form onSubmit={handleLogin}>
          <label
            style={{ display: "block", fontSize: "0.85rem", color: "#475569" }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              marginTop: "0.25rem",
              marginBottom: "0.9rem",
              borderRadius: "0.5rem",
              border: "1px solid #cbd5f5",
              outline: "none",
            }}
          />

          <label
            style={{ display: "block", fontSize: "0.85rem", color: "#475569" }}
          >
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              marginTop: "0.25rem",
              marginBottom: "1.2rem",
              borderRadius: "0.5rem",
              border: "1px solid #cbd5f5",
              outline: "none",
            }}
          />

          {error && (
            <div
              style={{
                marginBottom: "0.8rem",
                padding: "0.5rem 0.75rem",
                background: "#fee2e2",
                color: "#b91c1c",
                borderRadius: "0.5rem",
                fontSize: "0.85rem",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "0.7rem",
              borderRadius: "999px",
              border: "none",
              background:
                "linear-gradient(135deg, #020617 0%, #0f766e 40%, #06b6d4 100%)",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
        </form>

       
      </div>
    </div>
  );
}

export default App;
