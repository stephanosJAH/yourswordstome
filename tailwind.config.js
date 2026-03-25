/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#BFDBFE',
          DEFAULT: '#60A5FA',
          dark: '#2563EB',
        },
        secondary: '#D4AF37',
        accent: '#3B82F6',
        'light-bg': '#F7F8FA',
        'light-text': '#111827',
        'light-subtle': '#4B5563',
        'background-light': '#F3F4F6',
        'background-dark': '#111827',
        background: '#F7F8FA',
        text: '#111827',
        success: '#48BB78',
        error: '#F56565',
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        inter: ['Inter', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        montserrat: ['Montserrat', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive'],
        lato: ['Lato', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
        'large': '1.5rem',
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'fade-in': 'fadeIn 1.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
    },
  },
  plugins: [],
}
