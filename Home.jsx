import React from "react";

export default function Home() {
  return (
    <div className="card fade-in">
      <h1 className="card-title">Selamat Datang di Website Kelas 11 F8</h1>
      <p style={{ marginTop: "1rem", fontSize: "1.15rem", color: "#555" }}>
        Website ini dibuat untuk kebutuhan absensi, manajemen tugas, dan komunikasi kelas.
      </p>
      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <img
          src="https://placehold.co/320x160?text=F8+Modern+Website"
          alt="F8 Modern"
          style={{ borderRadius: "16px", boxShadow: "0 2px 16px rgba(44,62,80,0.10)" }}
        />
      </div>
    </div>
  );
}
