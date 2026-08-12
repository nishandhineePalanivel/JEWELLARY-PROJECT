import ring1 from '../assets/ring1.jpg';
import ring2 from '../assets/ring2.jpg';
import ring3 from '../assets/ring3.jpg';
import necklaceImg from '../assets/necklace.jpg';
import earringImg from '../assets/earring.jpg';
import braceletImg from '../assets/bracelet.jpg';
import bangleImg from '../assets/bangle.jpg';
import pendantImg from '../assets/pendant.jpg';

const products = [
  { id: 'p01', name: 'Vellai Solitaire Ring', category: 'Rings', price: 24999, material: '18k Gold · 0.5ct Diamond', swatch: '#E8C87E', image: ring1, description: 'A single round-brilliant stone set high on a tapered gold band.' },
  { id: 'p05', name: 'Mayil Halo Ring', category: 'Rings', price: 21499, material: '18k Gold · Emerald', swatch: '#2F6E52', image: ring2, description: 'A central emerald ringed by a halo of pavé stones.' },
  { id: 'p09', name: 'Sevvani Stack Rings', category: 'Rings', price: 11499, material: '18k Rose Gold · Set of 3', swatch: '#C98F7A', image: ring3, description: 'Three slim bands in graduated widths, sold as a set.' },
  { id: 'p10', name: 'Nila Crescent Necklace', category: 'Necklaces', price: 38999, material: '18k Gold', swatch: '#E8C87E', image: necklaceImg, description: 'A fluid gold chain holding a hand-textured crescent moon pendant.' },
  { id: 'p11', name: 'Ponnusai Layered Choker', category: 'Necklaces', price: 44999, material: '18k Yellow Gold', swatch: '#E8C87E', image: necklaceImg, description: 'Double strand gold necklace with polished coin drops.' },
  { id: 'p12', name: 'Kanni Ruby Drop Earrings', category: 'Earrings', price: 28499, material: '22k Gold · Natural Ruby', swatch: '#9B2335', image: earringImg, description: 'Handcrafted gold earrings featuring vivid natural ruby teardrops.' },
  { id: 'p13', name: 'Arasi Pearl Studs', category: 'Earrings', price: 14999, material: '18k White Gold · AAA Pearl', swatch: '#F5F5F0', image: earringImg, description: 'Lustrous AAA grade freshwater pearl studs on white gold posts.' },
  { id: 'p14', name: 'Vairam Tennis Bracelet', category: 'Bracelets', price: 89999, material: 'Platinum · 2.5ct Diamond', swatch: '#C0C0C0', image: braceletImg, description: 'A seamless row of 48 round brilliant cut diamonds.' },
  { id: 'p15', name: 'Thangam Gold Bangles', category: 'Bangles', price: 65999, material: '22k Gold · Set of 2', swatch: '#E8C87E', image: bangleImg, description: 'Set of 2 royal gold bangles with hand-engraved floral motifs.' },
  { id: 'p16', name: 'Ganesha Divine Pendant', category: 'Pendants', price: 21999, material: '22k Yellow Gold · Ruby Accent', swatch: '#E8C87E', image: pendantImg, description: 'Intricately molded Lord Ganesha pendant with ruby eye accents.' },
];

export default products;
