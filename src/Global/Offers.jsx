// src/Global/Offers.jsx
import React, { useState } from "react";
import {
  MOCK_CLIENT_PENDING,
  MOCK_CLIENT_ONGOING,
  MOCK_CLIENT_HISTORY,
  MOCK_PROVIDER_PENDING,
  MOCK_PROVIDER_ONGOING,
  MOCK_PROVIDER_HISTORY,
} from "../Sample/MockData";

const Offers = ({ role }) => {
  const isClient = role === "client";
  const isProvider = role === "provider";

  const [currentTab, setCurrentTab] = useState("pending");
  const [filterText, setFilterText] = useState("");

  const [clientPending, setClientPending] = useState(MOCK_CLIENT_PENDING);
  const [clientOngoing, setClientOngoing] = useState(MOCK_CLIENT_ONGOING);
  const [clientHistory, setClientHistory] = useState(MOCK_CLIENT_HISTORY);

  const [providerPending, setProviderPending] = useState(MOCK_PROVIDER_PENDING);
  const [providerOngoing, setProviderOngoing] = useState(MOCK_PROVIDER_ONGOING);
  const [providerHistory, setProviderHistory] = useState(MOCK_PROVIDER_HISTORY);

  const getCurrentData = () => {
    if (isClient) {
      switch (currentTab) {
        case "pending":
          return clientPending;
        case "ongoing":
          return clientOngoing;
        case "history":
          return clientHistory;
        default:
          return [];
      }
    } else {
      switch (currentTab) {
        case "pending":
          return providerPending;
        case "ongoing":
          return providerOngoing;
        case "history":
          return providerHistory;
        default:
          return [];
      }
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "pending":
        return "status pending";
      case "accepted":
        return "status accepted";
      case "denied":
        return "status denied";
      case "cancelled":
        return "status cancelled";
      case "finished":
        return "status finished";
      case "ongoing":
        return "status accepted";
      default:
        return "";
    }
  };

  const moveOffer = (offer, from, to, setFrom, setTo, newStatus) => {
    setFrom((list) => list.filter((o) => o.id !== offer.id));
    setTo((list) => [...list, { ...offer, status: newStatus }]);
  };

  const filteredData = getCurrentData().filter((item) =>
    item.title.toLowerCase().includes(filterText.toLowerCase())
  );

  const tabs = ["pending", "ongoing", "history"];

  return (
    <div className="page-container flex flex-col">
      {/* Bubble Tabs */}
      <div className="offers-tab-container mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`offers-tab ${currentTab === tab ? "active" : ""}`}
            onClick={() => setCurrentTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search offers..."
          className="search-input flex-grow"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button className="client-filter-btn">Filter Offers</button>
      </div>

      {/* Offer Cards */}
      <div className="card-list">
        {filteredData.map((offer) => (
          <div key={offer.id} className="offers-card flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-lg truncate">{offer.title}</h3>
                <span className={statusColor(offer.status)}>{offer.status.toUpperCase()}</span>
              </div>
              <p className="truncate">{isClient ? `From: ${offer.provider}` : `To: ${offer.client}`}</p>
              <p className="text-sm text-gray-600 truncate">{offer.description}</p>
              <p className="font-semibold mt-2">{offer.amount}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-3">
              {isClient && currentTab === "pending" && (
                <div className="flex gap-2">
                  <button
                    className="action-btn accept-btn flex-1"
                    onClick={() =>
                      moveOffer(offer, clientPending, clientOngoing, setClientPending, setClientOngoing, "ongoing")
                    }
                  >
                    Accept
                  </button>
                  <button
                    className="action-btn decline-btn flex-1"
                    onClick={() =>
                      moveOffer(offer, clientPending, clientHistory, setClientPending, setClientHistory, "denied")
                    }
                  >
                    Decline
                  </button>
                </div>
              )}

              {isProvider && currentTab === "pending" && (
                <button
                  className="action-btn decline-btn w-full"
                  onClick={() =>
                    moveOffer(offer, providerPending, providerHistory, setProviderPending, setProviderHistory, "cancelled")
                  }
                >
                  Cancel
                </button>
              )}

              {/* View Full Information Button */}
              <button className="action-btn viewinfo-btn w-full">View Full Information</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Offers;
