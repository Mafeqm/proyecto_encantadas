/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        pearl: {
          DEFAULT: '#FDFBF7',
          50: '#FFFFFF',
          100: '#FDFBF7',
          200: '#F7F3EB',
        },
        brand: {
          lilac: {
            light: '#C084FC', // purple-400
            DEFAULT: '#A855F7', // purple-500
          },
          teal: {
            light: '#2DD4BF', // teal-400
            DEFAULT: '#14B8A6', // teal-500
          },
          gold: {
            DEFAULT: '#FBBF24', // amber-400
          }
        }
      },
      boxShadow: {
        'soft': '0 8px 30px rgb(0, 0, 0, 0.04)',
        'soft-lg': '0 12px 40px rgb(0, 0, 0, 0.06)',
        'teal-glow': '0 8px 20px -4px rgba(20, 184, 166, 0.35)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};

