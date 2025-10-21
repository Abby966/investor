import React, { useState, useCallback, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import MyProjectsPage from "./pages/MyProjectsPage";
import OtherProjectsPage from "./pages/OtherProjectsPage";
import ChatPage from "./pages/ChatPage";
import axios from "axios";

function App() {
  const [myProjects, setMyProjects] = useState([]);
  const [othersProjects, setOthersProjects] = useState([]);
  const token = localStorage.getItem("token");

  const fetchProjects = useCallback(async () => {
    try {
      if (!token) return;

      const myRes = await axios.get("http://127.0.0.1:8000/api/my-projects/", {
        headers: { Authorization: `Token ${token}` },
      });
      const otherRes = await axios.get("http://127.0.0.1:8000/api/investor/projects/", {
        headers: { Authorization: `Token ${token}` },
      });

      setMyProjects(myRes.data);
      setOthersProjects(otherRes.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage fetchProjects={fetchProjects} />} />
        <Route path="/my-projects" element={<MyProjectsPage myProjects={myProjects} />} />
        <Route path="/other-projects" element={<OtherProjectsPage othersProjects={othersProjects} />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;
