import React, { useState } from "react";
import axios from "axios"; 
import "./HomePage.css"; 

export default function HomePage({ fetchProjects }) {
  const token = localStorage.getItem("token");
  const [formData, setFormData] = useState({
    headline: "",
    full_description: "",
    budget: "",
    is_woman_led: false, // Added in previous step
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/projects/", formData, {
        headers: token ? { Authorization: `Token ${token}` } : {},
      });
      alert("✅ Project added successfully!");
      setFormData({ headline: "", full_description: "", budget: "", is_woman_led: false });
      fetchProjects();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Failed to add project");
    }
  };

  return (
    // This wrapper div gets the full-screen black background and sprinkles from HomePage.css
    <div className="home-page-wrapper" style={{ paddingTop: '85px' }}>
      <div className="home-container">
        {/* --- WELCOME BANNER --- */}
        <div className="welcome-banner">
          
          <div className="welcome-text">
            <h1>Share Your Vision</h1>
            <p>
              Our community is built to support and fund the next generation of
              female innovators. Let's get your project seen.
            </p>
          </div>
        </div>
        {/* --- ADD PROJECT FORM --- */}
        <div className="add-project-card">
          <h2 className="form-title">Launch Your Project</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="headline" className="form-label">Project Headline</label>
              <input type="text" id="headline" className="form-input" name="headline" value={formData.headline} onChange={handleChange} placeholder="e.g., AI-Powered App for Financial Literacy" required />
            </div>
            <div className="form-group">
              <label htmlFor="full_description" className="form-label">Full Description</label>
              <textarea id="full_description" name="full_description" rows="5" className="form-textarea" value={formData.full_description} onChange={handleChange} placeholder="What problem does your project solve? Who is it for?" required></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="budget" className="form-label">Funding Goal ($)</label>
              <input type="number" id="budget" className="form-input" name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g., 50000" required />
            </div>
            {/* Woman-led Checkbox */}
            <div className="form-check mb-3">
              <input className="form-check-input" type="checkbox" id="is_woman_led" name="is_woman_led" checked={formData.is_woman_led} onChange={handleChange} />
              <label className="form-check-label" htmlFor="is_woman_led">
                This project is woman-led or has significant female leadership.
              </label>
            </div>
            <button className="form-button" type="submit">Add Project</button>
          </form>
        </div>
      </div>
    </div>
  );
}