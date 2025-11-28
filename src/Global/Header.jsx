// src/Global/Header.jsx

import React from 'react';

const Header = ({ userMode, toggleMode, setIsMenuOpen, currentView, setCurrentView }) => {
    
    // Use CSS variables for dynamic color
    const themeColor = userMode === 'client' ? 'var(--primary-client)' : 'var(--primary-provider)';

    return (
        <header className="header" style={{ borderBottom: `4px solid ${themeColor}`}}>
            <div className="logo" style={{ color: themeColor }}>
                Alacritas <small style={{color:'var(--text-dark)'}}>({userMode === 'client' ? 'Client' : 'Provider'})</small>
            </div>

            <nav className="nav-middle">
                {['home', 'messages', 'offers'].map((view) => (
                    <button 
                        key={view}
                        className={`nav-btn ${currentView === view ? 'active' : ''}`} 
                        onClick={() => setCurrentView(view)}
                    >
                        {view.charAt(0).toUpperCase() + view.slice(1)}
                    </button>
                ))}
            </nav>

            <div className="nav-right">
                <button className="switch-btn" onClick={toggleMode}>
                    Switch to **{userMode === 'client' ? 'Provider' : 'Client'}**
                </button>
                <button className="menu-btn" onClick={() => setIsMenuOpen(true)}>☰</button>
            </div>
        </header>
    );
}

export default Header;