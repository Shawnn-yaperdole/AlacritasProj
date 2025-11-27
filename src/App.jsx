import React, { useState } from 'react';
import './App.css';

// Sample Datas
const MOCK_CLIENT_REQUESTS = [
  { id: 1, title: "Fix Leaking Sink", type: "Plumbing", date: "2023-10-25" },
  { id: 2, title: "Lawn Mowing", type: "Gardening", date: "2023-10-26" },
  { id: 3, title: "Install Ceiling Fan", type: "Electrical", date: "2023-10-27" },
  { id: 4, title: "Paint Fence", type: "Painting", date: "2023-10-28" },
  { id: 5, title: "Deep Clean House", type: "Cleaning", date: "2023-10-29" },
];

const MOCK_PROVIDER_REQUESTS = [
  { id: 1, title: "Fix Leaking Sink", type: "Plumbing", client: "Alice", loc: "Downtown" },
  { id: 4, title: "Paint Living Room", type: "Painting", client: "Bob", loc: "Uptown" },
  { id: 5, title: "Move Furniture", type: "Moving", client: "Charlie", loc: "Suburbs" },
];

const MOCK_OFFERS_RECEIVED = [
  { id: 101, title: "Offer for Sink", provider: "Mario Plumber", amount: "$50", status: "pending" },
  { id: 102, title: "Offer for Lawn", provider: "Green Thumb", amount: "$30", status: "accepted" },
];

const MOCK_OFFERS_SENT = [
  { id: 201, title: "Sink Repair Bid", client: "Alice", amount: "$50", status: "pending" },
  { id: 202, title: "Roof Repair Bid", client: "Dave", amount: "$500", status: "denied" },
];

const CHATS = [
  { id: 1, name: "Mario Plumber", lastMsg: "I can be there at 5pm." },
  { id: 2, name: "Green Thumb", lastMsg: "Thanks for accepting!" },
  { id: 3, name: "Electric Co.", lastMsg: "Do you have the parts?" },
];

// ----------------------------------------------------------------------
// --- COMPONENTS ---
// ----------------------------------------------------------------------

const Menu = ({ isOpen, close, logout }) => {
  if (!isOpen) return null;
  return (
    <div className="menu-overlay" onClick={close}>
      <div className="side-menu" onClick={(e) => e.stopPropagation()}>
        <div className="close-menu" onClick={close}>&times;</div>
        <h2>Menu</h2>
        <div className="menu-item">Account Settings</div>
        <div className="menu-item">Preferences</div>
        <div className="menu-item">Get Help</div>
        <div className="menu-item" onClick={logout} style={{ color: 'red' }}>Log Out</div>
      </div>
    </div>
  );
};

