// src/Sample/MockData.js

// ==============================
// CLIENT MOCK DATA
// ==============================
const _DEFAULT_CLIENT = {
  profilePic: "https://via.placeholder.com/200",
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+123456789",
  location: "123 Main St, Springfield",
  communities: ["Gardening Club", "Plumbing Forum"],
  defaultCommunity: "Gardening Club",
  bio: "Hello! I love connecting with providers to get things done.",
};

// If a saved profile exists in localStorage, merge it so updates persist across pages/reloads
function loadSavedProfile(key, defaults) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return { ...defaults };
    const raw = window.localStorage.getItem(key);
    if (!raw) return { ...defaults };
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('Failed to load saved profile from localStorage', e);
    return { ...defaults };
  }
}

export const MOCK_CLIENT = loadSavedProfile('alacritas_profile_client', _DEFAULT_CLIENT);

export const MOCK_CLIENT_REQUESTS = [
  {
    id: 1,
    title: "Fix Leaking Sink",
    type: "Plumbing Forum",
    date: "2023-10-25",
    location: "123 Main St, Springfield",
    status: "accepted",
    description: "Sink in kitchen is leaking. Needs urgent repair.",
    thumbnail: "https://via.placeholder.com/150x100?text=Sink",
  },
  {
    id: 2,
    title: "Lawn Mowing",
    type: "Gardening Club",
    date: "2023-10-26",
    location: "456 Elm St, Springfield",
    status: "pending",
    description: "Backyard lawn needs mowing and trimming.",
    thumbnail: "https://via.placeholder.com/150x100?text=Lawn",
  },
  {
    id: 3,
    title: "Install Ceiling Fan",
    type: "Electrical",
    date: "2023-10-27",
    location: "789 Oak St, Springfield",
    status: "accepted",
    description: "Install a ceiling fan in the living room.",
    thumbnail: "https://via.placeholder.com/150x100?text=Fan",
  },
  {
    id: 4,
    title: "Paint Living Room",
    type: "Painting Network",
    date: "2023-10-28",
    location: "321 Pine St, Springfield",
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
  location: "456 Oak St, Springfield",
  communities: ["Electricians Hub", "Painting Network", "Plumbing Forum", "Gardening Club"],
  defaultCommunity: "Electricians Hub",
  bio: "Experienced provider ready to help!",
  skills: [
    { name: "Plumbing", verified: true },
    { name: "Electrical", verified: false },
    { name: "Painting", verified: true },
    { name: "Gardening", verified: true },
  ],
};

export const MOCK_PROVIDER = loadSavedProfile('alacritas_profile_provider', _DEFAULT_PROVIDER);



// ==============================
// OFFERS MOCK DATA
// ==============================

// Client offers
export const MOCK_CLIENT_PENDING = [
  {
    id: 1,
    requestId: 1, // link to "Fix Leaking Sink"
    title: "Leaky Faucet",
    provider: "Mario",
    amount: "$45",
    status: "pending",
    description: "Fix the faucet in the kitchen sink.",
  },
];

export const MOCK_CLIENT_ONGOING = [
  {
    id: 5,
    requestId: 2, // link to "Lawn Mowing"
    title: "Garden Cleanup",
    provider: "Luigi",
    amount: "$70",
    status: "ongoing",
    description: "Clean the backyard and trim hedges.",
  },
];

export const MOCK_CLIENT_HISTORY = [
  {
    id: 2,
    requestId: 3, // link to "Install Ceiling Fan"
    title: "Toilet Repair",
    provider: "Luigi",
    amount: "$60",
    status: "accepted",
    description: "Repair leaking toilet.",
  },
];

// Provider offers
export const MOCK_PROVIDER_PENDING = [
  {
    id: 3,
    requestId: 2, // link to "Lawn Mowing"
    title: "Pipe Fix Offer",
    client: "Alice",
    amount: "$80",
    status: "pending",
    description: "Fix the leaking pipes in the bathroom.",
  },
];

export const MOCK_PROVIDER_ONGOING = [
  {
    id: 6,
    requestId: 1, // link to "Fix Leaking Sink"
    title: "Window Repair",
    client: "Bob",
    amount: "$100",
    status: "ongoing",
    description: "Repair broken window in the living room.",
  },
];

export const MOCK_PROVIDER_HISTORY = [
  {
    id: 4,
    requestId: 3, // link to "Install Ceiling Fan"
    title: "Kitchen Sink",
    client: "Bob",
    amount: "$120",
    status: "denied",
    description: "Fix kitchen sink plumbing.",
  },
];

// ==============================
// CHAT MOCK DATA
// ==============================
export const MOCK_CHATS = [
  { id: 1, name: "Mario Plumber", lastMsg: "I sent a new offer, let me know what you think.", avatar: "https://randomuser.me/api/portraits/men/32.jpg", lastMsgTime: "10:24 AM" },
  { id: 2, name: "Green Thumb", lastMsg: "Thanks for accepting!", avatar: "https://randomuser.me/api/portraits/women/44.jpg", lastMsgTime: "Yesterday" },
];

export const CHAT_MESSAGES = [
  { id: 1, text: "Hi, I saw your request for sink repair...", sender: "Mario Plumber" },
  { id: 2, text: "What's your best offer?", sender: "Self" },
];

export const ACCEPTED_OFFER = {
  image: "https://via.placeholder.com/80",
  title: "Sink Repair Request",
  location: "123 Main St, Manila",
  date: "Nov 28, 2025",
  price: "₱1,500",
  fullDescriptionLink: "#"
};
