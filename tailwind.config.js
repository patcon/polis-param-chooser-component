// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // etc.
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
    // add as high as you’ll ever need
  ],
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        // new utility classes:
        '.h-screen-safe': {
          height: '100vh',
          height: '100dvh', // overrides in browsers that support dvh
        },
        '.w-screen-safe': {
          width: '100vw',
          width: '100dvw',
        },
        '.min-h-screen-safe': {
          minHeight: '100vh',
          minHeight: '100dvh',
        },
        '.max-h-screen-safe': {
          maxHeight: '100vh',
          maxHeight: '100dvh',
        },
      })
    },
  ],
}
