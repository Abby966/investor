import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css"; // Your stylish navbar CSS

// ✅ --- RECEIVE currentUser PROP ---
export default function Navbar({ currentUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="navbar-container">
      {/* ✅ We make the logo link to the correct "home" page 
        based on the user's role.
      */}
      <NavLink 
        to={currentUser?.role === 'investor' ? "/investor-dashboard" : "/"} 
        className="navbar-logo"
      >
        InvestorApp
      </NavLink>

      <div className="navbar-links">
        {/* ✅ --- CONDITIONAL LINKS --- */}
        {currentUser && (
          <>
            {currentUser.role === 'entrepreneur' ? (
              // --- ENTREPRENEUR LINKS ---
              <>
                <NavLink to="/" className="navbar-link" end>
                  Add Project
                </NavLink>
                <NavLink to="/my-projects" className="navbar-link">
                  My Projects
                </NavLink>
                <NavLink to="/other-projects" className="navbar-link">
                  Other Projects
                </NavLink>
              </>
            ) : (
              // --- INVESTOR LINKS ---
              <>
                <NavLink to="/investor-dashboard" className="navbar-link" end>
                  Dashboard
                </NavLink>
                <NavLink to="/other-projects" className="navbar-link">
                  Projects
                </NavLink>
              </>
            )}
            
            {/* --- COMMON LINKS --- */}
            <NavLink to="/chat" className="navbar-link">
              Chat
            </NavLink>
            <NavLink to="/profile" className="navbar-link">
              Profile
            </NavLink>
          </>
        )}
      </div>

      <button onClick={handleLogout} className="navbar-logout-btn">
        Logout
      </button>
    </nav>
  );
}