// src/Client/ClientHome.jsx
import React, { useState } from "react";
import { MOCK_CLIENT_REQUESTS } from "../Sample/MockData";

// Reusable SearchBar component
const SearchBar = ({ value, onChange }) => (
  <input
    className="search-input px-3 py-2 border border-gray-300 rounded-md flex-grow min-w-0"
    placeholder="Search my requests..."
    value={value}
    onChange={onChange}
  />
);

// Reusable RequestCard component
const RequestCard = ({ request, onViewDetails }) => (
  <div className="card hover:shadow-lg transition-shadow duration-200 flex flex-col">
    <img
      src={request.thumbnail}
      alt={request.title}
      className="w-full h-36 object-cover rounded-lg mb-3"
    />
    <div className="flex-1 flex flex-col space-y-1">
      <h3
        className="font-semibold text-lg line-clamp-1"
        title={request.title}
      >
        {request.title}
      </h3>
      <span className="tag line-clamp-1">{request.type}</span>
      <p className="text-gray-700 line-clamp-1" title={request.location}>
        {request.location}
      </p>
      <p className="text-gray-500 text-sm">{`Posted: ${request.date}`}</p>
      <button
        className="action-btn client-view-btn mt-auto w-auto py-2 px-4 text-sm"
        onClick={() => onViewDetails(request.id)}
      >
        View Full Details
      </button>
    </div>
  </div>
);

const ClientHome = ({ onViewDetails }) => {
  const [filterText, setFilterText] = useState("");

  const filteredRequests = MOCK_CLIENT_REQUESTS.filter((req) =>
    req.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="page-container flex flex-col space-y-6">
      {/* Page Heading */}
      <h2 className="text-2xl font-bold text-client-header">
        My Current Requests
      </h2>

      {/* Controls */}
      <div className="controls flex flex-wrap gap-4 items-center">
        <SearchBar value={filterText} onChange={(e) => setFilterText(e.target.value)} />
        <button className="action-btn client-filter-btn flex-shrink-0">Filter Requests By:</button>
        <button className="action-btn client-post-btn flex-shrink-0">+ Post Request</button>
      </div>

      {/* Card List */}
      <div
        className="card-list grid gap-6"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
      >
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <RequestCard key={req.id} request={req} onViewDetails={onViewDetails} />
          ))
        ) : (
          <p className="text-gray-400 col-span-full">No requests found.</p>
        )}
      </div>
    </div>
  );
};

export default ClientHome;
