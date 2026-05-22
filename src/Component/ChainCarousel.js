import React from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

import chain1 from '../image/Chain1.jpg';
import chain2 from '../image/Chain2.jpg';
import chain3 from '../image/Chain3.jpg';
import chain4 from '../image/Chain4.jpg';
import chain5 from '../image/Chain5.jpg';
import chain6 from '../image/Chain6.jpg';

const items = [
  { image: chain1, title: 'Elegant Gold Chain' },
  { image: chain2, title: 'Royal Pearl Necklace' },
  { image: chain3, title: 'Sparkling Choker' },
  { image: chain4, title: 'Temple Heritage Design' },
  { image: chain5, title: 'Modern Layered Style' },
  { image: chain6, title: 'Antique Diamond Drop' },
];

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet:  { breakpoint: { max: 1024, min: 768 }, items: 2 },
  mobile:  { breakpoint: { max: 768, min: 0 }, items: 1 },
};

const ChainCarousel = () => {
  return (
    <div style={{ padding: '40px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        ✨ Elegant Chains & Necklaces
      </h2>

      <Carousel
        responsive={responsive}
        infinite
        autoPlay={false}
        showDots={false} // 👈 Hides the dots
        keyBoardControl
        containerClass="carousel-container"
        itemClass="carousel-item-padding-40-px"
      >
        {items.map((item, index) => (
          <div key={index} style={{ textAlign: 'center', padding: '15px' }}>
            <img
              src={item.image}
              alt={item.title}
              style={{
                width: '100%',
                height: '280px',
                objectFit: 'cover',
                borderRadius: '12px',
                marginBottom: '10px',
              }}
            />
            <h5>{item.title}</h5>
            <button
              style={{
                marginTop: '8px',
                padding: '6px 18px',
                borderRadius: '5px',
                border: 'none',
                backgroundColor: '#000',
                color: '#fff',
                cursor: 'pointer',
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

export default ChainCarousel;