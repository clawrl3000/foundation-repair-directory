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
        "primary": "#d97706",
        "amber-accent": "#f59e0b",
        "background-light": "#f6f6f8",
        // 60/30/10 Color System for Foundation Repair
        dominant: {
          // Deep earth tones - 60% of design
          900: "#0f0e0a", // Deep warm black
          800: "#1c1815", // Rich dark slate
          700: "#2d2722", // Warm dark earth
        },
        secondary: {
          // Light supporting colors - 30% of design  
          100: "#faf9f7", // Warm near-white
          200: "#f1f0ec", // Warm light gray
          300: "#e6e4df", // Warm medium gray
        },
        accent: {
          // Vibrant CTA color - 10% of design ONLY
          500: "#f59e0b", // Amber primary
          600: "#d97706", // Amber hover
          700: "#b45309", // Amber pressed
        },
        // Earth tones for foundation repair authority
        steel: {
          500: "#64748b",
          600: "#475569", 
          700: "#334155",
          800: "#1e293b",
        },
      },
      fontFamily: {
        "display": ["var(--font-display)", "Georgia", "serif"],
        "sans": ["var(--font-sans)", "system-ui", "sans-serif"],
        "body": ["var(--font-sans)", "system-ui", "sans-serif"],
        "mono": ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem", 
        "xl": "0.75rem",
        "full": "9999px"
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      screens: {
        'sm': '640px',
        'md': '768px', 
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
    },
  },
  plugins: [],
}