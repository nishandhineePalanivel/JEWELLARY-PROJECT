import React from 'react';

// A single line-drawing of a chain + teardrop pendant that draws itself on load.
// This is the brand's signature mark — reused small in the footer as a divider.
export default function Pendant({ className = '', animate = true }) {
  return (
    <svg
      viewBox="0 0 220 320"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        className={animate ? 'pendant-path' : ''}
        d="M40 20
           C 40 60, 70 70, 110 70
           C 150 70, 180 60, 180 20
           M110 70
           C 105 100, 95 120, 95 150
           C 95 190, 120 210, 120 250
           C 120 285, 100 300, 80 300
           C 60 300, 45 285, 45 260
           C 45 235, 65 225, 85 235
           C 100 242, 100 260, 88 268"
        stroke="#C6A15B"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="40" cy="20" r="3" fill="#C6A15B" />
      <circle cx="180" cy="20" r="3" fill="#C6A15B" />
    </svg>
  );
}
