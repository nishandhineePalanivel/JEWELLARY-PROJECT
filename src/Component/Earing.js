import React from 'react';
import './Jewel.css';

import Earing1 from '../image/Earing1.jpg';
import Earing2 from '../image/Earing2.jpg';
import Earing3 from '../image/Earing3.jpg';
import Earing4 from '../image/Earing4.webp';
import Earing5 from '../image/Earing5.jpg';
import Earing6 from '../image/Earing6.jpg';

const earrings = [
  { name: 'Sunlit Pearl Drops', price: 1890, image: Earing1 },
  { name: 'Crimson Gold Hoops', price: 2099, image: Earing2 },
  { name: 'Vintage Star Studs', price: 1490, image: Earing3 },
  { name: 'Diamond Touch Drop', price: 2690, image: Earing4 },
  { name: 'Rose Loop Charms', price: 1750, image: Earing5 },
  { name: 'Classic Twin Dangles', price: 1950, image: Earing6 },
];

const Earring = () => {
  return (
    <div className="bangle-container">
      <h2 className="bangle-title">✨ Excellent Earrings Collection</h2>
      <div className="bangle-grid">
        {earrings.map((item, index) => (
          <div className="bangle-card" key={index}>
            <img src={item.image} alt={item.name} className="bangle-img" />
            <h3>{item.name}</h3>
            <p>Price: ₹{item.price}</p>
            <button className="buy-btn">Buy Now</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Earring;