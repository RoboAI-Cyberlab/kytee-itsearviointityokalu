import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{html,md,mdx,ts,tsx}"],
  safelist: [
    "bg-[#f4f9f8]",
    "bg-[#fdecf5]",
    "bg-indigo-50",
    "text-blue-700",
    "text-indigo-700",
    "text-pinkki",
    "text-turkoosi-700",
    "ring-red-200",
    "ring-orange-200",
    "ring-[#cef3e7]",
    "ring-[#bddbd5]",
    "focus-within:ring-red-200",
    "focus-within:ring-orange-200",
    "focus-within:ring-[#cef3e7]",
    "focus-within:ring-[#bddbd5]",
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.800"),
            a: {
              color: theme("colors.turkoosi"),
              "&:hover": {
                color: theme("colors.turkoosi"),
              },
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
            blockquote: {
              borderLeftColor: theme("colors.turkoosi"),
              borderLeftWidth: "4px",
              paddingTop: ".5rem",
              paddingBottom: ".5rem",
              backgroundColor: theme("colors.gray.50"),
            },
          },
        },
      }),
      colors: {
        "gray-20": "#fcfcfd",
        musta: "#000000",
        turkoosi: "#1a847b",
        vesi: "#3DCCEB",
        taivas: "#69FFFA",
        lila: "#631CFF",
        pinkki: "#C93D8A",
        keltainen: "#FFB505",
        "turkoosi-50": "#f1fcf9",
        "turkoosi-100": "#d1f6ee",
        "turkoosi-200": "#a3ecde",
        "turkoosi-300": "#6cdccb",
        "turkoosi-400": "#3ec3b3",
        "turkoosi-500": "#25a79a",
        "turkoosi-600": "#1b877e",
        "turkoosi-700": "#1a6b65",
        "turkoosi-800": "#195652",
        "turkoosi-900": "#194845",
        "turkoosi-950": "#082b2a",
        "samk-50": "#daf1f7",
        "samk-600": "#00A5CD",
        "samk-700": "#02a0c6",
        "samk-light": "#55CFED",
        "custon-muted": "#707070",
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
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        "roles-bg": "oklch(0.94 0.03 262)",
      },
      fontFamily: {
        body: ["Inter Variable", ...defaultTheme.fontFamily.sans],
        sans: ["Inter Variable", ...defaultTheme.fontFamily.sans],
        serif: ["Inter Variable", ...defaultTheme.fontFamily.sans],
        title: ["Bai Jamjuree", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        small: "0.9375rem",
        lg: "1.0625rem",
        "2xl": "1.375rem",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};
