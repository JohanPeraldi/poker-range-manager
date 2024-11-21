/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'bg-red-800',
    'bg-blue-200',
    'bg-gray-300',
    'text-white',
    'text-gray-800',
    'bg-[#f5f7f5]',
    'bg-[#eef2ee]',
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        13: 'repeat(13, minmax(0, 1fr))',
      },
      screens: {
        xxs: '320px',
        xs: '375px',
      },
    },
  },
  plugins: [],
};
