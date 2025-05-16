/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Couleurs personnalisées pour correspondre au design de TailGrids
        primary: "#3056D3", // Couleur bleue principale pour les boutons
        dark: "#090E34",    // Couleur foncée pour les textes
        "body-color": "#637381", // Couleur pour les textes secondaires
        "body-secondary": "#8899A8",
        stroke: "#E7E7E7",
        warning: "#FBBF24",
      },
      container: {
        center: true,
        padding: '1rem',
      },
    },
  },
  plugins: [import('tailgrids/plugin')],
}