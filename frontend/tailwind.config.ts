import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0F172A",
          card: "#111827",
          hover: "#1F2937",
        },
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        success: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
        muted: "#94A3B8",
      },
      backgroundColor: {
        glass: "rgba(17, 24, 39, 0.8)",
        "glass-dark": "rgba(15, 23, 42, 0.6)",
      },
      backdropFilter: {
        glass: "blur(10px)",
      },
      boxShadow: {
        card: "0 20px 60px rgba(15, 23, 42, 0.3)",
        "card-sm": "0 4px 20px rgba(15, 23, 42, 0.2)",
        glass: "0 8px 32px rgba(31, 41, 55, 0.1)",
      },
      borderColor: {
        glass: "rgba(31, 41, 55, 0.5)",
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in",
        slideUp: "slideUp 0.4s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
