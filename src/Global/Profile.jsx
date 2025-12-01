// src/Global/Profile.jsx
import React, { useState } from "react";
import { MOCK_CLIENT, MOCK_PROVIDER } from "../Sample/MockData";
import { saveProfileRealtime, saveProfile } from "../lib/firebase";
import { uploadFileToCloudinary } from "../lib/cloudinary";
import { useRef } from "react";

const Profile = ({ role }) => {
  const isClient = role === "client";
  const initialData = isClient ? MOCK_CLIENT : MOCK_PROVIDER;

  const [profilePic, setProfilePic] = useState(initialData.profilePic);
  const [fullName, setFullName] = useState(initialData.fullName);
  const [email, setEmail] = useState(initialData.email);
  const [phone, setPhone] = useState(initialData.phone);
  const [location, setLocation] = useState(initialData.location);
  const [communities, setCommunities] = useState(initialData.communities);
  const [defaultCommunity, setDefaultCommunity] = useState(initialData.defaultCommunity);
  const [bio, setBio] = useState(initialData.bio);
  const [skills, setSkills] = useState(initialData.skills || []);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isUploadingPic, setIsUploadingPic] = useState(false);
  const fileInputRef = useRef(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  const handleSave = async () => {
    const updatedData = {
      profilePic,
      fullName,
      email,
      phone,
      location,
      communities,
      defaultCommunity,
      bio,
      skills,
    };

    // Try saving to Realtime DB first, fall back to Firestore
    try {
      await saveProfileRealtime(isClient ? 'client' : 'provider', updatedData);
      // eslint-disable-next-line no-console
      console.log('Profile saved to Realtime DB:', updatedData);
      // removed blocking alert on successful save
    } catch (rtdbErr) {
      // attempt Firestore
      try {
        await saveProfile(isClient ? 'client' : 'provider', updatedData);
        // eslint-disable-next-line no-console
        console.log('Profile saved to Firestore:', updatedData);
        // removed blocking alert on successful save (Firestore fallback)
      } catch (fsErr) {
        // eslint-disable-next-line no-console
        console.error('Failed to save profile to database', rtdbErr, fsErr);
        setProfileError('Failed to save profile. See console for details.');
      }
    }

    setIsEditingBio(false); // stop editing after saving
    setIsEditingProfile(false);

    // update in-memory mocks so other views reflect the change immediately
    try {
      if (isClient) {
        // mutate exported mock object
        MOCK_CLIENT.profilePic = profilePic;
        MOCK_CLIENT.fullName = fullName;
        MOCK_CLIENT.email = email;
        MOCK_CLIENT.phone = phone;
        MOCK_CLIENT.location = location;
        MOCK_CLIENT.bio = bio;
      } else {
        MOCK_PROVIDER.profilePic = profilePic;
        MOCK_PROVIDER.fullName = fullName;
        MOCK_PROVIDER.email = email;
        MOCK_PROVIDER.phone = phone;
        MOCK_PROVIDER.location = location;
        MOCK_PROVIDER.bio = bio;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to update in-memory mock profiles', e);
    }

    // persist to localStorage so reloads keep the profile
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const key = isClient ? 'alacritas_profile_client' : 'alacritas_profile_provider';
        const payload = { profilePic, fullName, email, phone, location, bio };
        window.localStorage.setItem(key, JSON.stringify(payload));
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to persist profile to localStorage', e);
    }
  };

  return (
    <div className="profile-page flex flex-col md:flex-row justify-start w-full min-h-screen p-8 bg-gray-50 gap-12" style={{ paddingTop: "100px" }}>
      {/* Left: Profile Picture + Contact Info */}
      <div className="profile-left flex flex-col items-center gap-6 md:w-1/3">
        <div className="profile-pic-container relative">
          <img src={profilePic} alt="profile" className="profile-pic" />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files && e.target.files[0];
              if (!file) return;
              try {
                setIsUploadingPic(true);
                const url = await uploadFileToCloudinary(file);
                setProfilePic(url);
                // auto-save profile pic change to DB (optional) - keep existing save flow for full profile
                // You can uncomment to auto-save: await saveProfileRealtime(isClient ? 'client' : 'provider', { profilePic: url });
              } catch (err) {
                // eslint-disable-next-line no-console
                console.error('Profile picture upload failed', err);
                setProfileError('Failed to upload profile picture.');
              } finally {
                setIsUploadingPic(false);
                // reset input so same file can be selected again
                e.target.value = null;
              }
            }}
            className="hidden"
          />
          <button
            className="edit-pic-btn"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={isUploadingPic}
          >
            {isUploadingPic ? 'Uploading...' : 'Edit'}
          </button>
        </div>

        <div className="contact-info flex flex-col gap-2 text-center md:text-left">
          <div>
            <strong>Email:</strong>{' '}
            {isEditingProfile ? (
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="rd-search-input p-1" />
            ) : (
              email
            )}
          </div>
          <div>
            <strong>Phone:</strong>{' '}
            {isEditingProfile ? (
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="rd-search-input p-1" />
            ) : (
              phone
            )}
          </div>
          <div>
            <strong>Location:</strong>{' '}
            {isEditingProfile ? (
              <input value={location} onChange={(e) => setLocation(e.target.value)} className="rd-search-input p-1" />
            ) : (
              location
            )}
          </div>
        </div>
      </div>

      {/* Right: Main Info */}
      <div className="profile-right flex flex-col gap-6 md:w-2/3 text-center md:text-left">
        <div className="flex items-center justify-between">
          {isEditingProfile ? (
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="text-4xl font-bold rd-search-input p-2"
            />
          ) : (
            <h1 className="text-5xl font-bold">{fullName}</h1>
          )}

          <div className="flex gap-2">
            <button
              className="action-btn btn-secondary px-3 py-1"
              onClick={() => setIsEditingProfile((s) => !s)}
            >
              {isEditingProfile ? 'Done' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Communities */}
        <div className="communities flex flex-col gap-2">
          <strong>Communities:</strong>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {communities.map((c) => (
              <span
                key={c}
                className={`community-badge ${c === defaultCommunity ? "default-community" : ""}`}
                onClick={() => setDefaultCommunity(c)}
              >
                {c} {c === defaultCommunity && "(Default)"}
              </span>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="bio flex flex-col gap-2">
          <div className="flex items-center">
            <strong className="text-lg">About Me:</strong>
            <button
              className="edit-btn action-btn px-2 py-0.5 text-s ml-1 !h-auto !leading-none !py-0 !px-1 relative top-0.5"
              onClick={() => setIsEditingBio(!isEditingBio)}
            >
              {isEditingBio ? "Save" : "Edit"}
            </button>
          </div>

          {isEditingBio ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bio-textarea p-2 border rounded resize-none w-full"
              rows={1}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
            />
          ) : (
            <p className="bio-text">{bio}</p>
          )}
        </div>

        {/* Provider Skills */}
        {!isClient && (
          <div className="skills flex flex-col gap-2">
            <strong>Skills:</strong>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 justify-center">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded flex items-center justify-between border ${skill.verified ? "border-green-500 bg-green-50" : "border-gray-300"}`}
                >
                  <span>{skill.name}</span>
                  {skill.verified && <span className="text-green-600 font-bold">✔</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex flex-col justify-end w-full h-full mt-6">
          <button
            className="action-btn client-post-btn w-1/3"
            onClick={handleSave}
          >
            Save Profile
          </button>
          {profileError && <div className="text-red-600 mt-2">{profileError}</div>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
