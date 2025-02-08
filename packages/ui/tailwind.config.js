/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        geistSans: ["GeistSans", "sans-serif"],
        geistMono: ["GeistMono", "monospace"],
      },
    },
  },
  plugins: [],
};
