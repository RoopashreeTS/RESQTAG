/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070D1D',
          900: '#0B132B',
          850: '#131D38',
          800: '#1C2541',
          750: '#233054',
          700: '#2E3D6B',
          600: '#41558C',
          500: '#5A72B5',
        },
        emergency: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          500: '#EF233C',
          600: '#E63946',
          700: '#D90429',
          800: '#9B031E',
          glow: '#FF334B'
        },
        brand: {
          blue: '#2563EB',
          cyan: '#06B6D4',
          teal: '#0D9488',
          emerald: '#10B981',
          amber: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-red': '0 0 25px -5px rgba(230, 57, 70, 0.5)',
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.4)',
        'card': '0 10px 30px -5px rgba(11, 19, 43, 0.08), 0 4px 12px -2px rgba(11, 19, 43, 0.04)',
        'sticker': '0 15px 35px -5px rgba(0, 0, 0, 0.25)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'beacon': 'beacon 2s ease-out infinite',
      },
      keyframes: {
        beacon: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
