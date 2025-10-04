import React, { useEffect, useState } from "react";
import axios from "axios";

const Library = () => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchFiles = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/library");
      setFiles(res.data);
    } catch (err) {
      console.error(err);
      setFiles([]);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUpload = async () => {
    if (!file) return alert("Select a file first");
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await axios.post("http://localhost:4000/api/library/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchFiles();
      setMessage("✅ Upload successful!");
      setFile(null);
      document.querySelector("#fileInput").value = "";
    } catch (err) {
      console.error(err);
      setMessage("❌ Upload failed");
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/library/${id}`);
      setFiles(files.filter((f) => f._id !== id));
      setMessage("🗑️ File deleted");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Delete failed");
    }
  };

  const getIcon = (filename) => {
    if (filename.endsWith(".pdf")) return "📄";
    if (filename.endsWith(".docx")) return "📝";
    if (filename.endsWith(".pptx")) return "📊";
    if (filename.endsWith(".jpg") || filename.endsWith(".png")) return "🖼️";
    return "📁";
  };

  const getChipColor = (filename) => {
    if (filename.endsWith(".pdf")) return "#ef5350";
    if (filename.endsWith(".docx")) return "#42a5f5";
    if (filename.endsWith(".pptx")) return "#ab47bc";
    if (filename.endsWith(".jpg") || filename.endsWith(".png")) return "#66bb6a";
    return "#9e9e9e";
  };

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "auto",
        padding: "2rem",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #121212, #1e1e1e)",
        color: "#e0e0e0",
      }}
    >
      {/* Header */}
      <h2
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "2.5rem",
          fontWeight: "900",
          background: "linear-gradient(90deg, #42a5f5, #1de9b6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        🔬 MedicoHub Knowledge Vault
      </h2>

      {/* Upload box */}
      <div
        style={{
          background: "rgba(30, 30, 30, 0.9)",
          borderRadius: "16px",
          padding: "2rem",
          textAlign: "center",
          marginBottom: "2rem",
          border: "2px dashed #42a5f5",
          boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
        }}
      >
        <input
          id="fileInput"
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: "1rem", color: "#ccc" }}
        />
        <br />
        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{
            padding: "12px 22px",
            borderRadius: "10px",
            border: "none",
            background: uploading
              ? "#555"
              : "linear-gradient(90deg,#42a5f5,#1de9b6)",
            color: "#fff",
            fontWeight: "bold",
            cursor: uploading ? "not-allowed" : "pointer",
            boxShadow: "0 6px 12px rgba(0,0,0,0.4)",
            transition: "all 0.3s",
          }}
        >
          {uploading ? "Uploading..." : "🚀 Upload File"}
        </button>
        {uploading && (
          <div
            style={{
              marginTop: "1rem",
              width: "100%",
              height: "10px",
              borderRadius: "8px",
              background: "#333",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "100%",
                background: "linear-gradient(90deg,#42a5f5,#1de9b6)",
                animation: "loadingBar 1.5s infinite",
              }}
            />
          </div>
        )}
      </div>

      {/* Toast */}
      {message && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            background: "#1e1e1e",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: "12px",
            boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
            fontWeight: "600",
            zIndex: 1000,
            animation: "fadeIn 0.5s ease",
          }}
        >
          {message}
        </div>
      )}

      {/* File grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {files.map((f) => (
          <div
            key={f._id}
            style={{
              background: "rgba(40,40,40,0.95)",
              borderRadius: "16px",
              padding: "1rem",
              textAlign: "center",
              boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
              transition: "transform 0.3s, box-shadow 0.3s",
              cursor: "pointer",
              color: "#f5f5f5",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-8px) scale(1.05)";
              e.currentTarget.style.boxShadow =
                "0 12px 30px rgba(0,0,0,0.8)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0) scale(1)";
              e.currentTarget.style.boxShadow =
                "0 6px 18px rgba(0,0,0,0.5)";
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "0.5rem" }}>
              {getIcon(f.filename)}
            </div>
            <p
              style={{
                fontWeight: "600",
                marginBottom: "0.5rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={f.filename}
            >
              {f.filename}
            </p>
            <span
              style={{
                display: "inline-block",
                marginBottom: "0.8rem",
                padding: "4px 10px",
                fontSize: "12px",
                fontWeight: "bold",
                borderRadius: "12px",
                background: getChipColor(f.filename),
                color: "#fff",
              }}
            >
              {f.filename.split(".").pop().toUpperCase()}
            </span>
            <br />
            <a
              href={`http://localhost:4000/api/library/${f._id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                marginBottom: "0.6rem",
                padding: "8px 14px",
                background: "linear-gradient(90deg,#42a5f5,#1de9b6)",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "bold",
                boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
              }}
            >
              Open
            </a>
            <br />
            <button
              onClick={() => handleDelete(f._id)}
              style={{
                background: "linear-gradient(90deg,#e53935,#ff1744)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "8px 14px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes loadingBar {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(0); }
            100% { transform: translateX(100%); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Library;
