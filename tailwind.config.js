const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#DFFF03",
        "accent-muted": "#AEC102",
        "status-green": "#22c55e",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        inter: ["var(--font-inter)"],
        "druk-wide": ['"Druk Wide Bold"', "sans-serif"],
      },
      keyframes: {
        pulseGreen: {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow: "0 0 0 0px rgba(34, 197, 94, 0.7)",
          },
          "50%": {
            transform: "scale(1.1)",
            boxShadow: "0 0 0 6px rgba(34, 197, 94, 0)",
          },
        },
        "infinite-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "infinite-scroll-vertical": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" },
        },
      },
      animation: {
        "pulse-green": "pulseGreen 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "infinite-scroll": "infinite-scroll 30s linear infinite",
        "infinite-scroll-vertical": "infinite-scroll-vertical 20s linear infinite", // Przyspieszono z 40s
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config;
