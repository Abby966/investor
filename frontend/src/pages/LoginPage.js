import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios"; // make sure this is imported

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        username: formData.username,
        password: formData.password,
      });
  
      // Save token and role
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("username", response.data.username);
  
      // Redirect based on role
      if (response.data.role === "entrepreneur") {
        navigate("/entrepreneur-dashboard");
      } else if (response.data.role === "investor") {
        navigate("/investor-dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Invalid credentials!");
    }
  };
  
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", formData);
  
      localStorage.setItem("token", response.data.token);
  
    
      if (response.data.role === "entrepreneur") {
        navigate("/entrepreneur-dashboard");
      } else {
        navigate("/investor-dashboard");
      }
    } catch (error) {
      alert("Invalid credentials");
    }
  };
  
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Login</h2>
      <form className="mx-auto" style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
}


export default LoginPage;
