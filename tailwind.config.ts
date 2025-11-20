import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      // ✅ Custom Animations
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        blob: 'blob 8s infinite ease-in-out',
        'fade-in': 'fadeIn 1s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
}

export default config


// import type { Config } from 'tailwindcss'

// const config: Config = {
//   darkMode: ['class'],
//   content: [
//     './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/components/**/*.{js,ts,jsx,tsx,mdx}',
//     './src/app/**/*.{js,ts,jsx,tsx,mdx}',
//   ],
//   theme: {
//     extend: {
//       fontFamily: {
//         sans: ['Inter', 'system-ui', 'sans-serif'],
//         'playfair': ['Playfair Display', 'serif'],
//       },

//       // ----------------------------------------
//       //  🔵 BLUE, YELLOW & WHITE COLOR PALETTE
//       // ----------------------------------------
//       colors: {
//         primary: {
//           50:  '#eff6ff',   // very light blue
//           100: '#dbeafe',
//           200: '#bfdbfe',
//           300: '#93c5fd',
//           400: '#60a5fa',
//           500: '#3b82f6',   // BLUE – core brand color
//           600: '#2563eb',
//           700: '#1d4ed8',   // Dark blue for hero overlay
//           800: '#1e40af',
//           900: '#1e3a8a',
//           DEFAULT: '#3b82f6',
//           foreground: '#ffffff',
//         },

//         secondary: {
//           50:  '#fefce8',   // very light yellow
//           100: '#fef9c3',
//           200: '#fef08a',
//           300: '#fde047',
//           400: '#facc15',
//           500: '#eab308',   // YELLOW – accent color
//           600: '#ca8a04',
//           700: '#a16207',
//           800: '#854d0e',
//           900: '#713f12',
//           DEFAULT: '#eab308',
//           foreground: '#000000',
//         },
//         // Global surfaces
//         background: '#ffffff',   // white
//         foreground: '#1e3a8a',   // dark blue text

//         // shadcn UI tokens still work normally
//         card: {
//           DEFAULT: 'hsl(var(--card))',
//           foreground: 'hsl(var(--card-foreground))',
//         },
//         popover: {
//           DEFAULT: 'hsl(var(--popover))',
//           foreground: 'hsl(var(--popover-foreground))',
//         },
//         muted: {
//           DEFAULT: 'hsl(var(--muted))',
//           foreground: 'hsl(var(--muted-foreground))',
//         },
//         accent: {
//           DEFAULT: 'hsl(var(--accent))',
//           foreground: 'hsl(var(--accent-foreground))',
//         },
//         destructive: {
//           DEFAULT: 'hsl(var(--destructive))',
//           foreground: 'hsl(var(--destructive-foreground))',
//         },
//         border: 'hsl(var(--border))',
//         input: 'hsl(var(--input))',
//         ring: 'hsl(var(--ring))',

//         chart: {
//           1: 'hsl(var(--chart-1))',
//           2: 'hsl(var(--chart-2))',
//           3: 'hsl(var(--chart-3))',
//           4: 'hsl(var(--chart-4))',
//           5: 'hsl(var(--chart-5))',
//         },
//       },

//       // ----------------------------------------
//       //  🔵 Border Radius
//       // ----------------------------------------
//       borderRadius: {
//         lg: 'var(--radius)',
//         md: 'calc(var(--radius) - 2px)',
//         sm: 'calc(var(--radius) - 4px)',
//       },

//       // ----------------------------------------
//       //  ✨ Custom Animations
//       // ----------------------------------------
//       keyframes: {
//         blob: {
//           '0%': { transform: 'translate(0px, 0px) scale(1)' },
//           '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
//           '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
//           '100%': { transform: 'translate(0px, 0px) scale(1)' },
//         },
//         fadeIn: {
//           '0%': { opacity: '0' },
//           '100%': { opacity: '1' },
//         },
//         slideUp: {
//           '0%': { transform: 'translateY(20px)', opacity: '0' },
//           '100%': { transform: 'translateY(0)', opacity: '1' },
//         },
//       },
//       animation: {
//         blob: 'blob 8s infinite ease-in-out',
//         'fade-in': 'fadeIn 1s ease-out',
//         'slide-up': 'slideUp 0.8s ease-out',
//       },
//     },
//   },

//   plugins: [
//     require('tailwindcss-animate'),
//     require('@tailwindcss/typography'),
//   ],
// }

// export default config

