// Signature colors double as placeholder "stone" swatches for each piece,
// so the catalog renders correctly with zero external image dependencies.
const products = [
  {
    id: 'p01',
    name: 'Vellai Solitaire Ring',
    category: 'Rings',
    price: 24999,
    material: '18k Gold · 0.5ct Diamond',
    swatch: '#E8C87E',
    description:
      'A single round-brilliant stone set high on a tapered gold band. Cut for everyday wear, bright enough for evenings.',
  },
  {
    id: 'p02',
    name: 'Kanni Drop Earrings',
    category: 'Earrings',
    price: 8499,
    material: '22k Gold · Ruby',
    swatch: '#8B3A3A',
    description:
      'Teardrop rubies suspended from hand-textured gold discs. Light enough to wear from morning to night.',
  },
  {
    id: 'p03',
    name: 'Nila Chain Necklace',
    category: 'Necklaces',
    price: 18999,
    material: '18k Gold Vermeil',
    swatch: '#C6A15B',
    description:
      'A fine curb chain with a crescent pendant, weighted to sit flat at the collarbone.',
  },
  {
    id: 'p04',
    name: 'Thangam Bangle Set',
    category: 'Bracelets',
    price: 15999,
    material: '22k Gold · Set of 2',
    swatch: '#D9B36A',
    description:
      'A pair of slim, softly hammered bangles designed to be stacked or worn alone.',
  },
  {
    id: 'p05',
    name: 'Mayil Halo Ring',
    category: 'Rings',
    price: 21499,
    material: '18k Gold · Emerald',
    swatch: '#2F6E52',
    description:
      'A central emerald ringed by a halo of pavé stones, inspired by the curve of a peacock feather.',
  },
  {
    id: 'p06',
    name: 'Arasi Pearl Studs',
    category: 'Earrings',
    price: 4999,
    material: 'Sterling Silver · Freshwater Pearl',
    swatch: '#EDE7DA',
    description:
      'Single freshwater pearls on a low silver setting. The everyday stud, sized to sit close to the ear.',
  },
  {
    id: 'p07',
    name: 'Ponnusai Layered Necklace',
    category: 'Necklaces',
    price: 26999,
    material: '18k Gold · Two-tier',
    swatch: '#B98B3E',
    description:
      'Two chains of different lengths, worn together, each finished with a small textured coin charm.',
  },
  {
    id: 'p08',
    name: 'Vairam Tennis Bracelet',
    category: 'Bracelets',
    price: 32999,
    material: '18k White Gold · Diamond Line',
    swatch: '#D8D3C8',
    description:
      'A continuous line of matched diamonds in a low-profile setting built for daily wear.',
  },
  {
    id: 'p09',
    name: 'Sevvani Stack Rings',
    category: 'Rings',
    price: 11499,
    material: '18k Rose Gold · Set of 3',
    swatch: '#C98F7A',
    description:
      'Three slim bands in graduated widths, sold as a set, made to be worn together or apart.',
  },
];

export const categories = ['All', 'Rings', 'Necklaces', 'Earrings', 'Bracelets'];

export default products;
