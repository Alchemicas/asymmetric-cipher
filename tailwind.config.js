const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: false,
  mode: 'jit',
  plugins: [require('@tailwindcss/line-clamp')],
  purge: ['./src/**/*.ts*'],
  theme: {
    extend: {
      colors: {
        amber: colors.amber,
        cyan: colors.cyan,
        emerald: colors.emerald,
        fuchsia: colors.fuchsia,
        gray: colors.blueGray,
        lime: colors.lime,
        orange: colors.orange,
        rose: colors.rose,
        sky: colors.sky,
        teal: colors.teal,
        violet: colors.violet
      },
      scale: {
        200: '2'
      }
    }
  },
  variants: {
    extend: {}
  }
}
