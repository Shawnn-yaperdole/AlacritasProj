// src/Sample/MockData.js

// ==============================
// CLIENT MOCK DATA
// ==============================

export const MOCK_CLIENT = {
  profilePic: "https://via.placeholder.com/200",
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+123456789",
  location: "123 Main St, Springfield",
  communities: ["Gardening Club", "Plumbing Forum"],
  defaultCommunity: "Gardening Club",
  bio: "Hello! I love connecting with providers to get things done.",
};

export const MOCK_CLIENT_REQUESTS = [
  {
    id: 1,
    title: "Fix Leaking Sink",
    type: "Plumbing",
    date: "2023-10-25",
    location: "123 Main St, Springfield",
    status: "accepted",
    thumbnail: "https://via.placeholder.com/80x80?text=Sink",
  },
  {
    id: 2,
    title: "Lawn Mowing",
    type: "Gardening",
    date: "2023-10-26",
    location: "456 Elm St, Springfield",
    status: "pending",
    thumbnail: "https://via.placeholder.com/80x80?text=Lawn",
  },
  {
    id: 3,
    title: "Install Ceiling Fan",
    type: "Electrical",
    date: "2023-10-27",
    location: "789 Oak St, Springfield",
    status: "accepted",
    thumbnail: "https://via.placeholder.com/80x80?text=Fan",
  },
  {
    id: 4,
    title: "Paint Living Room With Extra Long Description That Might Overflow",
    type: "Painting",
    date: "2023-10-28",
    location: "321 Pine St, Springfield",
    status: "pending",
    thumbnail: "https://via.placeholder.com/80x80?text=Paint",
  },
];

// ==============================
// PROVIDER MOCK DATA
// ==============================

export const MOCK_PROVIDER = {
  profilePic: "https://via.placeholder.com/200",
  fullName: "Jane Smith",
  email: "jane@example.com",
  phone: "+987654321",
  location: "456 Oak St, Springfield",
  communities: ["Electricians Hub", "Painting Network"],
  defaultCommunity: "Electricians Hub",
  bio: "Experienced provider ready to help!",
  skills: [
    { name: "Plumbing", verified: true },
    { name: "Electrical", verified: false },
    { name: "Painting", verified: true },
  ],
};

// ==============================
// OFFERS MOCK DATA
// ==============================

// Client offers
export const MOCK_CLIENT_PENDING = [
  {
    id: 1,
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

