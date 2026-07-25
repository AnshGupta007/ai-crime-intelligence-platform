# MASTER PROMPT: Crime Intelligence & Analytical Platform
## For Cursor AI Code Editor — Karnataka State Police Hackathon

> **How to use this document:** The project is split into phases. Each phase is a self-contained prompt you paste into a **fresh Cursor conversation**. Phase 0 is the foundation — read it once and keep it for reference. Each later phase starts with a "Context" section that summarizes what previous phases built, so the AI can continue without reading earlier conversations.

---

## PHASE 0 — PROJECT FOUNDATION (Read Once, Keep for Reference)

This phase is **not built**. It is the permanent specification doc. Read it, then start with Phase 1.

### PROJECT OVERVIEW
Build a full-stack web application that transforms KSP's Excel-based, siloed crime records into an integrated, AI-powered Strategic Intelligence Hub. The platform ingests FIR data, performs advanced analytics, visualizes crime patterns on interactive maps, detects criminal networks, and predicts emerging crime risks.

**Key Rule:** Every feature must be functional, not placeholder. Use mock data where real data isn't available, but the logic must be production-grade.

### TECH STACK

**Frontend**
- React 18 with TypeScript
- Vite as build tool
- Tailwind CSS for styling
- shadcn/ui for UI components (install via CLI)
- Recharts for charts
- React-Leaflet for maps (OpenStreetMap tiles)
- React-Force-Graph-2D for network graphs
- Lucide React for icons
- React Router DOM for routing
- Zustand for state management

**Backend**
- Python FastAPI (async, typed)
- SQLAlchemy 2.0 with async support
- Alembic for migrations
- Pydantic v2 for validation
- Uvicorn as ASGI server
- python-jose for JWT auth
- passlib for password hashing
- pandas, numpy for data processing
- scikit-learn for ML
- networkx for graph analysis
- prophet for forecasting (or simple ARIMA fallback)

**Database**
- PostgreSQL 15 with PostGIS extension
- Redis for caching and sessions

**Deployment**
- Docker + Docker Compose for local development

### PROJECT STRUCTURE

```
crime-intelligence-platform/
├── docker-compose.yml
├── README.md
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── redis_client.py
│   │   ├── auth/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   ├── services/
│   │   │   └── ml/
│   │   ├── seeders/
│   │   └── utils/
│   └── alembic/
│       ├── env.py
│       └── versions/
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── index.html
│   └── src/
│       ├── main.tsx
│       ├── App.tsx
│       ├── index.css
│       ├── lib/
│       ├── store/
│       ├── types/
│       ├── components/
│       │   ├── ui/
│       │   ├── layout/
│       │   ├── dashboard/
│       │   ├── map/
│       │   ├── network/
│       │   ├── predictions/
│       │   └── reports/
│       ├── pages/
│       └── hooks/
└── nginx/
    └── nginx.conf
```

### CRITICAL REMINDERS (All Phases)
1. NO PLACEHOLDERS — Every button must work. Every chart must show real data.
2. USE REAL ALGORITHMS — DBSCAN, Isolation Forest, NetworkX must actually execute.
3. BEAUTIFUL UI — Gradients, shadows, animations. Judges care about visuals.
4. FAST PERFORMANCE — Cache aggressively. Optimize SQL. Use async.
5. REALISTIC DATA — Karnataka districts, Kannada names, realistic patterns.
6. ERROR HANDLING — Graceful failures everywhere.
7. TYPE SAFETY — Full TypeScript frontend, type hints backend.
8. DEMO-READY — Stable for a 5-minute live demo.

---

## PHASE 1 — DATABASE SCHEMA + MIGRATIONS

Use this prompt in a **new conversation** after reading Phase 0.

### CONTEXT (What came before)
This is Phase 1 of building the Crime Intelligence Platform. No code exists yet. Refer to Phase 0 for the full project overview, tech stack, and structure.

### GOAL
Create the complete PostgreSQL database schema with Alembic migrations. Implement ALL tables from the Karnataka Police FIR ER Diagram and analytics tables.

### STEP 1.1 — Create `backend/` directory structure

Create the following files and folders:

**`backend/requirements.txt`**
```
fastapi==0.109.0
uvicorn[standard]==0.25.0
sqlalchemy==2.0.25
alembic==1.13.0
psycopg2-binary==2.9.9
geoalchemy2==0.14.3
shapely==2.0.2
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
pydantic==2.5.3
pydantic-settings==2.1.0
redis==5.0.1
pandas==2.1.4
numpy==1.26.2
scikit-learn==1.3.2
networkx==3.2.1
prophet==1.1.5
faker==20.1.0
```

