// src/components/Header.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center font-sans">
      <div className="text-2xl">PS Ticketing Tool</div>
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
        <FontAwesomeIcon icon={faBars} />
      </button>
      <nav className={`${isOpen ? 'block' : 'hidden'} md:flex`}>
        <Link to="/" className="block px-4 py-2">Form</Link>
        <Link to="/login" className="block px-4 py-2">Login</Link>
        <Link to="/resolved-tickets" className="block px-4 py-2">Resolved Tickets</Link>
      </nav>
    </header>
  );
};

export default Header;