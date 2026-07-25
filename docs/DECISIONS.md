# Architectural Decision Records

## ADR 001 — Use Next.js App Router instead of separate frontend/backend

**Status:** Approved

**Context:** The masterprompt specified React + Vite for frontend and Python FastAPI for backend. However, starting with Next.js 16 provides a unified codebase, shared TypeScript types, simpler deployment, and faster development for a hackathon.

**Decision:** Use Next.js 16 App Router with API Routes for the backend, keeping the architecture monorepo-style. If time permits, a FastAPI backend can be added later for the ML pipeline.

**Tradeoffs:**
- Pro: Single deploy target, shared types, faster iteration
- Pro: TypeScript end-to-end
- Con: Node.js may be slower than Python for ML-heavy workloads
- Con: Would need to migrate to FastAPI if ML pipeline becomes computationally intensive

## ADR 002 — Use Drizzle ORM instead of Prisma

**Status:** Approved

**Context:** Need type-safe SQL with good PostgreSQL support. Prisma is popular but has a heavier abstraction layer.

**Decision:** Use Drizzle ORM for its lightweight, SQL-like query API, excellent TypeScript support, and direct control over generated SQL.

**Tradeoffs:**
- Pro: More performant than Prisma for complex queries
- Pro: Full control over SQL
- Pro: Smaller bundle size
- Con: Smaller ecosystem and community compared to Prisma
- Con: Fewer migration features out of the box (drizzle-kit handles basics)

## ADR 003 — Single schema file vs. split schema modules

**Status:** Approved

**Context:** As the schema grows with 25+ tables, it could be split into multiple files.

**Decision:** Keep all schema definitions in a single `src/db/schema.ts` file for now. It's easier to maintain, review, and import. Split only if it exceeds 800 lines or becomes unwieldy.

**Tradeoffs:**
- Pro: Single import for all tables, easier to see relationships
- Con: Can become large (currently 578 lines, manageable)