**`backend/app/__init__.py`** — empty
**`backend/app/config.py`** — Settings class with DATABASE_URL, REDIS_URL, SECRET_KEY, etc.
**`backend/app/database.py`** — SQLAlchemy async engine + session factory
**`backend/app/redis_client.py`** — Redis connection pool

### STEP 1.2 — SQLAlchemy Models

Create ALL model files under `backend/app/models/`. Use the exact SQL schema below:

**`backend/app/models/base.py`** — SQLAlchemy DeclarativeBase

**`backend/app/models/case_master.py`** — CaseMaster (central table)
```sql
case_master_id SERIAL PRIMARY KEY
crime_no VARCHAR(25) UNIQUE NOT NULL
case_no VARCHAR(15) NOT NULL
crime_registered_date DATE NOT NULL
police_person_id INT FK -> employees
police_station_id INT FK -> units
case_category_id INT FK -> case_categories
gravity_offence_id INT FK -> gravity_offences
crime_major_head_id INT FK -> crime_heads
crime_minor_head_id INT FK -> crime_sub_heads
case_status_id INT FK -> case_status_masters
court_id INT FK -> courts
incident_from_date TIMESTAMP
incident_to_date TIMESTAMP
info_received_ps_date TIMESTAMP
latitude DECIMAL(10,8)
longitude DECIMAL(11,8)
brief_facts TEXT
created_at TIMESTAMP DEFAULT NOW()
geom GEOMETRY(POINT, 4326)  -- PostGIS
```
Add a GIST index on `geom`.

**`backend/app/models/complainant.py`** — ComplainantDetails
**`backend/app/models/victim.py`** — Victim
**`backend/app/models/accused.py`** — Accused
**`backend/app/models/arrest_surrender.py`** — ArrestSurrender
**`backend/app/models/act_section.py`** — Act, Section, ActSectionAssociation
**`backend/app/models/crime_classification.py`** — CrimeHead, CrimeSubHead
**`backend/app/models/geography.py`** — State, District, Unit
**`backend/app/models/personnel.py`** — Employee, Rank, Designation
**`backend/app/models/reference.py`** — CasteMaster, ReligionMaster, OccupationMaster, UnitType, Court, CaseStatus, CaseCategory, GravityOffence
**`backend/app/models/analytics.py`** — CrimeHotspot, RiskPrediction, AnomalyDetection, MOPattern, Alert

### STEP 1.3 — Alembic Setup

- Create `backend/alembic.ini` pointing to `app/models/base.py`
- Create `backend/alembic/env.py` with async Alembic config
- Run `alembic revision --autogenerate -m "initial_schema"`
- Review and fix the generated migration

### VERIFICATION
- All model files exist with proper SQLAlchemy 2.0 typing
- Alembic can generate migrations without errors
- Foreign keys, indexes, and PostGIS geometry columns are correct

---

## PHASE 2 — DATA SEEDER

Use this prompt in a **new conversation** after Phase 1 is complete.

### CONTEXT (What came before)
Phase 1 is complete. The database schema with all 20+ tables is created via Alembic. The models are in `backend/app/models/`. The database connection is configured.

### GOAL
Generate realistic mock Karnataka police data — 5,000–10,000 FIR records with intentional crime patterns.

### WHAT TO BUILD

**`backend/app/seeders/__init__.py`** — empty
**`backend/app/seeders/data_seeder.py`**

Create a `DataSeeder` class with these methods:

`seed_all()` — Orchestrator that calls all seed methods in dependency order.

`seed_reference_tables()` — Create lookup data:
- 31 Karnataka districts (Bangalore Urban, Bangalore Rural, Mysuru, Dakshina Kannada, Dharwad, Belagavi, Ballari, Hassan, Mandya, Tumakuru, Shivamogga, Davangere, Chitradurga, Kodagu, Raichur, Kalaburagi, Bidar, Koppal, Uttara Kannada, Udupi, Chamarajanagar, Ramanagara, Chikkaballapura, Kolar, Bagalkote, Gadag, Haveri, Yadgir, Vijayapura, Chikkmagaluru, Vijayanagara)
- ~200 police stations across districts
- 15+ crime heads (Murder, Rape, Theft, Burglary, Cybercrime, etc.)
- Statuses, categories, gravity levels, courts, ranks, designations
- Caste, religion, occupation reference tables

