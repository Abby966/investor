import React, { useState } from "react";
import axios from "axios";

function AddProjectForm({ onProjectAdded }) {
  const [formData, setFormData] = useState({
    headline: "",
    description: "",
    budget: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/projects/", formData, {
        withCredentials: true, // if using auth tokens/cookies
      });
      alert("Project added successfully!");
      setFormData({ headline: "", description: "", budget: "" });
      onProjectAdded(res.data); // update parent list
    } catch (err) {
      console.error(err.response?.data);
      alert("Failed to add project");
    }
  };

  return (
    <div className="card mb-4 p-3">
      <h4>Add New Project</h4>
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
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            required
          />
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
        <button type="submit" className="btn btn-primary">
          Add Project
        </button>
      </form>
    </div>
  );
}

export default AddProjectForm;
