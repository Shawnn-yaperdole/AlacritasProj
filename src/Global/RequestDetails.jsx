// src/Global/RequestDetails.jsx
import React, { useState } from "react";

const RequestDetails = ({ requestData, userRole, onBackToClientHome }) => {
  const [title, setTitle] = useState(requestData.title || "");
  const [type, setType] = useState(requestData.type || "");
  const [location, setLocation] = useState(requestData.location || "");
  const [description, setDescription] = useState(requestData.description || "");
  const [thumbnail, setThumbnail] = useState(requestData.thumbnail || "");
  const [additionalImages, setAdditionalImages] = useState(requestData.images || []);

  // Modals state
  const [chooseThumbnailOpen, setChooseThumbnailOpen] = useState(false);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [providerViewOpen, setProviderViewOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  // Handlers for file uploads
  const handleUpload = (e) => {
    const files = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
    setAdditionalImages([...additionalImages, ...files]);
  };

  const handleSelectThumbnail = (img) => {
    setThumbnail(img);
    setChooseThumbnailOpen(false);
  };

  // ------------------ Save Changes ------------------
  const handleSaveChanges = () => {
    if (onBackToClientHome) {
      onBackToClientHome({
        ...requestData,
        title,
        type,
        location,
        description,
        thumbnail,
        images: additionalImages,
      });
    }
  };

  return (
    <div className="page-container flex flex-col space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>

      {/* Request Info */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Images Section */}
        <div className="flex flex-col gap-4 items-center">
          {/* Thumbnail */}
          <div className="rd-card relative">
            {thumbnail ? (
              <img src={thumbnail} alt="Thumbnail" className="w-64 h-40 object-cover rounded-lg" />
            ) : (
              <div className="rd-add-image-box w-64 h-40 flex items-center justify-center">
                Choose Thumbnail
              </div>
            )}
            {userRole === "client" && (
              <button
                onClick={() => setChooseThumbnailOpen(true)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Choose Thumbnail
              </button>
            )}
          </div>

          {/* Add Reference Images Button */}
          {userRole === "client" && (
            <>
              <div className="rd-add-image-box relative">
                + Add Reference Images
                <input
                  type="file"
                  multiple
                  onChange={handleUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <button
                onClick={() => setViewAllOpen(true)}
                className="mt-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                View All Images
              </button>
            </>
          )}

          {/* Provider View All */}
          {userRole === "provider" && (
            <button
              onClick={() => setProviderViewOpen(true)}
              className="mt-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              View All Images
            </button>
          )}
        </div>

        {/* Details Section */}
        <div className="flex-1 flex flex-col gap-4">
          <div>
            <label className="font-semibold">Title</label>
            {userRole === "client" ? (
              <input
                type="text"
                className="w-full rd-search-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            ) : (
              <p>{title}</p>
            )}
          </div>

          <div>
            <label className="font-semibold">Type</label>
            {userRole === "client" ? (
              <input
                type="text"
                className="w-full rd-search-input"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
            ) : (
              <p>{type}</p>
            )}
          </div>

          <div>
            <label className="font-semibold">Location</label>
            {userRole === "client" ? (
              <>
                <input
                  type="text"
                  className="w-full rd-search-input mb-2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Barangay/City, Street, Specific address"
                />
                <div className="rd-map-container">
                  [Google Maps location picker placeholder]
                </div>
              </>
            ) : (
              <p>{location}</p>
            )}
          </div>

          <div>
            <label className="font-semibold">Description</label>
            {userRole === "client" ? (
              <textarea
                className="w-full rd-search-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            ) : (
              <p>{description}</p>
            )}
          </div>

          {/* Provider Actions */}
          {userRole === "provider" && (
            <div className="flex flex-wrap gap-4 mt-2">
              <button className="action-btn btn-secondary btn-accent px-4 py-2">
                Send Offer
              </button>
              <button className="action-btn btn-secondary px-4 py-2">
                View Client Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Save Changes Button for Client */}
      {userRole === "client" && (
        <div className="flex justify-center mt-6">
          <button
            className="action-btn client-post-btn px-6 py-2"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
      )}

      {/* ------------------ Modals ------------------ */}

      {/* Choose Thumbnail Modal */}
      {chooseThumbnailOpen && (
        <Modal title="Choose Thumbnail" onClose={() => setChooseThumbnailOpen(false)}>
          <div className="grid grid-cols-3 gap-2">
            {additionalImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx}`}
                className="cursor-pointer rounded border-2 border-gray-300 hover:border-blue-500"
                onClick={() => handleSelectThumbnail(img)}
              />
            ))}
          </div>
          <UploadButton onUpload={handleUpload} />
        </Modal>
      )}

      {/* View All Images Modal (Client) */}
      {viewAllOpen && (
        <Modal title="All Images" onClose={() => setViewAllOpen(false)}>
          <div className="grid grid-cols-3 gap-2">
            {additionalImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Reference ${idx}`}
                className="rounded border-2 border-gray-300"
              />
            ))}
          </div>
          <UploadButton onUpload={handleUpload} />
        </Modal>
      )}

      {/* Provider View Modal */}
      {providerViewOpen && (
        <Modal title="All Images" onClose={() => setProviderViewOpen(false)}>
          <div className="grid grid-cols-3 gap-2">
            {additionalImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Reference ${idx}`}
                className="cursor-pointer rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                onClick={() => setZoomedImage(img)}
              />
            ))}
          </div>
        </Modal>
      )}

      {/* Zoom Overlay for Provider */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setZoomedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl font-bold"
            onClick={() => setZoomedImage(null)}
          >
            ✕
          </button>
          <img
            src={zoomedImage}
            alt="Zoomed"
            className="max-h-[90vh] max-w-[90vw] rounded shadow-lg"
          />
        </div>
      )}
    </div>
  );
};

// ---------- Modal Component ----------
const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-4 rounded w-96 max-h-[80vh] overflow-y-auto relative">
      <button
        className="absolute top-2 right-2 text-gray-600 font-bold"
        onClick={onClose}
      >
        ✕
      </button>
      <h3 className="font-bold mb-4">{title}</h3>
      {children}
    </div>
  </div>
);

// ---------- Upload Button Component ----------
const UploadButton = ({ onUpload }) => (
  <div className="mt-4">
    <label className="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
      Upload
      <input type="file" multiple onChange={onUpload} className="hidden" />
    </label>
  </div>
);

export default RequestDetails;
