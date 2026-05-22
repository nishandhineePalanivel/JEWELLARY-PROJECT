import React from 'react';

import Zenemebangle from '../image/Zenemebangle.webp';
import Rubansset from '../image/Rubansset.webp';
import KewaiMetalBangle from '../image/KewaiMetalBangle.webp';
import DiamondLook from '../image/DiamondLook.webp';
import BeverlyHills from '../image/BeverlyHills.webp';
import Anoukset from '../image/Anoukset.webp';

const bangles = [
  { name: 'Elegant Wave Bangle', price: 1850, image: Zenemebangle },
  { name: 'Royal Heritage Gold', price: 6200, image: Rubansset },
  { name: 'Silken Shine Style', price: 3300, image: KewaiMetalBangle },
  { name: 'Designer Charm Set', price: 4600, image: DiamondLook },
  { name: 'Twist Thread Fusion', price: 2500, image: BeverlyHills },
  { name: 'Modern Elegance', price: 3400, image: Anoukset }
];

// Inline style for Buy Now button
const buyNowStyle = {
  backgroundColor: '#000',
  color: '#fff',
  border: '2px solid #000',
  padding: '8px 16px',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '500',
  cursor: 'pointer',
  transition: '0.3s'
};

const Bangle = () => {
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">✨ Bangle Collection</h2>

      <div className="row">
        {bangles.map((bangle, index) => (
          <div className="col-md-4 col-sm-6 mb-4" key={index}>
            <div className="card h-100 shadow-sm">

              <img
                src={bangle.image}
                alt={bangle.name}
                className="card-img-top"
              />

              <div className="card-body text-center">
                <h5 className="card-title">{bangle.name}</h5>

                <p className="fw-bold text-success">
                  ₹{bangle.price}
                </p>

                <button
                  style={buyNowStyle}
                  onMouseOver={e => {
                    e.target.style.backgroundColor = '#fff';
                    e.target.style.color = '#000';
                  }}
                  onMouseOut={e => {
                    e.target.style.backgroundColor = '#000';
                    e.target.style.color = '#fff';
                  }}
                >
                  Buy Now
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bangle;