`seed_cases(count=8000)` — Generate FIR records:
- Crime numbers in format `FIR/2025/0001`
- Dates spanning 2024–2026
- Lat/lon within Karnataka bounds (11.5–18.5 N, 74–78.5 E)
- Realistic brief facts using faker
- Link to proper police station, district, crime head

`seed_persons()` — Generate complainants, victims, accused (1–3 per case).

`seed_arrests()` — Arrest records for ~30% of cases.

`seed_act_sections()` — Assign IPC sections to cases.

`seed_analytics_tables()` — Populate empty hotspot/prediction/anomaly tables.

### INTENTIONAL PATTERNS (CRITICAL — seed these exactly)
1. **Hotspot in Koramangala (Bangalore Urban):** 40+ theft cases within 1km radius
2. **Organized gang:** 5 accused linked across 8 cases in Bangalore and Mysuru
3. **Repeat offender "Ramesh Kumar":** 6 cases across 3 districts
4. **Temporal pattern:** Chain-snatching spikes 6–8 PM weekdays
5. **Anomaly:** Murder in a district with zero murders in 2 years
6. **Emerging trend:** Cyber fraud doubling month-over-month in Bangalore
7. **Seasonal pattern:** Property crimes spike during festival months

### VERIFICATION
- `python -c "from app.seeders.data_seeder import DataSeeder; DataSeeder().seed_all()"` runs without error
- `SELECT COUNT(*) FROM case_masters` returns 5000–10000 rows
- All foreign key relationships are valid
- Repeat offender "Ramesh Kumar" exists and has 6+ cases
- Koramangala has 40+ theft cases

---

## PHASE 3 — BACKEND CORE + API ROUTERS

Use this prompt in a **new conversation** after Phase 2 is complete.

### CONTEXT (What came before)
Phase 1: Database schema with all tables, Alembic migrations.
Phase 2: Data seeder with 5,000–10,000 realistic FIR records and intentional crime patterns.

### GOAL
Build the FastAPI application with all API routers, Pydantic schemas, and service layer with real SQL queries.

### WHAT TO BUILD

**`backend/app/main.py`** — FastAPI app with:
- CORS middleware (allow all origins for hackathon)
- Lifespan context manager: init DB pool + auto-seed on first run
- Include all routers under `/api/v1/`
- Health check at `/health`
- OpenAPI docs at `/docs`

**Pydantic Schemas** under `backend/app/schemas/`:
- `case.py` — CaseOut, CaseList, CaseDetail
- `dashboard.py` — SummaryKPIs, TrendData, CategoryBreakdown, AlertOut
- `map.py` — DistrictDensity, HotspotOut, CaseMapPin, TemporalPattern
- `network.py` — NodeOut, EdgeOut, NetworkGraph, RepeatOffender
- `prediction.py` — ForecastOut, RiskScoreOut

**Routers** under `backend/app/routers/` (each returns proper Pydantic models):

`dashboard.py`:
- `GET /dashboard/summary` — total_firs, today_firs, active_hotspots, critical_alerts, mom_change, yoy_change
- `GET /dashboard/trends?months=6` — daily counts grouped by category (date_trunc)
- `GET /dashboard/categories` — top 5 categories with counts and percentages
- `GET /dashboard/alerts?limit=10` — recent alerts ordered by created_at DESC
- `GET /dashboard/recent-cases?limit=10` — recent cases with district/type/status

`cases.py`:
- `GET /cases` — paginated list with filters (district, status, crime_head, search)
- `GET /cases/{id}` — full detail with complainant, victims, accused, acts
- `GET /cases/{id}/network` — related cases via shared accused/vehicles/phones

`map.py`:
- `GET /map/districts` — all districts with FIR counts
- `GET /map/districts/{id}/density` — FIRs in last 30 days
- `GET /map/hotspots` — DBSCAN clusters with center, radius, count, risk
- `GET /map/cases?north=&south=&east=&west=` — PostGIS ST_Within query
- `GET /map/temporal-pattern` — hourly + weekly distribution arrays

`network.py`:
- `GET /network/accused/{id}?depth=2` — NetworkX graph from accused-case relationships
- `GET /network/communities` — greedy_modularity_communities on co-occurrence graph
- `GET /network/repeat-offenders?min_cases=2` — grouped accused with case counts
- `GET /network/search?q=` — search accused by name

