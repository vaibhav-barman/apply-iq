/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#070811',
        foreground: '#F8FAFC',
        muted: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          foreground: '#94A3B8',
        },
        primary: {
          DEFAULT: '#6366F1', // Soft Indigo
          foreground: '#F8FAFC',
        },
        secondary: {
          DEFAULT: '#8B5CF6', // Electric Violet
          foreground: '#F8FAFC',
        },
        tertiary: {
          DEFAULT: '#22D3EE', // Luminous Cyan
          foreground: '#000608',
        },
        card: {
          DEFAULT: 'rgba(23, 26, 48, 0.70)',
          foreground: '#F8FAFC',
        },
        glass: {
          base: 'rgba(15, 17, 32, 0.65)',
          raised: 'rgba(23, 26, 48, 0.70)',
          hover: 'rgba(30, 34, 62, 0.85)',
        },
        border: 'rgba(255, 255, 255, 0.08)',
        'border-active': 'rgba(99, 102, 241, 0.35)',
        success: {
          DEFAULT: '#10B981', // Emerald
          foreground: '#ffffff',
          bg: 'rgba(16, 185, 129, 0.12)',
        },
        warning: {
          DEFAULT: '#F59E0B', // Amber
          foreground: '#ffffff',
        },
        danger: {
          DEFAULT: '#F43F5E', // Coral Red
          foreground: '#ffffff',
        },
      },
      borderRadius: {
        lg: '1rem', // 16px
        md: '0.75rem', // 12px
        sm: '0.5rem', // 8px
        xl: '1.5rem', // 24px
        pill: '9999px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Geist Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(99, 102, 241, 0.15)',
        'glow-strong': '0 16px 48px -8px rgba(0, 0, 0, 0.7), 0 0 20px rgba(99, 102, 241, 0.12)',
        'glass-floor': '0 8px 32px -4px rgba(0, 0, 0, 0.5)',
        'btn-primary': 'inset 0 1px 0 rgba(255, 255, 255, 0.25)',
        'btn-primary-hover': '0 0 16px rgba(99, 102, 241, 0.4)',
        'input-focus': '0 0 0 3px rgba(99, 102, 241, 0.20)',
      }
    },
  },
  plugins: [],
}
