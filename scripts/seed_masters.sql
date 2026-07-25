-- =============================================================================
-- SEED DATA SCRIPT: MASTER & REFERENCE DATA FOR POLICE PLATFORM
-- =============================================================================

-- 1. States
INSERT INTO states (state_code, state_name) VALUES
('KA', 'Karnataka')
ON CONFLICT (state_code) DO NOTHING;

-- 2. Districts (Sample Key Districts)
INSERT INTO districts (district_code, district_name, state_id, latitude, longitude, population) VALUES
('BLR_U', 'Bengaluru Urban', 1, 12.9716, 77.5946, 9621551),
('BLR_R', 'Bengaluru Rural', 1, 13.2257, 77.5750, 990923),
('MYS', 'Mysuru', 1, 12.2958, 76.6394, 3001127),
('DK', 'Dakshina Kannada', 1, 12.9141, 74.8560, 2089649),
('DWD', 'Dharwad', 1, 15.4589, 75.0078, 1847023),
('BEL', 'Belagavi', 1, 15.8497, 74.4977, 4779661)
ON CONFLICT (district_code) DO NOTHING;

-- 3. Unit Types
INSERT INTO unit_types (type_code, type_name) VALUES
('PS', 'Police Station'),
('OP', 'Outpost'),
('CO', 'Circle Office'),
('DHQ', 'District Headquarters'),
('COMM', 'Commissionerate')
ON CONFLICT (type_code) DO NOTHING;

-- 4. Case Categories
INSERT INTO case_categories (category_code, category_name) VALUES
('10', 'Heinous Crimes'),
('20', 'Major Crimes'),
('30', 'Minor Crimes'),
('40', 'Petty Crimes')
ON CONFLICT (category_code) DO NOTHING;

-- 5. Gravity Offences
INSERT INTO gravity_offences (gravity_code, gravity_name) VALUES
('HEINOUS', 'Heinous'),
('SERIOUS', 'Serious'),
('NORMAL', 'Normal'),
('MINOR', 'Minor')
ON CONFLICT (gravity_code) DO NOTHING;

-- 6. Case Status
INSERT INTO case_status_masters (status_code, status_name) VALUES
('UNDER_INVESTIGATION', 'Under Investigation'),
('CHARGESHEETED', 'Chargesheeted'),
('FINAL_REPORT_FALSE', 'Final Report False'),
('FINAL_REPORT_TRUE', 'Final Report True'),
('TRANSFERRED', 'Transferred'),
('CLOSED', 'Closed'),
('PENDING_TRIAL', 'Pending Trial'),
('CONVICTED', 'Convicted'),
('ACQUITTED', 'Acquitted')
ON CONFLICT (status_code) DO NOTHING;

-- 7. Ranks & Designations
INSERT INTO ranks (rank_code, rank_name, rank_order) VALUES
('DG_IGP', 'Director General and Inspector General of Police', 1),
('ADGP', 'Additional Director General of Police', 2),
('IGP', 'Inspector General of Police', 3),
('DIGP', 'Deputy Inspector General of Police', 4),
('SP', 'Superintendent of Police', 5),
('DSP', 'Deputy Superintendent of Police', 6),
('PI', 'Police Inspector', 7),
('PSI', 'Police Sub-Inspector', 8),
('ASI', 'Assistant Sub-Inspector', 9),
('HC', 'Head Constable', 10),
('PC', 'Police Constable', 11)
ON CONFLICT (rank_code) DO NOTHING;

-- 8. Crime Heads & Sub-Heads
INSERT INTO crime_heads (head_code, head_name) VALUES
('CH_MURDER', 'Offences Affecting Life - Murder'),
('CH_ROBBERY', 'Property Offences - Robbery/Dacoity'),
('CH_THEFT', 'Property Offences - Theft'),
('CH_CYBER', 'Cyber Crimes'),
('CH_WOMEN', 'Crimes Against Women')
ON CONFLICT (head_code) DO NOTHING;

INSERT INTO crime_sub_heads (crime_head_id, sub_head_code, sub_head_name) VALUES
(1, 'CSH_MURDER_GAIN', 'Murder for Gain'),
(1, 'CSH_MURDER_VENDETTA', 'Murder due to Personal Vendetta'),
(3, 'CSH_THEFT_VEHICLE', 'Motor Vehicle Theft'),
(3, 'CSH_THEFT_CHAIN', 'Chain Snatching'),
(4, 'CSH_CYBER_FRAUD', 'Financial Fraud / Phishing')
ON CONFLICT (sub_head_code) DO NOTHING;

-- 9. Acts & Sections
INSERT INTO acts (act_code, act_name, act_year, is_central) VALUES
('IPC', 'Indian Penal Code', 1860, TRUE),
('SLL', 'Special and Local Laws', 1950, FALSE),
('IT_ACT', 'Information Technology Act', 2000, TRUE),
('NDPS', 'Narcotic Drugs and Psychotropic Substances Act', 1985, TRUE)
ON CONFLICT (act_code) DO NOTHING;

INSERT INTO sections (act_id, section_code, section_number, description, bailable, cognizable) VALUES
(1, 'IPC_302', '302', 'Punishment for Murder', FALSE, TRUE),
(1, 'IPC_379', '379', 'Punishment for Theft', TRUE, TRUE),
(1, 'IPC_392', '392', 'Punishment for Robbery', FALSE, TRUE),
(3, 'IT_66D', '66D', 'Cheating by Personation using Computer Resource', TRUE, TRUE)
ON CONFLICT (section_code) DO NOTHING;
