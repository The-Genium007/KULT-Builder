/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{vue,js,ts}',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './plugins/**/*.{js,ts}',
    './error.vue'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif']
      },
      colors: {
        ink: '#0b0c10',
        blood: '#b31b3f',
        ash: '#c5c6c7',
        iron: '#1f2833',
        ember: '#d1785c'
      },
      boxShadow: {
        glow: '0 0 30px rgba(179, 27, 63, 0.35)'
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
