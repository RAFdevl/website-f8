import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";

export default function MessageForm() {
  const [pesan, setPesan] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    if (!pesan.trim()) {
      setStatus("error");
      setStatus("Pesan tidak boleh kosong");
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, "pesan"), {
        nama: auth.currentUser?.displayName || auth.currentUser?.email,
        pesan: pesan.trim(),
        userId: auth.currentUser?.uid,
        waktu: serverTimestamp(),
        createdAt: new Date()
      });

      setPesan("");
      setStatus("success");
      setStatus("Pesan berhasil dikirim!");
    } catch (error) {
      setStatus("error");
      setStatus("Gagal mengirim pesan: " + error.message);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Tulis pesan Anda di sini..."
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
          rows={4}
          className="form-input"
          disabled={loading}
        />
        <button 
          type="submit" 
          className="form-button"
          disabled={loading}
        >
          {loading ? "Mengirim..." : "Kirim Pesan"}
        </button>
      </form>

      {status && (
        <div className={`message message-${status.includes("berhasil") ? "success" : "error"}`}>
          {status}
        </div>
      )}
    </div>
  );
}