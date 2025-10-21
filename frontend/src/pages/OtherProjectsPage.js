import React from "react";
import "../components/Dashboard.css";
import Navbar from "../components/Navbar";


export default function OtherProjectsPage({ othersProjects }) {
  return (
    <div className="container py-4">
      <h2 className="text-center mb-4 fw-bold">🤝 Other Entrepreneurs’ Projects</h2>
      {othersProjects.length === 0 ? (
        <p className="text-muted">No other projects available yet.</p>
      ) : (
        <div className="row">
          {othersProjects.map((p) => (
            <div key={p.id} className="col-md-4 mb-3">
              <div className="card border-info shadow-sm h-100">
                <div className="card-body">
                  <h6 className="fw-bold text-primary">{p.headline}</h6>
                  <p className="text-muted">(Full description hidden)</p>
                  <p className="fw-bold text-success">💰 ${p.budget}</p>
                  <button className="btn btn-outline-info btn-sm">
                    Request Collaboration
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
