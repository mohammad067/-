# Styling Guidelines (Tailwind CSS + Shadcn UI)

## 1. Design Tokens

All colors, spacing, radii, and typography are defined as Tailwind theme
extensions in `tailwind.config.ts` — never as one-off hex codes or magic
numbers in component code.

```ts
// tailwind.config.ts (excerpt)
theme: {
  extend: {
    colors: {
      brand: {
        50: '#f7f8f3',
        500: '#7a8450',   // primary rice-shop green
        900: '#2e3320',
      },
      // semantic aliases consumed by shadcn components
      background: 'hsl(var(--background))',
      foreground: 'hsl(var(--foreground))',
      // ...
    },
    fontFamily: {
      sans: ['var(--font-inter)', 'sans-serif'],
    },
    borderRadius: {
      lg: 'var(--radius)',
    },
  },
}
```

CSS variables for semantic tokens (`--background`, `--foreground`,
`--radius`, etc.) are defined in `src/styles/globals.css` for both light and
dark themes, following the Shadcn UI theming convention.

## 2. Utility-First, No Ad Hoc CSS Files

- Styling is expressed with Tailwind utility classes directly on elements.
- Component-specific `.module.css` files are avoided; if a style cannot be
  expressed with utilities, prefer a small `@layer components` entry in
  `globals.css` over inline `style` props.
- `clsx`/`cn` helper (`src/lib/utils.ts`, standard Shadcn convention) is used
  to compose conditional classes — never string concatenation.

## 3. Shadcn UI Usage

- Base primitives (`Button`, `Dialog`, `Input`, `Select`, `Toast`, etc.) are
  generated via the Shadcn CLI into `src/components/ui/` and are treated as
  owned project code — customize directly rather than overriding via wrapper
  props.
- Do not fork visual variants ad hoc in feature code; add new `variant`
  entries to the relevant `cva` (class-variance-authority) definition in the
  base component so variants stay centrally discoverable.

## 4. Responsive Design

- Mobile-first: unprefixed utilities target mobile; breakpoints (`sm:`,
  `md:`, `lg:`, `xl:`) layer up.
- Standard breakpoints follow Tailwind defaults; no custom breakpoints unless
  a documented product need arises.

## 5. Dark Mode

- Supported via Tailwind's `class` strategy (`darkMode: 'class'`) and the
  Shadcn CSS-variable theme pattern, toggled by a theme provider.

## 6. Accessibility & Contrast

- Color combinations must meet WCAG AA contrast ratios; verified against the
  `brand` palette during design token definition.
- Interactive states (`hover:`, `focus-visible:`, `disabled:`) are required
  on all interactive elements — enforced in code review, not just relying on
  Shadcn defaults.

## 7. Animation Boundaries (Framer Motion)

- Tailwind handles static/transition-on-state-change styling
  (`transition-colors`, `hover:scale-105`) for simple cases.
- Framer Motion is reserved for: orchestrated multi-element animations, drag
  interactions, layout animations (`layoutId`), and route transitions — not
  simple hover color changes.
- See `07-component-guidelines.md` §4 for detailed Framer Motion conventions.

## 8. Linting

- `eslint-plugin-tailwindcss` enforces class ordering and flags unknown/
  conflicting utility classes.
