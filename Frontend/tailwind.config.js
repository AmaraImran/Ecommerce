export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        pinyon: ["Pinyon Script", "cursive"],
        science: ["Science Gothic", "sans-serif"],
      },
      keyframes: {
    fadeIn: {
      "0%": { opacity: 0 },
      "100%": { opacity: 1 },
    },
    slideIn: {
      "0%": { transform: "translateX(50px)", opacity: 0 },
      "100%": { transform: "translateX(0)", opacity: 1 },
    },
  },
  animation: {
    fadeIn: "fadeIn 1s ease-out",
    slideIn: "slideIn 1s ease-out",
  },
    },
  },
  plugins: [],
};
