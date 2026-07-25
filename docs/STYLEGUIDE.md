# Style Guide

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Variables | camelCase | `firCount`, `isLoading` |
| Functions | camelCase | `fetchCases()`, `formatNumber()` |
| React Components | PascalCase | `CrimeMap`, `KPIGrid` |
| Files (components) | kebab-case | `crime-map.tsx`, `sidebar.tsx` |
| Files (pages) | kebab-case | `page.tsx`, `layout.tsx` |
| API Routes | kebab-case | `route.ts`, `stats/route.ts` |
| Database tables | snake_case | `case_master`, `crime_heads` |
| Database columns | snake_case | `fir_number`, `date_of_report` |
| CSS classes | Tailwind utility | Direct in JSX |
| Types/Interfaces | PascalCase | `CaseRecord`, `DashboardStats` |
| Enum values | snake_case | `"under_investigation"` |

## TypeScript

- Use strict mode in `tsconfig.json`
- Prefer `interface` over `type` for object shapes
- Use `type` for unions, intersections, and utility types
- Define props interfaces for all components
- Use `const` assertions for literal types
- Avoid `any` — use `unknown` and narrow with type guards

## React Components

- Use function components with explicit return types
- Use React 19 patterns (no class components)
- Destructure props in the function signature
- Keep components focused — extract sub-components for complex UIs
- Use React Server Components by default, client components only when needed (interactivity, browser APIs, state)
- Mark client components with `"use client"` directive

## CSS & Styling

- Use Tailwind CSS utility classes exclusively
- Use the `cn()` helper for conditional classes
- Maintain dark theme: `bg-slate-950` background, `text-slate-100` text
- Use Framer Motion for animations
- Avoid inline styles unless dynamic values require them

## Imports

Order:
1. External libraries (react, next, framer-motion)
2. Internal components (`@/components/...`)
3. Utilities and lib (`@/lib/utils`, `@/db/...`)
4. Types
5. Styles

No empty lines between import groups — single group with logical ordering.

## Functions

- Keep functions under 30 lines where possible
- Single responsibility — one function does one thing
- Use default parameters instead of conditionals
- Return early for guard clauses
- Async functions use `async/await`, not `.then()`

## Comments

- Only explain **why**, never explain **what** (the code should be self-explanatory)
- Use `//` for single-line and brief comments
- Use `/** */` for JSDoc on exported functions and complex types
- No commented-out code — delete it
