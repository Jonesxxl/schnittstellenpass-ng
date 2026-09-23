/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      // Design tokens from the "Schnittstellenpass Website" design
      colors: {
        paper: '#F3EFE2',
        ink: '#16261B',
        pitch: '#CFE3C4',
        moss: '#3F6B45',
        forest: '#2E4A33',
        chalk: '#E4EBDD',
        signal: '#E0492F'
      },
      fontFamily: {
        sans: ['"Familjen Grotesk"', 'system-ui', 'sans-serif'],
        display: ['"Big Shoulders Display"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        block: '8px 8px 0 #16261B'
      },
      keyframes: {
        livepulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.25' }
        }
      },
      animation: {
        livepulse: 'livepulse 1.4s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}