const ClientHome = () => {
  const [filterText, setFilterText] = useState("");
  const filtered = MOCK_CLIENT_REQUESTS.filter(req => 
    req.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="page-container">
      <h2>My Current Requests</h2>
      <div className="controls">
        <input 
          className="search-input" 
          placeholder="Search my requests..." 
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button className="action-btn filter">Filter Services</button>
        <button className="action-btn post">+ Post Request</button>
      </div>

      <div className="card-list">
        {filtered.map(req => (
          <div key={req.id} className="card">
            <h3>{req.title}</h3>
            <span className="tag">{req.type}</span>
            <p>Posted: {req.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProviderHome = () => {
  const [filterText, setFilterText] = useState("");
  const filtered = MOCK_PROVIDER_REQUESTS.filter(req => 
    req.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="page-container">
      <h2>Requests in your Community</h2>
      <div className="controls">
        <input 
          className="search-input" 
          placeholder="Search jobs in community..." 
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button className="action-btn filter">Filter Skills</button>
      </div>

      <div className="card-list">
        {filtered.map(req => (
          <div key={req.id} className="card">
            <h3>{req.title}</h3>
            <span className="tag">{req.type}</span>
            <p>Client: {req.client}</p>
            <p>Location: {req.loc}</p>
            <button style={{marginTop:'1rem', padding:'10px', width:'100%', cursor:'pointer', background:'#f0f0f0', border:'none', borderRadius:'4px'}}>Send Offer</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const MessagesPage = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [search, setSearch] = useState("");
  const layoutClass = activeChat ? 'show-chat' : 'show-list';

  return (
    <div className="page-container">
      <div className={`messages-layout ${layoutClass}`}>
        

        <div className="chat-list">
          <div className="chat-header">
            <input 
              className="search-input" 
              placeholder="Search chats..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{width: '100%'}}
            />
          </div>
          <div style={{flexGrow: 1, overflowY: 'auto'}}>
            {CHATS.map(chat => (
              <div 
                key={chat.id} 
                className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
                onClick={() => setActiveChat(chat.id)}
              >
                <strong>{chat.name}</strong>
                <p style={{fontSize:'0.85rem', color:'#666', marginTop:'4px'}}>{chat.lastMsg}</p>
              </div>
            ))}
          </div>
        </div>


        <div className="chat-window">
          {activeChat ? (
            <>
              <div className="chat-window-header">
                <button 
                  onClick={() => setActiveChat(null)}
                  style={{marginRight:'10px', background:'none', border:'none', fontSize:'1.2rem', cursor:'pointer'}}
                >
                  &larr;
                </button>
                <span>{CHATS.find(c => c.id === activeChat).name}</span>
                <span></span> 
              </div>
              
              <div className="chat-content">
                <p style={{alignSelf:'center', color:'#aaa'}}>Start of conversation...</p>
                <div style={{background:'#eee', padding:'10px', borderRadius:'10px', alignSelf:'flex-start', maxWidth:'70%', marginTop: '10px'}}>
                  {CHATS.find(c => c.id === activeChat).lastMsg}
                </div>
              </div>
              
              <div className="chat-input-area">
                <input className="chat-input" placeholder="Type a message..." />
                <button className="action-btn post" style={{padding: '10px 15px'}}>Send</button>
              </div>
            </>
          ) : (
            <div className="chat-content" style={{alignItems:'center', justifyContent:'center', color:'#aaa'}}>
              <p>Select a Conversation</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OffersPage = ({ mode }) => {
  const data = mode === 'client' ? MOCK_OFFERS_RECEIVED : MOCK_OFFERS_SENT;
  const [filterText, setFilterText] = useState("");
  const filtered = data.filter(item => item.title.toLowerCase().includes(filterText.toLowerCase()));

  return (
    <div className="page-container">
      <h2>{mode === 'client' ? "Offers Received 📬" : "Sent Offers 📤"}</h2>
      <div className="controls">
        <input 
          className="search-input" 
          placeholder="Search offers..." 
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button className="action-btn filter">Filter Status</button>
      </div>

      <div className="card-list">
        {filtered.map(offer => (
          <div key={offer.id} className="card">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h3>{offer.title}</h3>
              <span className={`status ${offer.status}`} style={{margin:0}}>{offer.status.toUpperCase()}</span>
            </div>
            <hr style={{margin:'10px 0', border:'none', borderTop:'1px solid #eee'}}/>
            <p>{mode === 'client' ? `From: ${offer.provider}` : `To: ${offer.client}`}</p>
            <p style={{fontSize:'1.2rem', fontWeight:'bold', marginTop:'5px'}}>{offer.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// --- MAIN APP COMPONENT ---
// ----------------------------------------------------------------------

function App() {
  const [userMode, setUserMode] = useState('client'); 
  const [currentView, setCurrentView] = useState('home'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMode = () => {
    setUserMode(prev => prev === 'client' ? 'provider' : 'client');
    setCurrentView('home'); 
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home': return userMode === 'client' ? <ClientHome /> : <ProviderHome />;
      case 'messages': return <MessagesPage />;
      case 'offers': return <OffersPage mode={userMode} />;
      default: return <ClientHome />;
    }
  };

  const themeColor = userMode === 'client' ? 'var(--primary-client)' : 'var(--primary-provider)';

  return (
    <div className="App">
      {/* HEADER */}
      <header className="header" style={{ borderBottom: `4px solid ${themeColor}`}}>
        <div className="logo" style={{ color: themeColor }}>
          Alacritas <small style={{color:'#333'}}>({userMode === 'client' ? 'Client' : 'Provider'})</small>
        </div>

        <nav className="nav-middle">
          <button className={`nav-btn ${currentView === 'home' ? 'active' : ''}`} onClick={() => setCurrentView('home')}>Home</button>
          <button className={`nav-btn ${currentView === 'messages' ? 'active' : ''}`} onClick={() => setCurrentView('messages')}>Messages</button>
          <button className={`nav-btn ${currentView === 'offers' ? 'active' : ''}`} onClick={() => setCurrentView('offers')}>Offers</button>
        </nav>

        <div className="nav-right">
          <button className="switch-btn" onClick={toggleMode}>
            Switch to **{userMode === 'client' ? 'Provider' : 'Client'}**
          </button>
          <button className="menu-btn" onClick={() => setIsMenuOpen(true)}>☰</button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main>
        {renderContent()}
      </main>

      {/* MENU SLIDE-OUT */}
      <Menu isOpen={isMenuOpen} close={() => setIsMenuOpen(false)} logout={() => alert("Logged out")} />
    </div>
  );
}

export default App;