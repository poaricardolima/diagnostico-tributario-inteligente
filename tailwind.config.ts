import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        impulso: {
          navy: "#010D1F",
          deep: "#0B1A2E",
          gold: "#E5B14B",
          yellow: "#F2D648",
          success: "#22C55E",
          muted: "#94A3B8",
          card: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 18px 50px rgba(1, 13, 31, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;
