import random
import math
from datetime import date, timedelta, datetime

from faker import Faker
from sqlalchemy import text

from app.auth.utils import hash_password

fake = Faker(["en_IN"])

KARNATAKA_DISTRICTS = [
    "Bengaluru Urban", "Bengaluru Rural", "Mysuru", "Dakshina Kannada",
    "Dharwad", "Belagavi", "Ballari", "Hassan", "Mandya", "Tumakuru",
    "Shivamogga", "Davangere", "Chitradurga", "Kodagu", "Raichur",
    "Kalaburagi", "Bidar", "Koppal", "Uttara Kannada", "Udupi",
    "Chamarajanagar", "Ramanagara", "Chikkaballapura", "Kolar",
    "Bagalkote", "Gadag", "Haveri", "Yadgir", "Vijayapura",
    "Chikkmagaluru", "Vijayanagara",
]

DISTRICT_LAT_LON = {
    "Bengaluru Urban": (12.9716, 77.5946),
    "Bengaluru Rural": (13.0830, 77.5900),
    "Mysuru": (12.2958, 76.6394),
    "Dakshina Kannada": (12.8698, 74.8430),
    "Dharwad": (15.4589, 75.0078),
    "Belagavi": (15.8497, 74.4977),
    "Ballari": (15.1394, 76.9214),
    "Hassan": (13.0067, 76.0995),
    "Mandya": (12.5223, 76.8958),
    "Tumakuru": (13.3379, 77.1173),
    "Shivamogga": (13.9299, 75.5681),
    "Davangere": (14.4644, 75.9218),
    "Chitradurga": (14.2220, 76.4068),
    "Kodagu": (12.3375, 75.8070),
    "Raichur": (16.2092, 77.3434),
    "Kalaburagi": (17.3358, 76.8376),
    "Bidar": (17.9133, 77.5301),
    "Koppal": (15.3451, 76.1521),
    "Uttara Kannada": (14.7983, 74.1290),
    "Udupi": (13.3409, 74.7421),
    "Chamarajanagar": (11.9262, 76.9437),
    "Ramanagara": (12.7205, 77.2838),
    "Chikkaballapura": (13.4356, 77.7318),
    "Kolar": (13.1367, 78.1290),
    "Bagalkote": (16.1868, 75.6962),
    "Gadag": (15.4298, 75.6297),
    "Haveri": (14.7933, 75.4043),
    "Yadgir": (16.7701, 77.1376),
    "Vijayapura": (16.8303, 75.7170),
    "Chikkmagaluru": (13.3161, 75.7720),
    "Vijayanagara": (15.3350, 76.4570),
}

CRIME_HEADS = [
    ("Murder", "IPC-302"),
    ("Attempt to Murder", "IPC-307"),
    ("Rape", "IPC-376"),
    ("Kidnapping & Abduction", "IPC-363"),
    ("Robbery", "IPC-392"),
    ("Burglary", "IPC-454"),
    ("Theft", "IPC-379"),
    ("Rioting", "IPC-147"),
    ("Cruelty by Husband", "IPC-498A"),
    ("Dowry Death", "IPC-304B"),
    ("Cheating & Fraud", "IPC-420"),
    ("Cybercrime", "IT-66"),
    ("Motor Vehicle Theft", "IPC-379"),
    ("Arms Act", "AA-25"),
    ("Drug Offences", "NDPS-20"),
]

CASE_STATUSES = [
    "Under Investigation", "Chargesheeted", "Final Report False",
    "Closed", "Pending Trial", "Convicted", "Acquitted", "Transferred",
]

CASTE_NAMES = [
    "General", "OBC", "SC", "ST", "Minority", "Vokkaliga", "Lingayat",
    "Kuruba", "Ediga", "Brahmin", "Kshatriya", "Schedule Caste",
    "Schedule Tribe", "Other",
]

RELIGION_NAMES = [
    "Hindu", "Muslim", "Christian", "Jain", "Sikh", "Buddhist", "Other",
]

OCCUPATION_NAMES = [
    "Farmer", "Daily Wages", "Government Employee", "Private Employee",
    "Business", "Student", "Housewife", "Driver", "Auto Driver",
    "Shopkeeper", "Labourer", "Teacher", "Doctor", "Lawyer", "Engineer",
    "IT Professional", "Retired", "Unemployed", "Police", "Army",
]

BRIEF_FACTS_TEMPLATES = [
    "The complainant reported that {suspect} {action} at {location} on {date_str}. The victim sustained {injury}. "
    "A case was registered and investigation taken up.",
    "On {date_str}, {suspect} {action} near {location}. The accused was identified by the victim during identification "
    "parade. Property worth INR {amount} was recovered.",
    "It is alleged that {suspect} {action} after conspiring with other unknown persons at {location}. "
    "Medical examination of the victim was conducted.",
    "The accused {suspect} was caught red-handed while {action} near {location}. "
    "Incriminating material was seized in the presence of panchas.",
    "Based on credible information, a raid was conducted at {location} and {suspect} was apprehended. "
    "Stolen property worth INR {amount} was recovered from their possession.",
]

