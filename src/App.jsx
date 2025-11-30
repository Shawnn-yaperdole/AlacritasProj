// src/App.jsx
import React, { useState } from 'react';
import './App.css';

import Header from './Global/Header';
import Menu from './Global/Menu';
import MessagesPage from './Global/Messages';
import ClientHome from './Client/ClientHome';
import Offers from './Global/Offers';
import Profile from './Global/Profile';
import ProviderHome from './Provider/ProviderHome';
import RequestDetails from './Global/RequestDetails';
import OfferDetails from './Global/OfferDetails'; // <-- new

import {
  MOCK_CLIENT_REQUESTS,
  MOCK_PROVIDER,
  MOCK_CLIENT_PENDING,
  MOCK_CLIENT_ONGOING,
  MOCK_CLIENT_HISTORY,
  MOCK_PROVIDER_PENDING,
  MOCK_PROVIDER_ONGOING,
  MOCK_PROVIDER_HISTORY
} from './Sample/MockData';

function App() {
  const [userMode, setUserMode] = useState('client'); // 'client' or 'provider'
  const [currentView, setCurrentView] = useState('home'); // 'home', 'messages', etc.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Track selected request & offer
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  const toggleMode = () => {
    setUserMode(prev => (prev === 'client' ? 'provider' : 'client'));
    setCurrentView('home');
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return userMode === 'client' ? (
          <ClientHome
            onViewDetails={(id) => {
              setSelectedRequestId(id);
              setCurrentView('request-details');
            }}
          />
        ) : (
          <ProviderHome
            onViewDetails={(id) => {
              setSelectedRequestId(id);
              setCurrentView('request-details');
            }}
          />
        );

      case 'messages':
        return <MessagesPage />;

      case 'offers':
        return (
          <Offers
            role={userMode}
            onViewOfferDetails={(offerId) => {
              setSelectedOfferId(offerId);
              setCurrentView('offer-details');
            }}
          />
        );

      case 'profile':
        return <Profile role={userMode} />;

      case 'request-details': {
        // Find the request data
        const requestData =
          userMode === 'client'
            ? MOCK_CLIENT_REQUESTS.find(r => r.id === selectedRequestId)
            : MOCK_CLIENT_REQUESTS.find(r => r.id === selectedRequestId); // provider sees same data

        return (
          <RequestDetails
            requestData={requestData}
            userRole={userMode}
            onBackToClientHome={(updatedRequest) => {
              if (userMode === 'client' && updatedRequest) {
                const index = MOCK_CLIENT_REQUESTS.findIndex(r => r.id === updatedRequest.id);
                if (index !== -1) {
                  MOCK_CLIENT_REQUESTS[index] = updatedRequest;
                }
              }
              setCurrentView('home');
            }}
          />
        );
      }

      case 'offer-details': {
        // Find selected offer and its related request
        const offerData = [
          ...MOCK_CLIENT_PENDING,
          ...MOCK_CLIENT_ONGOING,
          ...MOCK_CLIENT_HISTORY,
          ...MOCK_PROVIDER_PENDING,
          ...MOCK_PROVIDER_ONGOING,
          ...MOCK_PROVIDER_HISTORY
        ].find(o => o.id === selectedOfferId);

        const relatedRequest = MOCK_CLIENT_REQUESTS.find(r => r.id === offerData?.requestId);

        if (!offerData) return <div>Offer not found</div>;

        return (
          <OfferDetails
            offerData={offerData}
            requestData={relatedRequest}
            userRole={userMode}
            onBackToOffers={() => setCurrentView('offers')}
          />
        );
      }

      default:
        return userMode === 'client' ? <ClientHome /> : <ProviderHome />;
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

      <Menu
        isOpen={isMenuOpen}
        close={() => setIsMenuOpen(false)}
        logout={() => alert('Logged out')}
      />
    </div>
  );
}

export default App;
