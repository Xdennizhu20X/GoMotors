const {heroui} = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#0056FF',
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
        heading: ["var(--font-heading)", "var(--font-sans)"],
        display: ["var(--font-display)", "var(--font-sans)"],
      },
      dropShadow: {
        'logo': '0 4px 8px var(--logo-shadow-color)',
      },
      scrollBehavior: {
        smooth: 'smooth'
      }
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF",
            foreground: "#0F0F1F",
            primary: "#1341EE",
            secondary: "#0A39ED",
            tertiary: "#0D3CEE",
          },
        },
        dark: {
          colors: {
            background: "#000000",
            foreground: "#FFFFFF",
            primary: "#6ea8ff",
            content1: "#111111",
            content2: "#181818",
            content3: "#222222",
          },
        },
      },
    }),
  ],
};