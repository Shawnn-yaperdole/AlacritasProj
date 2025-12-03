// src/Global/OfferDetails.jsx
import React, { useState } from "react";
import { MOCK_PROVIDER } from "../Sample/MockData";
import { saveOffer, saveOfferRealtime } from "../lib/firebase";

const OfferDetails = ({
  offerData,
  requestData,
  userRole,
  onBackToClientHome,
  onBackToProviderHome,
  isNewOffer = false,
}) => {
  if (!offerData) return <div className="p-4">Offer not found</div>;
  if (!requestData) return <div className="p-4">Related request not found</div>;

  const [description, setDescription] = useState(offerData.description || "");
  const [price, setPrice] = useState(offerData.amount || "");
  const [status, setStatus] = useState(offerData.status || "pending");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const provider =
    typeof offerData.provider === "string"
      ? MOCK_PROVIDER
      : offerData.provider || MOCK_PROVIDER;

  const verifiedSkills =
    provider.skills?.filter(s => s.verified).map(s => s.name) || [];
  const unverifiedSkills =
    provider.skills?.filter(s => !s.verified).map(s => s.name) || [];

  // ---------- CLIENT ACTIONS ----------
  const handleAcceptOffer = () => {
    setStatus("accepted");
    alert("Offer Accepted!");
  };

  const handleDeclineOffer = () => {
    setStatus("declined");
    alert("Offer Declined!");
  };

  // ---------- PROVIDER ACTIONS ----------
  const handleSendOffer = async () => {
    if (!description || !price) {
      alert("Please fill in all fields");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      const offerId = offerData.id || Date.now();
      const payload = {
        id: offerId,
        requestId: requestData.id,
        description,
        amount: price,
        provider: MOCK_PROVIDER,
        status: "pending",
        title: requestData.title,
        timestamp: new Date().toISOString(),
      };

      try {
        // Choose ONE system only
        await saveOfferRealtime(offerId, payload); // OR await saveOffer(offerId, payload);
        setSaveMessage("Offer sent successfully!");
        alert("Offer sent successfully!");
        if (onBackToProviderHome) onBackToProviderHome(payload);
      } catch (err) {
        console.error("Offer save failed:", err);
        setSaveMessage("Failed to send offer");
        alert("Failed to send offer. See console for details.");
      } finally {
        setIsSaving(false);
      }
    } catch (err) {
      console.error(err);
      setSaveMessage("Failed to send offer");
      alert("Failed to send offer. See console for details.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveMessage(""), 2500);
    }
  };

  const handleDeleteOffer = () => {
    alert("Offer deleted!");
    if (onBackToProviderHome) onBackToProviderHome(null);
  };

  // ---------- LAYOUT ----------
  return (
    <div className="page-container flex flex-col space-y-6 p-4">
      {/* Offer Info */}
      <h2 className="text-2xl font-bold">{offerData.title}</h2>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Provider Info */}
        <div className="od-card flex flex-col items-center p-4 gap-2 w-full md:w-1/3">
          <img
            src={provider.profilePic}
            alt={provider.fullName}
            className="od-profile-pic"
          />
          <h3 className="font-bold text-lg">{provider.fullName}</h3>

          {/* Provider Skills */}
          <div className="flex flex-wrap gap-1 mt-2 justify-center">
            {verifiedSkills.map((skill, idx) => (
              <span key={idx} className="od-skill-verified">
                {skill} ✔
              </span>
            ))}
            {unverifiedSkills.map((skill, idx) => (
              <span key={idx} className="od-skill-unverified">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Offer Details */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="od-card flex flex-col gap-2">
            <label className="font-semibold">Description</label>
            {userRole === "provider" ? (
              <textarea
                className="od-textarea"
                value={description}
                onChange={e => setDescription(e.target.value)}
              />
            ) : (
              <p>{description}</p>
            )}

            <label className="font-semibold mt-2">Price</label>
            {userRole === "provider" ? (
              <input
                className="od-input"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            ) : (
              <p className="font-bold">{price}</p>
            )}

            <label className="font-semibold mt-2">Status</label>
            <p className="capitalize">{status}</p>

            {/* Actions */}
            {userRole === "client" && status === "pending" && (
              <div className="flex gap-2 mt-4">
                <button
                  className="od-btn od-btn-accept"
                  onClick={handleAcceptOffer}
                >
                  Accept
                </button>
                <button
                  className="od-btn od-btn-decline"
                  onClick={handleDeclineOffer}
                >
                  Decline
                </button>
              </div>
            )}

            {userRole === "provider" && (
              <div className="flex gap-2 mt-4">
                <button
                  className="od-btn od-btn-counter"
                  onClick={handleSendOffer}
                  disabled={isSaving}
                >
                  {isSaving ? "Sending..." : "Send Offer"}
                </button>
                {!isNewOffer && (
                  <button
                    className="od-btn od-btn-decline"
                    onClick={handleDeleteOffer}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}

            {saveMessage && (
              <p className="text-sm text-green-600 mt-2">{saveMessage}</p>
            )}
          </div>

          {/* Linked Request Info */}
          <div className="od-request-card mt-4 flex flex-col gap-1">
            <label className="font-semibold">Request Info</label>
            <p className="font-bold">{requestData.title}</p>
            <p className="text-gray-500">{requestData.location}</p>
            <p className="text-gray-700 truncate">{requestData.description}</p>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <button
        className="od-btn od-btn-counter mt-4"
        onClick={() => {
          if (userRole === "client") onBackToClientHome(null);
          else if (userRole === "provider") onBackToProviderHome(null);
        }}
      >
        Back
      </button>
    </div>
  );
};

export default OfferDetails;
