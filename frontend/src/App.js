import React, { useState, useCallback, useEffect } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import MyProjectsPage from "./pages/MyProjectsPage";
import OtherProjectsPage from "./pages/OtherProjectsPage";
import ChatPage from "./pages/ChatPage";
import axios from "axios";

// Import all pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import InvestorDashboard from "./pages/InvestorDashboard";
import NdaPage from "./pages/NdaPage"; // Ensure this is imported correctly
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProfilePage from "./pages/ProfilePage"; 

// Private Route component
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  const [myProjects, setMyProjects] = useState(null);
  const [othersProjects, setOthersProjects] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem("token");

  // --- Fetching logic (unchanged) ---
  const fetchCurrentUser = useCallback(async () => {
    if (token) {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/profile/", {
          headers: { Authorization: `Token ${token}` },
        });
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Could not fetch profile", err);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  }, [token]);

  const fetchProjects = useCallback(async () => {
    // ... (fetchProjects logic is correct)
    try {
      if (!token) return;
      const myRes = await axios.get("http://127.0.0.1:8000/api/my-projects/", {
        headers: { Authorization: `Token ${token}` },
      });
      const otherRes = await axios.get(
        "http://127.0.0.1:8000/api/investor/projects/",
        {
          headers: { Authorization: `Token ${token}` },
        }
      );
      setMyProjects(myRes.data);
      setOthersProjects(otherRes.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
      fetchProjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Re-run only when token changes
  // --- End Fetching Logic ---

  return (
    <Router>
      <Navbar currentUser={currentUser} />
      
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* --- PRIVATE ENTREPRENEUR ROUTES --- */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage fetchProjects={fetchProjects} />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-projects"
          element={
            <PrivateRoute>
              <MyProjectsPage
                myProjects={myProjects}
                fetchProjects={fetchProjects}
              />
            </PrivateRoute>
          }
        />

        {/* --- COMMON ROUTES --- */}
         <Route
          path="/other-projects"
          element={
            <PrivateRoute>
              <OtherProjectsPage
                othersProjects={othersProjects}
                currentUser={currentUser}
              />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage currentUser={currentUser} />
            </PrivateRoute>
          }
        />
         <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage currentUser={currentUser} />
            </PrivateRoute>
          }
        />

        {/* --- INVESTOR ROUTES --- */}
        <Route
          path="/investor-dashboard"
          element={
            <PrivateRoute>
              <InvestorDashboard />
            </PrivateRoute>
          }
        />
        {/* ✅ ENSURE THIS ROUTE IS CORRECT */}
        <Route
          path="/project/:id/nda" 
          element={
            <PrivateRoute>
              <NdaPage /> 
            </PrivateRoute>
          }
        />
         <Route
          path="/project/:id/detail"
          element={
            <PrivateRoute>
              <ProjectDetailPage />
            </PrivateRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
