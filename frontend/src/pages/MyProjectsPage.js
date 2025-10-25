import React, { useState } from "react";
import axios from "axios";
import "../components/Dashboard.css"; // ✅ Our stylish new file

export default function MyProjectsPage({ myProjects, fetchProjects }) {
  
  // --- YOUR LOGIC (UNCHANGED) ---
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
  // --- END OF LOGIC ---


  // --- ✅ NEW RENDER LOGIC ---

  // 1. Show loading spinner
  //    (We check for `null` which is the new initial state from App.js)
  if (myProjects === null) {
    return (
      // We apply the layout fix here too, so the spinner is centered correctly
      <div className="page-wrapper" style={{ paddingTop: '85px' }}>
        <div className="loader-wrapper" style={{ height: '70vh' }}>
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  // 2. Show empty message
  if (myProjects.length === 0) {
    return (
      <div className="page-wrapper" style={{ paddingTop: '85px' }}>
        <h2 className="page-title">My Projects</h2>
        <p className="text-muted text-center" style={{fontSize: '1.1rem'}}>
          You haven’t added any projects yet.
        </p>
      </div>
    );
  }

  // 3. Show projects
  return (
    // ✅ BULLETPROOF LAYOUT FIX (same as HomePage.js)
    <div className="page-wrapper" style={{ paddingTop: '85px' }}>
      <h2 className="page-title">My Projects</h2>
      <div className="projects-grid">
        {myProjects.map((p) => (
          <div key={p.id} className="project-card"> {/* Animation is here! */}
            {editingProjectId === p.id ? (
              // --- EDIT FORM ---
              <form onSubmit={handleEditSubmit} className="edit-form">
                <input
                  type="text"
                  name="headline"
                  className="form-input"
                  value={editFormData.headline}
                  onChange={handleEditChange}
                  required
                />
                <textarea
                  name="full_description"
                  className="form-textarea"
                  rows="4"
                  value={editFormData.full_description}
                  onChange={handleEditChange}
                  required
                ></textarea>
                <input
                  type="number"
                  name="budget"
                  className="form-input"
                  value={editFormData.budget}
                  onChange={handleEditChange}
                  required
                />
                <div className="edit-form-actions">
                  <button type="submit" className="project-btn btn-save">
                    Save
                  </button>
                  <button
                    type="button"
                    className="project-btn btn-cancel"
                    onClick={() => setEditingProjectId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // --- PROJECT DISPLAY ---
              <>
                <h6 className="project-headline">{p.headline}</h6>
                <p className="project-description">{p.full_description}</p>
                <p className="project-budget"> ${p.budget}</p>
                <div className="project-actions">
                  <button
                    className="project-btn btn-edit"
                    onClick={() => handleEditClick(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="project-btn btn-delete"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}