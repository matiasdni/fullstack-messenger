/** @type {import("tailwindcss").Config} */
/** @type {import("@tailwindcss/forms")} */
/** @type {import("@tailwindcss/typography")} */

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
    extend: {
      gridTemplateColumns: {
        "auto-1fr": "2fr 7fr",
      },
      spacing: {
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
        "2/6": "33.333333%",
        "3/6": "50%",
        "4/6": "66.666667%",
        "5/6": "83.333333%",
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
      },
      minWidth: {
        0: "0",
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        full: "100%",
      },
      maxWidth: {
        "1/4": "25%",
        "1/2": "50%",
        "3/4": "75%",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "1/6": "16.666667%",
      },
      animation: {
        "fade-in-down": "fadeInDown .35s ease-out forwards",
        "fade-out-up": "fadeOutUp .45s ease-out forwards",
        "fade-in": "fadeIn ease-in-out forwards .15s",
        "fade-out": "fadeOut .2s ease-in-out forwards",
        "bg-fade-in": "bgFadeIn ease-in-out forwards 0.1s",
        "bg-fade-out": "bgFadeOut .2s ease-in-out forwards",
      },
      keyframes: {
        fadeInDown: {
          from: {
            opacity: "0",
            transform: "translate3d(0, -10%, 0)",
          },
          to: {
            opacity: "1",
            transform: "translate3d(0, 0, 0)",
          },
        },
        fadeOutUp: {
          from: {
            opacity: "1",
            transform: "translate3d(0, 0, 0)",
          },
          to: {
            opacity: "0",
            transform: "translate3d(0, -25%, 0)",
          },
        },
        fadeIn: {
          from: {
            opacity: "0",
          },
          to: {
            opacity: "1",
          },
        },
        fadeOut: {
          from: {
            opacity: "1",
          },
          to: {
            opacity: "0",
          },
        },
        bgFadeIn: {
          from: { opacity: "0" },
          to: { opacity: ".25" },
        },
        bgFadeOut: {
          from: { opacity: ".25" },
          to: {
            opacity: "0",
          },
        },
      },
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