`predictions.py`:
- `GET /predictions/forecast` — Prophet/sklearn time series forecast
- `GET /predictions/risk-scores` — per-district risk (incident_rate + trend + hotspots + repeat_offenders)

`anomalies.py`:
- `GET /anomalies` — list from anomaly_detections table
- `GET /anomalies/{id}` — single anomaly detail
- `POST /anomalies/{id}/review` — mark as reviewed

`reports.py`:
- `POST /reports/generate` — generate report (returns job ID)
- `GET /reports/{id}/download` — download generated report

`alerts.py`:
- `GET /alerts` — list alerts
- `POST /alerts/{id}/read` — mark alert as read

**Service Layer** under `backend/app/services/`:
Implement real SQL queries in each service. Use async SQLAlchemy 2.0 session.

### PERFORMANCE REQUIREMENTS
- Database indexes on: `case_masters(crime_registered_date)`, `case_masters(police_station_id)`, `case_masters(district_id)`, `accused(accused_name)`
- Dashboard summary response < 500ms p95

### VERIFICATION
- `uvicorn app.main:app --reload` starts without error
- `curl http://localhost:8000/health` returns `{"status": "ok"}`
- `curl http://localhost:8000/api/v1/dashboard/summary` returns real aggregate data
- All endpoints return properly typed JSON matching Pydantic schemas

---

## PHASE 4 — AUTH SYSTEM (JWT + RBAC)

Use this prompt in a **new conversation** after Phase 3 is complete.

### CONTEXT (What came before)
Phase 1: Database schema + migrations.
Phase 2: Data seeder with 5,000–10,000 mock FIR records.
Phase 3: FastAPI app with all API routers, services, and Pydantic schemas. The app runs at `localhost:8000`.

### GOAL
Implement JWT-based authentication with Role-Based Access Control (RBAC) — SCRB (full access), SP (district access), IO (station access).

### WHAT TO BUILD

**`backend/app/auth/schemas.py`**:
- `TokenOut` — access_token, token_type, expires_in
- `UserLogin` — username, password
- `UserRegister` — username, password, role, district_id, station_id
- `UserOut` — user_id, username, role, district_id, station_id

**`backend/app/auth/utils.py`**:
- `hash_password(plain: str) -> str` — passlib bcrypt
- `verify_password(plain: str, hashed: str) -> bool`
- `create_access_token(data: dict) -> str` — python-jose JWT with expiry
- `decode_access_token(token: str) -> dict`

**`backend/app/auth/dependencies.py`**:
- `get_current_user()` — Extract JWT from Authorization header, decode, return user
- `require_role(allowed_roles: list[str])` — Dependency that checks role and raises 403
- SP can only access their own district's data
- IO can only access their own station's data

**`backend/app/auth/router.py`**:
- `POST /auth/register` — Create user with hashed password
- `POST /auth/login` — Verify credentials, return JWT
- `GET /auth/me` — Return current user info (requires auth)

**Add a `users` table** to the database model:
```sql
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(10) NOT NULL CHECK (role IN ('SCRB', 'SP', 'IO')),
    district_id INT REFERENCES districts(district_id),
    station_id INT REFERENCES units(unit_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### VERIFICATION
- Register 3 test users (one SCRB, one SP, one IO)
- Login returns valid JWT token
- SCRB can access any district's data
- SP gets 403 trying to access another district
- IO gets 403 trying to access another station
- Invalid/expired tokens return 401

---

## PHASE 5 — FRONTEND SHELL + AUTH UI

Use this prompt in a **new conversation** after Phase 4 is complete.

### CONTEXT (What came before)
Phase 1–2: Database schema + data seeder with 5,000–10,000 mock FIRs.
Phase 3: FastAPI backend at `localhost:8000` with all API endpoints.
Phase 4: JWT auth system with RBAC (SCRB, SP, IO roles).

### GOAL
Create the complete frontend project with Vite + React 18, all routing, layout, sidebar, auth pages, and API client. Connect to the backend.

### WHAT TO BUILD

Initialize a React 18 + Vite + TypeScript project in `frontend/`:

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install tailwindcss @tailwindcss/vite lucide-react recharts react-leaflet leaflet react-force-graph-2d zustand react-router-dom framer-motion axios
npm install -D @types/leaflet
npx shadcn@latest init
npx shadcn@latest add card button badge table dialog dropdown-menu tabs select
```

