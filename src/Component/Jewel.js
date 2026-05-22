import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../image/Jewel.avif';
import './Jewel.css'; // Optional if you want extra custom styles

const JewelNavbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ backgroundColor: '#1a1a1a', padding: '12px 30px' }}>
      <Link className="navbar-brand d-flex align-items-center" to="/">
        <img
          src={logo}
          alt="Jewellery Junction Logo"
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            marginRight: '14px',
            border: '2px solid white',
          }}
        />
        <span style={{ fontSize: '1.7rem', fontWeight: '700', letterSpacing: '1px', color: '#f8f8f8' }}>
          NEELA JEWELLARY
        </span>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon" />
      </button>

      <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul className="navbar-nav" style={{ gap: '22px' }}>
          <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/bangle">Bangle</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/chain">Chain & Necklace</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/earrings">Earrings</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/anklets">Anklets</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/buy">Buy Now</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/faq">FAQ</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/create">Create Account</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/signin">Sign In</Link></li>
          <li className="nav-item"><Link className="nav-link" to="/contact">Contact Us</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default JewelNavbar;