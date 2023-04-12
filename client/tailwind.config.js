/** @type {import("tailwindcss").Config} */
import * as forms from "@tailwindcss/forms";
import * as typography from "@tailwindcss/typography";

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
      textColor: ["active"],
    },
  },
  plugins: [forms, typography],
};
