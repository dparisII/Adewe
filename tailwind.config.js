/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': 'var(--color-primary, #58cc02)',
        'brand-secondary': 'var(--color-secondary, #1cb0f6)',
        'brand-accent': 'var(--color-accent, #ff9600)',
        'brand-green': 'var(--duo-green, #58cc02)',
        'brand-blue': 'var(--duo-blue, #1cb0f6)',
        'brand-yellow': 'var(--duo-yellow, #ffc800)',
        'bg-main': 'var(--bg-primary, #ffffff)',
        'bg-alt': 'var(--bg-secondary, #f8fafc)',
        'bg-card': 'var(--bg-card, #ffffff)',
        'text-main': 'var(--text-primary, #3c3c3c)',
        'text-alt': 'var(--text-secondary, #777777)',
        'border-main': 'var(--border-color, #e5e5e5)',
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#58cc02',
          600: '#4caf00',
          700: '#3d8c00',
          800: '#326e00',
          900: '#2a5c00',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#ffc800',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
      },
      fontFamily: {
        sans: ['Nunito', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
