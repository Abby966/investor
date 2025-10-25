import React from "react";
import { Link } from "react-router-dom"; // Import Link
import "../components/Dashboard.css"; // Use our existing styles

export default function InvestorDashboard() {
  return (
    // Use the layout fix
    <div className="page-wrapper" style={{ paddingTop: '85px' }}>
      <h2 className="page-title">Investor Dashboard</h2>
      <p className="text-muted text-center">
        Browse and show interest in projects.
      </p>
      <div className="mt-4 text-center">
        {/* Use Link to navigate */}
        <Link to="/other-projects" className="project-btn btn-save" style={{fontSize: '1rem', textDecoration: 'none'}}>
          View All Projects
        </Link>
      </div>
    </div>
  );
}