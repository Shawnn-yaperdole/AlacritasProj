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
import OfferDetails from './Global/OfferDetails'; 
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
  const [userMode, setUserMode] = useState('client'); 
  const [currentView, setCurrentView] = useState('home'); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Track selected request & offer
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  // NEW: track if request is new or existing
  const [isNewRequest, setIsNewRequest] = useState(false);

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
              setIsNewRequest(false);  // existing request
              setSelectedRequestId(id);
              setCurrentView('request-details');
            }}
            onCreateRequest={() => {
              setIsNewRequest(true);

              // Generate a temporary ID
              const newId = Math.max(0, ...MOCK_CLIENT_REQUESTS.map(r => r.id)) + 1;
              setSelectedRequestId(newId);

              // Open request details
              setCurrentView('request-details');
            }}
          />
        ) : (
          <ProviderHome
            onViewDetails={(id) => {
              setIsNewRequest(false);
              setSelectedRequestId(id);
              setCurrentView('request-details');
            }}
          />
        );

      case 'messages':
        return <MessagesPage userRole={userMode} />;

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
        // Find existing request if any
        const existingRequest = MOCK_CLIENT_REQUESTS.find(
          (r) => r.id === selectedRequestId
        );

        // If it's new, create a temporary request object
        const requestData = existingRequest || {
          id: selectedRequestId,
          title: '',
          type: '',
          date: new Date().toISOString().split('T')[0],
          location: '',
          status: 'draft',
          description: '',
          thumbnail: '',
          images: [],
        };

        return (
          <RequestDetails
            isNewRequest={isNewRequest} // <-- important
            requestData={requestData}
            userRole={userMode}
            onBackToClientHome={(updatedRequest) => {
              if (userMode === 'client') {
                if (updatedRequest) {
                  const index = MOCK_CLIENT_REQUESTS.findIndex(
                    (r) => r.id === updatedRequest.id
                  );

                  if (index !== -1) {
                    // Update existing request
                    MOCK_CLIENT_REQUESTS[index] = updatedRequest;
                  } else if (isNewRequest) {
                    // Only add new request when saved
                    MOCK_CLIENT_REQUESTS.push(updatedRequest);
                  }
                }
                // If updatedRequest is null (Cancel), do nothing
              }

              // Go back to client home
              setCurrentView('home');
            }}
          />
        );
      }

      case 'offer-details': {
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
        return userMode === 'client' ? (
          <ClientHome
            onViewDetails={(id) => {
              setIsNewRequest(false);
              setSelectedRequestId(id);
              setCurrentView('request-details');
            }}
          />
        ) : (
          <ProviderHome
            onViewDetails={(id) => {
              setIsNewRequest(false);
              setSelectedRequestId(id);
              setCurrentView('request-details');
            }}
          />
        );
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
