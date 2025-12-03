// src/App.jsx
import React, { useState, useEffect } from 'react';
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
import { MOCK_CLIENT_REQUESTS, MOCK_PROVIDER } from './Sample/MockData';
import { saveRequestRealtime, saveOfferRealtime, realtimeDb } from './lib/firebase';
import { ref, onValue } from 'firebase/database';

function App() {
  const [userMode, setUserMode] = useState('client');
  const [currentView, setCurrentView] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [selectedOfferId, setSelectedOfferId] = useState(null);

  const [isNewRequest, setIsNewRequest] = useState(false);
  const [tempRequestData, setTempRequestData] = useState(null);

  const [requests, setRequests] = useState([]);
  const [offers, setOffers] = useState([]);

  // Load requests from Firebase Realtime DB
  useEffect(() => {
    if (!realtimeDb) return;
    const requestsRef = ref(realtimeDb, 'requests');
    const unsubscribe = onValue(requestsRef, snapshot => {
      const val = snapshot.val() || {};
      const list = Object.keys(val).map(k => ({ id: Number(k), ...val[k] }));
      setRequests(list);
    });
    return () => unsubscribe();
  }, []);

  // Load offers from Firebase Realtime DB
  useEffect(() => {
    if (!realtimeDb) return;
    const offersRef = ref(realtimeDb, 'offers');
    const unsubscribe = onValue(offersRef, snapshot => {
      const val = snapshot.val() || {};
      const list = Object.keys(val).map(k => ({ id: Number(k), ...val[k] }));
      setOffers(list);
    });
    return () => unsubscribe();
  }, []);

  const toggleMode = () => {
    setUserMode(prev => (prev === 'client' ? 'provider' : 'client'));
    setCurrentView('home');
  };

  const handleOfferUpdate = (updatedOffer) => {
    setOffers(prev => {
      const exists = prev.find(o => o.id === updatedOffer.id);
      if (exists) {
        return prev.map(o => o.id === updatedOffer.id ? updatedOffer : o);
      }
      return [...prev, updatedOffer];
    });
  };

  const handleRequestUpdate = (updatedRequest) => {
    setRequests(prev => {
      const exists = prev.find(r => r.id === updatedRequest.id);
      if (exists) {
        return prev.map(r => r.id === updatedRequest.id ? updatedRequest : r);
      }
      return [...prev, updatedRequest];
    });
  };

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return userMode === 'client' ? (
          <ClientHome
            requests={requests}
            onViewDetails={(id) => {
              setIsNewRequest(false);
              setSelectedRequestId(id);
              setCurrentView('request-details');
            }}
            onCreateRequest={() => {
              setIsNewRequest(true);
              const newId = Math.max(0, ...requests.map(r => r.id)) + 1;
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
              setTempRequestData(newRequest);
              setCurrentView('request-details');
            }}
            navigateToProfile={() => setCurrentView('profile')}
          />
        ) : (
          <ProviderHome
            requests={requests}
            onViewDetails={(id) => {
              setIsNewRequest(false);
              setSelectedRequestId(id);
              setCurrentView('request-details');
            }}
            onSendOffer={(request) => {
              setSelectedRequestId(request.id);
              const offerIds = offers.filter(o => o.id != null).map(o => o.id);
              const maxOfferId = offerIds.length > 0 ? Math.max(...offerIds) : 0;
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
            onOfferUpdate={handleOfferUpdate}
            onViewOfferDetails={(offerId) => {
              setSelectedOfferId(offerId);
              setCurrentView('offer-details');
            }}
          />
        );

      case 'profile':
        return <Profile role={userMode} setCurrentView={setCurrentView} />;

      case 'request-details': {
        const existingRequest = requests.find(r => r.id === selectedRequestId);
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
                handleRequestUpdate(updatedRequest);
                saveRequestRealtime(updatedRequest.id, updatedRequest);
              }
              setCurrentView('home');
            }}
            onGoToOffer={(request) => {
              const existingOffer = offers.find(o => o.requestId === request.id);
              if (existingOffer) {
                setSelectedOfferId(existingOffer.id);
              } else {
                const offerIds = offers.filter(o => o.id != null).map(o => o.id);
                const maxOfferId = offerIds.length > 0 ? Math.max(...offerIds) : 0;
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
          title: '',
          description: '',
          amount: '',
          status: 'pending',
          provider: MOCK_PROVIDER,
          requestId: selectedRequestId
        } : null);

        const relatedRequest = requests.find(r => r.id === selectedRequestId);
        
        if (!offerData) {
          return <div className="p-4">Offer not found</div>;
        }
        
        if (!relatedRequest) {
          return <div className="p-4">Related request not found</div>;
        }

        return (
          <OfferDetails
            offerData={offerData}
            requestData={relatedRequest}
            userRole={userMode}
            isNewOffer={isNewOffer}
            onOfferUpdate={handleOfferUpdate}
            onBackToClientHome={() => setCurrentView(userMode === 'client' ? 'offers' : 'home')}
            onBackToProviderHome={() => setCurrentView('offers')}
          />
        );
      }

      default:
        return userMode === 'client' ? (
          <ClientHome
            requests={requests}
            onViewDetails={(id) => {
              setIsNewRequest(false);
              setSelectedRequestId(id);
              setCurrentView('request-details');
            }}
            navigateToProfile={() => setCurrentView('profile')}
          />
        ) : (
          <ProviderHome
            requests={requests}
            onViewDetails={(id) => {
              setIsNewRequest(false);
              setSelectedRequestId(id);
              setCurrentView('request-details');
            }}
            navigateToProfile={() => setCurrentView('profile')}
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