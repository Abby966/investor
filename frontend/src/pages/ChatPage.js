import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import "./ChatPage.css"; // Import styles

// Simple polling hook
function useInterval(callback, delay) {
 // ... (useInterval hook - unchanged) ...
 const savedCallback = useRef();
 useEffect(() => { savedCallback.current = callback; }, [callback]);
 useEffect(() => { function tick() { savedCallback.current(); } if (delay !== null) { let id = setInterval(tick, delay); return () => clearInterval(id); } }, [delay]);
}

// Helper Functions for Local Storage (Unchanged)
const getLastReadTimestamps = () => { try { const d = localStorage.getItem('chatLastReadTimestamps'); return d ? JSON.parse(d) : {}; } catch (e) { return {}; }};
const saveLastReadTimestamps = (t) => { try { localStorage.setItem('chatLastReadTimestamps', JSON.stringify(t)); } catch (e) {} };

export default function ChatPage({ currentUser }) {
 const [contacts, setContacts] = useState([]);
 const [selectedChat, setSelectedChat] = useState(null);
 const [messages, setMessages] = useState([]); // State for the conversation
 const [newMessage, setNewMessage] = useState("");
 const [lastReadTimestamp, setLastReadTimestamp] = useState(getLastReadTimestamps);
 const [unreadChats, setUnreadChats] = useState(new Set());
 const token = localStorage.getItem("token");
 const messageListRef = useRef(null);

 console.log("ChatPage rendered. currentUser:", currentUser); // Log initial render

 // Auto-scroll (Unchanged)
 useEffect(() => { /* ... */ }, [messages]);

 // Fetch contacts and check notifications (Unchanged)
 const fetchContacts = useCallback(async () => { /* ... */ }, [token, currentUser, lastReadTimestamp]);

 // --- FETCH MESSAGES (WITH DETAILED LOGGING) ---
 const fetchMessages = useCallback(async (chat) => {
   if (!chat) {
       console.log("fetchMessages skipped: No chat selected.");
       setMessages([]); // Clear messages if no chat selected
       return;
   }
   console.log(`%c[FETCH] Starting fetch for chat: Project ${chat.project_id}, User ${chat.other_user.id}`, 'color: blue; font-weight: bold;');
   try {
     const { project_id, other_user } = chat;
     const apiUrl = `http://127.0.0.1:8000/api/chats/${project_id}/${other_user.id}/`;
     console.log("[FETCH] Calling API:", apiUrl);
     const res = await axios.get(apiUrl, { headers: { Authorization: `Token ${token}` } });
     console.log("[FETCH] Raw API Response:", res); // Log the entire response object

     if (res && res.data) {
        console.log("%c[FETCH] Messages received from API:", 'color: green;', res.data);
        console.log("[FETCH] Type of received data:", typeof res.data);
        console.log("[FETCH] Is received data an array?", Array.isArray(res.data));

        if (Array.isArray(res.data)) {
            setMessages(res.data);
            console.log("%c[STATE] setMessages called with data.", 'color: purple;');
        } else {
            console.error("Error: API did not return an array. Received:", res.data);
            setMessages([]);
             console.log("%c[STATE] setMessages called with empty array due to incorrect data type.", 'color: orange;');
        }
     } else {
        console.error("Error: API response or response.data is missing.");
         setMessages([]);
         console.log("%c[STATE] setMessages called with empty array due to missing response data.", 'color: orange;');
     }

   } catch (err) {
     console.error("Failed to fetch messages:", err.response?.data || err.message);
      if (err.response) { console.error("Backend Error Response:", err.response); }
     setMessages([]);
     console.log("%c[STATE] setMessages called with empty array due to API error.", 'color: red;');
   }
 }, [token]); // Dependency array only needs token

 // --- Use ONE fast poll for contacts/notifications (Unchanged) ---
 useInterval(fetchContacts, 2500);

 // --- Runs when you CLICK a chat contact ---
 const handleSelectChat = (contact) => {
   console.log("handleSelectChat called with:", contact); // Log selected contact
   setMessages([]); // Clear old messages immediately visually
   setSelectedChat(contact); // Set the selected chat state
   fetchMessages(contact); // <--- Trigger fetching messages for this NEW chat

   // Mark as read logic (Unchanged)
   const chatKey = `${contact.project_id}-${contact.other_user.id}`;
   const now = new Date().toISOString();
   setLastReadTimestamp(prev => { /* ... */ });
   setUnreadChats(prevUnread => { /* ... */ });
 };

 // --- Runs when you SEND a message (Unchanged) ---
 const handleSendMessage = async (e) => { /* ... */ };

 // --- RENDER LOGIC ---
 if (!currentUser) { /* ... (Loader) ... */ }

 console.log(`Rendering Chat window. SelectedChat: ${selectedChat ? 'Yes' : 'No'}, Messages state (length ${messages.length}):`, messages); // Log state before render

 return (
   <div className="chat-layout">
     {/* --- SIDEBAR (Unchanged structure) --- */}
      <div className="chat-sidebar">
        <div className="sidebar-header">Conversations</div>
        <div className="contact-list">
          {contacts.map((contact) => {
            const chatKey = `${contact.project_id}-${contact.other_user.id}`;
            const isUnread = unreadChats.has(chatKey);
            return (
              <div
                key={chatKey}
                className={`contact-card ${selectedChat?.other_user.id === contact.other_user.id && selectedChat?.project_id === contact.project_id ? "active" : ""}`}
                onClick={() => handleSelectChat(contact)}
              >
                <h4 className="contact-name">{contact.other_user.username}</h4>
                <p className="contact-project">{contact.project_headline}</p>
                <p className="contact-project" style={{color: '#1e8a5b', fontWeight: '600'}}>💰 ${contact.project_budget}</p>
                {isUnread && <div className="notification-badge"></div>}
              </div>
            );
          })}
        </div>
      </div>
     {/* --- CHAT WINDOW --- */}
     <div className="chat-window">
        {selectedChat ? (
          <>
           <div className="chat-window-header">
             <h3>{selectedChat.other_user.username}</h3>
             <p className="contact-project" style={{ margin: 0 }}>{selectedChat.project_headline}</p>
           </div>
           <div className="message-list" ref={messageListRef}>
             {/* Check messages state */}
             {Array.isArray(messages) && messages.length > 0 ? (
                 messages.map((msg, index) => (
                   <div key={msg.id || `msg-${index}`}
                        className={`message-bubble ${ msg.sender === currentUser.username ? "sent" : "received" }`}>
                     {msg.message || ''}
                   </div>
                 ))
             ) : (
                 <p style={{textAlign: 'center', color: '#888', marginTop: '2rem'}}>No messages yet. Start the conversation!</p>
             )}
           </div>
           <form className="message-form" onSubmit={handleSendMessage}>
             <input type="text" className="message-input" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
             <button type="submit" className="send-button">Send</button>
           </form>
         </>
       ) : (
         <div className="chat-placeholder">
           <h3>Select a conversation</h3>
           <p>Choose a project from the left to start chatting.</p>
         </div>
       )}
     </div>
   </div>
 );
}