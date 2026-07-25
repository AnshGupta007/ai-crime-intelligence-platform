# CIPAP — Crime Intelligence & Predictive Analytics Platform

AI-powered Strategic Intelligence Hub for the Karnataka State Police (SCRB).

## Overview

Transforms siloed Excel-based FIR records into an integrated AI-driven platform for crime pattern visualization, criminal network detection, hotspot identification, and predictive policing.

## Features

- **Dashboard** — Real-time KPIs, trends, crime category distribution, alert feed
- **Crime Map** — Interactive Leaflet map with heatmaps, hotspots (DBSCAN), district choropleth, time slider, and patrol recommendations
- **Knowledge Graph** — Force-directed network graph linking accused, victims, cases, locations with community detection
- **AI Analytics** — Anomaly detection (Isolation Forest), crime forecasting (Prophet/ARIMA), risk scoring, MO pattern extraction
- **Case Management** — Search, filter, drill-down into FIR records
- **Reports** — Automated PDF/Excel report generation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, TypeScript 5.9 |
| Styling | Tailwind CSS 4.1, Framer Motion, Lucide React |
| Charts | Recharts, React-Leaflet, @xyflow/react |
| Backend | Next.js API Routes (Node.js) |
| Database | PostgreSQL 15 with Drizzle ORM |
| Auth | JWT (next-auth / custom) |
| AI/ML | DBSCAN, Isolation Forest, Prophet/ARIMA, NetworkX |

## Folder Structure

```
src/
├── app/
│   ├── ai/              # AI Analytics page
│   ├── api/             # API routes (cases, dashboard, health, ai)
│   ├── cases/           # Case management page
│   ├── dashboard/       # Dashboard page
│   ├── graph/           # Knowledge graph page
│   ├── investigation/   # Investigation support page
│   ├── map/             # Crime map page
│   ├── predictions/     # Predictions & forecasting page
│   └── reports/         # Report generation page
├── components/
│   ├── crime-map.tsx    # Leaflet crime map component
│   └── sidebar.tsx      # Navigation sidebar
├── db/
│   ├── index.ts         # Drizzle DB connection
│   └── schema.ts        # Full database schema
└── lib/
    └── utils.ts         # Utility functions & constants
docs/                    # Project documentation
```

## Installation

```bash
# Prerequisites: Node.js 20+, PostgreSQL 15+, Redis (optional)

git clone <repo-url>
cd ai-crime-intelligence-platform

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# Run database migrations
npx drizzle-kit push

# Seed data (if seeder available)
npm run seed

# Start development server
npm run dev
```

## Development

```bash
npm run dev       # Next.js dev server on http://localhost:3000
npm run build     # Production build
npm run lint      # ESLint
npm run typecheck # TypeScript type checking
```

## Deployment

```bash
npm run build
npm start         # Production server on http://localhost:3000
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.
