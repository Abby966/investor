import React, { useState } from "react";
import axios from "axios";
import "../components/Dashboard.css";
import Navbar from "../components/Navbar";



export default function HomePage({ fetchProjects }) {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    headline: "",
    full_description: "",
    budget: "",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/projects/", formData, {
        headers: token ? { Authorization: `Token ${token}` } : {},
      });
      alert("✅ Project added successfully!");
      setFormData({ headline: "", full_description: "", budget: "" });
      fetchProjects();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Failed to add project");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 fw-bold">➕ Add New Project</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Headline</label>
              <input
                type="text"
                className="form-control"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Full Description</label>
              <textarea
                name="full_description"
                rows="3"
                className="form-control"
                value={formData.full_description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label">Budget</label>
              <input
                type="number"
                className="form-control"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                required
              />
            </div>
            <button className="btn btn-primary w-100" type="submit">
              Add Project
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
