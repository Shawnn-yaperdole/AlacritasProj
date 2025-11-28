// src/Global/Messages.jsx
import React, { useState } from 'react';

// --- MOCK DATA ---
const MOCK_CHATS = [
  { id: 1, name: "Mario Plumber", lastMsg: "I sent a new offer, let me know what you think.", avatar: "https://randomuser.me/api/portraits/men/32.jpg", lastMsgTime: "10:24 AM" },
  { id: 2, name: "Green Thumb", lastMsg: "Thanks for accepting!", avatar: "https://randomuser.me/api/portraits/women/44.jpg", lastMsgTime: "Yesterday" },
];

const CHAT_MESSAGES = [
  { id: 1, text: "Hi, I saw your request for sink repair...", sender: 'Mario Plumber' },
  { id: 2, text: "What's your best offer?", sender: 'Self' },
];

// --- MOCK ACCEPTED OFFER ---
const ACCEPTED_OFFER = {
  image: "https://via.placeholder.com/80",
  title: "Sink Repair Request",
  location: "123 Main St, Manila",
  date: "Nov 28, 2025",
  price: "₱1,500",
  fullDescriptionLink: "#"
};

const MessagesPage = ({ chats = MOCK_CHATS }) => {
  const [selectedChatId, setSelectedChatId] = useState(chats[0]?.id || null);
  const [search, setSearch] = useState("");

  const selectedChat = chats.find(c => c.id === selectedChatId);

  return (
    <div className="messages-fullscreen flex w-screen h-screen">
      
      {/* Chat List */}
      <div className="chat-list flex-shrink-0 w-80 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        <div className="chat-header p-3 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input w-full rounded border px-3 py-2"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats
            .filter(chat => chat.name.toLowerCase().includes(search.toLowerCase()))
            .map(chat => (
              <div
                key={chat.id}
                className={`chat-item flex items-center gap-3 p-3 cursor-pointer transition-colors rounded ${selectedChatId === chat.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                onClick={() => setSelectedChatId(chat.id)}
              >
                <img src={chat.avatar} alt={chat.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1 flex flex-col truncate">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-800 truncate">{chat.name}</p>
                    <span className="text-xs text-gray-400 ml-2">{chat.lastMsgTime}</span>
                  </div>
                  <p className="text-gray-500 text-sm truncate">{chat.lastMsg}</p>
                </div>
              </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="chat-window flex-1 flex flex-col bg-gray-50">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="chat-window-header flex items-center gap-2 p-3 border-b border-gray-200">
              <button 
                onClick={() => setSelectedChatId(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
              >
                &larr;
              </button>
              <span className="font-bold">{selectedChat.name}</span>
            </div>

            {/* Accepted Offer Card */}
            <div className="accepted-offer-card flex items-start gap-4 p-4 bg-white border-b border-gray-200">
              <img src={ACCEPTED_OFFER.image} alt="Issue thumbnail" className="w-20 h-20 object-cover rounded" />
              <div className="flex-1 flex flex-col">
                <h3 className="font-bold text-lg">{ACCEPTED_OFFER.title}</h3>
                <p className="text-gray-500 text-sm">{ACCEPTED_OFFER.location} • {ACCEPTED_OFFER.date}</p>
                <p className="text-green-600 font-semibold mt-1">Accepted Price: {ACCEPTED_OFFER.price}</p>
                <a href={ACCEPTED_OFFER.fullDescriptionLink} className="text-blue-500 text-sm mt-2 hover:underline">
                  View full description
                </a>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="chat-content flex-1 flex flex-col p-4 overflow-y-auto gap-2">
              {CHAT_MESSAGES.map(msg => (
                <div
                  key={msg.id}
                  className={`max-w-[75%] p-3 rounded-xl ${msg.sender === 'Self' ? 'self-end bg-primary-client text-white' : 'self-start bg-gray-200 text-gray-800'}`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="chat-input-area flex p-3 gap-2 border-t border-gray-200">
              <input type="text" placeholder="Type a message..." className="chat-input flex-1 px-3 py-2 rounded border" />
              <button className="action-btn post px-4 py-2">Send</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>Select a chat</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
