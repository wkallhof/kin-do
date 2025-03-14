import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'bg-card-bg-1',
    'bg-card-bg-2',
    'bg-card-bg-3',
    'bg-card-bg-4',
    'bg-card-bg-5',
    'text-card-text',
    'bg-gradient-primary',
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))',
  			},
            'card-bg-1': 'hsl(var(--card-palette-1))',
            'card-bg-2': 'hsl(var(--card-palette-2))',
            'card-bg-3': 'hsl(var(--card-palette-3))',
            'card-bg-4': 'hsl(var(--card-palette-4))',
            'card-bg-5': 'hsl(var(--card-palette-5))',
            'card-text': 'hsl(var(--card-palette-text))',
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			activity: {
  				indoor: {
  					bg: 'hsl(var(--indoor-bg))',
  					border: 'hsl(var(--indoor-border))',
  					text: 'hsl(var(--indoor-text))'
  				},
  				outdoor: {
  					bg: 'hsl(var(--outdoor-bg))',
  					border: 'hsl(var(--outdoor-border))',
  					text: 'hsl(var(--outdoor-text))'
  				},
  				both: {
  					bg: 'hsl(var(--both-bg))',
  					border: 'hsl(var(--both-border))',
  					text: 'hsl(var(--both-text))'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
		fontFamily: {
			sans: ['Inter', 'sans-serif'],
		},
        backgroundImage: {
          'gradient-primary': 'linear-gradient(to bottom right, hsl(var(--background-gradient-start)), hsl(var(--background-gradient-end)))',
        },
  	}
  },
  plugins: [animate, typography],
} satisfies Config;
