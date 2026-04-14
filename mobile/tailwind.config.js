/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0D80AE",
        secondary: "#62882B",
        accent: "#ED701E",
        foreground: "#0F172A",
        muted: "#EDF2F5",
        "muted-foreground": "#64748B",
        card: "#FFFFFF",
        border: "#CBD5E1",
        input: "#CBD5E1",
      },
    },
  },
  plugins: [],
};
