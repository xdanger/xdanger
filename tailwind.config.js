/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'lxgw-bright': ['var(--font-lxgw-bright)'],
        'lxgw-bright-medium': ['var(--font-lxgw-bright-medium)'],
        'lxgw-bright-light': ['var(--font-lxgw-bright-light)'],
      },
    },
  },
  plugins: [],
};
