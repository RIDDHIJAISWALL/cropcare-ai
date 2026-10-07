import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Sprout, LayoutDashboard, Leaf, FlaskConical, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";
import "./Header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="container header-inner">
        {/* Logo */}
        <Link to="/" className="header-logo" onClick={() => setMenuOpen(false)}>
          <Sprout size={28} />
          <span>CropCare AI</span>
        </Link>

        {/* Mobile menu toggle */}
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation */}
        <nav className={`header-nav ${menuOpen ? "open" : ""}`}>
          <Link to="/crop-recommendation" className="nav-link" onClick={() => setMenuOpen(false)}>
            <FlaskConical size={18} />
            Crop Predict
          </Link>
          <Link to="/disease-detection" className="nav-link" onClick={() => setMenuOpen(false)}>
            <Leaf size={18} />
            Disease Detect
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="nav-link" onClick={() => setMenuOpen(false)}>
                  <User size={18} />
                  Admin
                </Link>
              )}
              <div className="nav-user">
                <span className="nav-user-name">{user.name}</span>
                <button className="btn btn-sm btn-secondary" onClick={handleLogout}>
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-sm btn-secondary" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-primary" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
