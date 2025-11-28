// src/Global/Offers.jsx

import React, { useState } from 'react';

// Sample data (Assuming imported or defined here)
const MOCK_OFFERS_RECEIVED = [
  { id: 101, title: "Offer for Sink", provider: "Mario Plumber", amount: "$50", status: "pending" },
];

const MOCK_OFFERS_SENT = [
  { id: 201, title: "Sink Repair Bid", client: "Alice", amount: "$50", status: "denied" },
];

const OffersPage = ({ mode }) => {
  const data = mode === "client" ? MOCK_OFFERS_RECEIVED : MOCK_OFFERS_SENT;

  const [filterText, setFilterText] = useState("");

  const filtered = data.filter(item =>
    item.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="page-container">
      <h2>{mode === "client" ? "Offers Received 📬" : "Sent Offers 📤"}</h2>

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
        {filtered.map((offer) => (
          <div key={offer.id} className="card">
            <div className="card-header">
              <h3 className="card-title">{offer.title}</h3>

              {/* Status badge */}
              <span className={`status ${offer.status}`}>
                {offer.status.toUpperCase()}
              </span>
            </div>

            <hr className="divider" />

            <p>{mode === "client" ? `From: ${offer.provider}` : `To: ${offer.client}`}</p>
            <p className="amount">{offer.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersPage;
