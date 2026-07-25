# Functional Specifications

## 1. Authentication & Authorization

### Features
- Login with badge number/email and password
- JWT-based session management
- Role-based access control (SCRB, SP, IO)

### Validation
- Email/badge required
- Password minimum 8 characters
- Account lockout after 5 failed attempts

### Errors
- Invalid credentials
- Account locked
- Insufficient permissions (role check)

### UI
- Login page with role-appropriate redirect
- Session timeout handling
- Logout

## 2. Dashboard

### Features
- KPI cards: Total FIRs, Today's FIRs, Active Hotspots, Critical Alerts
- Trend chart: 6-month daily crime counts with category breakdown
- Crime category distribution: Top 5 categories with percentages
- Karnataka district choropleth map (crime density)
- Alert feed: Color-coded severity badges (Critical/ Warning/ Watch)
- Recent cases table: Paginated, sortable, with status badges

### Data Sources
- Real SQL aggregate queries (COUNT, GROUP BY, date_trunc)
- Redis caching: KPIs TTL 5min, hotspots TTL 1hr

### UI States
- Loading: Skeleton loaders for each card/chart
- Empty: "No data available" with illustration
- Error: Toast notification with retry option
- Edge case: Zero cases in selected date range shows empty state gracefully

## 3. Crime Map

### Features
- Full-screen interactive Leaflet map (OpenStreetMap tiles)
- Layer toggles: Heatmap, Police Stations, Hotspots, Case Markers
- Time slider: Filter by hour of day (00:00-23:59)
- Date range picker
- Crime category filter dropdown
- Hotspot circles with pulsing CSS animation for critical zones
- Case detail popup on marker click (FIR number, type, date, status)
- District boundary overlay (GeoJSON)
- Patrol Recommendation panel

### Validation
- Latitude/longitude within Karnataka bounds (11.5-18.5 N, 74-78.5 E)
- Bounds-based query for visible map area

## 4. Knowledge Graph

### Features
- Force-directed graph visualization
- Node colors by type: Accused (blue), Victim (green), Location (red), Case (yellow)
- Search bar: Find accused by name
- Node detail sidebar on click
- Network metrics: degree, betweenness centrality, clustering coefficient
- Filter controls: crime type, date range, district

## 5. AI Analytics

### Features
- **Forecast chart**: Historical + predicted crime counts with confidence intervals
- **Risk heatmap**: District grid with color coding
- **Anomaly detection list**: Score (0-1), description, severity, review button
- **Socio-economic correlation** (placeholder for real correlation data)

### ML Pipeline
- HotspotDetector: DBSCAN clustering on lat/lon (eps=500m, min_samples=3)
- RiskScorer: Multi-feature district risk scoring
- AnomalyDetector: Isolation Forest on case features
- CrimeForecaster: Prophet or ARIMA time series

## 6. Cases

### Features
- Searchable, filterable case list with pagination
- Case detail view with all linked entities
- Case status tracking
- Act/Section associations display

## 7. Reports

### Features
- Generate PDF reports (per district, per crime type, per date range)
- Excel export for raw data
- Scheduled report generation (future)

## 8. Predictions

### Features
- Crime forecast by district and category
- Risk scores for all districts
- Hotspot predictions with location and intensity
- Trend direction indicators

## 9. Investigation Support

### Features
- Case linkages and connections
- Repeat offender identification
- MO pattern matching
- Investigation recommendations
