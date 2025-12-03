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
import { saveRequestRealtime } from './lib/firebase';

function App() {
  const [userMode, setUserMode] = useState('client');
  const [currentView, setCurrentView] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Track selected request & offer
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  // Track new/existing requests
  const [isNewRequest, setIsNewRequest] = useState(false);
  const [tempRequestData, setTempRequestData] = useState(null);

  // Offers state
  const [offers, setOffers] = useState([
    ...MOCK_CLIENT_PENDING,
    ...MOCK_CLIENT_ONGOING,
    ...MOCK_CLIENT_HISTORY,
    ...MOCK_PROVIDER_PENDING,
    ...MOCK_PROVIDER_ONGOING,
    ...MOCK_PROVIDER_HISTORY,
  ]);
  const [newOffer, setNewOffer] = useState(null);

  const toggleMode = () => {
    setUserMode(prev => (prev === 'client' ? 'provider' : 'client'));
    setCurrentView('home');
  };

  // ----- RENDER LOGIC -----
  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return userMode === 'client' ? (
          <ClientHome
            onViewDetails={(id) => {
              setIsNewRequest(false);
              setSelectedRequestId(id);
              setCurrentView('request-details');
            }}
            onCreateRequest={() => {
              setIsNewRequest(true);
              const newId = Math.max(0, ...MOCK_CLIENT_REQUESTS.map(r => r.id)) + 1;
              const newRequest = {
                id: newId,
                title: '',
                type: '',
                date: new Date().toISOString().split('T')[0],
                location: '',
                status: 'draft',
                description: '',
                thumbnail: '',
                images: [],
              };
              setSelectedRequestId(newId);
              setCurrentView('request-details');
              setTempRequestData(newRequest);
            }}
            navigateToProfile={() => setCurrentView('profile')}
          />
        ) : (
          <ProviderHome
            onViewDetails={(id) => {
              setIsNewRequest(false);
              setSelectedRequestId(id);
              setCurrentView('request-details');
            }}
            onSendOffer={(request) => {
              setSelectedRequestId(request.id);
              const maxOfferId = offers.length > 0 ? Math.max(...offers.map(o => o.id)) : 0;
              setSelectedOfferId(maxOfferId + 1);
              setCurrentView('offer-details');
            }}
            navigateToProfile={() => setCurrentView('profile')}
          />
        );

      case 'messages':
        return (
          <MessagesPage
            userRole={userMode}
            onViewRequestDetails={(requestId) => {
              setSelectedRequestId(requestId);
              setCurrentView('request-details');
            }}
            onViewOfferDetails={(offerId) => {
              setSelectedOfferId(offerId);
              setCurrentView('offer-details');
            }}
          />
        );

      case 'offers':
        return (
          <Offers
            role={userMode}
            offers={offers} 
            newOffer={newOffer} 
            onViewOfferDetails={(offerId) => {
              setSelectedOfferId(offerId);
              setCurrentView('offer-details');
            }}
          />
        );

      case 'profile':
        return <Profile role={userMode} />;

      case 'request-details': {
        const existingRequest = MOCK_CLIENT_REQUESTS.find(
          (r) => r.id === selectedRequestId
        );
        const requestData = isNewRequest ? tempRequestData : existingRequest;

        return (
          <RequestDetails
            isNewRequest={isNewRequest}
            requestData={requestData}
            tempRequestData={tempRequestData}
            setTempRequestData={setTempRequestData}
            userRole={userMode}
            onBackToClientHome={(updatedRequest) => {
              if (userMode === 'client' && updatedRequest) {
                const index = MOCK_CLIENT_REQUESTS.findIndex(r => r.id === updatedRequest.id);
                if (index !== -1) {
                  MOCK_CLIENT_REQUESTS[index] = updatedRequest;
                } else if (isNewRequest) {
                  MOCK_CLIENT_REQUESTS.push(updatedRequest);
                }
                saveRequestRealtime(updatedRequest.id, updatedRequest);
              }
              setCurrentView('home');
            }}
            onGoToOffer={(request) => {
              const existingOffer = offers.find(o => o.requestId === request.id);
              if (existingOffer) {
                setSelectedOfferId(existingOffer.id);
              } else {
                const maxOfferId = offers.length > 0 ? Math.max(...offers.map(o => o.id)) : 0;
                setSelectedOfferId(maxOfferId + 1);
              }
              setCurrentView('offer-details');
            }}
          />
        );
      }

      case 'offer-details': {
        const existingOffer = offers.find(o => o.id === selectedOfferId);
        const isNewOffer = !existingOffer && userMode === 'provider';
        const offerData = existingOffer || (isNewOffer ? {
          id: selectedOfferId,
          description: '',
          amount: '',
          provider: MOCK_PROVIDER,
          requestId: selectedRequestId
        } : null);

        const relatedRequest = MOCK_CLIENT_REQUESTS.find(r => r.id === selectedRequestId);
        if (!relatedRequest) return <div>Related request not found</div>;
        if (!offerData) return <div>Offer not found</div>;

        return (
          <OfferDetails
            offerData={offerData}
            requestData={relatedRequest}
            userRole={userMode}
            isNewOffer={isNewOffer}
            onBackToClientHome={() => setCurrentView(userMode === 'client' ? 'offers' : 'home')}
            onBackToProviderHome={(newOfferPayload) => {
              if (newOfferPayload) {
                setNewOffer(newOfferPayload);
                setOffers(prev => [...prev, newOfferPayload]);
              }
              setCurrentView('offers');
            }}
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
