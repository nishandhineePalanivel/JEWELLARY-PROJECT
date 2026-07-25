import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-ink/95 backdrop-blur border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl tracking-wide text-ivory">
          ANAYA <span className="text-gold">JEWELS</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest text-ivory/80">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `hover:text-gold transition-colors ${isActive ? 'text-gold' : ''}`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-ivory hover:text-gold transition-colors" aria-label="View cart">
            <FiShoppingBag size={22} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-ink text-xs font-mono-brand rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            className="md:hidden text-ivory"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </nav>

      {open && (
        <ul className="md:hidden bg-ink border-t border-white/10 px-6 py-4 flex flex-col gap-4 text-ivory/90 uppercase tracking-widest text-sm">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} onClick={() => setOpen(false)} className="hover:text-gold">
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
