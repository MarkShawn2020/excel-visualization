function filterDefault(values) {
	return Object.fromEntries(
		Object.entries(values).filter(([key]) => key !== "DEFAULT"),
	)
}

/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: {height: 0},
					to: {height: "var(--radix-accordion-content-height)"},
				},
				"accordion-up": {
					from: {height: "var(--radix-accordion-content-height)"},
					to: {height: 0},
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
		},
	},
	plugins: [
		require("tailwindcss-animate"),
		
		require('tailwindcss/plugin')(function ({addVariant, matchVariant, theme, matchUtilities}) {
			addVariant('not-first', '&:not(first-child)') // ref: https://www.reddit.com/r/tailwindcss/comments/s3wka1/comment/hspmjxo/?utm_source=share&utm_medium=web2x&context=3
			addVariant('not-last', '&:not(last-child)')
			
			addVariant("hocus", ["&:hover", "&:focus"])
			
			// 防止与animation的duration冲突， ref: https://github.com/jamiebuilds/tailwindcss-animate/blob/main/index.js
			matchUtilities(
				{"anim-duration": (value) => ({animationDuration: value})},
				{values: filterDefault(theme("animationDuration"))},
			)
			
		})
	],
}
