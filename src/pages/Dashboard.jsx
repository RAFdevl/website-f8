import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy, addDoc } from "firebase/firestore";
import MessageForm from "../components/MessageForm";

export default function Dashboard({ admin }) {
  const [struktur, setStruktur] = useState([]);
  const [anggota, setAnggota] = useState([]);
  const [galeri, setGaleri] = useState([]);
  const [jadwalPiket, setJadwalPiket] = useState([]);
  const [jadwalPelajaran, setJadwalPelajaran] = useState([]);
  const [hariIni, setHariIni] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const hari = new Date().toLocaleDateString("id-ID", { weekday: "long" });
    setHariIni(hari);
  }, []);

  const fetchData = async () => {
    try {
      const [
        strukturSnap,
        anggotaSnap,
        galeriSnap,
        piketSnap,
        pelajaranSnap
      ] = await Promise.all([
        getDocs(collection(db, "struktur")),
        getDocs(query(collection(db, "anggota"), orderBy("nama"))),
        getDocs(query(collection(db, "galeri"), orderBy("createdAt", "desc"))),
        getDocs(collection(db, "jadwalPiket")),
        getDocs(collection(db, "jadwalPelajaran"))
      ]);

      setStruktur(strukturSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setAnggota(anggotaSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setGaleri(galeriSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setJadwalPiket(piketSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setJadwalPelajaran(pelajaranSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const jadwalHariIni = jadwalPelajaran.filter(j => j.hari === hariIni);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Dashboard Kelas 11 F8</h1>
          <span className="badge" style={{ background: "#667eea", color: "white", padding: "0.5rem 1rem", borderRadius: "20px" }}>
            Hari: {hariIni}
          </span>
        </div>
        <p>Selamat datang di portal kelas 11 F8. Semua informasi terkini tentang kelas ada di sini.</p>
      </div>

      <div className="grid grid-2">
        {/* Struktur Kelas */}
        <div className="card">
          <h2 className="card-title">Struktur Kelas</h2>
          <div className="grid grid-2">
            {struktur.map((s) => (
              <div key={s.id} className="team-member">
                {s.foto && (
                  <img 
                    src={s.foto} 
                    alt={s.nama} 
                    className="avatar-lg"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/80x80?text=Foto";
                    }}
                  />
                )}
                <div>
                  <h4>{s.jabatan}</h4>
                  <p>{s.nama}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jadwal Hari Ini */}
        <div className="card">
          <h2 className="card-title">Jadwal Pelajaran Hari Ini</h2>
          {jadwalHariIni.length === 0 ? (
            <p>Tidak ada jadwal pelajaran hari ini</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Mata Pelajaran</th>
                  <th>Jam</th>
                  <th>Guru</th>
                </tr>
              </thead>
              <tbody>
                {jadwalHariIni.map((j) => (
                  <tr key={j.id}>
                    <td>{j.mataPelajaran}</td>
                    <td>{j.jamMulai} - {j.jamSelesai}</td>
                    <td>{j.guru}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Jadwal Piket */}
      <div className="card">
        <h2 className="card-title">Jadwal Piket</h2>
        <div className="grid grid-4">
          {jadwalPiket.map((p) => (
            <div key={p.id} className="piket-item">
              <h4>{p.hari}</h4>
              <p>{p.nama}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Anggota Kelas */}
      <div className="card">
        <h2 className="card-title">Anggota Kelas (Total: {anggota.length})</h2>
        <div className="grid grid-4">
          {anggota.map((a) => (
            <div key={a.id} className="anggota-item">
              {a.foto && (
                <img 
                  src={a.foto} 
                  alt={a.nama} 
                  className="avatar"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/50x50?text=Foto";
                  }}
                />
              )}
              <p>{a.nama}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Galeri */}
      <div className="card">
        <h2 className="card-title">Galeri Kelas</h2>
        <div className="grid grid-3">
          {galeri.slice(0, 6).map((g) => (
            <div key={g.id} className="gallery-item">
              <img 
                src={g.url} 
                alt={g.keterangan} 
                className="gallery-image"
                onError={(e) => {
                  e.target.src = "https://placehold.co/300x200?text=Gambar";
                }}
              />
              <p style={{ marginTop: "0.5rem", fontSize: "14px" }}>{g.keterangan}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Kirim Pesan */}
      <div className="card">
        <h2 className="card-title">Kirim Pesan</h2>
        <MessageForm />
      </div>
    </div>
  );
}