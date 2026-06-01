/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        signal: {
          200: '#c9e4ff',
          300: '#8cc4ff',
          400: '#5aa7ff',
          500: '#3291ff',
          600: '#1f79df',
          DEFAULT: '#3291ff',
        },
        dark: {
          50: '#f6f9fb',
          100: '#eef4f8',
          200: '#d7e2e8',
          300: '#b7c7d0',
          400: '#8fa3ae',
          500: '#73828c',
          600: '#55656f',
          700: '#33424a',
          800: '#1b2830',
          850: '#121b20',
          900: '#0d151a',
          950: '#091014',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.22s ease-out',
        'slide-up': 'slideUp 0.26s cubic-bezier(0.22, 1, 0.36, 1)',
        'menu-in': 'menuIn 0.18s cubic-bezier(0.22, 1, 0.36, 1)',
        'rail-in': 'railIn 0.24s cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px) scale(0.99)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        menuIn: {
          '0%': { opacity: '0', transform: 'translateY(-6px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        railIn: {
          '0%': { transform: 'scaleY(0)' },
          '100%': { transform: 'scaleY(1)' },
        },
      },
    },
  },
  plugins: [],
}
