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
        surface: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          muted: '#F1F5F9',
          border: '#E2E8F0',
          borderDark: '#CBD5E1',
          textMain: '#0F172A',
          textMuted: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.08)',
        'card-hover': '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'modal': '0 20px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)',
        'glow-red': '0 0 20px -3px rgba(220, 38, 38, 0.35)',
        'glow-blue': '0 0 20px -3px rgba(22, 135, 255, 0.35)',
        'glow-teal': '0 0 20px -3px rgba(56, 198, 181, 0.35)',
        'glow-cyan': '0 0 20px -3px rgba(56, 217, 255, 0.35)',
        'glow-green': '0 0 20px -3px rgba(34, 197, 94, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        'sticker': '0 15px 35px -5px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'scan': 'scan-line 2.5s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        'pulse-emergency': 'pulse-emergency 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
      },
      keyframes: {
        'scan-line': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '50%': { opacity: '0.8' },
          '100%': { transform: 'translateY(100%)', opacity: '0' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.92', transform: 'scale(1.02)' },
        },
        'pulse-emergency': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(220, 38, 38, 0.6)' },
          '50%': { opacity: '0.95', boxShadow: '0 0 0 10px rgba(220, 38, 38, 0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
