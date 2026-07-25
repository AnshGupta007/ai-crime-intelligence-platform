# Testing Strategy

## Unit Tests

- **Services** — Utility functions (`formatNumber`, `cn`, `getRiskColor`)
- **Types** — Type-level tests for strict TypeScript compliance
- **Database** — Drizzle schema validation and relation integrity

## Integration Tests

- **API Routes** — Health check, dashboard stats, cases listing
- **Database Queries** — Drizzle query correctness with test database

## E2E Tests

- **Authentication flow** — Login, protected route access, logout
- **Dashboard** — KPI cards render with data, charts display correctly
- **Navigation** — All routes accessible from sidebar, correct page titles

## Manual Testing

- **Live data** — Verify with seeded 5K-10K records
- **Performance** — Dashboard load <2s, map with 1K markers <3s
- **Responsive** — Test on desktop (1920x1080) and tablet (768x1024)
- **Dark mode** — All text readable, contrast meets WCAG AA

## Tools

- **Vitest** for unit and integration tests
- **Playwright** for E2E browser tests
- **Manual** for visual regression and UX testing

## Coverage Goal

- 90%+ for utility functions
- 80%+ for API route handlers
- Key user flows covered by E2E tests
