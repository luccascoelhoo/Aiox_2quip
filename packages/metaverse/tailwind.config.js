/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hive: {
          bg: '#0a0a0f',
          surface: '#0d1117',
          border: '#30363d',
          text: '#c9d1d9',
          muted: '#8b949e',
          gold: '#ffd700',
          tech: '#58a6ff',
          product: '#3fb950',
          creative: '#bc8cff',
          strategic: '#f0883e',
          security: '#f85149',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
