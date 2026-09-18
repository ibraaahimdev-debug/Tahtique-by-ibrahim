/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#327BE4',
          hover: '#2563EB',
          light: '#EBF1FC',
          dark: '#1E40AF',
        },
        lavender: {
          DEFAULT: '#EBF1FC',
          border: '#D8E4FA',
        },
        pinkAccent: {
          DEFAULT: '#FFD4E9',
          light: '#FFF0F7',
        },
        pageBg: '#F7EBEF',
        headingText: '#1A1A1A',
        bodyText: '#8A8A8A',
        cardBg: '#FFFFFF',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Poppins', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -5px rgba(50, 123, 228, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'soft-hover': '0 20px 40px -10px rgba(50, 123, 228, 0.15), 0 8px 12px -3px rgba(0, 0, 0, 0.05)',
        'card': '0 10px 25px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'popular': '0 20px 40px -8px rgba(50, 123, 228, 0.22), 0 6px 12px -2px rgba(50, 123, 228, 0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
