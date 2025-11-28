// src/Client/ClientHome.jsx

import React, { useState } from 'react';

const MOCK_CLIENT_REQUESTS = [
  { id: 1, title: "Fix Leaking Sink", type: "Plumbing", date: "2023-10-25" },
  { id: 2, title: "Lawn Mowing", type: "Gardening", date: "2023-10-26" },
];

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
        {filtered.map((req) => (
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

export default ClientHome;
