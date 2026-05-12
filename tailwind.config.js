/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0A0A0F',
          1: '#111118',
          2: '#16161f',
          3: '#1c1c27',
          border: '#27272a',
        },
        primary: {
          DEFAULT: '#6366f1',
          dim:     '#4f46e5',
          glow:    'rgba(99,102,241,0.18)',
        },
        accent: {
          DEFAULT: '#8b5cf6',
        },
        text: {
          primary:   '#f4f4f5',
          secondary: '#a1a1aa',
          muted:     '#52525b',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in':    'fadeIn 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
