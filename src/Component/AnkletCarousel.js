// src/Component/AnkletCarousel.js

import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import Anklet1 from '../image/Anklet1.jpg';
import Anklet2 from '../image/Anklet2.jpg';
import Anklet3 from '../image/Anklet3.jpg';
import Anklet4 from '../image/Anklet4.jpg';
import Anklet5 from '../image/Anklet5.jpg';
import Anklet6 from '../image/Anklet6.jpg';

const anklets = [
  { name: 'Silver Sparkle', price: '₹50', image: Anklet1 },
  { name: 'Pearl Payal', price: '₹950', image: Anklet2 },
  { name: 'Traditional Bells', price: '₹1,200', image: Anklet3 },
  { name: 'Kundan Anklet', price: '₹1,400', image: Anklet4 },
  { name: 'Oxidized Pair', price: '₹780', image: Anklet5 },
  { name: 'Golden Charm', price: '₹1,100', image: Anklet6 },
];

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 768, min: 0 },
    items: 1
  }
};

// Inline styles (IMAGE SIZE FIXED)
const cardStyle = {
  background: '#fff',
  borderRadius: '10px',
  padding: '15px',
  textAlign: 'center',
  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
  margin: '10px'
};

const imageStyle = {
  width: '100%',
  height: '220px',      // FIXED HEIGHT
  objectFit: 'cover',   // NO DISTORTION
  borderRadius: '8px',
  marginBottom: '10px'
};

const buttonStyle = {
  backgroundColor: '#000',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: '0.3s'
};

const AnkletCarousel = () => {
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">✨ Elegant Anklets Collection</h2>

      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={3000}
        keyBoardControl
      >
        {anklets.map((anklet, index) => (
          <div key={index} style={cardStyle}>
            
            <img
              src={anklet.image}
              alt={anklet.name}
              style={imageStyle}
            />

            <h5>{anklet.name}</h5>
            <p style={{ fontWeight: 'bold', color: 'green' }}>
              {anklet.price}
            </p>

            <button
              style={buttonStyle}
              onMouseOver={e => {
                e.target.style.backgroundColor = '#fff';
                e.target.style.color = '#000';
                e.target.style.border = '1px solid #000';
              }}
              onMouseOut={e => {
                e.target.style.backgroundColor = '#000';
                e.target.style.color = '#fff';
                e.target.style.border = 'none';
              }}
            >
              Buy Now
            </button>

          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default AnkletCarousel;
