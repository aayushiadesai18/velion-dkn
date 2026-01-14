import React, { useState } from "react";

function UploadKnowledgePage({ onBack, user }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
     const res = await fetch("http://localhost:4000/knowledge", {
  method: "POST",
  headers: {
  "Content-Type": "application/json",
  "x-user-id": String(user.id),
},

  body: JSON.stringify({ title, content, tags }),

      });


      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setMessage(err.message || "Upload failed");
        return;
      }

      setMessage("Knowledge item submitted for review.");
      setTitle("");
      setContent("");
      setTags("");
    } catch (err) {
      console.error("upload error", err);
      setMessage("Server error while uploading.");
    }
  }

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
          maxWidth: "800px",
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

        <h1>Upload knowledge item</h1>

        <form
          onSubmit={handleSubmit}
          style={{
            marginTop: "1rem",
            background: "#f8fafc",
            borderRadius: "1rem",
            padding: "1.5rem",
            color: "#0f172a",
          }}
        >
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Title
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                marginTop: "0.25rem",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #cbd5f5",
              }}
              required
            />
          </label>

          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Content / description
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              style={{
                width: "100%",
                marginTop: "0.25rem",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #cbd5f5",
                resize: "vertical",
              }}
              required
            />
          </label>

          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Tags (comma-separated)
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              style={{
                width: "100%",
                marginTop: "0.25rem",
                padding: "0.5rem",
                borderRadius: "0.5rem",
                border: "1px solid #cbd5f5",
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              marginTop: "0.8rem",
              padding: "0.6rem 1.2rem",
              borderRadius: "999px",
              border: "none",
              background: "#22c55e",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Submit for review
          </button>

          {message && (
            <p
              style={{
                marginTop: "0.8rem",
                fontSize: "0.85rem",
                color: "#dc2626",
              }}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default UploadKnowledgePage;
