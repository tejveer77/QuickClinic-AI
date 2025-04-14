/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        midnightBlue: "#1E1E2E",
        frostWhite: "#F8FAFC",
        electricTeal: "#2EE5C4",
        slateGray: "#94A3B8",
        vibrantPurple: "#A855F7",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
      },
    },
  },
  plugins: [],
};