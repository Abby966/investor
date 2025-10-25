import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Auth.css"; // Your stylish styles

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        formData
      );

      // ✅ --- NEW REDIRECT LOGIC ---
      if (response.data.token && response.data.role) {
        localStorage.setItem("token", response.data.token);
        
        // Check the role and redirect!
        if (response.data.role === 'investor') {
          window.location.href = "/investor-dashboard"; // Go to investor page
        } else {
          window.location.href = "/"; // Go to entrepreneur home
        }
      } else {
        setError("Login failed: Invalid response from server.");
      }
      // --- END OF NEW LOGIC ---

    } catch (err) {
      console.error(err.response?.data || err.message);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error); // e.g., "Invalid username or password"
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  // ... (the rest of your handleChange and return() is the same)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Welcome Back!</h2>
      {error && <div className="auth-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label className="auth-label" htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            className="auth-input"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="auth-form-group">
          <label className="auth-label" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button className="auth-button" type="submit">
          Login
        </button>
      </form>
      <p className="auth-toggle-link">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}