import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./frontend/**/*.{html,js,ts,jsx,tsx}",
    "./frontend/index.html",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        midnight: {
          950: "#080B18", // Primary Deep Midnight Navy
          900: "#0D1127",
          850: "#111736",
          800: "#161F45",
          700: "#1E295C",
          600: "#2B3A7E",
        },
        electric: {
          cyan: "#22D3EE",
          cyanDark: "#06B6D4",
          violet: "#A855F7",
          indigo: "#6366F1",
          purpleGlow: "#C084FC",
        },
        lavender: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'orb-float': 'orbFloat 8s ease-in-out infinite alternate',
        'orb-float-delayed': 'orbFloat 10s ease-in-out 3s infinite alternate-reverse',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        orbFloat: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(20px, -25px) scale(1.08)' },
          '100%': { transform: 'translate(-15px, 15px) scale(0.95)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.3)',
        'glow-violet': '0 0 35px -5px rgba(168, 85, 247, 0.25)',
        'glow-indigo': '0 0 30px -5px rgba(99, 102, 241, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
};

export default config;
