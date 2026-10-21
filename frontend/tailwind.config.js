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
          dark: '#F1F2F4', // Flipkart Light Page Background
          darker: '#E4E7EB',
          surface: '#FFFFFF', // Pure White Cards & Containers
          card: '#FFFFFF',
          cardHover: '#F8FAFC',
          border: '#E0E0E0', // Subtle clean border
          borderLight: '#CBD5E1',
          gold: {
            DEFAULT: '#2874F0', // Flipkart Royal Blue
            light: '#5B95F5',
            dark: '#1B5ECC',
            glow: 'rgba(40, 116, 240, 0.18)',
          },
          blue: {
            DEFAULT: '#2874F0',
            dark: '#1B5ECC',
            light: '#5B95F5',
          },
          orange: {
            DEFAULT: '#FB641B', // Flipkart Orange (Buy Now / Cart)
            light: '#FF7A38',
            dark: '#E04F09',
          },
          yellow: {
            DEFAULT: '#FF9F00', // Flipkart Amber / Plus Star
            light: '#FFB833',
            dark: '#E68F00',
          },
          green: {
            DEFAULT: '#388E3C', // Flipkart Success / Rating Green
            light: '#4CAF50',
            dark: '#2E7D32',
          },
          muted: '#878787', // Flipkart Secondary Gray Text
          light: '#FFFFFF',
          white: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'Roboto', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        display: ['Plus Jakarta Sans', 'Cinzel', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(40, 116, 240, 0.20)',
        'gold-sm': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'luxury': '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        'flipkart': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'flipkart-card': '0 2px 4px 0 rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at 50% 0%, rgba(40, 116, 240, 0.05) 0%, transparent 70%)',
        'gold-gradient': 'linear-gradient(135deg, #2874F0 0%, #5B95F5 50%, #1B5ECC 100%)',
      }
    },
  },
  plugins: [],
}
