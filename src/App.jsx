// src/App.jsx

import React, { useState } from 'react';
import './App.css';

// Import your components
import Header from './Global/Header';
import Menu from './Global/Menu';
import MessagesPage from './Global/Messages';
import ClientHome from './Client/ClientHome';
import OffersPage from './Global/Offers';

// Example Provider Home component
const ProviderHome = () => {
  return (
    <div className="page-container">
      <h2>Provider Home</h2>
      <p>Content for providers goes here.</p>
    </div>
  );
};

function App() {
  const [userMode, setUserMode] = useState('client');
  const [currentView, setCurrentView] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMode = () => {
    setUserMode((prev) => (prev === 'client' ? 'provider' : 'client'));
    setCurrentView('home'); // Reset view when switching mode
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return userMode === 'client' ? <ClientHome /> : <ProviderHome />;
      case 'messages':
        return <MessagesPage />;
      case 'offers':
        return <OffersPage mode={userMode} />;
      default:
        return userMode === 'client' ? <ClientHome /> : <ProviderHome />;
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <Header
        userMode={userMode}
        toggleMode={toggleMode}
        setIsMenuOpen={setIsMenuOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* Main content */}
      <main className="main">
        {renderContent()}
      </main>

      {/* Slide-out Menu */}
      <Menu
        isOpen={isMenuOpen}
        close={() => setIsMenuOpen(false)}
        logout={() => alert("Logged out")}
      />
    </div>
  );
}

export default App;
