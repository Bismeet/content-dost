/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050604',
        'background-deep': '#020302',
        surface: '#0b0e07',
        'surface-elevated': '#11150b',
        'surface-hover': '#171d0d',
        primary: '#d7ff00',
        'primary-bright': '#efff00',
        'primary-dark': '#8fa800',
        'text-primary': '#f5f5ef',
        'text-secondary': '#aaad9f',
        'text-muted': '#686d61',
        'border-neutral': 'rgba(255, 255, 255, 0.08)',
        'border-primary': 'rgba(215, 255, 0, 0.20)',
        'accent-red': '#ff3b30',
        'accent-blue': '#3478f6',
        'accent-yellow': '#ffd60a',
      },
      fontFamily: {
        sans: ['Manrope', 'Geist', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
