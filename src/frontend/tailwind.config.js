/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out'
      },

      // Suporte às variáveis de borda
      borderWidth: {
        DEFAULT: "var(--border-width, 1px)"
      },
      borderColor: {
        DEFAULT: "var(--border-color, transparent)"
      }
    },
  },

  plugins: [
    // Utilities de borda dependentes do tema
    function ({ addUtilities }) {
      addUtilities({
        ".border-theme": {
          border: "var(--border-default)",
        },
        ".border-theme-strong": {
          border: "var(--border-strong)",
        },
      });
    }
  ],
}
