/** @type {import("tailwindcss").Config} */

module.exports = {
  darkMode: "class",
  content: [
    "./src/*.{js, jsx, ts, tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
