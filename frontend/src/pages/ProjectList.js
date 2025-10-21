function ProjectList({ projects }) {
  return (
    <div>
      <h4>Your Projects</h4>
      {projects.length === 0 && <p>No projects yet.</p>}
      {projects.map((proj) => (
        <div key={proj.id} className="card mb-3 p-3">
          <h5>{proj.headline}</h5>
          <p><strong>Budget:</strong> ${proj.budget}</p>
          <p>{proj.full_description}</p> {/* fixed */}
        </div>
      ))}
    </div>
  );
}
