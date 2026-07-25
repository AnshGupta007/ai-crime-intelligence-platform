# AI Rules

## Always

- Write production-quality, type-safe code
- Never use placeholder functions or TODO stubs in production code
- Never use mock data unless explicitly requested or for seed scripts
- Prefer reusable components over copy-pasted code
- Keep files under 400 lines — split into modules when exceeded
- Use TypeScript strict mode — no `any`, no `@ts-ignore`
- Add proper error handling for all API calls and async operations
- Handle loading, empty, error, and edge-case states in every component
- Use the `cn()` utility for conditional class merging
- Explain important decisions with brief comments only when necessary
- Write clean, readable code that is self-documenting

## Never

- Commit `.env` files, secrets, or API keys
- Use `console.log` in production code (use proper logging)
- Use `any` type — define proper interfaces/types
- Create circular dependencies between modules
- Use `require()` — always use ESM `import/export`
- Write imperative code when declarative alternatives exist
- Ignore TypeScript or ESLint errors
- Add comments that explain obvious code (e.g., `// increment counter`)

## Code Quality

- Follow the existing patterns in the codebase
- Maintain consistent naming conventions (see STYLEGUIDE.md)
- Keep functions small with single responsibility
- Extract repeated logic into shared utilities
- Use async/await for all asynchronous operations
- Validate all user inputs at API boundaries
- Write database queries with parameterized statements (Drizzle handles this)
- Use React Server Components for data fetching where possible
- Use client components only when interactivity is needed

## Database

- All schema changes go through Drizzle (`src/db/schema.ts`)
- Use Drizzle relations for table relationships
- Create proper indexes for query performance
- Use appropriate column types (varchar, text, uuid, etc.)
- Timestamps should use `defaultNow()` where appropriate
- Always define the inverse relation in `relations()`

## Git

- Write meaningful commit messages
- Keep commits focused on a single concern
- Do not commit generated files or build artifacts
