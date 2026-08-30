import { useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./components/Dashboard";
import Transactions from "./pages/Transactions";
import RiskAnalysis from "./pages/RiskAnalysis";

import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");

    // No token = not authenticated
    if (!savedUser || !token) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error("Invalid user data:", error);

      localStorage.removeItem("user");
      localStorage.removeItem("access_token");

      return null;
    }
  });

  const [page, setPage] = useState("dashboard");
  const [authPage, setAuthPage] = useState("login");

  // ================= LOGIN =================

  const handleLogin = (userData) => {
    console.log("Login successful:", userData);

    setUser(userData);
    setPage("dashboard");
  };

  // ================= REGISTER =================

  const handleRegister = () => {
    setAuthPage("login");
  };

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    setUser(null);
    setPage("dashboard");
    setAuthPage("login");
  };

  // ================= AUTH SCREEN =================

  if (!user) {
    if (authPage === "register") {
      return (
        <Register
          onRegister={handleRegister}
          onShowLogin={() => setAuthPage("login")}
        />
      );
    }

    return (
      <Login
        onLogin={handleLogin}
        onShowRegister={() => setAuthPage("register")}
      />
    );
  }

  // ================= MAIN APPLICATION =================

  return (
    <div className="app">

      {/* HEADER */}

      <header className="topbar">

        <div className="brand">
          <h2>Risk Manager</h2>

          <span>
            AI Payment Security
          </span>
        </div>

        <div className="user-section">

          <span>
            {user.name ||
              user.email ||
              "User"}
          </span>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* NAVIGATION */}

      <nav className="navigation">

        <button
          type="button"
          className={
            page === "dashboard"
              ? "nav-button active"
              : "nav-button"
          }
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </button>

        <button
          type="button"
          className={
            page === "transactions"
              ? "nav-button active"
              : "nav-button"
          }
          onClick={() => setPage("transactions")}
        >
          Transactions
        </button>

        <button
          type="button"
          className={
            page === "risk"
              ? "nav-button active"
              : "nav-button"
          }
          onClick={() => setPage("risk")}
        >
          Risk Analysis
        </button>

      </nav>

      {/* PAGE CONTENT */}

      <main className="main-content">

        {page === "dashboard" && (
          <Dashboard />
        )}

        {page === "transactions" && (
          <Transactions />
        )}

        {page === "risk" && (
          <RiskAnalysis />
        )}

      </main>

    </div>
  );
}

export default App;