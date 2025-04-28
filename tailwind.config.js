/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts}"],
  theme: {
    extend: {
      fontFamily: {
        instrument: ['"Instrument Sans"', "sans-serif"],
        inder: ['"Inder"', "sans-serif"],
        inter: ['"Inter"', "sans-serif"],
        itim: ['"Itim"', "cursive"],
        inkut: ['"Inknut Antiqua"', "serif"],
      },
    },
  },
  plugins: [],
};
