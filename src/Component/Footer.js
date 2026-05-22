import React from 'react';
import { FaFacebookF, FaInstagram } from 'react-icons/fa';
import './Footer.css'; // Optional for additional styling

const Footer = () => {
  return (
    <footer className="text-white py-4" style={{ backgroundColor: '#000', marginTop: '60px' }}>
      <div className="container text-center">
        <div className="mb-3">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white me-3"
            style={{ fontSize: '1.5rem' }}
          >
            <FaFacebookF />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white"
            style={{ fontSize: '1.5rem' }}
          >
            <FaInstagram />
          </a>
        </div>
        <p className="mb-0" style={{ fontSize: '14px' }}>
          © 2026 <strong>Luxurious</strong>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;