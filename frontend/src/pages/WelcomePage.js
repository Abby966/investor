import React from "react";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

function WelcomePage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup");
  };

  return (
    <div className="container text-center mt-5">
      <h1 className="display-4 mb-3">Welcome to Investor Connect</h1>
      <p className="lead mb-4">
        Connecting Entrepreneurs and Investors for a better future.
      </p>
      <button
        onClick={handleGetStarted}
        className="btn btn-primary btn-lg px-5"
      >
        Get Started
      </button>
    </div>
  );
}

export default WelcomePage;