**`frontend/src/lib/utils.ts`** — `cn()` helper (clsx + tailwind-merge)
**`frontend/src/lib/api.ts`** — Axios instance with base URL `http://localhost:8000/api/v1`, interceptors for JWT injection and 401 handling
**`frontend/src/lib/constants.ts`** — App constants (Karnataka districts, crime types, colors)

**`frontend/src/store/useAppStore.ts`** — Zustand store:
```typescript
interface AppStore {
  user: User | null;
  alerts: Alert[];
  selectedDistrict: number | null;
  selectedDateRange: [Date, Date];
  selectedCrimeCategory: number | null;
  // setters
}
```

**`frontend/src/types/`** — TypeScript interfaces for Case, Dashboard, Map, Network entities.

**`frontend/src/components/ui/`** — shadcn/ui components (already installed via CLI).

**`frontend/src/components/layout/`**:
- `Sidebar.tsx` — Dark navy (`#0f172a`), collapsible, shows nav items + user info
- `TopBar.tsx` — Breadcrumbs + alert bell + user dropdown
- `Layout.tsx` — Sidebar + TopBar + main content area
- `ProtectedRoute.tsx` — Redirect to login if no JWT, check RBAC role

**`frontend/src/pages/LoginPage.tsx`** — Login form with username/password, calls `/auth/login`, stores JWT in localStorage + Zustand.

**`frontend/src/App.tsx`** — React Router setup:
```
/login          -> LoginPage (public)
/dashboard      -> DashboardPage (protected)
/map            -> MapPage (protected)
/network        -> NetworkPage (protected)
/predictions    -> PredictionsPage (protected)
/anomalies      -> AnomaliesPage (protected)
/reports        -> ReportsPage (protected)
/settings       -> SettingsPage (protected)
```

### UI THEME (All frontend phases)
- Sidebar: `#0f172a` (dark navy)
- Background: `#f8fafc` (light gray)
- Accent: `#3b82f6` (blue), `#ef4444` (red), `#f59e0b` (amber), `#10b981` (green)
- Animations: Framer Motion for page transitions, number counters
- Loading: Skeleton loaders for all async components
- Error: Toast notifications
- Responsive: Collapsible sidebar, stacked layouts on mobile

### VERIFICATION
- `npm run dev` starts the frontend
- Login page renders, login works, JWT stored
- After login, redirects to dashboard
- Sidebar shows correct nav items based on role
- Logout clears JWT and redirects to login

---

## PHASE 6 — DASHBOARD UI

Use this prompt in a **new conversation** after Phase 5 is complete.

### CONTEXT (What came before)
Phase 1–2: Database + mock data (5,000+ FIRs).
Phase 3–4: FastAPI backend with auth running at `localhost:8000`.
Phase 5: Frontend shell with Vite + React 18 + shadcn/ui. Login works, sidebar and routing are set up.

### GOAL
Build the full Dashboard page with KPI cards, charts, map preview, alert feed, and recent cases table — all pulling real data from the API.

### WHAT TO BUILD

**`frontend/src/pages/DashboardPage.tsx`**:

1. **KPI Cards** — 4 cards in a row:
   - Total FIRs (with MoM change %, up/down arrow)
   - Today's FIRs
   - Active Hotspots
   - Critical Alerts
   Each card: animated number counter, trend indicator, gradient background

2. **Karnataka Choropleth Map** — Leaflet with GeoJSON district boundaries. Color by crime density (red=high, yellow=medium, green=low). Click to drill down.

3. **Trend Chart** — Recharts AreaChart, 6-month daily crime counts.

4. **Crime Category Distribution** — Recharts horizontal BarChart, top 5 categories with percentages.

5. **Alert Feed** — Scrollable list, color-coded severity badges (CRITICAL=red, WARNING=orange, WATCH=yellow).

6. **Recent Cases Table** — Paginated, sortable, columns: FIR#, Date, Type, District, Status.

**`frontend/src/components/dashboard/`**:
- `KPIGrid.tsx`
- `TrendChart.tsx`
- `CrimeCategoryChart.tsx`
- `AlertFeed.tsx`
- `RecentCasesTable.tsx`

**`frontend/src/hooks/useDashboard.ts`** — Fetch hook calling:
- `GET /dashboard/summary`
- `GET /dashboard/trends?months=6`
- `GET /dashboard/categories`
- `GET /dashboard/alerts?limit=10`
- `GET /dashboard/recent-cases?limit=10`

