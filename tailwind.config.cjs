/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        owntext: ["Josefin Sans", "sans-serif"],
      },
      colors: {
        "bright-blue": "hsl(220, 98%, 61%)",

        gradient1: "hsl(192, 100%, 67%)",
        gradient2: "hsl(280, 87%, 65%)",

        "bg-cards-light": "hsl(0, 0%, 98%)",
        "bg-main-light": "hsl(236, 33%, 92%)",
        "task-completed-light": "hsl(233, 11%, 84%)",
        "task-light": "hsl(236, 9%, 61%)",
        "all-link-light": "hsl(235, 19%, 35%)",

        "bg-main-dark": "hsl(235, 21%, 11%)",
        // "bg-main-dark": "hsl(236, 10%, 29%)",
        "bg-cards-dark": "hsl(235, 24%, 19%)",
        "task-dark": "hsl(234, 39%, 85%)",
        "task-hover-dark": "hsl(236, 33%, 92%)",
        "task-completed-dark": "hsl(234, 11%, 52%)",
      },
    },
  },
  plugins: [],
};
