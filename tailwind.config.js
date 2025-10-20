/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8f0',
          100: '#ffe8cc',
          200: '#ffd699',
          300: '#ffbf66',
          400: '#ffa833',
          500: '#ff9100',
          600: '#cc7400',
          700: '#995700',
          800: '#663a00',
          900: '#331d00',
        },
        devotional: {
          saffron: '#FF9933',
          maroon: '#8B0000',
          gold: '#FFD700',
          crimson: '#DC143C',
          amber: '#FFBF00',
        },
      },
      fontFamily: {
        sanskrit: ['Noto Serif Devanagari', 'serif'],
      },
      backgroundImage: {
        'mandala': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ff9933\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
      },
    },
  },
  plugins: [],
}
