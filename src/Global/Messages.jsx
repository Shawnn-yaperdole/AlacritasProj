// src/Global/Messages.jsx
import React, { useState } from 'react';

// --- MOCK DATA & COMPONENTS (Simplified) ---
const MOCK_CHATS = [
  { 
    id: 1, 
    name: "Mario Plumber", 
    lastMsg: "I sent a new offer.", 
    transactionStatus: 'negotiating',
    lastOffer: 75.0,
    lastOfferBy: 'provider',
    canViewContact: false,
    clientBudgetMax: 100.0,
    minBenchmarkPrice: 60.0,
    requestTitle: 'Fix Leaking Sink',
  },
  { 
    id: 2, 
    name: "Green Thumb", 
    lastMsg: "Thanks for accepting!", 
    transactionStatus: 'accepted',
    lastOffer: 30.0,
    lastOfferBy: 'client',
    canViewContact: true,
    clientBudgetMax: 50.0,
    minBenchmarkPrice: 20.0,
    requestTitle: 'Lawn Mowing',
  },
];

const CHAT_MESSAGES = [
  { id: 1, text: "Hi, I saw your request for sink repair...", sender: 'Mario Plumber' },
  { id: 2, text: "What's your best offer?", sender: 'Self' },
];

const OfferForm = ({ minPrice, maxPrice, onSubmit }) => (
  <div style={{ padding: '10px', background: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: '4px' }}>
    <p style={{ fontSize: '0.9rem', color: 'green' }}>
      Benchmark Price: ₱{minPrice.toFixed(2)} - Max Budget: ₱{maxPrice.toFixed(2)}
    </p>
    <input 
      type="number" 
      placeholder={`Offer (min ₱${minPrice.toFixed(2)})`} 
      style={{ width: '100%', padding: '8px', margin: '5px 0' }}
    />
    <button onClick={onSubmit} className="action-btn post" style={{ width: '100%' }}>
      Send New Offer
    </button>
  </div>
);
// --- END MOCK DATA ---

