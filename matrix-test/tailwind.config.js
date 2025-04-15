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
        // Add these new animations
        'glow-pulse': 'glowPulse 2s infinite',
        'glitch': 'glitch 0.3s ease infinite',
        'pulse': 'pulse 3s infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 }
        },
        progressBarStripes: {
          '0%': { backgroundPosition: '1rem 0' },
          '100%': { backgroundPosition: '0 0' }
        },
        // Add these new keyframes
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px var(--m-glow)' },
          '50%': { boxShadow: '0 0 20px var(--m-glow), 0 0 30px var(--m-glow)' }
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-2px, -2px)' },
          '80%': { transform: 'translate(2px, 2px)' }
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' }
        }
      }
    },
  },
  plugins: [],
  // Add the new animation and button classes to safelist
  safelist: [
    'bg-matrix-primary',
    'bg-matrix-secondary',
    'bg-matrix-danger',
    'text-matrix-text',
    'text-matrix-text-bright',
    'border-matrix-border',
    'border-matrix-primary',
    // Add these new classes
    'animate-glow-pulse',
    'animate-glitch',
    'animate-pulse',
    'clip-path-cyber'
  ]
}