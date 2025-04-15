/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'matrix': {
          'bg': 'var(--m-bg)',
          'text': 'var(--m-text)',
          'text-dim': 'var(--m-text-dim)',
          'text-bright': 'var(--m-text-bright)',
          'text-white': 'var(--m-text-white)',
          'border': 'var(--m-border)',
          'panel': 'var(--m-panel)',
          'primary': 'var(--m-primary)',
          'secondary': 'var(--m-secondary)',
          'danger': 'var(--m-danger)',
          'warning': 'var(--m-warning)',
          'success': 'var(--m-success)',
          'info': 'var(--m-info)',
          'light': 'var(--m-light)',
          'dark': 'var(--m-dark)',
          'glow': 'var(--m-glow)',
          'overlay': 'var(--m-overlay)'
        }
      },
      fontFamily: {
        'matrix': 'var(--m-font-main)',
        'matrix-alt': 'var(--m-font-alt)',
        'matrix-hacker': 'var(--m-font-hacker)'
      },
      animation: {
        'cursor-blink': 'blink 1s step-end infinite',
        'progress-bar-stripes': 'progressBarStripes 1s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 }
        },
        progressBarStripes: {
          '0%': { backgroundPosition: '1rem 0' },
          '100%': { backgroundPosition: '0 0' }
        }
      }
    },
  },
  plugins: [],
  // Important: safelist crucial classes to ensure they're included in production builds
  safelist: [
    'bg-matrix-primary',
    'bg-matrix-secondary',
    'bg-matrix-danger',
    'text-matrix-text',
    'text-matrix-text-bright',
    'border-matrix-border',
    'border-matrix-primary',
  ]
}
