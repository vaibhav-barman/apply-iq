/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: '#070811',
        obsidian: '#0B0D17',
        surface: {
          DEFAULT: '#0F1221',
          subtle: '#14182B',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.04)'
        },
        electric: {
          violet: '#8B5CF6',
          cyan: '#22D3EE',
          indigo: '#4338CA',
          glow: 'rgba(139, 92, 246, 0.15)'
        },
        canvas: {
          text: '#F5F5FA',
          muted: '#A1A1B5',
          dim: '#62627A'
        },
        background: '#070811',
        foreground: '#F5F5FA',
        muted: {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          foreground: '#A1A1B5',
        },
        primary: {
          DEFAULT: '#8B5CF6', // Electric Violet
          foreground: '#F5F5FA',
        },
        secondary: {
          DEFAULT: '#22D3EE', // Electric Cyan
          foreground: '#F5F5FA',
        },
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
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glass-subtle': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glow-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.3)',
        'glow-violet': '0 0 35px -5px rgba(139, 92, 246, 0.25)',
        glow: '0 0 24px rgba(139, 92, 246, 0.15)',
        'glow-strong': '0 16px 48px -8px rgba(0, 0, 0, 0.7), 0 0 20px rgba(139, 92, 246, 0.12)',
        'glass-floor': '0 8px 32px -4px rgba(0, 0, 0, 0.5)',
        'btn-primary': 'inset 0 1px 0 rgba(255, 255, 255, 0.25)',
        'btn-primary-hover': '0 0 16px rgba(139, 92, 246, 0.4)',
        'input-focus': '0 0 0 3px rgba(139, 92, 246, 0.20)',
      }
    }
  },
  plugins: [],
}
