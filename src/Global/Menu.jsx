// src/Global/Menu.jsx
import React from 'react';

const Menu = ({ isOpen, close, logout }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={close}></div>
      )}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white p-6 flex flex-col gap-4 z-50 transform transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } shadow-lg`}
      >
        <button className="self-end text-2xl" onClick={close}>×</button>
        <button className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600" onClick={logout}>
          Logout
        </button>
        <button className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300">Profile</button>
        <button className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300">Settings</button>
      </div>
    </>
  );
};

export default Menu;
