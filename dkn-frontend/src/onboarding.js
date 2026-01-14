import React from "react";

function OnboardingPage({ onBack }) {
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

        <h1>Onboarding checklist</h1>
        <div
          style={{
            marginTop: "1rem",
            background: "#f8fafc",
            borderRadius: "1rem",
            padding: "1.5rem",
            color: "#0f172a",
          }}
        >
          <ol style={{ paddingLeft: "1.2rem" }}>
            <li>Watch the “Welcome to Velion DKN” intro video.</li>
            <li>Read the DKN playbook for your business unit.</li>
            <li>Complete the “How to search effectively” guide.</li>
            <li>Submit your first QA request to a champion.</li>
            <li>Bookmark at least three useful templates.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
