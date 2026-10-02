/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0B0C10',
          darker: '#07080A',
          surface: '#13151D',
          card: '#1A1C25',
          cardHover: '#212430',
          border: '#272B38',
          borderLight: '#373D4F',
          gold: {
            DEFAULT: '#C5A880',
            light: '#E2CDB2',
            dark: '#9F835B',
            glow: 'rgba(197, 168, 128, 0.25)',
          },
          muted: '#8E94A5',
          light: '#FAF9F6',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        display: ['Cinzel', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px rgba(197, 168, 128, 0.18)',
        'gold-sm': '0 0 10px rgba(197, 168, 128, 0.15)',
        'luxury': '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 0%, rgba(197, 168, 128, 0.08) 0%, transparent 70%)',
        'gold-gradient': 'linear-gradient(135deg, #C5A880 0%, #E2CDB2 50%, #9F835B 100%)',
      }
    },
  },
  plugins: [],
}
