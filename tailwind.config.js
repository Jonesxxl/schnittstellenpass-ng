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
        },
        // Progress bars of the Instagram carousel
        fillbar: {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' }
        },
        // Caption entering the Instagram stage
        capin: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'none' }
        },
        // Ticker band; its content is rendered twice
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' }
        }
      },
      animation: {
        livepulse: 'livepulse 1.4s ease-in-out infinite',
        // Duration matches SLIDE_DURATION in instagram-feed.component.ts
        fillbar: 'fillbar 5000ms linear both',
        capin: 'capin .6s cubic-bezier(.2,.7,.2,1) both',
        marquee: 'marquee 38s linear infinite'
      }
    },
  },
  plugins: [],
}
