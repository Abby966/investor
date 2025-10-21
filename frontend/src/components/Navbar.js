import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="pure-menu pure-menu-horizontal">
      <Link className="pure-menu-heading pure-menu-link" to="/">Home</Link>
      <ul className="pure-menu-list">
        <li className="pure-menu-item"><Link className="pure-menu-link" to="/">Add Project</Link></li>
        <li className="pure-menu-item"><Link className="pure-menu-link" to="/my-projects">My Projects</Link></li>
        <li className="pure-menu-item"><Link className="pure-menu-link" to="/other-projects">Other Projects</Link></li>
        <li className="pure-menu-item"><Link className="pure-menu-link" to="/chat">Chat</Link></li>
      </ul>
    </div>
  );
}