### VERIFICATION
- Dashboard loads under 2 seconds
- KPI cards show real numbers from API
- Charts render with actual data
- Map shows district boundaries with crime density colors
- Alert feed shows color-coded alerts
- Table is paginated and sortable

---

## PHASE 7 — MAP PAGE (FULL INTERACTIVE MAP)

Use this prompt in a **new conversation** after Phase 6 is complete.

### CONTEXT (What came before)
Phase 1–2: Database + mock data.
Phase 3–4: Backend at `localhost:8000` with auth.
Phase 5–6: Frontend shell with login, sidebar, dashboard with KPI cards and charts.

### GOAL
Build the full Crime Map page with interactive Leaflet map, hotspot detection, time slider, date range picker, and patrol recommendations.

### WHAT TO BUILD

**`frontend/src/pages/MapPage.tsx`** — Full-screen map page:

1. **Interactive Leaflet Map** — Full height, CARTO dark tile layer
2. **Layer Controls** — Toggle: Heatmap, Police Stations, Hotspots, Case Markers
3. **Time Slider** — Filter cases by hour of day (00:00–23:59)
4. **Date Range Picker** — Filter cases by date range
5. **Crime Category Dropdown** — Filter by crime type
6. **Hotspot Circles** — Pulsing CSS animation for critical zones
7. **Case Detail Popup** — On marker click: FIR#, date, type, brief facts
8. **District Boundary Overlay** — GeoJSON district polygons
9. **Patrol Recommendation Panel** — Side panel with optimal patrol routes based on hotspot density

**`frontend/src/components/map/`**:
- `CrimeMap.tsx` — Main Leaflet map component
- `HotspotLayer.tsx` — Pulsing circle markers for hotspots
- `DistrictChoropleth.tsx` — District polygon overlay with crime density colors
- `TimeSlider.tsx` — Range slider for hour filtering
- `MapControls.tsx` — Layer toggle buttons + date picker

**`frontend/src/hooks/useMapData.ts`** — Fetch:
- `GET /map/districts`
- `GET /map/hotspots?days=30`
- `GET /map/cases?north=&south=&east=&west=`
- `GET /map/temporal-pattern`

### VERIFICATION
- Map loads with CARTO dark tiles
- All layer toggles work (heatmap, stations, hotspots, cases)
- Time slider filters markers in real-time
- Hotspot circles pulse for critical zones
- Clicking a marker shows case detail popup
- District boundaries overlay correctly
- Patrol recommendations panel shows optimized routes

---

## PHASE 8 — NETWORK GRAPH PAGE

Use this prompt in a **new conversation** after Phase 7 is complete.

### CONTEXT (What came before)
Phase 1–2: Database + mock data with criminal network patterns.
Phase 3–4: Backend with auth.
Phase 5–7: Frontend with login, dashboard, map page — all working.

### GOAL
Build the Criminal Network page with a force-directed graph using react-force-graph-2d, search, node details sidebar, and community detection.

### WHAT TO BUILD

**`frontend/src/pages/NetworkPage.tsx`**:

1. **Force-Directed Graph** — react-force-graph-2d, nodes colored by type:
   - Accused = blue
   - Victim = green
   - Location = red
   - Case = yellow

2. **Search Bar** — Find accused by name, highlight matching nodes

3. **Node Detail Sidebar** — On click shows:
   - Profile (name, age, status)
   - Linked cases list
   - MO pattern summary
   - Risk score
   - Degree/betweenness centrality

4. **Network Metrics Panel**:
   - Node count, edge count
   - Average degree
   - Clustering coefficient
   - Community count

5. **Filter Controls** — By crime type, date range, district

6. **Zoom + Pan** — Mouse wheel zoom, drag to pan, reset button

**`frontend/src/components/network/`**:
- `NetworkGraph.tsx` — Force-directed graph wrapper
- `NodeDetails.tsx` — Sidebar panel
- `NetworkMetrics.tsx` — Stats cards

**`frontend/src/hooks/useNetwork.ts`** — Fetch:
- `GET /network/accused/{id}?depth=2`
- `GET /network/communities`
- `GET /network/repeat-offenders?min_cases=2`
- `GET /network/search?q={query}`

### VERIFICATION
- Force graph renders with colored nodes
- Search finds and highlights accused
- Clicking a node populates sidebar
- Metrics panel shows real values
- Filters work (crime type, date range, district)
- Zoom + pan controls work

---

