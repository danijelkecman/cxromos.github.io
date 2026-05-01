/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#08111f',
        panel: '#0d1828',
        line: '#1f3148',
        signal: '#38bdf8',
        heat: '#f97316',
        paper: '#f8fafc'
      },
      boxShadow: {
        soft: '0 18px 60px rgba(2, 8, 23, 0.35)'
      }
    }
  },
  plugins: []
};
