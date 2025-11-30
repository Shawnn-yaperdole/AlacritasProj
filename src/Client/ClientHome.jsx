// src/Client/ClientHome.jsx
import React, { useState } from "react";
import { MOCK_CLIENT_REQUESTS } from "../Sample/MockData";

// Reusable SearchBar component
const SearchBar = ({ value, onChange }) => (
  <input
    className="search-input"
    placeholder="Search my requests..."
    value={value}
    onChange={onChange}
  />
);

// Reusable RequestCard component
const RequestCard = ({ request }) => (
  <div className="card hover:shadow-lg transition-shadow duration-200 flex flex-col">
    <img
      src={request.thumbnail}
      alt={request.title}
      className="w-full h-36 object-cover rounded-lg mb-3"
    />
    <div className="flex-1 flex flex-col">
      <h3 className="font-semibold text-lg mb-1 line-clamp-1" title={request.title}>
        {request.title}
      </h3>
      <span className="tag mb-1 line-clamp-1">{request.type}</span>
      <p className="text-gray-700 line-clamp-1" title={request.location}>
        {request.location}
      </p>
      <p className="text-gray-500 text-sm mb-1">{`Posted: ${request.date}`}</p>
      <button className="action-btn client-view-btn mt-auto w-full py-2 text-sm">
        View Full Details
      </button>
    </div>
  </div>
);

const ClientHome = () => {
  const [filterText, setFilterText] = useState("");

  const filteredRequests = MOCK_CLIENT_REQUESTS.filter((req) =>
    req.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="page-container">
      <h2 className="text-2xl font-bold mb-6 text-client-header">My Current Requests</h2>

      <div className="controls mb-6">
        <SearchBar value={filterText} onChange={(e) => setFilterText(e.target.value)} />
        <button className="action-btn client-filter-btn">Filter Services</button>
        <button className="action-btn client-post-btn">+ Post Request</button>
      </div>

      <div
        className="card-list grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
      >
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => <RequestCard key={req.id} request={req} />)
        ) : (
          <p className="text-gray-400 col-span-full">No requests found.</p>
        )}
      </div>
    </div>
  );
};

export default ClientHome;
