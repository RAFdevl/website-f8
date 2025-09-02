import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nama, setNama] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          throw new Error("Password tidak cocok");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Set role user secara otomatis, admin hanya diset manual di Firebase Console
        await setDoc(doc(db, "users", userCredential.user.uid), {
          nama,
          email,
          role: "user", // Default role user
          createdAt: new Date()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container fade-in">
      <h2 style={{ textAlign: "center", marginBottom: "2rem", color: "#333" }}>
        {isRegistering ? "Daftar Akun" : "Login Kelas 11 F8"}
      </h2>
      
      {error && (
        <div className="message message-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="form-input"
            required
          />
        )}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          required
        />
        
        {isRegistering && (
          <input
            type="password"
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            required
          />
        )}
        
        <button 
          type="submit" 
          className="form-button"
          disabled={loading}
        >
          {loading ? "Memproses..." : (isRegistering ? "Daftar" : "Login")}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "1rem", color: "#666" }}>
        {isRegistering ? "Sudah punya akun? " : "Belum punya akun? "}
        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          style={{
            background: "none",
            border: "none",
            color: "#667eea",
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          {isRegistering ? "Login disini" : "Daftar disini"}
        </button>
      </p>

      <div style={{ marginTop: "2rem", padding: "1rem", background: "#f8f9fa", borderRadius: "5px" }}>
        <p style={{ fontSize: "14px", color: "#666", textAlign: "center" }}>
          <strong>Akun Demo:</strong><br />
          Admin: admin@kelas11f8.com / admin123<br />
          User: user@kelas11f8.com / user123
        </p>
      </div>
    </div>
  );
}      
      {error && (
        <div className="message message-error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <input
            type="text"
            placeholder="Nama Lengkap"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
            className="form-input"
            required
          />
        )}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
          required
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          required
        />
        
        {isRegistering && (
          <input
            type="password"
            placeholder="Konfirmasi Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            required
          />
        )}
        
        <button 
          type="submit" 
          className="form-button"
          disabled={loading}
        >
          {loading ? "Memproses..." : (isRegistering ? "Daftar" : "Login")}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: "1rem", color: "#666" }}>
        {isRegistering ? "Sudah punya akun? " : "Belum punya akun? "}
        <button
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          style={{
            background: "none",
            border: "none",
            color: "#667eea",
            cursor: "pointer",
            textDecoration: "underline"
          }}
        >
          {isRegistering ? "Login disini" : "Daftar disini"}
        </button>
      </p>

      <div style={{ marginTop: "2rem", padding: "1rem", background: "#f8f9fa", borderRadius: "5px" }}>
        <p style={{ fontSize: "14px", color: "#666", textAlign: "center" }}>
          <strong>Akun Demo:</strong><br />
          Admin: admin@kelas11f8.com / admin123<br />
          User: user@kelas11f8.com / user123 tes 
        </p>
      </div>
    </div>
  );

}

