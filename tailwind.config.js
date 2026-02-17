/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": "#1152d4",
        "amber-accent": "#f59e0b",
        "accent-amber": "#f59e0b",
        "background-light": "#f6f6f8",
        "background-dark": "#101622",
        "glass-stroke": "rgba(255, 255, 255, 0.1)",
        "surface-dark": "#1c2433",
        "border-dark": "#232f48",
        "navy-muted": "#1e293b",
      },
      fontFamily: {
        "display": ["Manrope", "sans-serif"]
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem", 
        "xl": "0.75rem",
        "full": "9999px"
      },
    },
  },
  plugins: [],
}