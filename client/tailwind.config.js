const palette = require('./src/design/palette')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        wh: palette.wh,
        grey: palette.grey,
        primary: palette.primary,
        secondary: palette.secondary,
        azul: palette.azul,
        price: palette.price,
        foreground: palette.foreground,
        outline: palette.outline,
        button: palette.button,
        'form-bg': palette['form-bg'],
        'secondary-btn': palette['secondary-btn'],
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif']
      }
    }
  },
  plugins: [],
}
