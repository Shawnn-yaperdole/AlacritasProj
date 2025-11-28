// src/Global/Menu.jsx

import React from 'react';

const Menu = ({ isOpen, close, logout }) => {
  // Toggle visibility using a simple conditional render
  if (!isOpen) return null;

  return (
    <div className="menu-overlay" onClick={close}>
      {/* Prevent clicks inside the menu from closing the overlay */}
      <div className="side-menu" onClick={(e) => e.stopPropagation()}>
        <div className="close-menu" onClick={close}>
          &times;
        </div>

        <h2>Menu</h2>

        <div className="menu-item">Account Settings</div>
        <div className="menu-item">Preferences</div>
        <div className="menu-item">Get Help</div>

        <div
          className="menu-item"
          onClick={logout}
          style={{ color: 'red', cursor: 'pointer' }}
        >
          Log Out
        </div>
      </div>
    </div>
  );
};

export default Menu;
