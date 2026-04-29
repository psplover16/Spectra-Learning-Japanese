import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        ink: '#2f1f18',
        clay: '#b45a32',
        parchment: '#f6f0e8',
        sand: '#e7d6c6',
        moss: '#7c8567',
        pine: '#3f5a49'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(47, 31, 24, 0.08)'
      }
    }
  },
  plugins: []
} satisfies Config;