const MessagesPage = ({ chats = MOCK_CHATS, userMode = 'client' }) => {
  const [selectedChatId, setSelectedChatId] = useState(chats[0]?.id || null);
  const [showChat, setShowChat] = useState(false); 
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedChat = chats.find(c => c.id === selectedChatId);
  const isChatUnlocked = selectedChat?.transactionStatus === 'accepted' || selectedChat?.transactionStatus === 'completed';

  // --- Negotiation Panel Component (Offer Gate) ---
  const NegotiationGate = () => {
    if (!selectedChat) return null;

    const { transactionStatus, lastOffer, lastOfferBy, clientBudgetMax, minBenchmarkPrice, requestTitle } = selectedChat;
    const offererRole = lastOfferBy === 'provider' ? 'Provider' : 'Client';
    const isClient = userMode === 'client';

    let statusText;
    let actionButtons;

    if (transactionStatus === 'negotiating') {
      if (isClient && lastOfferBy === 'provider') {
        statusText = `Review offer of ₱${lastOffer.toFixed(2)} for ${requestTitle}.`;
        actionButtons = (
          <>
            <button className="action-btn post" onClick={() => console.log("Accept Deal")} style={{ flexGrow: 1 }}>
              Accept Deal
            </button>
            <button className="action-btn filter" onClick={() => setIsFormOpen(true)} style={{ flexGrow: 1, background: '#ffc107' }}>
              Counter-Offer
            </button>
          </>
        );
      } else if (!isClient && lastOfferBy === 'client') {
        statusText = `Review counter-offer of ₱${lastOffer.toFixed(2)} for ${requestTitle}.`;
        actionButtons = (
          <>
            <button className="action-btn post" onClick={() => console.log("Accept Deal")} style={{ flexGrow: 1 }}>
              Accept Deal
            </button>
            <button className="action-btn filter" onClick={() => setIsFormOpen(true)} style={{ flexGrow: 1, background: '#ffc107' }}>
              Counter-Offer
            </button>
          </>
        );
      } else {
        statusText = `Waiting for ${offererRole} (Last: ₱${lastOffer.toFixed(2)}).`;
        actionButtons = (
          <button className="action-btn filter" disabled style={{ opacity: 0.5, flexGrow: 1 }}>
            Waiting...
          </button>
        );
      }
    } else if (transactionStatus === 'accepted') {
      statusText = `DEAL LOCKED! Chat unlocked. Funds in Escrow: ₱${lastOffer.toFixed(2)}.`;
      actionButtons = (
        <button className="action-btn post" style={{ flexGrow: 1, background: 'var(--success)' }}>
          Go to Chat
        </button>
      );
    } else {
      statusText = `Start negotiation for ${requestTitle}. Min Price: ₱${minBenchmarkPrice.toFixed(2)}.`;
      actionButtons = (
        <button className="action-btn post" onClick={() => setIsFormOpen(true)} style={{ flexGrow: 1 }}>
          Make Initial Offer
        </button>
      );
    }

    return (
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', height: '100%', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--primary-dark)' }}>{requestTitle}</h3>
        <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{statusText}</p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', maxWidth: '350px' }}> 
          {actionButtons}
        </div>
        {isFormOpen && (
          <OfferForm 
            minPrice={minBenchmarkPrice} 
            maxPrice={clientBudgetMax} 
            onSubmit={() => { console.log('Offer submitted'); setIsFormOpen(false); }}
          />
        )}
      </div>
    );
  };

  const layoutState = showChat ? 'show-chat' : 'show-list';

  return (
    <div className="page-container">
      <div className={`messages-layout ${layoutState}`}>
        {/* Chat List */}
        <div className="chat-list">
          <div className="chat-header">
            <input type="text" placeholder="Search chats..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" style={{ width: '100%' }}/>
          </div>
          {chats.map(chat => (
            <div
              key={chat.id}
              className="chat-item"
              style={{ backgroundColor: selectedChatId === chat.id ? '#f0f0f0' : 'var(--white)' }}
              onClick={() => { setSelectedChatId(chat.id); setShowChat(true); }}
            >
              <p style={{ fontWeight: 'bold' }}>{chat.requestTitle || chat.name}</p>
              <small>Status: {chat.transactionStatus}</small>
            </div>
          ))}
        </div>

        {/* Chat Window */}
        <div className="chat-window">
          {selectedChat ? (
            <>
              <div className="chat-window-header">
                <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>
                  &larr;
                </button>
                <span>Negotiation: {selectedChat.requestTitle}</span>
              </div>

              {isChatUnlocked ? (
                // Chat view
                <>
                  <div className="chat-content" style={{ padding: '15px' }}>
                    <div style={{ padding: '10px', marginBottom: '15px', background: '#e0f7fa', borderLeft: '3px solid var(--info)', color: 'var(--text-dark)' }}>
                      DEAL FINALIZED! You can now freely discuss logistics.
                    </div>
                    {CHAT_MESSAGES.map(msg => (
                      <div 
                        key={msg.id} 
                        style={{ 
                          maxWidth: '70%', padding: '10px', borderRadius: '15px', margin: '5px',
                          alignSelf: msg.sender === 'Self' ? 'flex-end' : 'flex-start',
                          background: msg.sender === 'Self' ? 'var(--primary-client)' : '#e0e0e0',
                          color: msg.sender === 'Self' ? 'var(--white)' : 'var(--text-dark)'
                        }}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>
                  <div className="chat-input-area">
                    <input type="text" placeholder="Type a message..." className="chat-input" />
                    <button className="action-btn post" style={{ padding: '0.7rem 1rem' }}>Send</button>
                  </div>
                </>
              ) : (
                // Negotiation gate view
                <NegotiationGate />
              )}
            </>
          ) : (
            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'gray' }}>
              <p>Select an Active Negotiation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
