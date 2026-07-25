# API Reference

**Base URL:** `/api`

## Dashboard

### GET /api/dashboard/stats

Returns summary KPIs.

**Response**
```json
{
  "totalFirs": 5842,
  "todayFirs": 12,
  "activeHotspots": 8,
  "criticalAlerts": 3,
  "monthOverMonthChange": 5.2,
  "yearOverYearChange": -2.1,
  "trends": [{ "date": "2026-01-01", "count": 45, "category": "Theft" }],
  "categories": [{ "name": "Theft", "count": 1200, "percentage": 20.5 }],
  "recentAlerts": [{ "id": 1, "type": "hotspot", "severity": "critical", "title": "...", "description": "..." }],
  "recentCases": [{ "id": "uuid", "firNumber": "001/2026", "dateOfReport": "2026-01-15", "crimeHead": "Theft", "status": "under_investigation" }]
}
```

## Cases

### GET /api/cases

List cases with pagination and filters.

**Query Parameters**
- `page` (number, default 1)
- `limit` (number, default 20)
- `districtCode` (number, optional)
- `unitCode` (number, optional)
- `crimeHeadCode` (number, optional)
- `status` (string, optional)
- `search` (string, optional — searches fir_number, accused_name, victim_name)
- `fromDate` (string, optional)
- `toDate` (string, optional)

**Response**
```json
{
  "cases": [{ "id": "uuid", "firNumber": "001/2026", ... }],
  "total": 5842,
  "page": 1,
  "limit": 20,
  "totalPages": 293
}
```

### GET /api/cases/:id

Get full case details with all linked entities.

**Response**
```json
{
  "case": { ... },
  "victims": [{ ... }],
  "accused": [{ ... }],
  "complainant": [{ ... }],
  "actSections": [{ ... }],
  "arrests": [{ ... }],
  "chargesheet": { ... }
}
```

## AI / Analytics

### GET /api/ai/analytics

**Query Parameters**
- `type` (string: "forecast" | "risk-scores" | "hotspots" | "anomalies")
- `districtCode` (number, optional)
- `crimeHeadCode` (number, optional)
- `days` (number, default 30)

**Response (forecast)**
```json
{
  "forecasts": [{ "date": "2026-02-01", "predictedCount": 45, "lowerBound": 35, "upperBound": 55 }],
  "historical": [{ "date": "2026-01-01", "actualCount": 42 }]
}
```

**Response (risk-scores)**
```json
{
  "districts": [{ "districtCode": 1, "districtName": "Bengaluru Urban", "riskScore": 8.5, "riskLevel": "critical", "contributingFactors": { ... } }]
}
```

**Response (hotspots)**
```json
{
  "hotspots": [{ "latitude": 12.9716, "longitude": 77.5946, "radiusKm": 0.5, "intensityScore": 0.85, "crimeType": "Theft", "incidentCount": 42 }]
}
```

**Response (anomalies)**
```json
{
  "anomalies": [{ "id": "uuid", "caseId": "uuid", "anomalyType": "unusual_time", "anomalyScore": 0.92, "description": "Murder at 3 AM in low-crime district", "reviewed": false }]
}
```

## Health

### GET /api/health

**Response**
```json
{
  "status": "ok",
  "timestamp": "2026-01-15T10:30:00Z"
}
```

## Future Endpoints

### Map
- `GET /api/map/districts` — District boundaries for choropleth
- `GET /api/map/districts/:id/density` — Crime density per district
- `GET /api/map/hotspots` — DBSCAN-computed hotspots
- `GET /api/map/cases` — Cases within map bounds (north/south/east/west)

### Network / Graph
- `GET /api/graph/accused/:id` — Accused network with connections
- `GET /api/graph/communities` — Detected criminal communities
- `GET /api/graph/repeat-offenders` — Repeat offender list
- `GET /api/graph/search` — Search entities in graph

### Predictions
- `GET /api/predictions/forecast` — Crime forecasting
- `GET /api/predictions/risk-scores` — Per-district risk
- `GET /api/predictions/trends` — Crime trend analysis

### Reports
- `POST /api/reports/generate` — Generate PDF/Excel report
- `GET /api/reports/:id/download` — Download generated report
