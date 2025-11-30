// src/Global/OfferDetails.jsx
import React, { useState } from "react";
import { MOCK_PROVIDER } from "../Sample/MockData";

const OfferDetails = ({ offerData, requestData, userRole, onBackToClientHome }) => {
  if (!offerData) return <div className="p-4">Offer not found</div>;
  if (!requestData) return <div className="p-4">Related request not found</div>;

  // Offer fields
  const [description, setDescription] = useState(offerData.description || "");
  const [price, setPrice] = useState(offerData.amount || "");

  // Client buttons state
  const [accepted, setAccepted] = useState(false);

  // Construct provider object if offerData.provider is a string
  const provider =
    typeof offerData.provider === "string"
      ? {
          avatar: MOCK_PROVIDER.profilePic,
          firstName: MOCK_PROVIDER.fullName.split(" ")[0],
          verifiedSkills: MOCK_PROVIDER.skills.filter(s => s.verified).map(s => s.name),
          unverifiedSkills: MOCK_PROVIDER.skills.filter(s => !s.verified).map(s => s.name),
          fullName: MOCK_PROVIDER.fullName,
          contact: MOCK_PROVIDER.phone,
        }
      : offerData.provider;

  // ---------- Client Actions ----------
  const handleAcceptOffer = () => {
    setAccepted(true);
    alert("Offer Accepted!");
  };

  const handleCounterOffer = () => alert("Counter Offer clicked");
  const handleDecline = () => alert("Offer Declined");

  // ---------- Provider Actions ----------
  const handleSendOffer = () => alert("Offer Sent!");
  const handleDeleteOffer = () => alert("Offer Deleted!");

  // ---------- Save Changes (navigate back) ----------
  const handleSaveChanges = () => {
    if (onBackToClientHome) {
      onBackToClientHome({
        ...offerData,
        description,
        price,
      });
    }
  };

  // ---------- CLIENT VIEW ----------
  if (userRole === "client") {
    return (
      <div className="flex flex-col md:flex-row w-full min-h-screen p-4 gap-4">
        {/* Left Side - Provider Info */}
        <div className="flex flex-col w-full md:w-2/5 gap-4">
          <div className="od-card flex flex-col items-center p-4 gap-4">
            <img src={provider.avatar} alt={provider.firstName} className="od-profile-pic" />
            <h3 className="font-bold text-lg">{provider.firstName}</h3>

            <div className="flex flex-wrap gap-2 w-full justify-center">
              {provider.verifiedSkills.map((skill, idx) => (
                <span key={idx} className="od-skill-verified">{skill} ✔</span>
              ))}
              {provider.unverifiedSkills.map((skill, idx) => (
                <span key={idx} className="od-skill-unverified">{skill}</span>
              ))}
            </div>

            {accepted && (
              <div className="flex flex-col gap-1 w-full text-center text-sm text-gray-700">
                <p>Full Name: {provider.fullName}</p>
                <p>Contact: {provider.contact}</p>
              </div>
            )}

            <button className="od-btn od-btn-counter mt-auto w-full">
              View Profile
            </button>
          </div>
        </div>

        {/* Right Side - Offer Info */}
        <div className="flex flex-col w-full md:w-3/5 gap-4">
          {/* Client's Request Card */}
          <div className="od-request-card">
            <h3 className="font-bold text-lg">{requestData.title}</h3>
            <p className="text-gray-500">{requestData.location}</p>
            <p className="text-gray-700 mt-1">{requestData.description}</p>
          </div>

          {/* Offer Details */}
          <div className="od-card">
            <label className="font-semibold">Offer Description</label>
            <p className="mt-1">{description}</p>

            <div className="od-divider"></div>

            <label className="font-semibold">Offer Price</label>
            <p className="mt-1 font-bold">{price}</p>

            {/* Client Action Buttons */}
            <div className="flex gap-2 mt-4">
              <button className="od-btn od-btn-accept" onClick={handleAcceptOffer}>
                Accept Offer
              </button>
              <button className="od-btn od-btn-counter" onClick={handleCounterOffer}>
                Counter Offer
              </button>
              <button className="od-btn od-btn-decline" onClick={handleDecline}>
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- PROVIDER VIEW ----------
  return (
    <div className="flex flex-col w-full min-h-screen p-4 gap-4">
      {/* Client Request Card */}
      <div className="od-request-card flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">{requestData.title}</h3>
          <p className="text-gray-500">{requestData.location}</p>
          <p className="text-gray-700 mt-1 truncate">{requestData.description}</p>
        </div>
        <button className="od-btn od-btn-counter" onClick={() => alert("Navigate to Request Details")}>
          View Full Details
        </button>
      </div>

      {/* Offer Details */}
      <div className="od-card flex flex-col gap-4">
        <label className="font-semibold">Offer Description</label>
        <textarea
          className="od-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="font-semibold">Offer Price</label>
        <input
          className="od-input"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* Provider Buttons */}
        <div className="flex gap-2 mt-4">
          <button className="od-btn od-btn-counter" onClick={handleSendOffer}>
            Send Offer
          </button>
          <button className="od-btn od-btn-decline" onClick={handleDeleteOffer}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfferDetails;
