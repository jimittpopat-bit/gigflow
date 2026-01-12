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
          DEFAULT: '#8b5cf6',
          light: '#a78bfa',
          dark: '#7c3aed',
        },
        secondary: {
          DEFAULT: '#ec4899',
        },
        accent: {
          DEFAULT: '#3b82f6',
        },
        dark: {
          DEFAULT: '#000000',
          card: 'rgba(20, 20, 25, 0.95)',
          darker: 'rgba(15, 15, 20, 0.98)',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
        'gradient-primary-dark': 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%)',
        'gradient-text': 'linear-gradient(135deg, #ffffff 0%, #a78bfa 100%)',
        'gradient-button': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #ec4899 100%)',
      },
      boxShadow: {
        'primary': '0 8px 24px rgba(139, 92, 246, 0.35)',
        'primary-lg': '0 12px 32px rgba(139, 92, 246, 0.35)',
        'primary-xl': '0 20px 48px rgba(139, 92, 246, 0.5)',
        'card': '0 40px 80px rgba(0, 0, 0, 0.6)',
        'glow': '0 0 120px rgba(139, 92, 246, 0.08)',
      },
      backdropBlur: {
        'heavy': '40px',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
        '3xl': '32px',
      },
      animation: {
        'atmosphere': 'atmosphereMove 25s ease-in-out infinite',
        'logo-shine': 'logoShine 3s ease-in-out infinite',
        'gradient-move': 'gradientMove 4s ease infinite',
        'border-glow': 'borderGlow 4s ease-in-out infinite',
      },
      keyframes: {
        atmosphereMove: {
          '0%, 100%': { transform: 'scale(1) translateY(0)', opacity: '0.6' },
          '50%': { transform: 'scale(1.1) translateY(-20px)', opacity: '0.8' },
        },
        logoShine: {
          '0%, 100%': { transform: 'translate(-100%, -100%) rotate(45deg)' },
          '50%': { transform: 'translate(100%, 100%) rotate(45deg)' },
        },
        gradientMove: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        borderGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}