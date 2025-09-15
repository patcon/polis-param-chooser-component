// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // etc.
    './src/**/*.{stories,story}.{js,jsx,ts,tsx,mdx}', // 👈 add this for storybook files
    './.storybook/**/*.{js,jsx,ts,tsx,mdx}',         // if you have decorators etc
  ],
  theme: {
    extend: {
      // you can still extend theme here if needed
    },
  },
  // Added because we manage some of these dynamically, and it confuses PostCSS.
  safelist: [
    'grid-cols-1',
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'grid-cols-5',
    'h-screen-safe',
    'w-screen-safe',
    'min-h-screen-safe',
    'max-h-screen-safe',
    // add as high as you’ll ever need
  ],
  plugins: [
  ],
}
