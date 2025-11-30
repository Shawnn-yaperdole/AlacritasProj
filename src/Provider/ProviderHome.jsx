// src/Provider/ProviderHome.jsx
import React, { useState, useRef, useEffect } from "react";
import { MOCK_CLIENT_REQUESTS, MOCK_PROVIDER } from "../Sample/MockData";

// Reusable SearchBar component
const SearchBar = ({ value, onChange }) => (
  <input
    className="search-input px-3 py-2 border rounded-md flex-grow min-w-0"
    placeholder="Search client requests or communities..."
    value={value}
    onChange={onChange}
  />
);

// RequestCard component
const RequestCard = ({ request, onViewDetails, onSendOffer }) => (
  <div className="card hover:shadow-lg transition-shadow duration-200 flex flex-col">
    <img
      src={request.thumbnail}
      alt={request.title}
      className="w-full h-36 object-cover rounded-lg mb-3"
    />
    <div className="flex-1 flex flex-col space-y-1">
      <h3 className="font-semibold text-lg line-clamp-1" title={request.title}>
        {request.title}
      </h3>
      <span className="tag line-clamp-1">{request.type}</span>
      <p className="text-gray-700 line-clamp-1" title={request.location}>
        {request.location}
      </p>
      <p className="text-gray-500 text-sm">{`Posted: ${request.date}`}</p>

      <button
        className="action-btn client-view-btn mt-auto w-full py-2 text-sm"
        onClick={() => onViewDetails(request.id)}
      >
        View Full Details
      </button>

      <button
        className="action-btn client-view-btn w-full py-2 text-sm"
        onClick={() => onSendOffer(request.id)}
      >
        Send an Offer
      </button>
    </div>
  </div>
);

// ArrowButton component
const ArrowButton = ({ direction, onClick, isActive }) => (
  <button
    className={`arrow-btn ${isActive ? "active" : ""}`}
    onClick={onClick}
    disabled={!isActive}
  >
    {direction === "left" ? (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    )}
  </button>
);

const ProviderHome = ({ onViewDetails, onSendOffer }) => {
  const [filterText, setFilterText] = useState("");
  const providerData = MOCK_PROVIDER;

  // Refs for each community row
  const communityRefs = providerData.communities.reduce((acc, community) => {
    acc[community] = useRef(null);
    return acc;
  }, {});

  // Track scroll status
  const [scrollStatus, setScrollStatus] = useState(
    providerData.communities.reduce((acc, community) => {
      acc[community] = { left: false, right: false };
      return acc;
    }, {})
  );

  const updateScrollStatus = (community) => {
    const container = communityRefs[community].current;
    if (!container) return;

    setScrollStatus((prev) => ({
      ...prev,
      [community]: {
        left: container.scrollLeft > 0,
        right: container.scrollLeft < container.scrollWidth - container.clientWidth,
      },
    }));
  };

  const scroll = (community, direction) => {
    const container = communityRefs[community].current;
    if (!container) return;

    const scrollAmount = 300;

    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });

    setTimeout(() => updateScrollStatus(community), 150);
  };

  useEffect(() => {
    providerData.communities.forEach(updateScrollStatus);
  }, []);

  // Filter requests based on title, description, or community
  const getFilteredRequestsForCommunity = (community) => {
    return MOCK_CLIENT_REQUESTS.filter((req) => {
      const titleMatch = req.title.toLowerCase().includes(filterText.toLowerCase());
      const descMatch = req.description.toLowerCase().includes(filterText.toLowerCase());
      const communityMatch = community.toLowerCase().includes(filterText.toLowerCase());
      const reqCommunityMatch = req.type.toLowerCase() === community.toLowerCase();

      // Only include requests of this community, but consider search
      if (!filterText) return reqCommunityMatch;
      if (communityMatch) return reqCommunityMatch; // Show full community row if search matches community name
      return reqCommunityMatch && (titleMatch || descMatch); // Filter cards by title/desc
    });
  };

  return (
    <div className="page-container flex flex-col space-y-6">

      {/* Header Controls */}
      <div className="controls flex flex-wrap gap-4 items-center">
        <SearchBar
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />

        <button className="action-btn client-filter-btn flex-shrink-0">
          Filter Requests By:
        </button>

        <button className="action-btn client-post-btn flex-shrink-0">
          Switch to Map
        </button>
      </div>

      {/* Community Rows */}
      <div className="flex flex-col gap-10">
        {providerData.communities.map((community) => {
          const filteredRequests = getFilteredRequestsForCommunity(community);
          if (filteredRequests.length === 0) return null; // hide empty rows
          return (
            <div key={community}>
              {/* Title + Arrows */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-xl">{community}</h3>
                <div className="flex gap-2">
                  <ArrowButton
                    direction="left"
                    onClick={() => scroll(community, "left")}
                    isActive={scrollStatus[community]?.left}
                  />
                  <ArrowButton
                    direction="right"
                    onClick={() => scroll(community, "right")}
                    isActive={scrollStatus[community]?.right}
                  />
                </div>
              </div>

              {/* Cards Row */}
              <div
                className="flex gap-6 overflow-x-auto scrollbar-hide"
                ref={communityRefs[community]}
                onScroll={() => updateScrollStatus(community)}
              >
                {filteredRequests.map((req) => (
                  <RequestCard
                    key={req.id}
                    request={req}
                    onViewDetails={onViewDetails}
                    onSendOffer={onSendOffer}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default ProviderHome;
