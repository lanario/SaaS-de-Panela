import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /** Rosa escuro - detalhes e CTAs da marca Presentix */
        presentix: {
          50: "#fdf2f8",
          100: "#fce7f3",
          200: "#fbcfe8",
          300: "#f9a8d4",
          400: "#f472b6",
          500: "#ec4899",
          600: "#db2777",
          700: "#be185d",
          800: "#9d174d",
          900: "#831843",
        },
        primary: {
          50: "#FFFFFF",
          100: "#E6EFFD",
          200: "#CDDFFA",
          300: "#B3CEF8",
          400: "#9ABEF5",
          500: "#7AA8F2",
          600: "#5B92EE",
        },
        sage: {
          50: "#f4f6f3",
          100: "#e3e9df",
          200: "#c9d4c1",
          400: "#8fa87e",
          500: "#6b8a5a",
        },
        terracotta: {
          100: "#fdf0eb",
          200: "#f9ddd2",
          400: "#c97a5c",
          500: "#b85c3a",
        },
        serenity: {
          50: "#f0f4f8",
          100: "#e1e9f1",
          200: "#c5d4e4",
          400: "#7a9bb8",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "dot-float": {
          "0%, 100%": { opacity: "0.4", transform: "translateY(0)" },
          "50%": { opacity: "0.7", transform: "translateY(-4px)" },
        },
        "blob-float": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(20px, -20px) scale(1.05)" },
          "66%": { transform: "translate(-15px, 15px) scale(0.95)" },
        },
        "blob-float-2": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(-25px, 10px) scale(1.08)" },
          "66%": { transform: "translate(15px, -25px) scale(0.92)" },
        },
        "gradient-shift": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "dot-float": "dot-float 4s ease-in-out infinite",
        "blob-float": "blob-float 12s ease-in-out infinite",
        "blob-float-2": "blob-float-2 14s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
