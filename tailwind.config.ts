import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "radial-gradient-card-back-side":
          "radial-gradient(circle at 1px 1px, rgba(135, 131, 126, 0.2) 1px, transparent 0)",
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "ripple-effect-active": "rippleEffect 0.9s ease infinite",
        "slide-animation": "slideAnimation 90s linear infinite normal",
        "button-effect-active": "wiggle 2s ease infinite",
        "card-slide-init-effect": "slideCardInitAnimation 2s linear normal",
        "card-slide-exit-effect": "slideCardExitAnimation 2s linear normal",
      },

      keyframes: {
        rippleEffect: {
          "0%": { opacity: "0.5", transform: "scale(0)" },
          "100%": { opacity: "0", transform: "scale(20)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        slideAnimation: {
          from: {
            transform: "translateX(0%)",
          },
          to: {
            transform: "translateX(-100%)",
          },
        },
        slideCardInitAnimation: {
          // "0%": { opacity: "0.5", transform: "scaleX(-100)" },
          // "100%": { opacity: "1", transform: "scaleX(100%)" },
          from: {
            transform: "translateX(-100%), transform: 'scaleX(0)'",
            opacity: "0.5",
          },
          to: {
            transform: "translateX(0%), scaleX(100%)",
            opacity: "1",
          },
        },
        slideCardExitAnimation: {
          from: {
            transform: "translateX(0%), scaleX(100%)",
            opacity: "1",
          },
          to: {
            transform: "translateX(100%), transform: 'scaleX(0)'",
            opacity: "0.5",
          },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
