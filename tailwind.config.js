/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14110F",
        ivory: "#F3ECE0",
        gold: "#C6A15B",
        goldbright: "#E8C87E",
        emerald: "#1E362E",
        rosewood: "#6B3F3F",
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        body: ["'Jost'", "sans-serif"],
        mono: ["'Space Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
