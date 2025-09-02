import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";
import ImageUploader from "../components/ImageUploader";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("struktur");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const tabs = [
    { id: "struktur", label: "Struktur Kelas" },
    { id: "anggota", label: "Anggota" },
    { id: "galeri", label: "Galeri" },
    { id: "jadwal", label: "Jadwal" },
    { id: "piket", label: "Piket" },
    { id: "pesan", label: "Pesan" }
  ];

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="fade-in">
      <div className="card">
        <h1 className="card-title">Admin Panel</h1>
        <p>Kelola semua data kelas 11 F8 dari sini</p>
        
        <div style={{ 
          padding: "1rem", 
          backgroundColor: "#fff3cd", 
          border: "1px solid #ffeaa7",
          borderRadius: "4px",
          marginTop: "1rem"
        }}>
          <p style={{ margin: 0, color: "#856404", fontSize: "14px" }}>
            <strong>Info:</strong> Untuk upload gambar, gunakan layanan hosting gratis seperti Imgur atau Postimages, 
            lalu paste URL gambar di form yang tersedia.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="card">
        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
              style={{
                padding: "1rem 2rem",
                border: "none",
                background: activeTab === tab.id ? "#667eea" : "transparent",
                color: activeTab === tab.id ? "white" : "#333",
                cursor: "pointer",
                borderRadius: "5px",
                marginRight: "0.5rem"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes("Berhasil") ? "message-success" : "message-error"}`}>
          {message}
        </div>
      )}

      {/* Content based on active tab */}
      <div className="card">
        {activeTab === "struktur" && <StrukturManager setMessage={setMessage} />}
        {activeTab === "anggota" && <AnggotaManager setMessage={setMessage} />}
        {activeTab === "galeri" && <GaleriManager setMessage={setMessage} />}
        {activeTab === "jadwal" && <JadwalManager setMessage={setMessage} />}
        {activeTab === "piket" && <PiketManager setMessage={setMessage} />}
        {activeTab === "pesan" && <PesanManager setMessage={setMessage} />}
      </div>
    </div>
  );
}

// Component for managing struktur kelas
function StrukturManager({ setMessage }) {
  const [struktur, setStruktur] = useState([]);
  const [form, setForm] = useState({ jabatan: "", nama: "", foto: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStruktur();
  }, []);

  const fetchStruktur = async () => {
    const snap = await getDocs(collection(db, "struktur"));
    setStruktur(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleImageUrlChange = (url) => {
    setForm(prev => ({ ...prev, foto: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.jabatan || !form.nama) {
      setMessage("Jabatan dan nama wajib diisi");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "struktur", editingId), form);
        setMessage("Data berhasil diupdate");
      } else {
        await addDoc(collection(db, "struktur"), {
          ...form,
          createdAt: new Date()
        });
        setMessage("Data berhasil ditambahkan");
      }
      setForm({ jabatan: "", nama: "", foto: "" });
      setEditingId(null);
      fetchStruktur();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await deleteDoc(doc(db, "struktur", id));
      setMessage("Data berhasil dihapus");
      fetchStruktur();
    } catch (error) {
      setMessage("Error deleting: " + error.message);
    }
  };

  return (
    <div>
      <h3>Kelola Struktur Kelas</h3>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          placeholder="Jabatan"
          value={form.jabatan}
          onChange={e => setForm({ ...form, jabatan: e.target.value })}
          className="form-input"
        />
        <input
          placeholder="Nama"
          value={form.nama}
          onChange={e => setForm({ ...form, nama: e.target.value })}
          className="form-input"
        />
        
        <ImageUploader
          onImageUrlChange={handleImageUrlChange}
          currentUrl={form.foto}
          label="URL Foto Profil"
        />
        
        <button type="submit" className="form-button">
          {editingId ? "Update" : "Tambah"} Struktur
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setForm({ jabatan: "", nama: "", foto: "" });
              setEditingId(null);
            }}
            className="btn btn-danger"
            style={{ marginLeft: "1rem" }}
          >
            Batal Edit
          </button>
        )}
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Jabatan</th>
            <th>Nama</th>
            <th>Foto</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {struktur.map((item) => (
            <tr key={item.id}>
              <td>{item.jabatan}</td>
              <td>{item.nama}</td>
              <td>
                {item.foto && (
                  <img 
                    src={item.foto} 
                    alt={item.nama} 
                    className="avatar"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/50x50?text=Gagal+Load";
                    }}
                  />
                )}
              </td>
              <td>
                <button
                  onClick={() => handleEdit(item)}
                  className="btn btn-primary"
                  style={{ marginRight: "0.5rem" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="btn btn-danger"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Anggota Manager dengan ImageUploader
function AnggotaManager({ setMessage }) {
  const [anggota, setAnggota] = useState([]);
  const [form, setForm] = useState({ nama: "", kelas: "11 F8", foto: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAnggota();
  }, []);

  const fetchAnggota = async () => {
    const snap = await getDocs(collection(db, "anggota"));
    setAnggota(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleImageUrlChange = (url) => {
    setForm(prev => ({ ...prev, foto: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nama) {
      setMessage("Nama wajib diisi");
      return;
    }

    try {
      if (editingId) {
        await updateDoc(doc(db, "anggota", editingId), form);
        setMessage("Anggota berhasil diupdate");
      } else {
        await addDoc(collection(db, "anggota"), {
          ...form,
          createdAt: new Date()
        });
        setMessage("Anggota berhasil ditambahkan");
      }
      setForm({ nama: "", kelas: "11 F8", foto: "" });
      setEditingId(null);
      fetchAnggota();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus anggota ini?")) return;
    try {
      await deleteDoc(doc(db, "anggota", id));
      setMessage("Anggota berhasil dihapus");
      fetchAnggota();
    } catch (error) {
      setMessage("Error deleting: " + error.message);
    }
  };

  return (
    <div>
      <h3>Kelola Anggota Kelas</h3>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          placeholder="Nama Lengkap"
          value={form.nama}
          onChange={e => setForm({ ...form, nama: e.target.value })}
          className="form-input"
        />
        <input
          placeholder="Kelas"
          value={form.kelas}
          onChange={e => setForm({ ...form, kelas: e.target.value })}
          className="form-input"
        />
        
        <ImageUploader
          onImageUrlChange={handleImageUrlChange}
          currentUrl={form.foto}
          label="URL Foto Anggota"
        />
        
        <button type="submit" className="form-button">
          {editingId ? "Update" : "Tambah"} Anggota
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Foto</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {anggota.map((item) => (
            <tr key={item.id}>
              <td>{item.nama}</td>
              <td>{item.kelas}</td>
              <td>
                {item.foto && (
                  <img 
                    src={item.foto} 
                    alt={item.nama} 
                    className="avatar"
                    onError={(e) => {
                      e.target.src = "https://placehold.co/50x50?text=Gagal+Load";
                    }}
                  />
                )}
              </td>
              <td>
                <button
                  onClick={() => {
                    setForm(item);
                    setEditingId(item.id);
                  }}
                  className="btn btn-primary"
                  style={{ marginRight: "0.5rem" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="btn btn-danger"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Galeri Manager dengan ImageUploader
function GaleriManager({ setMessage }) {
  const [galeri, setGaleri] = useState([]);
  const [form, setForm] = useState({ keterangan: "", url: "" });

  useEffect(() => {
    fetchGaleri();
  }, []);

  const fetchGaleri = async () => {
    const snap = await getDocs(query(collection(db, "galeri"), orderBy("createdAt", "desc")));
    setGaleri(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleImageUrlChange = (url) => {
    setForm(prev => ({ ...prev, url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.keterangan || !form.url) {
      setMessage("Keterangan dan URL gambar wajib diisi");
      return;
    }

    try {
      await addDoc(collection(db, "galeri"), {
        ...form,
        createdAt: new Date()
      });
      setMessage("Gambar berhasil ditambahkan ke galeri");
      setForm({ keterangan: "", url: "" });
      fetchGaleri();
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus gambar ini?")) return;
    try {
      await deleteDoc(doc(db, "galeri", id));
      setMessage("Gambar berhasil dihapus");
      fetchGaleri();
    } catch (error) {
      setMessage("Error deleting: " + error.message);
    }
  };

  return (
    <div>
      <h3>Kelola Galeri Kelas</h3>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          placeholder="Keterangan Gambar"
          value={form.keterangan}
          onChange={e => setForm({ ...form, keterangan: e.target.value })}
          className="form-input"
        />
        
        <ImageUploader
          onImageUrlChange={handleImageUrlChange}
          currentUrl={form.url}
          label="URL Gambar Galeri"
        />
        
        <button type="submit" className="form-button">
          Tambah ke Galeri
        </button>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
        {galeri.map((item) => (
          <div key={item.id} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" }}>
            <img
              src={item.url}
              alt={item.keterangan}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "4px",
                marginBottom: "0.5rem"
              }}
              onError={(e) => {
                e.target.src = "https://placehold.co/200x150?text=Gagal+Load";
              }}
            />
            <p style={{ margin: "0.5rem 0", fontSize: "14px" }}>{item.keterangan}</p>
            <button
              onClick={() => handleDelete(item.id)}
              className="btn btn-danger"
              style={{ width: "100%" }}
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Komponen manager lainnya tetap sama seperti sebelumnya
function JadwalManager({ setMessage }) {
  // Implementasi similar untuk jadwal pelajaran
  return <div>Jadwal Manager - Implementasi serupa dengan struktur manager</div>;
}

function PiketManager({ setMessage }) {
  // Implementasi similar untuk jadwal piket
  return <div>Piket Manager - Implementasi serupa dengan struktur manager</div>;
}

function PesanManager({ setMessage }) {
  const [pesan, setPesan] = useState([]);

  useEffect(() => {
    fetchPesan();
  }, []);

  const fetchPesan = async () => {
    const snap = await getDocs(query(collection(db, "pesan"), orderBy("createdAt", "desc")));
    setPesan(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pesan ini?")) return;
    try {
      await deleteDoc(doc(db, "pesan", id));
      setMessage("Pesan berhasil dihapus");
      fetchPesan();
    } catch (error) {
      setMessage("Error deleting: " + error.message);
    }
  };

  return (
    <div>
      <h3>Kelola Pesan</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Pesan</th>
            <th>Waktu</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pesan.map((item) => (
            <tr key={item.id}>
              <td>{item.nama}</td>
              <td style={{ maxWidth: "300px", wordBreak: "break-word" }}>{item.pesan}</td>
              <td>{item.createdAt?.toDate?.().toLocaleString('id-ID') || "Waktu tidak tersedia"}</td>
              <td>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="btn btn-danger"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}