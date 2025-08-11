export default {
  darkMode: "class",
  content: [
    "./components//*.{vue,js,ts}",
    "./layouts//.vue",
    "./pages/**/.vue",
    "./app.vue",
    "./plugins/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e8fbff",
          100: "#c8f3ff",
          200: "#94e5ff",
          300: "#5ad1ff",
          400: "#2bbcf5",
          500: "#11a2db",
          600: "#0a84b8",
          700: "#0b6a93",
          800: "#0e5878",
          900: "#0e455f",
        },
        // Define semantic colors for both modes
        light: {
          bg: "#f8fafc",
          surface: "#ffffff",
          text: "#0f172a",
          muted: "#475569",
          border: "#e2e8f0",
          card: "#ffffff",
        },
        dark: {
          bg: "#0f1722",
          surface: "#121b27",
          text: "#ffffff",
          muted: "#94a3b8",
          border: "rgba(255,255,255,0.08)",
          card: "#1b2430",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.12)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "Segoe UI",
          "Roboto",
          "Arial",
        ],
      },
    },
  },
  plugins: [],
};
