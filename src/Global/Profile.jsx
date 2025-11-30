// src/Global/Profile.jsx
import React, { useState } from "react";
import { MOCK_CLIENT, MOCK_PROVIDER } from "../Sample/MockData";

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

  const handleSave = () => {
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
    console.log("Saved Profile Data:", updatedData);
    alert("Profile saved!");
  };

  return (
    <div className="profile-page flex flex-col md:flex-row justify-start w-full min-h-screen p-8 bg-gray-50 gap-12" style={{ paddingTop: "100px" }}>
      {/* Left: Profile Picture + Contact Info */}
      <div className="profile-left flex flex-col items-center gap-6 md:w-1/3">
        <div className="profile-pic-container relative">
          <img src={profilePic} alt="profile" className="profile-pic" />
          <button
            className="edit-pic-btn"
            onClick={() => {
              const newUrl = prompt("Enter new profile picture URL", profilePic);
              if (newUrl) setProfilePic(newUrl);
            }}
          >
            Edit
          </button>
        </div>

        <div className="contact-info flex flex-col gap-2 text-center md:text-left">
          <div><strong>Email:</strong> {email}</div>
          <div><strong>Phone:</strong> {phone}</div>
          <div><strong>Location:</strong> {location}</div>
        </div>
      </div>

      {/* Right: Main Info */}
      <div className="profile-right flex flex-col gap-6 md:w-2/3 text-center md:text-left">
        <h1 className="text-5xl font-bold">{fullName}</h1>

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
          <strong>About Me:</strong>
          <p>{bio}</p>
          <button
            className="edit-btn action-btn"
            onClick={() => {
              const newBio = prompt("Edit your bio", bio);
              if (newBio) setBio(newBio);
            }}
          >
            Edit
          </button>
        </div>

        {/* Provider Skills */}
        {!isClient && (
          <div className="skills flex flex-col gap-2">
            <strong>Skills:</strong>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 justify-center">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded flex items-center justify-between border ${
                    skill.verified ? "border-green-500 bg-green-50" : "border-gray-300"
                  }`}
                >
                  <span>{skill.name}</span>
                  {skill.verified && <span className="text-green-600 font-bold">✔</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-center md:justify-start">
          <button className="action-btn client-post-btn w-1/4 mt-4" onClick={handleSave}>
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
