const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.ts*'],
  plugins: [require('@tailwindcss/line-clamp')],
  theme: {
    extend: {
      colors: {
        amber: colors.amber,
        cyan: colors.cyan,
        emerald: colors.emerald,
        fuchsia: colors.fuchsia,
        gray: colors.slate,
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
  }
}
