import React from "react";

export default function InvestorDashboard() {
  return (
    <div className="container mt-5">
      <h2>Investor Dashboard</h2>
      <p className="text-muted">Browse and show interest in projects.</p>
      <div className="mt-4">
        <button className="btn btn-primary me-3">View Projects</button>
        <button className="btn btn-outline-success">My Interests</button>
      </div>
    </div>
  );
}
