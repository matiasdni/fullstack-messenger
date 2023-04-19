/** @type {import("tailwindcss").Config} */
/** @type {import("@tailwindcss/forms")} */
/** @type {DefaultColors} */

const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "class",
  content: [
    "./src/*.{js, jsx, ts, tsx}",
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/**/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {},
  },
  variants: {},
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
