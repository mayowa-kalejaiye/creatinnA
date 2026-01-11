/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Zinc palette (Tailwind default)
        zinc: require('tailwindcss/colors').zinc,
        // Accent gold for CreatINN
        'accent-gold': '#d4af37',
      },
    },
  },
  plugins: [],
}
