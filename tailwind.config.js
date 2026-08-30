/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0D80AE",
        success: "#62882B",
        danger: "#DC2626",
        warning: "#ED701E",
        foreground: "#0F172A",
        background: "#EDF2F5",
        muted: "#EDF2F5",
        "muted-foreground": "#64748B",
        card: "#FFFFFF",
        border: "#CBD5E1",
        input: "#CBD5E1",
        whatsapp: "#25D366",
      },
    },
  },
  plugins: [],
};
