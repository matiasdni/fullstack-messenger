/** @type {import("tailwindcss").Config} */
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";

module.exports = {
  darkMode: "class",
  content: [
    "./src/*.{js, jsx, ts, tsx, html }",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [forms, typography],
};
