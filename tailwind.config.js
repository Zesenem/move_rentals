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
      },
      fontFamily: {
        sans: ["Manrope", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
