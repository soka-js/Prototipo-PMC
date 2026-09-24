/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        primary: { DEFAULT: '#0E6E63', dark: '#094C44', light: '#E8F4F2' },
        surface: { bg: '#FCF9F5', alt: '#F4F4F2', card: '#FFFFFF', subtle: '#F6F3EF' },
        ink: { DEFAULT: '#1A1A18', muted: '#706E6B' },
        soft: '#EFECE6',
        terracotta: { DEFAULT: '#B5623E', light: '#FBEFE8' },
        wa: {
          header: '#075E54',
          teal: '#128C7E',
          received: '#FFFFFF',
          sent: '#DCF8C6',
          bg: '#ECE5DD',
          check: '#34B7F1',
        },
      },
      keyframes: {
        blink: { '0%,49%': { opacity: '1' }, '50%,100%': { opacity: '0' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'sheet-up': { from: { transform: 'translateY(100%)' }, to: { transform: 'translateY(0)' } },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        grow: { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
      },
      animation: {
        blink: 'blink 1s step-end infinite',
        'fade-up': 'fade-up 0.3s ease-out both',
        'sheet-up': 'sheet-up 0.28s ease-out both',
        'fade-in': 'fade-in 0.2s ease-out both',
      },
    },
  },
  plugins: [],
};
