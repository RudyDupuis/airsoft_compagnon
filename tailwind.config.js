/** @type {import('tailwindcss').Config} */
export default {
  content: ['./components/**/*.{js,vue,ts}', './pages/**/*.vue', './app.vue', './error.vue'],
  theme: {
    colors: {
      primary: '#F30002',
      secondary: '#606060',
      background: '#1C0000',
      'on-background': '#FFF8F8'
    },
    fontFamily: {
      primary: ['Aldrich-Regular', 'Arial']
    },
    extend: {}
  },
  plugins: []
}
