import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/Dashboard.css"; // Use our existing styles

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        // This is the protected API that checks for a signed NDA
        const res = await axios.get(
          `http://127.0.0.1:8000/api/investor/projects/${id}/`,
          { headers: { Authorization: `Token ${token}` } }
        );
        setProject(res.data);
      } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 403) {
          // 403 Forbidden means NDA is not signed
          alert("❌ You must sign the NDA before viewing this project.");
          navigate(`/project/${id}/nda`); // Send them back to the NDA page
        } else {
          alert("❌ Could not load project details.");
        }
      }
    };

    fetchProjectDetails();
  }, [id, token, navigate]);

  if (!project) {
    return (
      <div className="page-wrapper" style={{ paddingTop: '85px' }}>
        <div className="loader-wrapper" style={{ height: '70vh' }}>
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper" style={{ paddingTop: '85px' }}>
      <div className="add-project-card" style={{maxWidth: '800px', margin: '0 auto'}}>
        <h2 className="project-headline" style={{fontSize: '2rem'}}>
          {project.title}
        </h2>
        <p className="project-description" style={{fontStyle: 'italic', color: '#555', fontWeight: 500, fontSize: '1.1rem'}}>
          By: {project.entrepreneur}
        </p>
        
        <hr className="my-4" />
        
        <h4 className="form-label">Full Project Description:</h4>
        <p className="project-description" style={{fontSize: '1.05rem'}}>
          {project.description}
        </p>
        
        <h4 className="form-label mt-4">Funding Goal:</h4>
        <p className="project-budget" style={{fontSize: '1.5rem', margin: 0}}>
          💰 ${project.budget}
        </p>

        <button 
          className="project-btn btn-save" 
          style={{marginTop: '2rem'}}
          onClick={() => navigate('/chat')}
        >
          Chat with Entrepreneur
        </button>
      </div>
    </div>
  );
}