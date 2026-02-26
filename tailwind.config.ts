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
    },
  },
  plugins: [],
};

export default config;
