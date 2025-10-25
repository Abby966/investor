import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css"; // Import the new styles

export default function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "entrepreneur", // Default role
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      // Call your Django API's signup endpoint
      await axios.post("http://127.0.0.1:8000/api/signup/", formData);

      alert("✅ Signup successful! Please log in.");
      // Redirect to the login page
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      if (err.response && err.response.data) {
        if (err.response.data.username) {
          setError(err.response.data.username[0]); // e.g., "A user with that username already exists."
        } else if (err.response.data.email) {
            setError(err.response.data.email[0]);
        } else {
          setError("Signup failed. Please check all your details.");
        }
      } else {
        setError("Signup failed. Please try again later.");
      }
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Create Account</h2>
      {error && <div className="auth-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label className="auth-label" htmlFor="username">
            Username
          </label>
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
          <label className="auth-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className="auth-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-form-group">
          <label className="auth-label" htmlFor="password">
            Password
          </label>
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

        <div className="auth-form-group">
          <label className="auth-label" htmlFor="role">I am an:</label>
          <select
            id="role"
            name="role"
            className="auth-select"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="entrepreneur">Entrepreneur</option>
            <option value="investor">Investor</option>
          </select>
        </div>

        <button className="auth-button" type="submit">
          Sign Up
        </button>
      </form>

      <p className="auth-toggle-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}