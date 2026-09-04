/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bone: {
          50:  '#FFFFFF',
          100: '#F2EEE6',
          200: '#E8E3D8',
          300: '#DDD7CA',
        },
        ink: {
          900: '#111111',
          700: 'rgba(17,17,17,0.65)',
          500: 'rgba(17,17,17,0.45)',
          300: 'rgba(17,17,17,0.25)',
          100: 'rgba(17,17,17,0.12)',
          '050': 'rgba(17,17,17,0.08)',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        label: ['Archivo', 'sans-serif'],
        body: ['Archivo', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.7s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.7s ease-out both',
        'slide-in':   'slideIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
