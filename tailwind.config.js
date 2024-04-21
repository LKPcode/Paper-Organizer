/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "rgb(250, 250, 250)",
        "secondary": "rgb(233, 233, 233)",
        "lighter": "#f9fafa",
        // "accent": "#fbbf24",
        "accent": "#f43f5e",       
        // "accent": "#fb7185",
      }
    },
  },
  plugins: [],
}