ACTIONS = [
    "forcibly entered the premises and committed theft",
    "assaulted the victim with a sharp weapon",
    "snatched a gold chain and fled",
    "broke into the house during nighttime",
    "threatened the victim at gunpoint",
    "cheated the complainant by promising a job",
    "created a fake website and defrauded victims",
    "stole a two-wheeler parked outside",
    "forged documents and sold the property",
    "ransomed the data after hacking the system",
]

SUSPECT_TYPES = [
    "the accused", "an unknown person", "a group of 2-3 individuals",
    "the accused along with associates", "a known acquaintance",
]

LOCATIONS = [
    "the market area", "a residential colony", "the bus stand",
    "the railway station", "an isolated road", "the temple premises",
    "outside a shopping mall", "near the park", "the industrial area",
    "the main road", "a crowded junction", "the suburban area",
]

INJURIES = [
    "grievous injuries", "minor injuries", "severe bleeding",
    "fracture of the right arm", "head injuries", "multiple contusions",
]

AMOUNTS = [5000, 10000, 25000, 50000, 100000, 200000, 500000, 1000000]

MALE_NAMES = [
    "Ramesh Kumar", "Suresh Patel", "Rajesh Singh", "Mahesh Reddy",
    "Venkatesh Rao", "Nagaraj", "Manjunath", "Shivakumar",
    "Satish Shetty", "Ravi Shastri", "Gopal Krishna", "Anil Kumar",
    "Sunil Kumar", "Prakash", "Krishna Murthy", "Lakshman",
    "Harish", "Vijay Kumar", "Arun Kumar", "Dinesh",
    "Chandrashekar", "Basavaraj", "Mallikarjun", "Siddarama",
    "Eshwarappa", "Yashwanth", "Karthik", "Pavan",
    "Rohan", "Akhil", "Naveen", "Prasanna",
    "Gurunath", "Sharan", "Bharat", "Aditya",
]

FEMALE_NAMES = [
    "Lakshmi Devi", "Parvathi", "Saraswathi", "Anitha",
    "Sushma", "Kavitha", "Priyanka", "Asha",
    "Rekha", "Geetha", "Shobha", "Mamatha",
    "Radha", "Meena", "Rathnamma", "Shakunthala",
    "Manjula", "Savitri", "Bhagya", "Nethravathi",
    "Shwetha", "Ananya", "Spoorthi", "Bhavana",
]

IPC_SECTIONS = {
    "IPC": [
        ("302", "Punishment for murder"),
        ("307", "Attempt to murder"),
        ("376", "Punishment for rape"),
        ("363", "Kidnapping"),
        ("379", "Theft"),
        ("392", "Robbery"),
        ("394", "Robbery with hurt"),
        ("420", "Cheating and dishonestly inducing delivery of property"),
        ("447", "Criminal trespass"),
        ("448", "House-trespass"),
        ("449", "House-trespass in order to commit offence punishable with death"),
        ("451", "House-trespass in order to commit offence punishable with imprisonment"),
        ("454", "Lurking house-trespass or house-breaking in order to commit offence"),
        ("457", "Lurking house-trespass or house-breaking by night"),
        ("498A", "Cruelty by husband or relative of husband"),
        ("304B", "Dowry death"),
        ("323", "Voluntarily causing hurt"),
        ("324", "Voluntarily causing hurt by dangerous weapons"),
        ("326", "Voluntarily causing grievous hurt by dangerous weapons"),
        ("341", "Wrongful restraint"),
        ("342", "Wrongful confinement"),
        ("364A", "Kidnapping for ransom"),
        ("395", "Dacoity"),
        ("399", "Preparation to commit dacoity"),
        ("147", "Rioting"),
        ("148", "Rioting armed with deadly weapon"),
        ("201", "Causing disappearance of evidence"),
        ("120B", "Criminal conspiracy"),
        ("406", "Criminal breach of trust"),
        ("468", "Forgery for purpose of cheating"),
    ],
    "IT Act": [
        ("66", "Computer related offences"),
        ("66C", "Identity theft"),
        ("66D", "Cheating by personation by using computer resource"),
        ("67", "Publishing obscene material in electronic form"),
        ("67A", "Publishing material containing sexually explicit act"),
    ],
    "NDPS Act": [
        ("20", "Punishment for cultivation of cannabis"),
        ("21", "Punishment for manufacture, possession, sale of psychotropic substances"),
        ("22", "Contravention relating to psychotropic substances"),
    ],
    "Arms Act": [
        ("25", "Punishment for illegal possession of arms"),
        ("27", "Punishment for using prohibited arms"),
    ],
}

STATION_NAMES = [
    "Town Police Station", "City Police Station", "Rural Police Station",
    "Traffic Police Station", "Women Police Station", "Cyber Crime Police Station",
    "Economic Offences Wing", "Nagar Police Station", "Circle Police Station",
    "Law and Order Police Station",
]


