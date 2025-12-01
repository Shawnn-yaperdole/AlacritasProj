// src/Global/RequestDetails.jsx
import React, { useState } from "react";
import { uploadFileToCloudinary } from "../lib/cloudinary";
import { saveRequest, saveRequestRealtime } from "../lib/firebase";
import { deleteRequest, deleteRequestRealtime } from "../lib/firebase";
import { MOCK_CLIENT_REQUESTS } from "../Sample/MockData";

const RequestDetails = ({ requestData, userRole, onBackToClientHome, isNewRequest }) => {
  const [title, setTitle] = useState(requestData.title || "");
  const [type, setType] = useState(requestData.type || "");
  const [location, setLocation] = useState(requestData.location || "");
  const [description, setDescription] = useState(requestData.description || "");
  const [thumbnail, setThumbnail] = useState(requestData.thumbnail || "");
  const initialAdditional = (requestData.images || []).map((src) => ({ src }));
  const [additionalImages, setAdditionalImages] = useState(initialAdditional);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Modals state
  const [chooseThumbnailOpen, setChooseThumbnailOpen] = useState(false);
  const [viewAllOpen, setViewAllOpen] = useState(false);
  const [providerViewOpen, setProviderViewOpen] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  // Upload new images
  const handleUpload = (e) => {
    const files = Array.from(e.target.files).map((file) => ({
      src: URL.createObjectURL(file),
      file,
    }));

    setAdditionalImages((prev) => {
      const updated = [...prev, ...files];
      if (!thumbnail && updated.length > 0) {
        setThumbnail(updated[0].src);
      }
      return updated;
    });
  };

  // Delete request
  const handleDeleteRequest = async () => {
    if (!requestData?.id) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this request? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const index = MOCK_CLIENT_REQUESTS.findIndex((r) => r.id === requestData.id);
      if (index !== -1){
        MOCK_CLIENT_REQUESTS.splice(index, 1);
      }
      
      try {
        await deleteRequestRealtime(requestData.id);
      } catch (rtdbErr) {
        console.warn("Realtime DB delete failed, falling back to Firestore", rtdbErr);
        await deleteRequest(requestData.id);
      }

      if (onBackToClientHome) onBackToClientHome(null);
    } catch (err) {
      console.error("Failed to delete request", err);
      alert("Failed to delete request: " + (err.message || err));
    }
  };

  // Save changes
  const handleSaveChanges = async () => {
    if (!title || !type || !location || !description || additionalImages.length === 0) {
      alert("Please fill all fields and upload at least one image before saving.");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    let payload = {
      ...requestData,
      title,
      type,
      location,
      description,
      thumbnail,
      images: additionalImages.map((img) => img.src),
    };

    if (isNewRequest) {
      const maxId = MOCK_CLIENT_REQUESTS.reduce((m, r) => Math.max(m, r.id), 0);
      payload.id = maxId + 1;
      MOCK_CLIENT_REQUESTS.push(payload);
    } else {
      const index = MOCK_CLIENT_REQUESTS.findIndex((r) => r.id === payload.id);
      if (index !== -1) {
        MOCK_CLIENT_REQUESTS[index] = payload;
      }
    }

    try {
      const uploaded = await Promise.all(
        additionalImages.map(async (item) => {
          if (item.file) {
            const url = await uploadFileToCloudinary(item.file);
            return { src: url };
          }
          return { src: item.src };
        })
      );

      const imagesUrls = uploaded.map((u) => u.src);
      let thumbnailUrl = thumbnail;

      if (thumbnailUrl && !thumbnailUrl.startsWith("http")) {
        const idx = additionalImages.findIndex((a) => a.src === thumbnailUrl);
        if (idx !== -1 && imagesUrls[idx]) thumbnailUrl = imagesUrls[idx];
      }

      setAdditionalImages(imagesUrls.map((src) => ({ src })));
      setThumbnail(imagesUrls.includes(thumbnailUrl) ? thumbnailUrl : imagesUrls[0] || "");

      payload = {
        ...requestData,
        title,
        type,
        location,
        description,
        thumbnail: imagesUrls.includes(thumbnailUrl) ? thumbnailUrl : imagesUrls[0] || "",
        images: imagesUrls,
      };

      if (requestData?.id) {
        try {
          await saveRequestRealtime(requestData.id, payload);
        } catch (rtdbErr) {
          console.warn("Realtime DB save failed, falling back to Firestore", rtdbErr);
          await saveRequest(requestData.id, payload);
        }
      }

      if (onBackToClientHome) onBackToClientHome(payload);

      setSaveMessage("Saved successfully.");
      setTimeout(() => setSaveMessage(""), 2500);
    } catch (err) {
      console.error("Failed to save request", err);
      setSaveMessage("Failed to save request: " + (err.message || err));
    } finally {
      setIsSaving(false);
    }
  };

  const isSaveDisabled =
    !title || !type || !location || !description || additionalImages.length === 0;

  return (
    <div className="page-container flex flex-col space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>

      {/* Request Info */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Images Section */}
        <div className="flex flex-col gap-4 items-center">
          <div className="rd-card relative w-64 h-40 flex flex-col items-center justify-center">
            {thumbnail && (
              <img
                src={thumbnail}
                alt="Thumbnail"
                className="w-64 h-40 object-cover rounded-lg mb-2"
              />
            )}

            {userRole === "client" && (
              <button
                onClick={() => setChooseThumbnailOpen(true)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {thumbnail ? "Change Thumbnail" : "Choose Thumbnail"}
              </button>
            )}
          </div>

          {userRole === "client" && (
            <button
              onClick={() => setViewAllOpen(true)}
              className="mt-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              View All Images
            </button>
          )}

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

      {userRole === "client" && (
        <div className="flex justify-center mt-4 gap-4">
          <button
            className={`action-btn client-post-btn px-6 py-2 ${
              isSaveDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleSaveChanges}
            disabled={isSaveDisabled || isSaving}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>

          <button
            className="action-btn btn-secondary px-6 py-2"
            onClick={() => onBackToClientHome(null)}
          >
            Cancel
          </button>

          {requestData?.id && !isNewRequest && (
            <button
              className="action-btn btn-secondary px-6 py-2"
              onClick={handleDeleteRequest}
            >
              Delete
            </button>
          )}
        </div>
      )}

      {/* ------------------ Modals ------------------ */}
      {chooseThumbnailOpen && (
        <ViewImagesModal
          images={additionalImages}
          selectThumbnail
          onClose={() => setChooseThumbnailOpen(false)}
          onSave={(newImages) => {
            setAdditionalImages(newImages);
            setThumbnail(newImages[0]?.src || "");
            setChooseThumbnailOpen(false);
          }}
        />
      )}

      {viewAllOpen && (
        <ViewImagesModal
          images={additionalImages}
          onClose={() => setViewAllOpen(false)}
          onSave={(newImages) => {
            setAdditionalImages(newImages);
            if (newImages.length > 0 && !thumbnail) setThumbnail(newImages[0].src);
            if (newImages.length === 0) setThumbnail("");
            setViewAllOpen(false);
          }}
        />
      )}

      {providerViewOpen && (
        <Modal title="All Images" onClose={() => setProviderViewOpen(false)}>
          <div className="grid grid-cols-3 gap-2">
            {additionalImages.map((img, idx) => (
              <img
                key={idx}
                src={img.src}
                alt={`Reference ${idx}`}
                className="cursor-pointer rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                onClick={() => setZoomedImage(img.src)}
              />
            ))}
          </div>
        </Modal>
      )}

      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200]"
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
  <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center">
    <div className="bg-white p-4 rounded w-96 max-h-[80vh] overflow-y-auto relative z-50">
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

// ---------- View Images Modal ----------
const ViewImagesModal = ({ images, onClose, onSave, selectThumbnail }) => {
  const [tempImages, setTempImages] = useState([...images]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(
    selectThumbnail ? tempImages[0]?.src || "" : ""
  );

  const handleUpload = (files) => {
    const newFiles = Array.from(files).map((file) => ({
      src: URL.createObjectURL(file),
      file,
    }));
    setTempImages((prev) => [...prev, ...newFiles]);
    if (selectThumbnail && !selectedThumbnail && newFiles.length > 0) {
      setSelectedThumbnail(newFiles[0].src);
    }
  };

  const removeImage = (index) => {
    const removed = tempImages[index];
    setTempImages((prev) => prev.filter((_, i) => i !== index));
    if (selectThumbnail && removed.src === selectedThumbnail) {
      setSelectedThumbnail(tempImages[1]?.src || tempImages[0]?.src || "");
    }
  };

  const clearAll = () => {
    setTempImages([]);
    if (selectThumbnail) setSelectedThumbnail("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };
  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]"
      onClick={onClose}
    >
      <div
        className="bg-white p-4 rounded w-96 max-h-[80vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <h3 className="font-bold mb-4 flex justify-between items-center">
          {selectThumbnail ? "Choose Thumbnail" : "All Images"}
          <button
            className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            onClick={clearAll}
          >
            Clear All
          </button>
        </h3>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {tempImages.map((img, idx) => (
            <div key={idx} className="relative group">
              <img
                src={img.src}
                alt={`img-${idx}`}
                className={`rounded border-2 w-full h-24 object-cover ${
                  selectThumbnail && img.src === selectedThumbnail
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => selectThumbnail && setSelectedThumbnail(img.src)}
              />
              <button
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(idx)}
              >
                ✕
              </button>
            </div>
          ))}

          <label className="flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:border-blue-500">
            <span className="text-2xl font-bold">+</span>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
          </label>
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              if (selectThumbnail) {
                const reordered = [
                  { src: selectedThumbnail },
                  ...tempImages.filter((img) => img.src !== selectedThumbnail),
                ];
                onSave(reordered);
              } else {
                onSave(tempImages);
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestDetails;
