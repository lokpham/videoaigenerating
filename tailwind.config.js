/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        vag: {
          primary: "#ffffff", // Xanh lá nhạt
          secondary: "#f9f9f9", // Xám đậm
        },
      },
    },
  },
  plugins: [],
};