## PHASE 9 — PREDICTIONS + ANOMALIES PAGE

Use this prompt in a **new conversation** after Phase 8 is complete.

### CONTEXT (What came before)
Phase 1–2: Database + mock data.
Phase 3–4: Backend with auth + prediction/anomaly endpoints.
Phase 5–8: Frontend with login, dashboard, map, network graph.

### GOAL
Build the Predictions page (forecast charts + risk heatmap) and Anomalies page (anomaly list + review workflow).

### WHAT TO BUILD

**`frontend/src/pages/PredictionsPage.tsx`**:

1. **Forecast Chart** — Recharts ComposedChart:
   - Area for confidence interval (translucent)
   - Line for forecast (solid, blue)
   - Line for historical data (dashed, gray)
   - Dropdown to select district + crime type

2. **Risk Heatmap** — Grid of districts:
   - Each cell color-coded (red=HIGH, orange=MEDIUM, green=LOW)
   - Shows risk score number
   - Click to drill down to station-level risks

3. **Socio-Economic Correlation Chart** — Scatter plot: crime rate vs literacy rate / unemployment / urbanization

4. **Export Report Button** — Download PDF/CSV

**`frontend/src/components/predictions/`**:
- `ForecastChart.tsx`
- `RiskHeatmap.tsx`

**`frontend/src/pages/AnomaliesPage.tsx`**:

1. **Anomaly List** — Table with columns:
   - Anomaly score (0–1), color-coded
   - Description
   - Severity badge (CRITICAL, HIGH, MEDIUM, LOW)
   - Detected date
   - Review button

2. **Anomaly Detail Panel** — Click to expand: case details, contributing factors, AI explanation

3. **Review Workflow** — Click "Review" → confirmation → `POST /anomalies/{id}/review`

**`frontend/src/components/predictions/AnomalyList.tsx`**

**`frontend/src/hooks/usePredictions.ts`** — Fetch:
- `GET /predictions/forecast?district_id=&category_id=&days=30`
- `GET /predictions/risk-scores`
- `GET /predictions/socio-economic`
- `GET /anomalies`

### VERIFICATION
- Forecast chart shows confidence interval band
- District selector changes chart data
- Risk heatmap colors match risk levels
- Anomaly list shows scores and severities
- Review button marks anomaly as reviewed
- Export button triggers download

---

## PHASE 10 — REPORTS + POLISH

Use this prompt in a **new conversation** after Phase 9 is complete.

### CONTEXT (What came before)
Phase 1–2: Database + mock data.
Phase 3–4: Backend with auth.
Phase 5–9: All frontend pages complete — Dashboard, Map, Network, Predictions, Anomalies.

### GOAL
Build the Reports page (scheduled reports + PDF/Excel export), then polish the entire application with animations, responsive design, and error handling.

### WHAT TO BUILD

**`frontend/src/pages/ReportsPage.tsx`**:

1. **Report List** — Pre-built reports:
   - Monthly Crime Statistics (SCRB format, PDF)
   - District Crime Comparison (PDF)
   - Repeat Offender Intelligence (PDF)
   - Hotspot Prediction Report (PDF)
   - FIR Status Dashboard (Excel)
   
2. **Generate Report** — Form: select report type, district, date range. POST to `/reports/generate`. Show progress.

3. **Download** — Button for each completed report. GET `/reports/{id}/download`.

**`frontend/src/components/reports/ReportBuilder.tsx`** — Report generation form.

### POLISH (Apply across ALL pages)

**Animations** (Framer Motion):
- Page transitions: fade + slide
- Number counters: animated counting on KPI cards
- Chart animations: Recharts `isAnimationActive={true}`

**Loading States**:
- Skeleton loaders for every async data component
- Spinner for button actions

**Error States**:
- Toast notifications for API errors
- Friendly error messages (not raw JSON)
- Retry button on failed data fetches

**Responsive**:
- Sidebar collapses to icons on < 1024px
- Charts stack vertically on mobile
- Tables become card lists on < 768px

**UI Enhancement**:
- Glassmorphism cards with backdrop blur
- Gradient borders on active elements
- Custom scrollbar styling
- Consistent spacing and typography

### VERIFICATION
- Reports page lists all 10+ pre-built reports
- Generate form works (at minimum shows progress)
- Download button triggers file download
- Page transitions are smooth
- Loading skeletons show during data fetch
- Error toasts appear on API failures
- Responsive layouts work at 768px and 1024px

