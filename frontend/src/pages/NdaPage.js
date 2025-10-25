import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../components/Dashboard.css"; // Use our existing styles
import "./ProfilePage.css"; // Use profile styles for card layout

export default function NdaPage() {
  const { id } = useParams(); // Gets the project ID from the URL
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // State to hold the project headline
  const [projectHeadline, setProjectHeadline] = useState("");
  // State to track if the interest record exists/is created
  const [interestRecordExists, setInterestRecordExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function runs on page load
    const createOrVerifyInterest = async () => {
      try {
        setLoading(true);
        // Step 1: Call the "Express Interest" API silently
        // This creates the ProjectInterest object OR returns the existing one
        const interestRes = await axios.post(
          `http://127.0.0.1:8000/api/investor/projects/${id}/interest/`,
          {},
          { headers: { Authorization: `Token ${token}` } }
        );

        // Step 2: Get the project's basic info to display
        // We fetch from the 'other-projects' API and find our project
        const projectsRes = await axios.get("http://127.0.0.1:8000/api/investor/projects/", {
          headers: { Authorization: `Token ${token}` },
        });

        const project = projectsRes.data.find(p => p.id === parseInt(id));
        if (project) {
          setProjectHeadline(project.headline);
        }

        setInterestRecordExists(true); // Mark as success
        setLoading(false);

      } catch (err) {
        console.error("Error verifying/creating interest:", err);
        // Handle specific errors if needed, e.g., project not found
        alert("Error loading project information.");
        setLoading(false);
        // Optional: Redirect back if the project doesn't exist or other critical error
        // navigate('/other-projects'); 
      }
    };

    createOrVerifyInterest();
  }, [id, token]); // Re-run if ID or token changes

  const handleSignNda = async () => {
    try {
      // Step 3: Call the "Sign NDA" API
      await axios.post(
        `http://127.0.0.1:8000/api/investor/projects/${id}/sign-nda/`,
        {},
        { headers: { Authorization: `Token ${token}` } }
      );

      alert("✅ NDA Signed! You can now view the full project details.");
      // Step 4: Redirect to the full project detail page
      navigate(`/project/${id}/detail`);

    } catch (err) {
      console.error("Error signing NDA:", err);
      alert("❌ Failed to sign NDA. Please try again.");
    }
  };

  // --- Render Logic ---

  if (loading) {
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
      <h2 className="page-title">Non-Disclosure Agreement (NDA)</h2>
      
      {/* --- Use profile card style for layout --- */}
      <div className="add-project-card profile-card-container" style={{maxWidth: '800px', margin: '1rem auto'}}> 
        <h3 className="project-headline text-center" style={{fontSize: '1.5rem'}}>
          Regarding Project: {projectHeadline || 'Loading...'}
        </h3>
        <hr className="my-4" />

        {/* --- ✅ NDA AGREEMENT TEXT AREA --- */}
        <div className="nda-text-area" style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem', marginBottom: '1.5rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <h4>Agreement Terms:</h4>
          <p>
            <strong>1. Definition of Confidential Information:</strong> "Confidential Information" shall mean any and all technical and non-technical information provided by the Disclosing Party (the Entrepreneur) to the Receiving Party (the Investor), including but not limited to patent and patent applications, trade secrets, and proprietary information, techniques, sketches, drawings, models, inventions, know-how, processes, apparatus, equipment, algorithms, software programs, software source documents, and formulae related to the current, future and proposed products and services of the Disclosing Party, and including, without limitation, the Disclosing Party’s information concerning research, experimental work, development, design details and specifications, engineering, financial information, procurement requirements, purchasing, manufacturing, customer lists, business forecasts, sales and merchandising, and marketing plans and information.
          </p>
          <p>
            <strong>2. Nondisclosure of Confidential Information:</strong> The Receiving Party agrees that it shall treat all Confidential Information of the Disclosing Party with the same degree of care as it accords to its own Confidential Information, and Receiving Party represents that it exercises reasonable care to protect its own Confidential Information. The Receiving Party agrees not to use any Confidential Information of the Disclosing Party for any purpose except as necessary to evaluate the potential business relationship between the parties related to the Project. The Receiving Party agrees not to disclose any Confidential Information of the Disclosing Party to third parties or to employees of the Receiving Party, except to those employees who are required to have the information in order to evaluate the potential business relationship.
          </p>
          <p>
            <strong>3. Return of Materials:</strong> Any materials or documents which have been furnished by the Disclosing Party to the Receiving Party will be promptly returned, accompanied by all copies of such documentation, after the business opportunity has been rejected or concluded.
          </p>
          <p>
            <strong>4. Term:</strong> This Agreement shall remain in effect for a period of three (3) years from the date hereof.
          </p>
          {/* Add more sections as needed */}
          <p className="mt-3">
            <strong>By clicking the "Sign NDA" button below, you acknowledge that you have read, understood, and agree to be bound by the terms of this Non-Disclosure Agreement.</strong>
          </p>
        </div>
        {/* --- END NDA TEXT AREA --- */}

        <button 
          className="form-button" // Use the nice purple button style
          onClick={handleSignNda}
          disabled={!interestRecordExists} // Button is disabled until interest is confirmed
        >
          Sign NDA and View Full Project Description
        </button>
        {!interestRecordExists && loading && <p className="text-muted text-center mt-2">Preparing agreement...</p>}
      </div>
    </div>
  );
}