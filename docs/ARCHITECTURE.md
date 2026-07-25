# System Architecture

## High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Next.js 16 Application                        │
│  ┌──────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │   Pages/UI   │  │   API Routes     │  │   Server Components  │  │
│  │  (React 19)  │  │  (Node.js)       │  │   (RSC)              │  │
│  └──────┬───────┘  └────────┬─────────┘  └──────────────────────┘  │
│         │                   │                                       │
│  ┌──────┴───────────────────┴──────────────────────────────────┐   │
│  │                    Drizzle ORM                               │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
└─────────────────────────────┼──────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │    PostgreSQL 15   │
                    │   + PostGIS (opt)  │
                    └───────────────────┘
```

## Frontend Architecture

| Module | Technology | Purpose |
|--------|-----------|---------|
| Framework | Next.js 16 (App Router) | SSR, routing, API routes |
| UI Layer | React 19 + TypeScript 5.9 | Component tree |
| Styling | Tailwind CSS 4.1 | Utility-first CSS |
| Animation | Framer Motion | Page transitions, number counters |
| Maps | React-Leaflet + Leaflet | Interactive crime map |
| Charts | Recharts | Dashboard charts, forecasts |
| Graph | @xyflow/react (React Flow) | Knowledge graph visualization |
| Icons | Lucide React | Icon library |
| Utilities | clsx + tailwind-merge | Class merging (cn helper) |

### Component Tree
```
RootLayout
├── Sidebar (nav items, collapsible)
└── Main Content (page router)
    ├── DashboardPage
    │   ├── KPIGrid (animated counters)
    │   ├── TrendChart (area chart)
    │   ├── CrimeCategoryChart (bar chart)
    │   ├── AlertFeed (severity-coded list)
    │   └── RecentCasesTable (paginated)
    ├── MapPage
    │   ├── CrimeMap (Leaflet)
    │   ├── MapControls (layers, filters)
    │   ├── TimeSlider
    │   └── PatrolPanel
    ├── GraphPage
    │   ├── NetworkGraph (React Flow)
    │   ├── NodeDetails (sidebar)
    │   └── GraphControls
    ├── AiPage
    │   ├── ForecastChart
    │   ├── RiskHeatmap
    │   └── AnomalyList
    ├── CasesPage
    │   ├── CaseTable
    │   └── CaseDetail
    └── ReportsPage
        └── ReportBuilder
```

### State Management
- Zustand store for global state (user, alerts, filters)
- React Server Components for data-fetching pages where possible
- Client components with `useEffect` + fetch for interactive pages

## Backend Architecture

| Layer | Technology | Purpose |
|-------|-----------|---------|
| API | Next.js Route Handlers | REST endpoints |
| ORM | Drizzle ORM | Type-safe SQL queries |
| DB | PostgreSQL 15 | Persistent storage |
| Cache | In-memory / Redis (optional) | Hot data caching |

### API Route Structure
```
/api
├── ai/analytics       # AI/ML analytics endpoint
├── cases              # CRUD for FIR cases
├── dashboard/stats    # Dashboard KPIs and aggregates
└── health             # Health check
```

### Data Flow
```
Client Request → API Route → Drizzle Query → PostgreSQL
                                    ↓
                              Response (JSON)
                                    ↓
                         Client renders component
```

## Database Architecture
- PostgreSQL 15 with Drizzle ORM
- Full schema in `src/db/schema.ts` with 25+ tables
- Relations defined with Drizzle `relations()` for type-safe joins
- Spatial queries via lat/lon columns (PostGIS optional)

## Security Architecture
- JWT-based authentication (via API routes)
- Role-based access: SCRB (full), SP (district), IO (station)
- Input validation via TypeScript types and Drizzle schema
- Environment variables for secrets (never committed)

## Performance Architecture
- Database indexes on: `fir_number`, `date_of_report`, `district_code`, `unit_code`, `crime_head_code`, `accused_name`
- Server-side pagination for case lists
- Client-side caching of static reference data
- Skeleton loading states for async components
