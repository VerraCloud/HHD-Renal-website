/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Work Sans'", "Helvetica", "Arial", "sans-serif"],
        mono: ["'IBM Plex Mono'", "ui-monospace", "monospace"],
      },
      colors: {
        // "teal"/"orange"/"ink" keys kept as-is so existing bg-brand-teal / bg-brand-orange /
        // text-ink-navy classes across every page don't need renaming; only the values are blue now.
        // Base blue + accent blue values match bidmc.org's real brand palette (#113C76 / #0069B4).
        brand: {
          teal: "#113C76",
          orange: "#0069B4",
          "orange-dark": "#00568F",
          "orange-light": "#0B5FA5",
          "orange-glow": "#5EB8E8",
        },
        ink: {
          DEFAULT: "#23272E",
          navy: "#0A2647",
          deep: "#061A33",
        },
      },
      maxWidth: {
        page: "1600px",
      },
    },
  },
  plugins: [],
};
