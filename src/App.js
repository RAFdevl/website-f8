import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import "./App.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Profile from "./pages/Profile";

function App() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAdmin(user?.email === "admin@kelas11f8.com");
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Memuat aplikasi...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {user && (
          <nav className="navbar">
            <div className="nav-brand">
              <h2>Kelas 11 F8</h2>
            </div>
            <div className="nav-links">
              <Link to="/">Dashboard</Link>
              <Link to="/profile">Profil</Link>
              {admin && <Link to="/admin">Admin Panel</Link>}
              <button
                onClick={() => {
                  signOut(auth);
                }}
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          </nav>
        )}

        <main className="main-content">
          <Routes>
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/"
              element={user ? <Dashboard admin={admin} /> : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={user && admin ? <AdminPanel /> : <Navigate to="/" />}
            />
            <Route
              path="/profile"
              element={user ? <Profile user={user} /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
