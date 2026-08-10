// Signature colors double as placeholder "stone" swatches for each piece,
// so the catalog renders correctly with zero external image dependencies.


import ring1 from '../assets/ring1.jpg';
import ring2 from '../assets/ring2.jpg';
import ring3 from '../assets/ring3.jpg';

const products = [
  
  {
    id: 'p01',
    name: 'Vellai Solitaire Ring',
    category: 'Rings',
    price: 24999,
    material: '18k Gold · 0.5ct Diamond',
    swatch: '#E8C87E',
    image: ring1,
    description:
      'A single round-brilliant stone set high on a tapered gold band. Cut for everyday wear, bright enough for evenings.',
  },

  {
    id: 'p05',
    name: 'Mayil Halo Ring',
    category: 'Rings',
    price: 21499,
    material: '18k Gold · Emerald',
    swatch: '#2F6E52',
    image: ring2,
    description:
      'A central emerald ringed by a halo of pavé stones, inspired by the curve of a peacock feather.',
  },

  {
    id: 'p09',
    name: 'Sevvani Stack Rings',
    category: 'Rings',
    price: 11499,
    material: '18k Rose Gold · Set of 3',
    swatch: '#C98F7A',
    image: ring3,
    description:
      'Three slim bands in graduated widths, sold as a set, made to be worn together or apart.',
  },
];

export const categories = [
  'All',
  'Rings',
  'Necklaces',
  'Earrings',
  'Bracelets'
];

export default products;