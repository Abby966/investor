import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function SignupPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "entrepreneur",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Signup
      const response = await axios.post(
        "http://localhost:8000/api/signup/",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("✅ Signup successful!");

      // 2️⃣ Auto-login
      const loginRes = await axios.post(
        "http://localhost:8000/api/login/",
        {
          username: formData.username,
          password: formData.password
        },
        { headers: { "Content-Type": "application/json" } }
      );

      // 3️⃣ Store token & user info
      localStorage.setItem("token", loginRes.data.token);
      localStorage.setItem("user", JSON.stringify({
        username: loginRes.data.username,
        role: loginRes.data.role
      }));

      // 4️⃣ Redirect to dashboard based on role
      if (formData.role === "entrepreneur") {
        navigate("/entrepreneur-dashboard");
      } else if (formData.role === "investor") {
        navigate("/investor-dashboard");
      }

    } catch (err) {
      console.error(err);

      let msg = "Signup failed!";
      if (err.response && err.response.data) {
        if (typeof err.response.data === "object") {
          msg = Object.entries(err.response.data)
            .map(([field, errors]) => {
              if (Array.isArray(errors)) {
                return `${field}: ${errors.join(", ")}`;
              } else {
                return `${field}: ${errors}`;
              }
            })
            .join("\n");
        } else {
          msg = err.response.data;
        }
      }
      alert(msg);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Create an Account</h2>
      <form className="mx-auto" style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            name="username"
            onChange={handleChange}
            value={formData.username}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            onChange={handleChange}
            value={formData.email}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            onChange={handleChange}
            value={formData.password}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            name="role"
            onChange={handleChange}
            value={formData.role}
          >
            <option value="entrepreneur">Entrepreneur</option>
            <option value="investor">Investor</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
      </form>

      <div className="text-center mt-3">
        <p>
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;

