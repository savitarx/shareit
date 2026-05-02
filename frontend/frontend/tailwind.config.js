/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      animation: {
        "fade-up":   "fadeUp 0.4s ease both",
        "msg-in":    "msgIn 0.25s ease both",
        "pulse-dot": "pulseDot 1.5s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:   { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        msgIn:    { from: { opacity: 0, transform: "translateY(6px)" },  to: { opacity: 1, transform: "translateY(0)" } },
        pulseDot: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } },
      },
    },
  },
  plugins: [],
};