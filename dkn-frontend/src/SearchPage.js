import React, { useState, useEffect } from "react";

function SearchPage({ user, onBack }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const cardStyle = {
    padding: "1rem",
    borderRadius: "0.75rem",
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    boxShadow: "0 4px 10px rgba(15,23,42,0.08)",
    width: "260px",
  };

  // load all approved knowledge on first render
  useEffect(() => {
    async function loadAll() {
      try {
        const res = await fetch("http://localhost:4000/knowledge", {
          headers: { "x-user-id": user.id },
        });
        if (!res.ok) {
          console.error("initial load error status", res.status);
          return;
        }
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("initial load error", err);
      }
    }
    if (user) loadAll();
  }, [user]);

  async function handleSearch(e) {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:4000/knowledge?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          headers: {
            "x-user-id": user.id,
          },
        }
      );

      if (!res.ok) {
        console.error("search error status", res.status);
        setResults([]);
        return;
      }

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("search error", err);
      setResults([]);
    }
  }

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: "2rem 0",
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#0f172a 0%,#1d4ed8 35%,#22c55e 100%)",
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

        <h1 style={{ marginBottom: "0.25rem" }}>Search Knowledge</h1>
        <p style={{ marginTop: 0, color: "#cbd5f5", fontSize: "0.9rem" }}>
          Find templates, playbooks, and past project assets.
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
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search by keyword, client, or topic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                maxWidth: "600px",
                padding: "0.6rem 0.9rem",
                borderRadius: "999px",
                border: "1px solid #cbd5f5",
                marginBottom: "1rem",
              }}
            />

            <button
              type="submit"
              style={{
                padding: "0.5rem 1.1rem",
                borderRadius: "999px",
                border: "none",
                background: "#2563eb",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: "1.2rem",
              }}
            >
              Search
            </button>
          </form>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            {results.length > 0 ? (
              results.map((item) => (
                <div key={item.id} style={cardStyle}>
                  <h3>{item.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b" }}>
                    {item.tags || "No tags"}
                  </p>
                </div>
              ))
            ) : (
              <p>No approved knowledge items yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
