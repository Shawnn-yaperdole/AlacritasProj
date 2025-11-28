// src/App.jsx
import React, { useState } from 'react';
import './App.css';
import Header from './Global/Header';
import Menu from './Global/Menu';
import MessagesPage from './Global/Messages';
import ClientHome from './Client/ClientHome';
import OffersPage from './Client/ClientOffers';

const ProviderHome = () => (
  <div className="page-container bg-gray-100 p-6 rounded shadow-md">
    <h2 className="text-3xl font-bold text-blue-500 mb-2">Provider Home</h2>
    <p className="text-gray-700">Content for providers goes here.</p>
  </div>
);

function App() {
  const [userMode, setUserMode] = useState('client');
  const [currentView, setCurrentView] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMode = () => {
    setUserMode((prev) => (prev === 'client' ? 'provider' : 'client'));
    setCurrentView('home');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home': return userMode === 'client' ? <ClientHome /> : <ProviderHome />;
      case 'messages': return <MessagesPage />; // Full width page
      case 'offers': return <OffersPage mode={userMode} />;
      default: return userMode === 'client' ? <ClientHome /> : <ProviderHome />;
    }
  };

  return (
    <div className="App flex flex-col w-full min-h-screen bg-gray-50">
      <Header
        userMode={userMode}
        toggleMode={toggleMode}
        setIsMenuOpen={setIsMenuOpen}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      <main className="main w-full flex-1">
        {renderContent()}
      </main>
      <Menu isOpen={isMenuOpen} close={() => setIsMenuOpen(false)} logout={() => alert('Logged out')} />
    </div>
  );
}

export default App;








