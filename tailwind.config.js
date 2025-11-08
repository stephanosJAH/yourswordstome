/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4A5568',
        secondary: '#D4AF37',
        accent: '#667EEA',
        background: '#F7FAFC',
        text: '#1A202C',
        success: '#48BB78',
        error: '#F56565',
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive'],
        lato: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
