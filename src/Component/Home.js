import React from 'react';
import Bangle from './Bangle';
import ChainCarousel from './ChainCarousel';
import Earing from './Earing';
import AnkletCarousel from './AnkletCarousel';

const Home = () => {
  return (
    <div>
      <h2 style={{ textAlign: 'center', margin: '30px 0' }}>💎 Welcome to Neela Jewellary</h2>
      <Bangle />
      <ChainCarousel />
      <Earing />
      <AnkletCarousel />
    </div>
  );
};

export default Home;