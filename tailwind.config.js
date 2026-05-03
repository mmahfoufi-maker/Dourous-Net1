/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body:    ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0fdf6',
          100: '#dcfce9',
          200: '#bbf7d2',
          300: '#86efad',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        sand: {
          50:  '#fefce8',
          100: '#fef9c3',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
        }
      },
      animation: {
        'fade-up':   'fadeUp 0.45s ease both',
        'fade-in':   'fadeIn 0.35s ease both',
        'slide-in':  'slideIn 0.4s ease both',
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: 'translateY(18px)' }, to: { opacity: 1, transform: 'none' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { opacity: 0, transform: 'translateX(-12px)' }, to: { opacity: 1, transform: 'none' } },
      },
    },
  },
  plugins: [],
};
