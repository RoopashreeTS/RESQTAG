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
        primary: {
          950: '#070D1D',
          900: '#0F172A',
          800: '#1E293B',
          700: '#334155',
          600: '#475569',
          500: '#64748B',
        },
        emergency: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          glow: '#EF4444'
        },
        safe: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
        },
        brand: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
          blue: '#2563EB',
          cyan: '#0284C7',
          teal: '#0D9488',
          emerald: '#10B981',
          amber: '#D97706'
        },
        tech: {
          deep: '#073B66',
          ocean: '#087EA4',
          bright: '#1687FF',
          cyan: '#38D9FF',
          teal: '#38C6B5',
          light: '#EAF6FF',
          dark: '#051C33',
        },
        roseTheme: {
          bg: '#FFF7F7',
          secondary: '#FFEFEF',
          light: '#FFE5E5',
          border: '#FED7D7',
          borderSubtle: 'rgba(229, 57, 53, 0.12)',
          card: 'rgba(255, 255, 255, 0.78)',
          cardSolid: '#FFFFFF',
          primaryRed: '#E53935',
          accentRed: '#FF6B6B',
          darkRed: '#C62828',
          textDark: '#2B2020',
          textMuted: '#806F6F',
        },
        surface: {
          bg: '#FFF7F7',
          card: 'rgba(255, 255, 255, 0.85)',
          muted: '#FFEFEF',
          border: 'rgba(229, 57, 53, 0.15)',
          borderDark: '#FED7D7',
          textMain: '#2B2020',
          textMuted: '#806F6F',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(229, 57, 53, 0.06)',
        'card': '0 4px 20px -2px rgba(229, 57, 53, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'card-hover': '0 15px 35px -5px rgba(229, 57, 53, 0.12), 0 6px 12px -3px rgba(229, 57, 53, 0.06)',
        'modal': '0 25px 50px -12px rgba(43, 32, 32, 0.25)',
        'rose-btn': '0 4px 15px 0 rgba(229, 57, 53, 0.35)',
        'rose-btn-hover': '0 8px 25px 0 rgba(229, 57, 53, 0.45)',
        'glow-red': '0 0 24px -2px rgba(229, 57, 53, 0.4)',
        'glow-accent': '0 0 24px -2px rgba(255, 107, 107, 0.4)',
        'glow-green': '0 0 20px -3px rgba(34, 197, 94, 0.35)',
        'glass': '0 8px 32px 0 rgba(229, 57, 53, 0.08)',
        'sticker': '0 15px 35px -5px rgba(43, 32, 32, 0.15)',
      },
      animation: {
        'scan': 'scan-line 2.5s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        'pulse-emergency': 'pulse-emergency 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'blob-slow': 'blob-move 14s ease-in-out infinite alternate',
      },
      keyframes: {
        'scan-line': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.94', transform: 'scale(1.02)' },
        },
        'pulse-emergency': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(229, 57, 53, 0.6)' },
          '50%': { opacity: '0.95', boxShadow: '0 0 0 12px rgba(229, 57, 53, 0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(6px)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(100%)' },
        },
        'blob-move': {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '50%': { transform: 'translate(30px, -20px) scale(1.06)' },
          '100%': { transform: 'translate(-20px, 20px) scale(0.96)' },
        }
      }
    },
  },
  plugins: [],
}
