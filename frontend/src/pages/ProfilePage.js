import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../components/Dashboard.css";
import "./HomePage.css";
import "./ProfilePage.css";

// Assuming App.js passes down a function `updateCurrentUser`
export default function ProfilePage({ currentUser, updateCurrentUser }) {
  // --- States ---
  const [investorFormData, setInvestorFormData] = useState({ full_name: "", min_budget: "", max_budget: "", areas_of_interest: "" });
  const [savedInvestorProfile, setSavedInvestorProfile] = useState(null); // Holds the data fetched/saved for display
  const [isEditingInvestor, setIsEditingInvestor] = useState(false);
  const [entrepreneurFormData, setEntrepreneurFormData] = useState({ username: "", email: "" });
  const [isEditingEntrepreneur, setIsEditingEntrepreneur] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // --- Fetch Investor Profile ---
  const fetchInvestorProfile = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'investor') { setLoading(false); return; }
    setError(null); setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/profile/investor/", { headers: { Authorization: `Token ${token}` } });
      const profileData = {
        full_name: res.data.full_name || "",
        min_budget: res.data.min_budget || "",
        max_budget: res.data.max_budget || "",
        areas_of_interest: res.data.areas_of_interest || "",
      };
      setInvestorFormData(profileData); // Keep form synced with fetched data
      setSavedInvestorProfile(profileData); // Set the display data
    } catch (err) { console.error("Error fetching investor profile:", err); setError("Failed to load profile data. Please try refreshing."); }
    finally { setLoading(false); }
  }, [currentUser, token]);

   // --- Set Initial Entrepreneur Form Data ---
   const setInitialEntrepreneurForm = useCallback(() => {
     if (currentUser && currentUser.role === 'entrepreneur') {
       setEntrepreneurFormData({ username: currentUser.username || "", email: currentUser.email || "" });
     }
   }, [currentUser]);

  // --- Load data ---
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'investor') { fetchInvestorProfile(); }
      else { setInitialEntrepreneurForm(); setLoading(false); }
    } else { setLoading(true); }
  }, [currentUser, fetchInvestorProfile, setInitialEntrepreneurForm]);

  // --- Investor Handlers ---
  const handleInvestorChange = (e) => setInvestorFormData({ ...investorFormData, [e.target.name]: e.target.value });
  const handleInvestorSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = { ...investorFormData, min_budget: investorFormData.min_budget || null, max_budget: investorFormData.max_budget || null };
    try {
      const res = await axios.put("http://127.0.0.1:8000/api/profile/investor/", dataToSubmit, { headers: { Authorization: `Token ${token}` } });
      alert("✅ Profile updated successfully!");
      const updatedProfileData = { full_name: res.data.full_name || "", min_budget: res.data.min_budget || "", max_budget: res.data.max_budget || "", areas_of_interest: res.data.areas_of_interest || "" };
      setSavedInvestorProfile(updatedProfileData); // Update displayed data
      setInvestorFormData(updatedProfileData); // Update form data as well
      setIsEditingInvestor(false);
    } catch (err) { console.error(err.response?.data || err.message); alert("❌ Failed to update profile."); }
  };
  const handleEditInvestorClick = () => setIsEditingInvestor(true);
  const handleCancelInvestorEdit = () => {
    setIsEditingInvestor(false);
    // Reset form to the currently *displayed* data
    if (savedInvestorProfile) { setInvestorFormData(savedInvestorProfile); }
  };

   // --- Entrepreneur Handlers ---
  const handleEntrepreneurChange = (e) => setEntrepreneurFormData({ ...entrepreneurFormData, [e.target.name]: e.target.value });
  const handleEntrepreneurSubmit = async (e) => {
    // ... (unchanged - includes changedData logic) ...
    e.preventDefault();
    const changedData = {};
    if (entrepreneurFormData.username !== currentUser.username) { changedData.username = entrepreneurFormData.username; }
     if (entrepreneurFormData.email !== currentUser.email) { changedData.email = entrepreneurFormData.email; }
    if (Object.keys(changedData).length === 0) { setIsEditingEntrepreneur(false); return; }
    try {
      const res = await axios.put("http://127.0.0.1:8000/api/profile/", changedData, { headers: { Authorization: `Token ${token}` } });
      alert("✅ Profile updated successfully!");
      if (updateCurrentUser) { updateCurrentUser(res.data); } // Update App state if function provided
      setEntrepreneurFormData({ username: res.data.username || "", email: res.data.email || ""});
      setIsEditingEntrepreneur(false);
    } catch (err) {
        console.error(err.response?.data || err.message);
        let errorMsg = "❌ Failed to update profile.";
        if (err.response?.data?.username) { errorMsg += ` Username error: ${err.response.data.username[0]}`; }
        else if (err.response?.data?.email) { errorMsg += ` Email error: ${err.response.data.email[0]}`; }
        alert(errorMsg);
    }
  };
   const handleEditEntrepreneurClick = () => setIsEditingEntrepreneur(true);
   const handleCancelEntrepreneurEdit = () => {
     setIsEditingEntrepreneur(false);
     if (currentUser) { setEntrepreneurFormData({ username: currentUser.username || "", email: currentUser.email || ""}); }
   };

  // --- Loader & Error ---
  if (!currentUser || loading) { return (<div className="page-wrapper" style={{ paddingTop: '85px' }}><div className="loader-wrapper" style={{ height: '70vh' }}><div className="loader"></div></div></div>); }
  if (error && currentUser.role === 'investor') { return (<div className="page-wrapper profile-page-layout" style={{ paddingTop: '85px' }}><h2 className="page-title">My Profile</h2><div className="add-project-card profile-card-container" style={{ borderColor: 'red' }}><p className="text-danger text-center">{error}</p><button onClick={fetchInvestorProfile} className="form-button" style={{marginTop: '1rem'}}>Retry</button></div></div>); }

  // --- RENDER ---
  return (
    <div className="page-wrapper profile-page-layout" style={{ paddingTop: '85px' }}>
      <h2 className="page-title">My Profile</h2>

      {/* --- INVESTOR VIEW --- */}
      {currentUser.role === 'investor' && (
        <div className="add-project-card profile-card-container">
          {isEditingInvestor ? (
            // --- Investor Edit Form ---
            <>
              <h3 className="form-title" style={{fontSize: '1.5rem', marginBottom: '1.5rem'}}>Edit Your Profile</h3>
              <form onSubmit={handleInvestorSubmit}>
                {/* Ensure inputs use investorFormData and handleInvestorChange */}
                <div className="form-group">
                  <label htmlFor="full_name" className="form-label">Full Name</label>
                  <input type="text" id="full_name" name="full_name" className="form-input" value={investorFormData.full_name} onChange={handleInvestorChange} placeholder="e.g., Jane Doe" />
                </div>
                 <div className="form-group">
                    <label htmlFor="min_budget" className="form-label">Investment Range (Min $)</label>
                    <input type="number" id="min_budget" name="min_budget" className="form-input" value={investorFormData.min_budget} onChange={handleInvestorChange} placeholder="e.g., 10000" />
                </div>
                <div className="form-group">
                    <label htmlFor="max_budget" className="form-label">Investment Range (Max $)</label>
                    <input type="number" id="max_budget" name="max_budget" className="form-input" value={investorFormData.max_budget} onChange={handleInvestorChange} placeholder="e.g., 50000" />
                </div>
                <div className="form-group">
                    <label htmlFor="areas_of_interest" className="form-label">Areas of Interest</label>
                    <textarea id="areas_of_interest" name="areas_of_interest" className="form-textarea" rows="4" value={investorFormData.areas_of_interest} onChange={handleInvestorChange} placeholder="e.g., AI, FinTech, Healthcare, E-commerce"></textarea>
                    <small className="text-muted">Comma-separated list</small>
                </div>
                <div className="edit-form-actions" style={{marginTop: '1rem'}}>
                   <button className="form-button" type="submit" style={{width: 'auto', marginRight: '1rem'}}>Save Profile</button>
                   <button type="button" className="project-btn btn-cancel" onClick={handleCancelInvestorEdit} style={{width: 'auto'}}>Cancel</button>
                </div>
              </form>
            </>
          ) : (
            // --- Investor Display Profile ---
            <>
              <h3 className="form-title" style={{fontSize: '1.5rem', marginBottom: '1.5rem'}}>Current Profile</h3>
              {/* ✅ Ensure this section uses savedInvestorProfile */}
              {savedInvestorProfile ? (
                <>
                  <div className="profile-info-item">
                    <strong className="form-label">Full Name:</strong>
                    {/* Display data from savedInvestorProfile */}
                    <p>{savedInvestorProfile.full_name || 'Not Set'}</p>
                  </div>
                  <div className="profile-info-item">
                    <strong className="form-label">Investment Range:</strong>
                    <p>${savedInvestorProfile.min_budget || '0'} - ${savedInvestorProfile.max_budget || 'Any'}</p>
                  </div>
                  <div className="profile-info-item">
                    <strong className="form-label">Areas of Interest:</strong>
                    <div className="interest-tags">
                      {savedInvestorProfile.areas_of_interest ? savedInvestorProfile.areas_of_interest.split(',').map((interest, index) => ( interest.trim() && <span key={index} className="interest-tag">{interest.trim()}</span> )) : <p>Not Set</p>}
                    </div>
                  </div>
                  <button className="project-btn btn-edit" style={{marginTop: '1.5rem'}} onClick={handleEditInvestorClick}>Edit Profile</button>
                </>
              ) : (
                 <>
                    <p className="text-muted text-center">No profile information saved yet. Click Edit to add details.</p>
                    <button className="project-btn btn-edit" style={{marginTop: '1.5rem'}} onClick={handleEditInvestorClick}>Edit Profile</button>
                 </>
              )}
            </>
          )}
        </div>
      )}

      {/* --- ENTREPRENEUR VIEW (Ensure this uses entrepreneurFormData/currentUser and isEditingEntrepreneur) --- */}
      {currentUser.role === 'entrepreneur' && (
        <div className="add-project-card profile-card-container">
           {isEditingEntrepreneur ? (
              // Entrepreneur Edit Form
              <>
                 <h3 className="form-title" style={{fontSize: '1.5rem', marginBottom: '1.5rem'}}>Edit Your Profile</h3>
                 <form onSubmit={handleEntrepreneurSubmit}>
                     <div className="form-group">
                         <label htmlFor="username" className="form-label">Username</label>
                         <input type="text" id="username" name="username" className="form-input" value={entrepreneurFormData.username} onChange={handleEntrepreneurChange} required />
                     </div>
                     <div className="form-group">
                         <label htmlFor="email" className="form-label">Email</label>
                         <input type="email" id="email" name="email" className="form-input" value={entrepreneurFormData.email} onChange={handleEntrepreneurChange} required />
                     </div>
                     <div className="edit-form-actions" style={{marginTop: '1rem'}}>
                         <button className="form-button" type="submit" style={{width: 'auto', marginRight: '1rem'}}>Save Profile</button>
                         <button type="button" className="project-btn btn-cancel" onClick={handleCancelEntrepreneurEdit} style={{width: 'auto'}}>Cancel</button>
                     </div>
                 </form>
              </>
           ) : (
              // Entrepreneur Display Profile
              <>
                 <h3 className="form-title" style={{fontSize: '1.5rem', marginBottom: '1.5rem'}}>Current Profile</h3>
                 <div className="profile-info-item">
                   <strong className="form-label">Username:</strong>
                   {/* Display current username (from form state if changed, else from currentUser) */}
                   <p>{entrepreneurFormData.username || currentUser.username || '-'}</p>
                 </div>
                 <div className="profile-info-item">
                   <strong className="form-label">Email:</strong>
                   <p>{entrepreneurFormData.email || currentUser.email || '-'}</p>
                 </div>
                 <button className="project-btn btn-edit" style={{marginTop: '1.5rem'}} onClick={handleEditEntrepreneurClick}>Edit Profile</button>
              </>
           )}
        </div>
      )}
    </div>
  );
}