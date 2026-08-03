/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          black: "#090909",
          charcoal: "#141414",
          card: "#181818",
          border: "rgba(255, 255, 255, 0.08)",
          orange: "#FF7A00",
          orangeGlow: "rgba(255, 122, 0, 0.15)",
          white: "#F8F8F8",
          muted: "#A1A1A1",
          subtle: "#737373",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        display: ["var(--font-outfit)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(255, 122, 0, 0.3)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.3, transform: 'scale(1)' },
          '50%': { opacity: 0.7, transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};
