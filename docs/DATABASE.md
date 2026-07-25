# Database Schema

**Dialect:** PostgreSQL 15  
**ORM:** Drizzle ORM  
**Schema File:** `src/db/schema.ts`

## Tables

### Core Entities

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `states` | Indian states | state_code, state_name |
| `districts` | Karnataka districts | district_code, district_name, state_code, lat/lon, population |
| `units` | Police stations / units | unit_code, unit_name, district_code, unit_type, lat/lon |
| `employees` | Police officers | employee_code, employee_name, rank_code, unit_code, district_code |
| `courts` | Judicial courts | court_code, court_name, district_code, court_type |

### Reference / Lookup Tables

| Table | Description |
|-------|-------------|
| `ranks` | Police rank hierarchy (rank_code, rank_name, rank_order) |
| `designations` | Job designations linked to ranks |
| `crime_heads` | Major crime categories (e.g., Murder, Theft) |
| `crime_sub_heads` | Sub-categories under crime heads |
| `case_categories` | Case classification (heinous, major, minor, petty) |
| `gravity_offences` | Offence gravity (heinous, serious, normal, minor) |
| `occupation_master` | Occupations for victims/accused |
| `religion_master` | Religion reference data |

### FIR / Case Tables

| Table | Description | Key Columns |
|-------|-------------|-------------|
| `case_master` | Central FIR table | id (uuid), fir_number, year, date_of_report, date_of_occurrence, district_code, unit_code, crime_head_code, lat/lon, status |
| `victims` | Case victims | case_id (FK), victim_name, age, gender, injury/death status |
| `accused` | Case accused | case_id (FK), accused_name, age, gender, status, repeat_offender flags |
| `complainant_details` | Complaint filer info | case_id (FK), complainant_name, age, relation |
| `act_section_association` | IPC/SLL acts applied | case_id, act_name, section_number |
| `arrest_surrender` | Arrest records | case_id, accused_id, date_of_arrest, arrest_type, bail status |
| `chargesheet_details` | Chargesheet filing | case_id, chargesheet_number, court_code |

### AI / Analytics Tables

| Table | Description |
|-------|-------------|
| `crime_predictions` | ML crime predictions with confidence scores |
| `risk_scores` | Per-entity risk scores with contributing factors |
| `hotspot_predictions` | Predicted crime hotspots (lat/lon, radius, intensity) |
| `crime_trend_forecasts` | Time-series forecasts per district/crime type |
| `knowledge_graph_cache` | Pre-computed entity relationships |
| `embedding_store` | Vector embeddings for AI features |
| `ml_model_metadata` | ML model registry (accuracy, version, hyperparameters) |
| `recommendation_logs` | AI-generated investigation recommendations |

## Key Relationships

```
districts ──< units
districts ──< employees
districts ──< case_master
districts ──< risk_scores
districts ──< hotspot_predictions
districts ──< crime_trend_forecasts

units ──< case_master
units ──< employees

crime_heads ──< crime_sub_heads
crime_heads ──< case_master

case_master ──< victims
case_master ──< accused
case_master ──< complainant_details
case_master ──< act_section_association
case_master ──< arrest_surrender
case_master ──< chargesheet_details
case_master ──< crime_predictions

accused ──< arrest_surrender
```

## Indexes

- `case_master(fir_number)` — unique lookup
- `case_master(date_of_report)` — time-range queries
- `case_master(district_code)` — district-level aggregation
- `case_master(unit_code)` — station-level queries
- `case_master(crime_head_code)` — category filtering
- `accused(accused_name)` — name search
- `crime_predictions(prediction_type)` — ML type queries

## Enums

- `fir_status`: under_investigation, chargesheeted, final_report_false, final_report_true, transferred, closed, pending_trial, convicted, acquitted
- `gender`: male, female, transgender, unknown
- `arrest_type`: arrested, surrendered, court_arrest, absconding
- `accused_status`: arrested, absconding, surrendered, on_bail, in_jail, acquitted, convicted
- `case_category_type`: heinous, major, minor, petty
- `gravity`: heinous, serious, normal, minor
- `unit_type`: police_station, outpost, circle_office, district_headquarters, range_office, commissionerate
- `court_type`: district_court, sessions_court, high_court, magistrate_court, fast_track_court, special_court
- `prediction_type`: crime_risk, repeat_offender, hotspot, anomaly, emerging_crime, district_risk, station_risk
- `relation_type`: shared_vehicle, shared_mobile, shared_address, shared_location, shared_weapon, co_accused, co_victim, family, associate, gang_member
- `model_status`: training, deployed, deprecated, experimental
