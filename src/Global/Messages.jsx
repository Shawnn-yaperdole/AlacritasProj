// src/Global/Messages.jsx
import React, { useState, useEffect, useRef } from "react";
import { MOCK_CHATS, CHAT_MESSAGES, ACCEPTED_OFFER, MOCK_CLIENT, MOCK_PROVIDER } from "../Sample/MockData";
import { sendMessage, subscribeToChatMessages, subscribeToChats, createChat } from "../lib/firebase";
import ChatBubble from "./ChatBubble";

const MessagesPage = ({ userRole = 'client' }) => {
  const [chats, setChats] = useState(MOCK_CHATS);
  const [selectedChatId, setSelectedChatId] = useState(chats[0]?.id || null);
  const [search, setSearch] = useState("");
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newError, setNewError] = useState("");

  const selectedChat = chats.find((c) => c.id === selectedChatId);
  const currentUserPic = userRole === 'client' ? MOCK_CLIENT.profilePic : MOCK_PROVIDER.profilePic;
  const [localUserId, setLocalUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesRef = useRef(null);

  // subscribe to available chats (meta) so both clients share the same list
  useEffect(() => {
    const unsub = subscribeToChats((list) => {
      if (!list || !list.length) return;
      setChats(list);
      if (!selectedChatId) setSelectedChatId(list[0].id);
    });

    return () => { try { unsub && unsub(); } catch (e) {} };
  }, []);

  // establish a local user id to identify sent messages reliably across devices
  useEffect(() => {
    try {
      const key = 'alacritas_user_id';
      let id = null;
      if (typeof window !== 'undefined' && window.localStorage) {
        id = window.localStorage.getItem(key);
        if (!id) {
          id = 'user-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
          window.localStorage.setItem(key, id);
        }
      } else {
        id = 'user-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
      }
      setLocalUserId(id);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('Failed to establish local user id', e);
      setLocalUserId('user-' + Date.now());
    }
  }, []);

  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      return undefined;
    }

    const unsubscribe = subscribeToChatMessages(selectedChatId, (msgs) => {
      // debug: log incoming messages for troubleshooting
      // eslint-disable-next-line no-console
      console.debug('subscribeToChatMessages:', selectedChatId, msgs);
      setMessages(msgs || []);
      // scroll to bottom on new messages (next tick)
      setTimeout(() => {
        try {
          if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        } catch (e) {
          // ignore
        }
      }, 50);
    });

    return () => {
      try { unsubscribe && unsubscribe(); } catch (e) { /* ignore */ }
    };
  }, [selectedChatId]);

  const handleSend = async () => {
    if (!inputValue || !selectedChatId) return;
    const text = inputValue.trim();
    if (!text) return;
    const msg = { text, sender: 'Self', senderRole: userRole, senderId: localUserId, timestamp: Date.now() };
    try {
      await sendMessage(selectedChatId, msg);
      // eslint-disable-next-line no-console
      console.debug('sent message', selectedChatId, msg);
      setInputValue('');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to send message', err);
      // fallback to local append
      setMessages((prev) => [...prev, { id: 'local-' + Date.now(), ...msg }]);
      setInputValue('');
    }
  };

  return (
    <div className="messages-fullscreen flex w-screen h-screen">
      {/* Chat List */}
      <div className="chat-list flex-shrink-0 w-80 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        <div className="chat-header p-3 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input w-full rounded border px-3 py-2"
          />
          <div className="mt-2 flex gap-2 items-center">
            <button className="action-btn px-3 py-1" onClick={() => setShowNewForm(s => !s)}>{showNewForm ? 'Cancel' : 'New Chat'}</button>
          {showNewForm && (
            <div className="w-full mt-2 p-2 border rounded bg-white">
              <input className="w-full mb-1 p-1 border rounded" placeholder="Chat name" value={newName} onChange={(e) => { setNewName(e.target.value); setNewError(''); }} />
              <input className="w-full mb-1 p-1 border rounded" placeholder="Avatar URL (optional)" value={newAvatar} onChange={(e) => setNewAvatar(e.target.value)} />
              <input className="w-full mb-1 p-1 border rounded" placeholder="Initial message (optional)" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
              {newError && <div className="text-sm text-red-600 mb-2">{newError}</div>}
              <div className="flex justify-end">
                <button
                  className="action-btn px-3 py-1"
                  onClick={async () => {
                    if (!newName) { setNewError('Please provide a chat name'); return; }
                    try {
                      const chatId = await createChat({ name: newName, avatar: newAvatar });
                      // send initial message if provided
                      if (newMessage && chatId) {
                        await sendMessage(chatId, { text: newMessage, sender: 'Self', senderRole: userRole, senderId: localUserId, timestamp: Date.now() });
                      }
                      setNewName(''); setNewAvatar(''); setNewMessage(''); setShowNewForm(false);
                      setSelectedChatId(chatId);
                    } catch (e) {
                      // eslint-disable-next-line no-console
                      console.error('Failed to create chat', e);
                      setNewError('Failed to create chat. See console for details.');
                    }
                  }}
                >Create</button>
              </div>
            </div>
          )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0">
          {chats
            .filter((chat) =>
              chat.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((chat) => (
              <div
                key={chat.id}
                className={`chat-item flex items-center gap-3 p-3 cursor-pointer transition-colors rounded ${
                  selectedChatId === chat.id ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
                onClick={() => setSelectedChatId(chat.id)}
              >
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 flex flex-col min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-gray-800 truncate">
                      {chat.name}
                    </p>
                    <span className="text-xs text-gray-400 ml-2">
                      {chat.lastMsgTime}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm truncate">{chat.lastMsg}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="chat-window flex-1 flex flex-col bg-gray-50 min-h-0">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="chat-window-header flex items-center gap-2 p-3 border-b border-gray-200">
              <button
                onClick={() => setSelectedChatId(null)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                }}
              >
                &larr;
              </button>
              <span className="font-bold">{selectedChat.name}</span>
            </div>

            {/* Accepted Offer Card */}
            <div className="accepted-offer-card flex items-start gap-4 p-4 bg-white border-b border-gray-200">
              <img
                src={ACCEPTED_OFFER.image}
                alt="Issue thumbnail"
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1 flex flex-col min-w-0">
                <h3 className="font-bold text-lg">{ACCEPTED_OFFER.title}</h3>
                <p className="text-gray-500 text-sm">
                  {ACCEPTED_OFFER.location} • {ACCEPTED_OFFER.date}
                </p>
                <p className="text-green-600 font-semibold mt-1">
                  Accepted Price: {ACCEPTED_OFFER.price}
                </p>
                <a
                  href={ACCEPTED_OFFER.fullDescriptionLink}
                  className="text-blue-500 text-sm mt-2 hover:underline"
                >
                  View full description
                </a>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="chat-content flex-1 flex flex-col p-4 overflow-y-auto gap-2 min-h-0" ref={messagesRef}>
              {(messages.length ? messages : CHAT_MESSAGES).map((msg) => {
                const isSent = (msg.senderId && localUserId && msg.senderId === localUserId) || (msg.senderRole && msg.senderRole === userRole) || msg.sender === 'Self' || msg.sender === 'Me';
                return (
                  <ChatBubble
                    key={msg.id || msg.timestamp}
                    msg={msg}
                    isSent={isSent}
                    currentUserPic={currentUserPic}
                    chatAvatar={selectedChat?.avatar}
                    userRole={userRole}
                  />
                );
              })}
            </div>

            {/* Input */}
            <div className="chat-input-area flex p-3 gap-2 border-t border-gray-200">
              <input
                type="text"
                placeholder="Type a message..."
                className="chat-input flex-1 px-3 py-2 rounded border"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <button className="action-btn post px-4 py-2" onClick={handleSend}>Send</button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <p>Select a chat</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
