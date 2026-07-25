-- =============================================================================
-- POLICE CASE MANAGEMENT SYSTEM (ENTERPRISE FIR PLATFORM)
-- SQL DDL SCHEMA SPECIFICATION & CATALYST DATA STORE COMPATIBLE MODEL
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. LOOKUP / MASTER TABLES
-- -----------------------------------------------------------------------------

CREATE TABLE states (
    state_id SERIAL PRIMARY KEY,
    state_code VARCHAR(10) UNIQUE NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE districts (
    district_id SERIAL PRIMARY KEY,
    district_code VARCHAR(10) UNIQUE NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    state_id INT NOT NULL REFERENCES states(state_id) ON DELETE RESTRICT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    population INT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE unit_types (
    unit_type_id SERIAL PRIMARY KEY,
    type_code VARCHAR(20) UNIQUE NOT NULL,
    type_name VARCHAR(100) NOT NULL -- Police Station, Outpost, Circle Office, District HQ, Range Office
);

CREATE TABLE units (
    unit_id SERIAL PRIMARY KEY,
    unit_code VARCHAR(20) UNIQUE NOT NULL,
    unit_name VARCHAR(150) NOT NULL,
    unit_type_id INT NOT NULL REFERENCES unit_types(unit_type_id) ON DELETE RESTRICT,
    district_id INT NOT NULL REFERENCES districts(district_id) ON DELETE RESTRICT,
    latitude DECIMAL(10, 8) CHECK (latitude BETWEEN -90 AND 90),
    longitude DECIMAL(11, 8) CHECK (longitude BETWEEN -180 AND 180),
    address TEXT,
    contact_number VARCHAR(20),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ranks (
    rank_id SERIAL PRIMARY KEY,
    rank_code VARCHAR(20) UNIQUE NOT NULL,
    rank_name VARCHAR(100) NOT NULL,
    rank_order INT NOT NULL
);

CREATE TABLE designations (
    designation_id SERIAL PRIMARY KEY,
    designation_code VARCHAR(20) UNIQUE NOT NULL,
    designation_name VARCHAR(100) NOT NULL,
    rank_id INT NOT NULL REFERENCES ranks(rank_id) ON DELETE RESTRICT
);

CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    employee_code VARCHAR(30) UNIQUE NOT NULL,
    employee_name VARCHAR(150) NOT NULL,
    rank_id INT NOT NULL REFERENCES ranks(rank_id) ON DELETE RESTRICT,
    designation_id INT NOT NULL REFERENCES designations(designation_id) ON DELETE RESTRICT,
    unit_id INT NOT NULL REFERENCES units(unit_id) ON DELETE RESTRICT,
    district_id INT NOT NULL REFERENCES districts(district_id) ON DELETE RESTRICT,
    contact_number VARCHAR(20),
    email VARCHAR(100),
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE courts (
    court_id SERIAL PRIMARY KEY,
    court_code VARCHAR(20) UNIQUE NOT NULL,
    court_name VARCHAR(150) NOT NULL,
    court_type VARCHAR(50) NOT NULL, -- District Court, Sessions Court, Magistrate Court, High Court
    district_id INT NOT NULL REFERENCES districts(district_id) ON DELETE RESTRICT
);

CREATE TABLE religion_masters (
    religion_id SERIAL PRIMARY KEY,
    religion_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE caste_masters (
    caste_id SERIAL PRIMARY KEY,
    caste_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE occupation_masters (
    occupation_id SERIAL PRIMARY KEY,
    occupation_name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE case_categories (
    category_id SERIAL PRIMARY KEY,
    category_code VARCHAR(10) UNIQUE NOT NULL, -- 10 (Heinous), 20 (Major), 30 (Minor), 40 (Petty)
    category_name VARCHAR(100) NOT NULL
);

CREATE TABLE gravity_offences (
    gravity_id SERIAL PRIMARY KEY,
    gravity_code VARCHAR(10) UNIQUE NOT NULL,
    gravity_name VARCHAR(100) NOT NULL -- Heinous, Serious, Normal, Minor
);

CREATE TABLE case_status_masters (
    status_id SERIAL PRIMARY KEY,
    status_code VARCHAR(20) UNIQUE NOT NULL,
    status_name VARCHAR(100) NOT NULL -- Under Investigation, Chargesheeted, Final Report False, Transferred, Closed
);

CREATE TABLE crime_heads (
    crime_head_id SERIAL PRIMARY KEY,
    head_code VARCHAR(20) UNIQUE NOT NULL,
    head_name VARCHAR(150) NOT NULL
);

CREATE TABLE crime_sub_heads (
    crime_sub_head_id SERIAL PRIMARY KEY,
    crime_head_id INT NOT NULL REFERENCES crime_heads(crime_head_id) ON DELETE RESTRICT,
    sub_head_code VARCHAR(20) UNIQUE NOT NULL,
    sub_head_name VARCHAR(150) NOT NULL
);

CREATE TABLE acts (
    act_id SERIAL PRIMARY KEY,
    act_code VARCHAR(30) UNIQUE NOT NULL, -- IPC, SLL, NDPS, POCSO
    act_name VARCHAR(255) NOT NULL,
    act_year INT NOT NULL,
    is_central BOOLEAN DEFAULT TRUE
);

CREATE TABLE sections (
    section_id SERIAL PRIMARY KEY,
    act_id INT NOT NULL REFERENCES acts(act_id) ON DELETE RESTRICT,
    section_code VARCHAR(30) UNIQUE NOT NULL,
    section_number VARCHAR(50) NOT NULL,
    description TEXT,
    bailable BOOLEAN DEFAULT FALSE,
    cognizable BOOLEAN DEFAULT TRUE
);

CREATE TABLE crime_head_act_sections (
    association_id SERIAL PRIMARY KEY,
    crime_head_id INT NOT NULL REFERENCES crime_heads(crime_head_id) ON DELETE CASCADE,
    act_id INT NOT NULL REFERENCES acts(act_id) ON DELETE CASCADE,
    section_id INT NOT NULL REFERENCES sections(section_id) ON DELETE CASCADE,
    CONSTRAINT uk_head_act_section UNIQUE (crime_head_id, act_id, section_id)
);

-- -----------------------------------------------------------------------------
-- 2. TRANSACTIONAL / CASE ENTITIES
-- -----------------------------------------------------------------------------

CREATE TABLE case_masters (
    case_id BIGSERIAL PRIMARY KEY,
    crime_no VARCHAR(25) UNIQUE NOT NULL, -- Format: Category(2)+District(3)+Unit(4)+Year(4)+Serial(5)
    case_no VARCHAR(20) NOT NULL,        -- Format: YYYY+Serial
    crime_registered_date TIMESTAMP NOT NULL,
    incident_from_date TIMESTAMP NOT NULL,
    incident_to_date TIMESTAMP,
    info_received_ps_date TIMESTAMP NOT NULL,
    district_id INT NOT NULL REFERENCES districts(district_id) ON DELETE RESTRICT,
    unit_id INT NOT NULL REFERENCES units(unit_id) ON DELETE RESTRICT,
    employee_id INT NOT NULL REFERENCES employees(employee_id) ON DELETE RESTRICT,
    case_category_id INT NOT NULL REFERENCES case_categories(category_id) ON DELETE RESTRICT,
    gravity_offence_id INT NOT NULL REFERENCES gravity_offences(gravity_id) ON DELETE RESTRICT,
    crime_head_id INT NOT NULL REFERENCES crime_heads(crime_head_id) ON DELETE RESTRICT,
    crime_sub_head_id INT NOT NULL REFERENCES crime_sub_heads(crime_sub_head_id) ON DELETE RESTRICT,
    case_status_id INT NOT NULL REFERENCES case_status_masters(status_id) ON DELETE RESTRICT,
    court_id INT REFERENCES courts(court_id) ON DELETE SET NULL,
    latitude DECIMAL(10, 8) CHECK (latitude BETWEEN -90 AND 90),
    longitude DECIMAL(11, 8) CHECK (longitude BETWEEN -180 AND 180),
    place_of_occurrence TEXT NOT NULL,
    brief_facts TEXT NOT NULL,
    
    -- Audit Columns
    created_by INT NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_by INT,
    modified_time TIMESTAMP,
    deleted_flag BOOLEAN DEFAULT FALSE,
    deleted_time TIMESTAMP,
    deleted_by INT
);

CREATE TABLE victims (
    victim_id BIGSERIAL PRIMARY KEY,
    case_id BIGINT NOT NULL REFERENCES case_masters(case_id) ON DELETE CASCADE,
    victim_name VARCHAR(150) NOT NULL,
    age INT CHECK (age >= 0 AND age <= 120),
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Transgender', 'Unknown')),
    religion_id INT REFERENCES religion_masters(religion_id),
    caste_id INT REFERENCES caste_masters(caste_id),
    occupation_id INT REFERENCES occupation_masters(occupation_id),
    injury_type VARCHAR(50), -- Fatal, Grievous, Simple, None
    is_deceased BOOLEAN DEFAULT FALSE,
    address TEXT,
    phone VARCHAR(20),
    
    -- Audit Columns
    created_by INT NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_by INT,
    modified_time TIMESTAMP,
    deleted_flag BOOLEAN DEFAULT FALSE,
    deleted_time TIMESTAMP,
    deleted_by INT
);

CREATE TABLE accused (
    accused_id BIGSERIAL PRIMARY KEY,
    case_id BIGINT NOT NULL REFERENCES case_masters(case_id) ON DELETE CASCADE,
    accused_name VARCHAR(150) NOT NULL,
    alias_name VARCHAR(100),
    age INT CHECK (age >= 0 AND age <= 120),
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Transgender', 'Unknown')),
    religion_id INT REFERENCES religion_masters(religion_id),
    caste_id INT REFERENCES caste_masters(caste_id),
    occupation_id INT REFERENCES occupation_masters(occupation_id),
    accused_status VARCHAR(50) NOT NULL CHECK (accused_status IN ('Arrested', 'Absconding', 'Surrendered', 'On Bail', 'In Jail', 'Acquitted', 'Convicted')),
    is_habitual_offender BOOLEAN DEFAULT FALSE,
    address TEXT,
    phone VARCHAR(20),
    
    -- Audit Columns
    created_by INT NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_by INT,
    modified_time TIMESTAMP,
    deleted_flag BOOLEAN DEFAULT FALSE,
    deleted_time TIMESTAMP,
    deleted_by INT
);

CREATE TABLE complainant_details (
    complainant_id BIGSERIAL PRIMARY KEY,
    case_id BIGINT NOT NULL REFERENCES case_masters(case_id) ON DELETE CASCADE,
    complainant_name VARCHAR(150) NOT NULL,
    father_husband_name VARCHAR(150),
    age INT CHECK (age >= 0 AND age <= 120),
    gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Transgender', 'Unknown')),
    relation_with_victim VARCHAR(100),
    address TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    
    -- Audit Columns
    created_by INT NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_by INT,
    modified_time TIMESTAMP,
    deleted_flag BOOLEAN DEFAULT FALSE,
    deleted_time TIMESTAMP,
    deleted_by INT
);

CREATE TABLE act_section_associations (
    association_id BIGSERIAL PRIMARY KEY,
    case_id BIGINT NOT NULL REFERENCES case_masters(case_id) ON DELETE CASCADE,
    act_id INT NOT NULL REFERENCES acts(act_id) ON DELETE RESTRICT,
    section_id INT NOT NULL REFERENCES sections(section_id) ON DELETE RESTRICT,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE arrest_surrenders (
    arrest_id BIGSERIAL PRIMARY KEY,
    case_id BIGINT NOT NULL REFERENCES case_masters(case_id) ON DELETE CASCADE,
    accused_id BIGINT NOT NULL REFERENCES accused(accused_id) ON DELETE CASCADE,
    date_of_arrest TIMESTAMP NOT NULL,
    arrest_type VARCHAR(50) NOT NULL CHECK (arrest_type IN ('Arrested', 'Surrendered', 'Court Arrest')),
    arresting_officer_id INT NOT NULL REFERENCES employees(employee_id) ON DELETE RESTRICT,
    place_of_arrest VARCHAR(255),
    bail_status VARCHAR(50) DEFAULT 'No Bail',
    
    -- Audit Columns
    created_by INT NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_by INT,
    modified_time TIMESTAMP,
    deleted_flag BOOLEAN DEFAULT FALSE
);

CREATE TABLE inv_arrest_surrender_accused (
    id BIGSERIAL PRIMARY KEY,
    arrest_id BIGINT NOT NULL REFERENCES arrest_surrenders(arrest_id) ON DELETE CASCADE,
    accused_id BIGINT NOT NULL REFERENCES accused(accused_id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chargesheet_details (
    chargesheet_id BIGSERIAL PRIMARY KEY,
    case_id BIGINT NOT NULL REFERENCES case_masters(case_id) ON DELETE CASCADE,
    chargesheet_no VARCHAR(50) UNIQUE NOT NULL,
    chargesheet_date TIMESTAMP NOT NULL,
    investigating_officer_id INT NOT NULL REFERENCES employees(employee_id) ON DELETE RESTRICT,
    court_id INT NOT NULL REFERENCES courts(court_id) ON DELETE RESTRICT,
    remarks TEXT,
    
    -- Audit Columns
    created_by INT NOT NULL,
    created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_by INT,
    modified_time TIMESTAMP,
    deleted_flag BOOLEAN DEFAULT FALSE
);

-- -----------------------------------------------------------------------------
-- 3. INDEXES FOR HIGH-PERFORMANCE SEARCH & FILTERING
-- -----------------------------------------------------------------------------

CREATE INDEX idx_case_masters_crime_no ON case_masters(crime_no);
CREATE INDEX idx_case_masters_case_no ON case_masters(case_no);
CREATE INDEX idx_case_masters_unit_id ON case_masters(unit_id);
CREATE INDEX idx_case_masters_employee_id ON case_masters(employee_id);
CREATE INDEX idx_case_masters_court_id ON case_masters(court_id);
CREATE INDEX idx_case_masters_status_id ON case_masters(case_status_id);
CREATE INDEX idx_case_masters_district_id ON case_masters(district_id);
CREATE INDEX idx_case_masters_registered_date ON case_masters(crime_registered_date);
CREATE INDEX idx_case_masters_incident_date ON case_masters(incident_from_date);
CREATE INDEX idx_case_masters_location ON case_masters(latitude, longitude);

CREATE INDEX idx_accused_name ON accused(accused_name);
CREATE INDEX idx_accused_case_id ON accused(case_id);
CREATE INDEX idx_victims_case_id ON victims(case_id);
CREATE INDEX idx_complainant_case_id ON complainant_details(case_id);
CREATE INDEX idx_act_sec_case_id ON act_section_associations(case_id);
CREATE INDEX idx_arrest_case_accused ON arrest_surrenders(case_id, accused_id);
