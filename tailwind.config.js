/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        darkbg: "#0f0f15",
        cardbg: "#1a1a2e",
        neonpurple: "#8b5cf6",
        neonblue: "#22d3ee",
        neongreen: "#4ade80",
        neonpink: "#f472b6",
        graytext: "#cbd5e1",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        display: ["Orbitron", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 8px #8b5cf6, 0 0 15px #22d3ee",
      },
      dropShadow: {
        neon: "0 0 6px #8b5cf6, 0 0 10px #22d3ee",
      },
    },
  },
  plugins: [],
}
