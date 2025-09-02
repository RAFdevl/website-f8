import React, { useState } from "react";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";

export default function Profile({ user }) {
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [photoURL, setPhotoURL] = useState(user.photoURL || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateProfile(user, {
        displayName: displayName.trim(),
        photoURL: photoURL.trim() || null
      });
      setMessage("Profil berhasil diupdate");
    } catch (error) {
      setMessage("Error updating profile: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="card">
        <h1 className="card-title">Profil Saya</h1>
      </div>

      <div className="card">
        <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "2rem" }}>
          <img
            src={user.photoURL || "https://placehold.co/100x100?text=User"}
            alt="Profile"
            className="avatar-lg"
          />
          <div>
            <h2>{user.displayName || "User"}</h2>
            <p>{user.email}</p>
            <p>Role: {user.email === "admin@kelas11f8.com" ? "Admin" : "User"}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile}>
          <div style={{ marginBottom: "1rem" }}>
            <label>Nama Display:</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="form-input"
              placeholder="Masukkan nama display"
            />
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label>Foto URL:</label>
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="form-input"
              placeholder="Masukkan URL foto"
            />
          </div>

          <button type="submit" className="form-button" disabled={loading}>
            {loading ? "Memproses..." : "Update Profil"}
          </button>

          {message && (
            <div className={`message ${message.includes("berhasil") ? "message-success" : "message-error"}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}