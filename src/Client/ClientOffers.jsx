// src/Global/Offers.jsx
import React, { useState } from 'react';

const MOCK_OFFERS_RECEIVED = [
  { id: 101, title: "Offer for Sink", provider: "Mario Plumber", amount: "$50", status: "pending" },
];

const MOCK_OFFERS_SENT = [
  { id: 201, title: "Sink Repair Bid", client: "Alice", amount: "$50", status: "denied" },
];

const OffersPage = ({ mode }) => {
  const data = mode === 'client' ? MOCK_OFFERS_RECEIVED : MOCK_OFFERS_SENT;
  const [filterText, setFilterText] = useState('');

  const filtered = data.filter((item) =>
    item.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const statusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-orange-500';
      case 'accepted': return 'text-green-500';
      case 'denied': return 'text-red-500';
      default: return '';
    }
  };

  return (
    <div className="page-container flex flex-col">
      <h2 className="text-2xl font-bold mb-4">
        {mode === 'client' ? 'Offers Received 📬' : 'Sent Offers 📤'}
      </h2>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search offers..."
          className="flex-grow p-2 border rounded"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button className="py-2 px-4 bg-gray-600 text-white rounded">Filter Status</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((offer) => (
          <div key={offer.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">{offer.title}</h3>
              <span className={`font-bold ${statusColor(offer.status)}`}>{offer.status.toUpperCase()}</span>
            </div>
            <p>{mode === 'client' ? `From: ${offer.provider}` : `To: ${offer.client}`}</p>
            <p className="font-semibold mt-2">{offer.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;
