import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ChatPage() {
  const [users, setUsers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");

  const token = localStorage.getItem("token");

  // Fetch all registered users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/all-users/", {
        headers: { Authorization: `Token ${token}` },
      });
      console.log(res.data); // <-- check if data comes
      setUsers(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };
  

  useEffect(() => {
    fetchUsers();
  }, []);

  // Sending chat messages locally for now
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      id: chatMessages.length + 1,
      sender: "You",
      text: chatInput,
      time: new Date().toLocaleTimeString(),
    };
    setChatMessages([...chatMessages, newMsg]);
    setChatInput("");
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      {/* Users List */}
      <div style={{ width: "25%", marginRight: "20px" }}>
        <h5>Registered Users</h5>
        <ul>
  {users.map((u) => (
    <li key={u.id}>
      <strong>{u.username}</strong> - <em>{u.role}</em>
    </li>
  ))}
</ul>

      </div>

      {/* Chat Section */}
      <div style={{ width: "75%" }}>
        <h5>💬 Chat Room</h5>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            height: "400px",
            overflowY: "auto",
            marginBottom: "10px",
            backgroundColor: "#f9f9f9",
          }}
        >
          {chatMessages.length === 0 ? (
            <p>No messages yet</p>
          ) : (
            chatMessages.map((msg) => (
              <div key={msg.id} style={{ marginBottom: "5px" }}>
                <strong>{msg.sender}:</strong> {msg.text}{" "}
                <small style={{ color: "#888" }}>{msg.time}</small>
              </div>
            ))
          )}
        </div>
        <form onSubmit={handleChatSubmit} style={{ display: "flex" }}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: "8px" }}
          />
          <button type="submit" style={{ padding: "8px 15px" }}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
