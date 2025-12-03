// src/Sample/MockData.js

// ==============================
// CLIENT MOCK DATA
// ==============================
const _DEFAULT_CLIENT = {
  profilePic: "https://via.placeholder.com/200",
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+123456789",
  location: "123-A Don Bosco Rd., Trancoville, Baguio City",
  communities: ["Trancoville, Baguio City", "Dominican Hill-Mirador, Baguio City"],
  defaultCommunity: "Trancoville, Baguio City",
  bio: "Hello! I love connecting with providers to get things done.",
};

// Load saved profile from localStorage to persist updates
function loadSavedProfile(key, defaults) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return { ...defaults };
    const raw = window.localStorage.getItem(key);
    if (!raw) return { ...defaults };
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch (e) {
    console.warn('Failed to load saved profile from localStorage', e);
    return { ...defaults };
  }
}

export const MOCK_CLIENT = loadSavedProfile('alacritas_profile_client', _DEFAULT_CLIENT);

export const MOCK_CLIENT_REQUESTS = [
  {
    id: 1,
    title: "Fix Leaking Sink",
    type: "Plumbing",
    date: "2023-10-25",
    location: "Trancoville, Baguio City",
    status: "accepted",
    description: "Sink in kitchen is leaking. Needs urgent repair.",
    thumbnail: "https://via.placeholder.com/150x100?text=Sink",
  },
  {
    id: 2,
    title: "Lawn Mowing",
    type: "Landscaping",
    date: "2023-10-26",
    location: "Dominican Hill-Mirador, Baguio City",
    status: "pending",
    description: "Backyard lawn needs mowing and trimming.",
    thumbnail: "https://via.placeholder.com/150x100?text=Lawn",
  },
  {
    id: 3,
    title: "Install Ceiling Fan",
    type: "Electrical",
    date: "2023-10-27",
    location: "Dominican Hill-Mirador, Baguio City",
    status: "accepted",
    description: "Install a ceiling fan in the living room.",
    thumbnail: "https://via.placeholder.com/150x100?text=Fan",
  },
  {
    id: 4,
    title: "Paint Living Room",
    type: "Painting",
    date: "2023-10-28",
    location: "Trancoville, Baguio City",
    status: "pending",
    description: "Full living room painting with prep work.",
    thumbnail: "https://via.placeholder.com/150x100?text=Paint",
  },
];

// ==============================
// PROVIDER MOCK DATA
// ==============================
const _DEFAULT_PROVIDER = {
  profilePic: "https://via.placeholder.com/200",
  fullName: "Jane Smith",
  email: "jane@example.com",
  phone: "+987654321",
  location: "2 St Theresa Ext., Dominican Hill-Mirador, Baguio City",
  communities: ["Trancoville, Baguio City", "Dominican Hill-Mirador, Baguio City"],
  defaultCommunity: "Dominican Hill-Mirador, Baguio City",
  bio: "Experienced provider ready to help!",
  skills: [
    { name: "Plumbing", verified: true },
    { name: "Electrical", verified: false },
    { name: "Painting", verified: true },
    { name: "Landscaping", verified: true },
  ],
};

export const MOCK_PROVIDER = loadSavedProfile('alacritas_profile_provider', _DEFAULT_PROVIDER);

// ==============================
// CLIENT OFFERS (split by status)
// ==============================
export const MOCK_CLIENT_PENDING = [
  { id: 1, requestId: 2, title: "Lawn Mowing", provider: "Jane", amount: "$70", status: "pending", description: "Backyard lawn needs mowing and trimming." },
  { id: 2, requestId: 4, title: "Paint Living Room", provider: "Jan", amount: "$120", status: "pending", description: "Full living room painting with prep work." },
];

export const MOCK_CLIENT_ONGOING = [
  { id: 3, requestId: 1, title: "Fix Leaking Sink", provider: "John Smith", amount: "$45", status: "ongoing", description: "Sink in kitchen is leaking. Needs urgent repair." },
];

export const MOCK_CLIENT_HISTORY = [
  { id: 4, requestId: 3, title: "Install Ceiling Fan", provider: "Smi", amount: "$60", status: "finished", description: "Ceiling fan installation completed successfully." },
];

// ==============================
// PROVIDER OFFERS (split by status)
// ==============================
export const MOCK_PROVIDER_PENDING = [
  { id: 1, requestId: 2, title: "Lawn Mowing", client: "Doe", amount: "$70", status: "pending", description: "Backyard lawn needs mowing and trimming." },
  { id: 2, requestId: 4, title: "Paint Living Room", client: "John", amount: "$120", status: "pending", description: "Full living room painting with prep work." },
];

export const MOCK_PROVIDER_ONGOING = [
  { id: 3, requestId: 1, title: "Fix Leaking Sink", client: "Man Doe", amount: "$45", status: "ongoing", description: "Sink in kitchen is leaking. Needs urgent repair." },
];

export const MOCK_PROVIDER_HISTORY = [
  { id: 4, requestId: 3, title: "Install Ceiling Fan", client: "John", amount: "$60", status: "finished", description: "Ceiling fan installation completed successfully." },
];

// ==============================
// CHAT MOCK DATA
// ==============================
export const MOCK_CHATS = [
  { id: 1, name: "Mario Plumber", lastMsg: "I will finish the job in 3 days.", avatar: "https://randomuser.me/api/portraits/men/32.jpg", lastMsgTime: "10:24 AM" },
  { id: 2, name: "Green Thumb", lastMsg: "Thanks for accepting!", avatar: "https://randomuser.me/api/portraits/women/44.jpg", lastMsgTime: "Yesterday" },
];

export const CHAT_MESSAGES = [
  { id: 1, text: "Nah twin ts brokey", sender: "Mario Plumber" },
  { id: 2, text: "AAAAAAH HEELLL NAHHH", sender: "Self" },
];

export const ACCEPTED_OFFER = {
  requestId: 1,
  image: "https://via.placeholder.com/80",
  title: "Sink Repair Request",
  location: "Dominican Hill-Mirador, Baguio City",
  date: "Nov 28, 2025",
  price: "₱1,500",
  fullDescriptionLink: "#"
};