class DataSeeder:
    def __init__(self, db_session):
        self.db = db_session
        self.district_ids = {}
        self.unit_ids = []
        self.unit_to_district = {}
        self.crime_head_ids = {}
        self.status_ids = {}
        self.employee_ids = []
        self.state_id = 1
        self.case_ids = []
        self.section_map = {}
        self.accused_ids = []

    async def seed_all(self):
        await self.seed_reference_tables()
        await self.seed_cases(7000)
        await self.seed_persons()
        await self.seed_arrests()
        await self.seed_act_sections()
        await self.seed_analytics_tables()
        await self._seed_intentional_patterns()
        await self.seed_users()

    async def _insert(self, table: str, data: list[dict]):
        if not data:
            return
        cols = list(data[0].keys())
        placeholders = ", ".join([f":{c}" for c in cols])
        stmt = f"INSERT INTO {table} ({', '.join(cols)}) VALUES ({placeholders})"
        for row in data:
            await self.db.execute(text(stmt), row)
        await self.db.commit()

    async def seed_reference_tables(self):
        now = datetime.now()

        await self.db.execute(text("DELETE FROM mo_patterns"))
        await self.db.execute(text("DELETE FROM anomaly_detections"))
        await self.db.execute(text("DELETE FROM risk_predictions"))
        await self.db.execute(text("DELETE FROM crime_hotspots"))
        await self.db.execute(text("DELETE FROM alerts"))
        await self.db.execute(text("DELETE FROM act_section_associations"))
        await self.db.execute(text("DELETE FROM arrest_surrenders"))
        await self.db.execute(text("DELETE FROM victims"))
        await self.db.execute(text("DELETE FROM complainant_details"))
        await self.db.execute(text("DELETE FROM accused"))
        await self.db.execute(text("DELETE FROM case_masters"))
        await self.db.execute(text("DELETE FROM employees"))
        await self.db.execute(text("DELETE FROM courts"))
        await self.db.execute(text("DELETE FROM units"))
        await self.db.execute(text("DELETE FROM districts"))
        await self.db.execute(text("DELETE FROM states"))
        await self.db.execute(text("DELETE FROM crime_sub_heads"))
        await self.db.execute(text("DELETE FROM crime_heads"))
        await self.db.execute(text("DELETE FROM sections"))
        await self.db.execute(text("DELETE FROM acts"))
        await self.db.execute(text("DELETE FROM unit_types"))
        await self.db.execute(text("DELETE FROM case_status_masters"))
        await self.db.execute(text("DELETE FROM case_categories"))
        await self.db.execute(text("DELETE FROM gravity_offences"))
        await self.db.execute(text("DELETE FROM religion_masters"))
        await self.db.execute(text("DELETE FROM occupation_masters"))
        await self.db.execute(text("DELETE FROM caste_masters"))
        await self.db.execute(text("DELETE FROM users"))
        await self.db.execute(text("DELETE FROM designations"))
        await self.db.execute(text("DELETE FROM ranks"))
        await self.db.execute(text("ALTER SEQUENCE states_state_id_seq RESTART WITH 1"))
        await self.db.commit()

        await self._insert("states", [{"state_name": "Karnataka", "nationality_id": 1, "active": True}])

        district_data = []
        for i, d in enumerate(KARNATAKA_DISTRICTS, 1):
            district_data.append({
                "district_id": i,
                "district_name": d,
                "state_id": 1,
                "active": True,
            })
            self.district_ids[d] = i
        await self._insert("districts", district_data)

        unit_type_data = [
            {"unit_type_id": 1, "unit_type_name": "Police Station", "city_dist_state": "City", "hierarchy": 3, "active": True},
            {"unit_type_id": 2, "unit_type_name": "District Police Office", "city_dist_state": "District", "hierarchy": 2, "active": True},
            {"unit_type_id": 3, "unit_type_name": "Commissionerate", "city_dist_state": "City", "hierarchy": 1, "active": True},
        ]
        await self._insert("unit_types", unit_type_data)

        unit_data = []
        unit_id = 1
        for dist_name, dist_id in self.district_ids.items():
            num_stations = 7 if dist_name in ("Bengaluru Urban", "Mysuru", "Belagavi") else random.randint(4, 6)
            for j in range(num_stations):
                lat_lon = DISTRICT_LAT_LON[dist_name]
                station_name = random.choice(STATION_NAMES)
                unit_data.append({
                    "unit_id": unit_id,
                    "unit_name": f"{dist_name} {station_name} #{j + 1}",
                    "type_id": 1,
                    "parent_unit": None,
                    "state_id": 1,
                    "district_id": dist_id,
                    "active": True,
                    "latitude": round(lat_lon[0] + random.uniform(-0.05, 0.05), 6),
                    "longitude": round(lat_lon[1] + random.uniform(-0.05, 0.05), 6),
                })
                self.unit_ids.append(unit_id)
                self.unit_to_district[unit_id] = dist_id
                unit_id += 1
        await self._insert("units", unit_data)

        crime_head_data = []
        for idx, (name, _) in enumerate(CRIME_HEADS, 1):
            crime_head_data.append({"crime_head_id": idx, "crime_group_name": name, "active": True})
            self.crime_head_ids[name] = idx
        await self._insert("crime_heads", crime_head_data)

        sub_head_data = []
        sh_id = 1
        for head_id in range(1, len(CRIME_HEADS) + 1):
            for k in range(random.randint(1, 3)):
                sub_head_data.append({
                    "crime_sub_head_id": sh_id,
                    "crime_head_id": head_id,
                    "crime_head_name": f"{CRIME_HEADS[head_id - 1][0]} - Type {k + 1}",
                    "seq_id": k + 1,
                })
                sh_id += 1
        self.max_sub_head_id = sh_id - 1
        await self._insert("crime_sub_heads", sub_head_data)

        status_data = []
        for idx, s in enumerate(CASE_STATUSES, 1):
            status_data.append({"case_status_id": idx, "case_status_name": s})
            self.status_ids[s] = idx
        await self._insert("case_status_masters", status_data)

        await self._insert("case_categories", [
            {"case_category_id": 1, "lookup_value": "Cognizable"},
            {"case_category_id": 2, "lookup_value": "Non-Cognizable"},
        ])
        await self._insert("gravity_offences", [
            {"gravity_offence_id": 1, "lookup_value": "Heinous"},
            {"gravity_offence_id": 2, "lookup_value": "Serious"},
            {"gravity_offence_id": 3, "lookup_value": "Regular"},
        ])

        await self._insert("caste_masters", [{"caste_master_id": i + 1, "caste_master_name": n} for i, n in enumerate(CASTE_NAMES)])
        await self._insert("religion_masters", [{"religion_id": i + 1, "religion_name": n} for i, n in enumerate(RELIGION_NAMES)])
        await self._insert("occupation_masters", [{"occupation_id": i + 1, "occupation_name": n} for i, n in enumerate(OCCUPATION_NAMES)])

        await self._insert("ranks", [
            {"rank_id": 1, "rank_name": "Constable", "hierarchy": 1, "active": True},
            {"rank_id": 2, "rank_name": "Head Constable", "hierarchy": 2, "active": True},
            {"rank_id": 3, "rank_name": "Assistant Sub-Inspector", "hierarchy": 3, "active": True},
            {"rank_id": 4, "rank_name": "Sub-Inspector", "hierarchy": 4, "active": True},
            {"rank_id": 5, "rank_name": "Inspector", "hierarchy": 5, "active": True},
            {"rank_id": 6, "rank_name": "Deputy Superintendent", "hierarchy": 6, "active": True},
        ])
        await self._insert("designations", [
            {"designation_id": 1, "designation_name": "Head Constable", "active": True, "sort_order": 1},
            {"designation_id": 2, "designation_name": "ASHC", "active": True, "sort_order": 2},
            {"designation_id": 3, "designation_name": "PSI", "active": True, "sort_order": 3},
            {"designation_id": 4, "designation_name": "PI", "active": True, "sort_order": 4},
            {"designation_id": 5, "designation_name": "DySP", "active": True, "sort_order": 5},
            {"designation_id": 6, "designation_name": "SP", "active": True, "sort_order": 6},
        ])

        emp_data = []
        for ei in range(1, 101):
            dist_name = random.choice(KARNATAKA_DISTRICTS)
            dist_id = self.district_ids[dist_name]
            station_id = random.choice([u for u, d in self.unit_to_district.items() if d == dist_id] or self.unit_ids)
            emp_data.append({
                "employee_id": ei,
                "district_id": dist_id,
                "unit_id": station_id,
                "rank_id": random.randint(1, 6),
                "designation_id": random.randint(1, 6),
                "kgid": f"KSP{ei:06d}",
                "first_name": random.choice(MALE_NAMES + FEMALE_NAMES),
                "employee_dob": fake.date_of_birth(minimum_age=25, maximum_age=58),
                "gender_id": random.choice([1, 2]),
                "blood_group_id": random.randint(1, 4),
                "physically_challenged": random.random() < 0.02,
                "appointment_date": fake.date_between(start_date="-20y", end_date="-1y"),
            })
            self.employee_ids.append(ei)
        await self._insert("employees", emp_data)

        act_data = []
        for act_name, sections in IPC_SECTIONS.items():
            act_code = act_name[:20]
            act_data.append({"act_code": act_code, "act_description": f"{act_name} Act", "short_name": act_name, "active": True})
        await self._insert("acts", act_data)

        section_data = []
        for act_name, sections in IPC_SECTIONS.items():
            act_code = act_name[:20]
            for section_code, section_desc in sections:
                section_data.append({
                    "act_code": act_code,
                    "section_code": section_code,
                    "section_description": section_desc,
                    "active": True,
                })
                self.section_map.setdefault(act_code, {})[section_code] = section_desc
        await self._insert("sections", section_data)

        court_data = []
        for i, dist_name in enumerate(KARNATAKA_DISTRICTS, 1):
            court_data.append({
                "court_id": i,
                "court_name": f"District & Sessions Court, {dist_name}",
                "district_id": self.district_ids[dist_name],
                "state_id": 1,
                "active": True,
            })
        await self._insert("courts", court_data)

    async def seed_cases(self, count: int):
        start_date = date(2024, 1, 1)
        end_date = date(2026, 6, 30)
        date_range_days = (end_date - start_date).days

        crime_head_weights = {
            "Murder": 0.03, "Attempt to Murder": 0.04, "Rape": 0.04,
            "Kidnapping & Abduction": 0.04, "Robbery": 0.07, "Burglary": 0.08,
            "Theft": 0.15, "Rioting": 0.03, "Cruelty by Husband": 0.07,
            "Dowry Death": 0.02, "Cheating & Fraud": 0.12, "Cybercrime": 0.10,
            "Motor Vehicle Theft": 0.10, "Arms Act": 0.03, "Drug Offences": 0.08,
        }
        crime_heads_list = list(crime_head_weights.keys())
        crime_heads_weights = list(crime_head_weights.values())

        case_data = []
        batch_size = 500

        for i in range(1, count + 1):
            crime_date = start_date + timedelta(days=random.randint(0, date_range_days))
            head_name = random.choices(crime_heads_list, weights=crime_heads_weights, k=1)[0]
            head_id = self.crime_head_ids[head_name]
            unit_id = random.choice(self.unit_ids)
            district_id = self.unit_to_district[unit_id]
            emp_id = random.choice(self.employee_ids)
            status_name = random.choices(
                CASE_STATUSES,
                weights=[0.30, 0.20, 0.10, 0.10, 0.15, 0.05, 0.05, 0.05],
                k=1,
            )[0]
            status_id = self.status_ids[status_name]

            lat_lon = DISTRICT_LAT_LON.get(head_name, DISTRICT_LAT_LON.get(random.choice(KARNATAKA_DISTRICTS)))
            if lat_lon:
                lat = round(lat_lon[0] + random.uniform(-0.03, 0.03), 6)
                lon = round(lat_lon[1] + random.uniform(-0.03, 0.03), 6)
            else:
                lat = round(random.uniform(11.5, 18.5), 6)
                lon = round(random.uniform(74.0, 78.5), 6)

            month = crime_date.month
            if month in [10, 11, 12]:
                lat += random.uniform(-0.005, 0.005)

            is_weekend = crime_date.weekday() >= 5
            hour = random.choices(
                range(24),
                weights=[2, 1, 1, 1, 1, 2, 3, 5, 6, 5, 4, 4, 4, 4, 4, 5, 6, 7, 8, 6, 4, 4, 3, 2],
                k=1,
            )[0]

            brief = random.choice(BRIEF_FACTS_TEMPLATES).format(
                suspect=random.choice(SUSPECT_TYPES),
                action=random.choice(ACTIONS),
                location=random.choice(LOCATIONS),
                date_str=crime_date.strftime("%d-%m-%Y"),
                injury=random.choice(INJURIES),
                amount=random.choice(AMOUNTS),
            )

            if head_name == "Cybercrime" and crime_date >= date(2025, 1, 1):
                brief = brief.replace("stole a two-wheeler", "created a phishing website").replace(
                    "forcibly entered", "hacked into the system")

            case_data.append({
                "crime_no": f"FIR/{crime_date.year}/{i:05d}",
                "case_no": str(i),
                "crime_registered_date": crime_date,
                "police_person_id": emp_id,
                "police_station_id": unit_id,
                "case_category_id": random.choice([1, 2]),
                "gravity_offence_id": random.choice([1, 2, 3]),
                "crime_major_head_id": head_id,
                "crime_minor_head_id": random.randint(1, self.max_sub_head_id),
                "case_status_id": status_id,
                "court_id": random.randint(1, 31),
                "incident_from_date": datetime.combine(crime_date - timedelta(days=random.randint(0, 3)), datetime.min.time()),
                "incident_to_date": datetime.combine(crime_date, datetime.min.time()) if random.random() < 0.3 else None,
                "info_received_ps_date": datetime.combine(crime_date, datetime.min.time()),
                "latitude": lat,
                "longitude": lon,
                "brief_facts": brief,
            })

            if len(case_data) >= batch_size:
                await self._insert("case_masters", case_data)
                for c in case_data:
                    self.case_ids.append({"crime_no": c["crime_no"], "head_id": c["crime_major_head_id"], "district": district_id})
                case_data = []

        if case_data:
            await self._insert("case_masters", case_data)
            for c in case_data:
                self.case_ids.append({"crime_no": c["crime_no"], "head_id": c["crime_major_head_id"], "district": None})

    async def _get_case_ids(self):
        result = await self.db.execute(text("SELECT case_master_id, crime_major_head_id FROM case_masters ORDER BY case_master_id"))
        return result.fetchall()

    async def seed_persons(self):
        rows = await self._get_case_ids()

        complainant_data = []
        victim_data = []
        accused_data = []

        for case_id, head_id in rows:
            num_complainants = 1
            for _ in range(num_complainants):
                gender = random.choice(["male", "female"])
                complainant_data.append({
                    "case_master_id": case_id,
                    "complainant_name": random.choice(MALE_NAMES) if gender == "male" else random.choice(FEMALE_NAMES),
                    "age_year": random.randint(18, 75),
                    "occupation_id": random.randint(1, len(OCCUPATION_NAMES)),
                    "religion_id": random.randint(1, len(RELIGION_NAMES)),
                    "caste_id": random.randint(1, len(CASTE_NAMES)),
                    "gender_id": 1 if gender == "male" else 2,
                })

            has_victim = random.random() < 0.4
            if has_victim:
                victim_data.append({
                    "case_master_id": case_id,
                    "victim_name": random.choice(MALE_NAMES + FEMALE_NAMES),
                    "age_year": random.randint(1, 70),
                    "gender_id": random.choice([1, 2]),
                    "victim_police": "1" if random.random() < 0.05 else "0",
                })

            num_accused = random.choices([0, 1, 2, 3, 4], weights=[0.1, 0.5, 0.2, 0.1, 0.1], k=1)[0]
            for _ in range(num_accused):
                accused_data.append({
                    "case_master_id": case_id,
                    "accused_name": random.choice(MALE_NAMES),
                    "age_year": random.randint(18, 60),
                    "gender_id": random.choice([1, 2]),
                    "person_id": f"UID{random.randint(100000, 999999)}",
                })

        await self._insert("complainant_details", complainant_data)
        await self._insert("victims", victim_data)
        await self._insert("accused", accused_data)

        result = await self.db.execute(text("SELECT accused_master_id, accused_name FROM accused"))
        self.accused_ids = result.fetchall()

    async def seed_arrests(self):
        arrest_data = []
        case_rows = await self.db.execute(text("SELECT case_master_id FROM case_masters ORDER BY case_master_id"))
        case_ids = [r[0] for r in case_rows.fetchall()]

        accused_rows = await self.db.execute(text("""
            SELECT a.accused_master_id, a.case_master_id
            FROM accused a ORDER BY a.accused_master_id
        """))
        accused_list = accused_rows.fetchall()

        for accused_id, case_id in accused_list:
            if random.random() < 0.30:
                arrest_data.append({
                    "case_master_id": case_id,
                    "arrest_surrender_type_id": random.choice([1, 2]),
                    "arrest_surrender_date": fake.date_between(start_date="-2y", end_date="today"),
                    "arrest_surrender_state_id": 1,
                    "arrest_surrender_district_id": self.district_ids[random.choice(KARNATAKA_DISTRICTS)],
                    "police_station_id": random.choice(self.unit_ids),
                    "io_id": random.choice(self.employee_ids),
                    "court_id": random.randint(1, 31),
                    "accused_master_id": accused_id,
                    "is_accused": True,
                    "is_complainant_accused": random.random() < 0.05,
                })

        await self._insert("arrest_surrenders", arrest_data)

    async def seed_act_sections(self):
        case_rows = await self.db.execute(text("SELECT case_master_id, crime_major_head_id FROM case_masters"))
        cases = case_rows.fetchall()

        head_to_sections = {
            1: [("IPC", "302")],
            2: [("IPC", "307")],
            3: [("IPC", "376")],
            4: [("IPC", "363")],
            5: [("IPC", "392")],
            6: [("IPC", "454"), ("IPC", "457")],
            7: [("IPC", "379")],
            8: [("IPC", "147"), ("IPC", "148")],
            9: [("IPC", "498A"), ("IPC", "323")],
            10: [("IPC", "304B")],
            11: [("IPC", "420"), ("IPC", "468")],
            12: [("IT Act", "66"), ("IT Act", "66D")],
            13: [("IPC", "379")],
            14: [("Arms Act", "25")],
            15: [("NDPS Act", "20")],
        }

        assoc_data = []
        for case_id, head_id in cases:
            sections = head_to_sections.get(head_id, [("IPC", "420")])
            act_code = sections[0][0][:20]
            for idx, (act, sec) in enumerate(sections):
                assoc_data.append({
                    "case_master_id": case_id,
                    "act_id": act[:20],
                    "section_id": sec,
                    "act_order_id": 1,
                    "section_order_id": idx + 1,
                })

        await self._insert("act_section_associations", assoc_data)

    async def seed_analytics_tables(self):
        await self._seed_hotspots()
        await self._seed_risk_predictions()
        await self._seed_anomalies()
        await self._seed_alerts()
        await self._seed_repeat_offender_patterns()

    async def _seed_hotspots(self):
        hotspot_ids = self.district_ids

        hotspot_data = []
        for dist_name, dist_id in hotspot_ids.items():
            lat_lon = DISTRICT_LAT_LON.get(dist_name, (15.0, 76.0))
            score = round(random.uniform(0.1, 9.5), 2)
            hotspot_data.append({
                "district_id": dist_id,
                "police_station_id": random.choice([
                    u for u, d in self.unit_to_district.items() if d == dist_id
                ] or self.unit_ids),
                "latitude": round(lat_lon[0] + random.uniform(-0.02, 0.02), 6),
                "longitude": round(lat_lon[1] + random.uniform(-0.02, 0.02), 6),
                "crime_category_id": random.choice([1, 2]),
                "crime_head_id": random.randint(1, 15),
                "hotspot_radius_meters": random.randint(300, 1000),
                "incident_count": random.randint(5, 50),
                "risk_score": score,
                "computed_date": date.today() - timedelta(days=random.randint(1, 7)),
                "valid_until": date.today() + timedelta(days=random.randint(15, 45)),
            })

        koramangala_district = self.district_ids.get("Bengaluru Urban")
        if koramangala_district:
            stations = [u for u, d in self.unit_to_district.items() if d == koramangala_district]
            if stations:
                for kc in range(3):
                    hotspot_data.append({
                        "district_id": koramangala_district,
                        "police_station_id": random.choice(stations),
                        "latitude": round(12.9352 + random.uniform(-0.01, 0.01), 6),
                        "longitude": round(77.6245 + random.uniform(-0.01, 0.01), 6),
                        "crime_category_id": 1,
                        "crime_head_id": self.crime_head_ids.get("Theft", 7),
                        "hotspot_radius_meters": 500,
                        "incident_count": random.randint(35, 50),
                        "risk_score": round(random.uniform(7.5, 9.5), 2),
                        "computed_date": date.today() - timedelta(days=1),
                        "valid_until": date.today() + timedelta(days=30),
                    })

        await self._insert("crime_hotspots", hotspot_data)

    async def _seed_risk_predictions(self):
        pred_data = []
        for dist_name, dist_id in self.district_ids.items():
            for cat_id in [1, 2]:
                risk = round(random.uniform(1.0, 9.0), 2)
                pred_data.append({
                    "district_id": dist_id,
                    "police_station_id": random.choice([
                        u for u, d in self.unit_to_district.items() if d == dist_id
                    ] or self.unit_ids),
                    "crime_category_id": cat_id,
                    "prediction_date": date.today(),
                    "forecast_date": date.today() + timedelta(days=random.randint(7, 30)),
                    "predicted_incidents": random.randint(5, 150),
                    "confidence_interval_low": round(max(0.1, risk - 1.5), 2),
                    "confidence_interval_high": round(risk + 1.5, 2),
                    "risk_level": "high" if risk > 6.5 else "medium" if risk > 3.5 else "low",
                    "model_version": "v1.0",
                })

        blore_id = self.district_ids.get("Bengaluru Urban")
        if blore_id:
            for cat_id in [1, 2]:
                pred_data.append({
                    "district_id": blore_id,
                    "police_station_id": random.choice([
                        u for u, d in self.unit_to_district.items() if d == blore_id
                    ]),
                    "crime_category_id": cat_id,
                    "prediction_date": date.today(),
                    "forecast_date": date.today() + timedelta(days=14),
                    "predicted_incidents": random.randint(200, 300),
                    "confidence_interval_low": 6.5,
                    "confidence_interval_high": 9.8,
                    "risk_level": "critical",
                    "model_version": "v1.0",
                })

        await self._insert("risk_predictions", pred_data)

    async def _seed_anomalies(self):
        case_rows = await self.db.execute(text("""
            SELECT cm.case_master_id, ch.crime_group_name, cm.brief_facts
            FROM case_masters cm
            JOIN crime_heads ch ON cm.crime_major_head_id = ch.crime_head_id
            ORDER BY RANDOM() LIMIT 50
        """))
        cases = case_rows.fetchall()

        anomaly_data = []
        for case_id, crime_name, brief in cases:
            if random.random() < 0.3:
                score = round(random.uniform(0.7, 0.99), 4)
                anomaly_data.append({
                    "case_master_id": case_id,
                    "anomaly_type": random.choice(["unusual_time", "rare_category", "geo_outlier", "spike"]),
                    "anomaly_score": score,
                    "description": f"Unusual {crime_name.lower()} case detected - anomaly score {score}",
                    "reviewed": random.random() < 0.3,
                })
        await self._insert("anomaly_detections", anomaly_data)

    async def _seed_alerts(self):
        alert_templates = [
            ("Critical crime spike detected", "CRITICAL"),
            ("Unusual pattern in chain snatching", "HIGH"),
            ("Hotspot zone expanding", "WARNING"),
            ("Repeat offender active", "HIGH"),
            ("Cyber fraud campaign detected", "CRITICAL"),
            ("Seasonal crime trend alert", "WATCH"),
            ("District crossing threshold", "HIGH"),
            ("New MO pattern identified", "WARNING"),
        ]

        alert_data = []
        for i in range(15):
            title, severity = random.choice(alert_templates)
            dist_name = random.choice(KARNATAKA_DISTRICTS)
            alert_data.append({
                "alert_type": "system",
                "severity": severity,
                "district_id": self.district_ids[dist_name],
                "police_station_id": random.choice([
                    u for u, d in self.unit_to_district.items() if d == self.district_ids[dist_name]
                ] or self.unit_ids),
                "title": title,
                "description": f"Automated alert generated for {dist_name}: {title.lower()}",
                "is_read": False,
                "created_at": datetime.now() - timedelta(hours=random.randint(1, 72)),
            })

        murder_id = self.crime_head_ids.get("Murder", 1)
        quiet_district = None
        for dist_name, dist_id in self.district_ids.items():
            if dist_name not in ("Bengaluru Urban", "Mysuru", "Belagavi"):
                quiet_district = dist_id
                break

        if quiet_district:
            alert_data.append({
                "alert_type": "anomaly",
                "severity": "CRITICAL",
                "district_id": quiet_district,
                "police_station_id": random.choice([
                    u for u, d in self.unit_to_district.items() if d == quiet_district
                ] or self.unit_ids),
                "title": "Zero to One - First Murder in 2 Years",
                "description": f"A murder case has been registered in a district with zero homicides in the past 24 months. Immediate attention required.",
                "is_read": False,
                "created_at": datetime.now() - timedelta(hours=2),
            })

        await self._insert("alerts", alert_data)

    async def _seed_intentional_patterns(self):
        case_rows = await self.db.execute(text("""
            SELECT case_master_id, crime_major_head_id, crime_registered_date, police_station_id
            FROM case_masters ORDER BY case_master_id
        """))
        all_cases = case_rows.fetchall()

        blore_stations = [u for u, d in self.unit_to_district.items()
                          if d == self.district_ids.get("Bengaluru Urban")]
        mysuru_stations = [u for u, d in self.unit_to_district.items()
                           if d == self.district_ids.get("Mysuru")]
        theft_head_id = self.crime_head_ids.get("Theft", 7)

        koramangala_cases = [
            c for c in all_cases
            if c[2] is not None and c[3] in (blore_stations or [])
        ][:45]

        for case in koramangala_cases[:45]:
            await self.db.execute(text("""
                UPDATE case_masters
                SET latitude = 12.9352 + random() * 0.02 - 0.01,
                    longitude = 77.6245 + random() * 0.02 - 0.01,
                    crime_major_head_id = :head_id
                WHERE case_master_id = :cid
            """), {"cid": case[0], "head_id": theft_head_id})
        await self.db.commit()

        ramesh_stmt = """
            INSERT INTO accused (case_master_id, accused_name, age_year, gender_id, person_id)
            VALUES (:cid, 'Ramesh Kumar', :age, 1, :pid)
        """
        ramesh_cases = [c for c in all_cases if c[2] is not None][:6]
        for idx, case in enumerate(ramesh_cases):
            await self.db.execute(text(ramesh_stmt), {
                "cid": case[0], "age": random.randint(25, 45), "pid": f"UID900{idx}"
            })
        await self.db.commit()

        gang_members = ["Suresh Patel", "Venkatesh Rao", "Mallikarjun", "Shivakumar", "Satish Shetty"]
        gang_cases = [c for c in all_cases
                      if c[3] in (blore_stations + mysuru_stations) and c[2] is not None][:8]
        for case in gang_cases:
            for member in gang_members:
                await self.db.execute(text("""
                    INSERT INTO accused (case_master_id, accused_name, age_year, gender_id, person_id)
                    VALUES (:cid, :name, :age, 1, :pid)
                """), {"cid": case[0], "name": member, "age": random.randint(22, 50),
                       "pid": f"UIDG{random.randint(100, 999)}"})
        await self.db.commit()

    async def _seed_repeat_offender_patterns(self):
        await self.db.execute(text("""
            INSERT INTO mo_patterns (accused_master_id, pattern_signature, associated_cases, first_seen, last_seen, evolution_score)
            SELECT DISTINCT ON (q.accused_name)
                (SELECT accused_master_id FROM accused WHERE accused_name = q.accused_name LIMIT 1),
                'repeat_offender',
                q.case_ids,
                q.first_seen,
                q.last_seen,
                q.score
            FROM (
                SELECT
                    a.accused_name,
                    ARRAY_AGG(DISTINCT a.case_master_id) AS case_ids,
                    MIN(cm.crime_registered_date) AS first_seen,
                    MAX(cm.crime_registered_date) AS last_seen,
                    ROUND(COUNT(DISTINCT a.case_master_id) * 1.0 / 5, 2) AS score
                FROM accused a
                JOIN case_masters cm ON a.case_master_id = cm.case_master_id
                GROUP BY a.accused_name
                HAVING COUNT(DISTINCT a.case_master_id) >= 2
            ) q
        """))
        await self.db.commit()

    async def seed_users(self):
        users_data = [
            {
                "username": "scrb_admin",
                "hashed_password": hash_password("admin123"),
                "role": "SCRB",
                "district_id": None,
                "station_id": None,
            },
            {
                "username": "sp_bengaluru",
                "hashed_password": hash_password("sp123"),
                "role": "SP",
                "district_id": self.district_ids.get("Bengaluru Urban"),
                "station_id": None,
            },
            {
                "username": "io_koramangala",
                "hashed_password": hash_password("io123"),
                "role": "IO",
                "district_id": self.district_ids.get("Bengaluru Urban"),
                "station_id": self.unit_ids[0] if self.unit_ids else None,
            },
        ]

        for user in users_data:
            await self.db.execute(
                text("""
                    INSERT INTO users (username, hashed_password, role, district_id, station_id, is_active)
                    VALUES (:username, :password, :role, :district_id, :station_id, TRUE)
                """),
                user,
            )
        await self.db.commit()
