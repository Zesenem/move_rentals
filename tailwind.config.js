import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cloud: "#EDEFF7",
        smoke: "#D3D6E0",
        steel: "#BCBFCC",
        space: "#9DA2B3",
        graphite: "#6E7180",
        arsenic: "#40424D",
        phantom: "#1E1E24",
        "brand-black": "#000000",
        status: {
          available: '#6EE7B7', 
          booked: '#FCD34D',     
        },
        'status-bg': {
          available: 'rgba(110, 231, 183, 0.2)',
          booked: 'rgba(252, 211, 77, 0.2)',
        }
      },
      animation: {
        'fade-scale-in': 'fade-scale-in 0.3s ease-out forwards',
      },
      keyframes: {
        'fade-scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      fontFamily: {
        sans: ["Manrope", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
