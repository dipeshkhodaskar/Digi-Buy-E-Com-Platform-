/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2A5CAA',   // Custom primary color
        secondary: '#FFFFFF', // Custom secondary color
        accent: '#F97316',    // Custom accent color
        text: '#333333'
      },
    },
  },
  plugins: [],
};
