import React, { useState } from "react";
import axios from "axios";
import "../components/Dashboard.css";
import Navbar from "../components/Navbar";


export default function MyProjectsPage({ myProjects, fetchProjects }) {
  const token = localStorage.getItem("token");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    headline: "",
    full_description: "",
    budget: "",
  });

  const handleEditClick = (project) => {
    setEditingProjectId(project.id);
    setEditFormData({
      headline: project.headline,
      full_description: project.full_description,
      budget: project.budget,
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProjectId) return;

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/my-projects/${editingProjectId}/`,
        editFormData,
        { headers: token ? { Authorization: `Token ${token}` } : {} }
      );
      alert("✅ Project updated successfully!");
      setEditingProjectId(null);
      fetchProjects();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Failed to update project");
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await axios.delete(
        `http://127.0.0.1:8000/api/my-projects/${projectId}/`,
        { headers: token ? { Authorization: `Token ${token}` } : {} }
      );
      alert("🗑️ Project deleted successfully!");
      fetchProjects();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("❌ Failed to delete project");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 fw-bold">📁 My Projects</h2>
      {myProjects.length === 0 ? (
        <p className="text-muted">You haven’t added any projects yet.</p>
      ) : (
        <div className="row">
          {myProjects.map((p) => (
            <div key={p.id} className="col-md-4 mb-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  {editingProjectId === p.id ? (
                    <form onSubmit={handleEditSubmit}>
                      <input
                        type="text"
                        name="headline"
                        className="form-control mb-2"
                        value={editFormData.headline}
                        onChange={handleEditChange}
                        required
                      />
                      <textarea
                        name="full_description"
                        className="form-control mb-2"
                        rows="3"
                        value={editFormData.full_description}
                        onChange={handleEditChange}
                        required
                      ></textarea>
                      <input
                        type="number"
                        name="budget"
                        className="form-control mb-2"
                        value={editFormData.budget}
                        onChange={handleEditChange}
                        required
                      />
                      <button type="submit" className="btn btn-success btn-sm me-2">
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingProjectId(null)}
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <h6 className="fw-bold">{p.headline}</h6>
                      <p>{p.full_description}</p>
                      <p className="fw-bold text-success">💰 ${p.budget}</p>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEditClick(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