---

## PHASE 11 — DOCKER + DEPLOYMENT

Use this prompt in a **new conversation** after Phase 10 is complete.

### CONTEXT (What came before)
All phases 1–10 are complete. The full application works:
- Backend: FastAPI at `localhost:8000` with auth, all APIs, real ML
- Frontend: Vite + React 18 at `localhost:5173` with all pages
- Database: PostgreSQL with PostGIS and 5,000+ mock FIRs

### GOAL
Containerize everything with Docker Compose and create deployment configuration.

### WHAT TO BUILD

**`docker-compose.yml`**:
```yaml
services:
  postgres:
    image: postgis/postgis:15-3.3
    ports: ["5432:5432"]
    environment:
      POSTGRES_DB: crime_intelligence
      POSTGRES_USER: ksp
      POSTGRES_PASSWORD: ksp_secure_2024
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  backend:
    build: ./backend
    ports: ["8000:8000"]
    depends_on: [postgres, redis]
    environment:
      DATABASE_URL: postgresql+asyncpg://ksp:ksp_secure_2024@postgres:5432/crime_intelligence
      REDIS_URL: redis://redis:6379/0
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build: ./frontend
    ports: ["5173:5173"]
    depends_on: [backend]
    environment:
      VITE_API_URL: http://localhost:8000/api/v1

  nginx:
    image: nginx:alpine
    ports: ["80:80"]
    depends_on: [backend, frontend]
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
```

**`backend/Dockerfile`**:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**`frontend/Dockerfile`**:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

**`nginx/nginx.conf`** — Reverse proxy: `/api/` → backend:8000, `/` → frontend:5173.

**`.env.example`** — All environment variables with placeholder values.

### REDIS CACHING (Backend)
Add caching middleware for:
- Dashboard summary: TTL 5 minutes
- Hotspot calculations: TTL 1 hour
- Risk scores: TTL 1 hour

### VERIFICATION
- `docker compose up --build` starts all services
- `http://localhost/` shows the frontend
- `http://localhost/api/v1/dashboard/summary` returns data
- `http://localhost:8000/docs` shows OpenAPI docs
- Backend connects to PostgreSQL and Redis
- Frontend talks to backend through nginx proxy

---

## PHASE 12 — README + DEMO SCRIPT

Use this prompt in a **new conversation** after Phase 11 is complete.

### CONTEXT (What came before)
All phases 1–11 are complete. The full application is containerized with Docker and running.

### GOAL
Create README.md and a 5-minute demo script.

### README.md

Must include:
1. Project title: "Crime Intelligence & Predictive Analytics Platform"
2. Description: AI-powered Strategic Intelligence Hub for KSP
3. Architecture diagram (ASCII)
4. Screenshots of all 7 major pages (placeholder paths)
5. Step-by-step setup instructions
6. Docker compose commands
7. API docs link `(/docs)`
8. Demo video link placeholder
9. Team members and roles
10. Tech stack badges
11. License (MIT)

### DEMO SCRIPT

Write a **5-minute live demo script** covering 4 scenarios:

**Scenario 1 (1 min) — Dashboard Overview:**
- Login as SCRB officer
- Show KPI cards: 6,834 FIRs, trending up 8.2%
- Click Bangalore Urban on choropleth → drill down
- Point out trend chart: YoY comparison

**Scenario 2 (1.5 min) — Crime Map + Hotspot Detection:**
- Navigate to Map page
- Toggle hotspot layer → show 6 active hotspots
- Click Koramangala hotspot: "40+ theft cases within 1km"
- Drag time slider to 6–8 PM → show chain-snatching spike
- Show patrol recommendation panel

**Scenario 3 (1.5 min) — Criminal Network Analysis:**
- Navigate to Network page
- Search "Ramesh Kumar" → highlight repeat offender
- Show node connections: 6 cases across 3 districts
- Show community detection: "Brigade Road Crew" gang
- Point out network metrics (degree, centrality)

**Scenario 4 (1 min) — AI Predictions:**
- Navigate to Predictions page
- Show forecast chart: 8-week crime prediction
- Show risk heatmap: Bengaluru Urban = CRITICAL (92.5)
- Show anomaly alert: chain-snatching surge in Mysuru
- Click "Export Report" → download PDF

### VERIFICATION
- README has clear setup instructions
- All Docker commands are copy-pasteable
- Demo script can be completed in 5 minutes
- Each scenario demonstrates a distinct feature
