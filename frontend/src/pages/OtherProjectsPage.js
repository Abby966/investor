import React, { useState, useMemo } from "react"; // ✅ Added useMemo
import { Link, useLocation } from "react-router-dom";
import "../components/Dashboard.css";

// ✅ Simple Badge Component
const WomanLedBadge = () => (
 <span style={{
   backgroundColor: '#e7d7ff', // Light purple
   color: '#764ba2', // Theme purple
   padding: '0.2rem 0.6rem',
   borderRadius: '12px',
   fontSize: '0.75rem',
   fontWeight: '600',
   marginLeft: '0.5rem',
   border: '1px solid #c9aeff'
 }}>
   ♀ Woman-Led
 </span>
);

// ✅ Featured Icon
const FeaturedIcon = () => (
    <span title="Featured Project" style={{ color: '#ffc107', marginLeft: '0.5rem', fontSize: '1.1rem' }}>⭐</span>
);


export default function OtherProjectsPage({ othersProjects, currentUser }) {
 const location = useLocation();
 const hideTitle = location.state?.fromDashboard;
 // ✅ State for filtering
 const [showOnlyWomanLed, setShowOnlyWomanLed] = useState(false);

 // ✅ Memoize sorting and filtering for performance
 const sortedAndFilteredProjects = useMemo(() => {
    // Handle loading case where projects might be null initially
    if (!othersProjects) return [];

    // Filter first based on the toggle state
    const filtered = showOnlyWomanLed
      ? othersProjects.filter(p => p.is_woman_led)
      : othersProjects;

    // Then sort: featured projects first
    return filtered.sort((a, b) => {
        // If 'a' is featured and 'b' is not, 'a' comes first (-1)
        if (a.is_featured && !b.is_featured) return -1;
        // If 'b' is featured and 'a' is not, 'b' comes first (1)
        if (!a.is_featured && b.is_featured) return 1;
        // Otherwise, keep original order (or sort by date if needed)
        return 0;
    });
  }, [othersProjects, showOnlyWomanLed]); // Recalculate only when projects or filter change


 // ✅ --- ADDED LOADING SPINNER LOGIC ---
 // 1. Show loading spinner if data isn't ready
 if (othersProjects === null || currentUser === null) {
    return (
      <div className="page-wrapper" style={{ paddingTop: '85px' }}>
        <div className="loader-wrapper" style={{ height: '70vh' }}>
          <div className="loader"></div>
        </div>
      </div>
    );
 }
 // ------------------------------------

 // 3. Show projects (or empty message)
 return (
   <div className="page-wrapper" style={{ paddingTop: '85px' }}>
     {/* Conditionally render title */}
     {!hideTitle && <h2 className="page-title"></h2>}

     {/* Filter Toggle Button */}
     <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
       <button
         className={`project-btn ${showOnlyWomanLed ? 'btn-save' : 'btn-cancel'}`} // Use existing button styles
         onClick={() => setShowOnlyWomanLed(!showOnlyWomanLed)}
       >
         {showOnlyWomanLed ? 'Show All Projects' : 'Show Only Woman-Led'}
       </button>
     </div>

     {/* ✅ Premium Message (Check currentUser before accessing role/is_premium) */}
      {currentUser && currentUser.role === 'investor' && !currentUser.is_premium && othersProjects && othersProjects.length > 3 && (
        <div className="alert alert-info text-center" style={{maxWidth: '600px', margin: '0 auto 1.5rem auto'}}>
          Upgrade to Premium to view all projects. (Showing first 3)
        </div>
      )}

     {/* Apply premium limit if applicable */}
     {(() => {
        const projectsToDisplay = (currentUser && currentUser.role === 'investor' && !currentUser.is_premium)
            ? sortedAndFilteredProjects.slice(0, 3) // Apply limit
            : sortedAndFilteredProjects; // Show all

        // Check filtered list length AFTER applying limit
        if (projectsToDisplay.length === 0) {
            return (
                 <p className="text-muted text-center" style={{fontSize: '1.1rem'}}>
                    {showOnlyWomanLed ? "No woman-led projects match." : "No other projects available."}
                 </p>
            );
        } else {
            // Display the projects grid
            return (
                <div className="projects-grid">
                    {projectsToDisplay.map((p) => (
                    <div key={p.id} className={`project-card ${p.is_featured ? 'featured-project' : ''}`}> {/* Optional class */}
                        <h6 className="project-headline">
                        {p.headline}
                        {/* Display badges/icons */}
                        {p.is_woman_led && <WomanLedBadge />}
                        {p.is_featured && <FeaturedIcon />}
                        </h6>
                        <p className="project-description" style={{fontStyle: 'italic', color: '#555', fontWeight: 500}}>By: {p.entrepreneur}</p>
                        <p className="project-budget">💰 ${p.budget}</p>
                        <div className="project-actions">
                        {/* Conditional Button/Link */}
                        {currentUser.role === 'investor' ? (
                            <Link to={`/project/${p.id}/nda`} className="project-btn btn-save" style={{textDecoration: 'none', textAlign: 'center'}}>Request NDA</Link>
                        ) : (
                            <Link to={`/project/${p.id}/nda`} className="project-btn btn-save" style={{textDecoration: 'none', textAlign: 'center'}}>Start Chat</Link>
                        )}
                        </div>
                    </div>
                    ))}
                </div>
            );
        }
     })()} {/* End of self-invoking function to handle display logic */}

   </div>
 );
}