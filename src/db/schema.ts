import {
  pgTable, uuid, varchar, integer, bigint, boolean, date, timestamp,
  text, decimal, serial, jsonb, pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ───────────────────────────────────────────────────────

export const firStatusEnum = pgEnum("fir_status", [
  "under_investigation",
  "chargesheeted",
  "final_report_false",
  "final_report_true",
  "transferred",
  "closed",
  "pending_trial",
  "convicted",
  "acquitted",
]);

export const genderEnum = pgEnum("gender", ["male", "female", "transgender", "unknown"]);
export const arrestTypeEnum = pgEnum("arrest_type", ["arrested", "surrendered", "court_arrest", "absconding"]);
export const accusedStatusEnum = pgEnum("accused_status", ["arrested", "absconding", "surrendered", "on_bail", "in_jail", "acquitted", "convicted"]);
export const caseCategoryEnum = pgEnum("case_category_type", ["heinous", "major", "minor", "petty"]);
export const gravityEnum = pgEnum("gravity", ["heinous", "serious", "normal", "minor"]);
export const unitTypeEnum = pgEnum("unit_type", ["police_station", "outpost", "circle_office", "district_headquarters", "range_office", "commissionerate"]);
export const courtTypeEnum = pgEnum("court_type", ["district_court", "sessions_court", "high_court", "magistrate_court", "fast_track_court", "special_court"]);
export const predictionTypeEnum = pgEnum("prediction_type", ["crime_risk", "repeat_offender", "hotspot", "anomaly", "emerging_crime", "district_risk", "station_risk"]);
export const relationTypeEnum = pgEnum("relation_type", [
  "shared_vehicle", "shared_mobile", "shared_address", "shared_location",
  "shared_weapon", "co_accused", "co_victim", "family", "associate", "gang_member",
]);
export const modelStatusEnum = pgEnum("model_status", ["training", "deployed", "deprecated", "experimental"]);

// ─── State ───────────────────────────────────────────────────────

export const states = pgTable("states", {
  stateCode: serial("state_code").primaryKey(),
  stateName: varchar("state_name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const statesRelations = relations(states, ({ many }) => ({
  districts: many(districts),
}));

// ─── District ────────────────────────────────────────────────────

export const districts = pgTable("districts", {
  districtCode: serial("district_code").primaryKey(),
  districtName: varchar("district_name", { length: 100 }).notNull(),
  stateCode: integer("state_code").references(() => states.stateCode).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
  population: integer("population"),
  areaSqKm: decimal("area_sq_km", { precision: 10, scale: 2 }),
  headquarters: varchar("headquarters", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const districtsRelations = relations(districts, ({ one, many }) => ({
  state: one(states, { fields: [districts.stateCode], references: [states.stateCode] }),
  units: many(units),
  courts: many(courts),
  employees: many(employees),
  cases: many(caseMaster),
  riskScores: many(riskScores),
  hotspotPredictions: many(hotspotPredictions),
  crimeTrendForecasts: many(crimeTrendForecasts),
}));

// ─── Unit (Police Station) ──────────────────────────────────────

export const units = pgTable("units", {
  unitCode: serial("unit_code").primaryKey(),
  unitName: varchar("unit_name", { length: 150 }).notNull(),
  districtCode: integer("district_code").references(() => districts.districtCode).notNull(),
  unitType: unitTypeEnum("unit_type").default("police_station"),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
  jurisdictionArea: varchar("jurisdiction_area", { length: 200 }),
  phone: varchar("phone", { length: 20 }),
  address: varchar("address", { length: 300 }),
  officerCount: integer("officer_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const unitsRelations = relations(units, ({ one, many }) => ({
  district: one(districts, { fields: [units.districtCode], references: [districts.districtCode] }),
  employees: many(employees),
  cases: many(caseMaster),
  riskScores: many(riskScores),
}));

// ─── Rank ────────────────────────────────────────────────────────

export const ranks = pgTable("ranks", {
  rankCode: serial("rank_code").primaryKey(),
  rankName: varchar("rank_name", { length: 50 }).notNull(),
  rankOrder: integer("rank_order").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ranksRelations = relations(ranks, ({ many }) => ({
  employees: many(employees),
  designations: many(designations),
}));

// ─── Designation ─────────────────────────────────────────────────

export const designations = pgTable("designations", {
  designationCode: serial("designation_code").primaryKey(),
  designationName: varchar("designation_name", { length: 100 }).notNull(),
  rankCode: integer("rank_code").references(() => ranks.rankCode),
  createdAt: timestamp("created_at").defaultNow(),
});

export const designationsRelations = relations(designations, ({ one }) => ({
  rank: one(ranks, { fields: [designations.rankCode], references: [ranks.rankCode] }),
}));

// ─── Employee (Police Officers) ──────────────────────────────────

export const employees = pgTable("employees", {
  employeeCode: serial("employee_code").primaryKey(),
  employeeName: varchar("employee_name", { length: 150 }).notNull(),
  rankCode: integer("rank_code").references(() => ranks.rankCode),
  designationCode: integer("designation_code").references(() => designations.designationCode),
  unitCode: integer("unit_code").references(() => units.unitCode),
  districtCode: integer("district_code").references(() => districts.districtCode),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 100 }),
  badgeNumber: varchar("badge_number", { length: 30 }),
  isActive: boolean("is_active").default(true),
  yearsOfService: integer("years_of_service"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const employeesRelations = relations(employees, ({ one, many }) => ({
  rank: one(ranks, { fields: [employees.rankCode], references: [ranks.rankCode] }),
  designation: one(designations, { fields: [employees.designationCode], references: [designations.designationCode] }),
  unit: one(units, { fields: [employees.unitCode], references: [units.unitCode] }),
  district: one(districts, { fields: [employees.districtCode], references: [districts.districtCode] }),
  investigatedCases: many(caseMaster),
}));

// ─── CrimeHead ───────────────────────────────────────────────────

export const crimeHeads = pgTable("crime_heads", {
  crimeHeadCode: serial("crime_head_code").primaryKey(),
  crimeHeadDescription: varchar("crime_head_description", { length: 200 }).notNull(),
  ipcSection: varchar("ipc_section", { length: 50 }),
  category: varchar("category", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const crimeHeadsRelations = relations(crimeHeads, ({ many }) => ({
  crimeSubHeads: many(crimeSubHeads),
  cases: many(caseMaster),
}));

// ─── CrimeSubHead ────────────────────────────────────────────────

export const crimeSubHeads = pgTable("crime_sub_heads", {
  crimeSubHeadCode: serial("crime_sub_head_code").primaryKey(),
  crimeHeadCode: integer("crime_head_code").references(() => crimeHeads.crimeHeadCode).notNull(),
  crimeSubHeadDescription: varchar("crime_sub_head_description", { length: 200 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const crimeSubHeadsRelations = relations(crimeSubHeads, ({ one, many }) => ({
  crimeHead: one(crimeHeads, { fields: [crimeSubHeads.crimeHeadCode], references: [crimeHeads.crimeHeadCode] }),
  cases: many(caseMaster),
}));

// ─── CaseCategory ────────────────────────────────────────────────

export const caseCategories = pgTable("case_categories", {
  categoryCode: serial("category_code").primaryKey(),
  categoryName: caseCategoryEnum("category_name").notNull(),
  description: varchar("description", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const caseCategoriesRelations = relations(caseCategories, ({ many }) => ({
  cases: many(caseMaster),
}));

// ─── GravityOffence ──────────────────────────────────────────────

export const gravityOffences = pgTable("gravity_offences", {
  gravityCode: serial("gravity_code").primaryKey(),
  gravityName: gravityEnum("gravity_name").notNull(),
  description: varchar("description", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const gravityOffencesRelations = relations(gravityOffences, ({ many }) => ({
  cases: many(caseMaster),
}));

// ─── OccupationMaster ────────────────────────────────────────────

export const occupationMaster = pgTable("occupation_master", {
  occupationCode: serial("occupation_code").primaryKey(),
  occupationName: varchar("occupation_name", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── ReligionMaster ──────────────────────────────────────────────

export const religionMaster = pgTable("religion_master", {
  religionCode: serial("religion_code").primaryKey(),
  religionName: varchar("religion_name", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Court ───────────────────────────────────────────────────────

export const courts = pgTable("courts", {
  courtCode: serial("court_code").primaryKey(),
  courtName: varchar("court_name", { length: 150 }).notNull(),
  districtCode: integer("district_code").references(() => districts.districtCode),
  courtType: courtTypeEnum("court_type").default("district_court"),
  address: varchar("address", { length: 300 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const courtsRelations = relations(courts, ({ one, many }) => ({
  district: one(districts, { fields: [courts.districtCode], references: [districts.districtCode] }),
  chargesheets: many(chargesheetDetails),
}));

// ─── CaseMaster (Main FIR Table) ────────────────────────────────

export const caseMaster = pgTable("case_master", {
  id: uuid("id").defaultRandom().primaryKey(),
  firNumber: varchar("fir_number", { length: 50 }).notNull().unique(),
  caseNumber: varchar("case_number", { length: 50 }),
  year: integer("year").notNull(),
  dateOfReport: date("date_of_report").notNull(),
  dateOfOccurrence: date("date_of_occurrence").notNull(),
  timeOfOccurrence: varchar("time_of_occurrence", { length: 10 }),
  districtCode: integer("district_code").references(() => districts.districtCode).notNull(),
  unitCode: integer("unit_code").references(() => units.unitCode).notNull(),
  crimeHeadCode: integer("crime_head_code").references(() => crimeHeads.crimeHeadCode).notNull(),
  crimeSubHeadCode: integer("crime_sub_head_code").references(() => crimeSubHeads.crimeSubHeadCode),
  categoryCode: integer("category_code").references(() => caseCategories.categoryCode),
  gravityCode: integer("gravity_code").references(() => gravityOffences.gravityCode),
  firStatus: firStatusEnum("fir_status").default("under_investigation").notNull(),
  investigatingOfficer: integer("investigating_officer").references(() => employees.employeeCode),
  briefFacts: text("brief_facts"),
  placeOfOccurrence: varchar("place_of_occurrence", { length: 300 }),
  latitude: decimal("latitude", { precision: 10, scale: 6 }),
  longitude: decimal("longitude", { precision: 10, scale: 6 }),
  addressOfOccurrence: varchar("address_of_occurrence", { length: 500 }),
  isNightCrime: boolean("is_night_crime").default(false),
  isUrbanCrime: boolean("is_urban_crime").default(false),
  weaponUsed: varchar("weapon_used", { length: 100 }),
  vehicleUsed: varchar("vehicle_used", { length: 100 }),
  modusOperandi: varchar("modus_operandi", { length: 200 }),
  propertyStolenValue: integer("property_stolen_value"),
  propertyRecoveredValue: integer("property_recovered_value"),
  numberOfVictims: integer("number_of_victims").default(0),
  numberOfAccused: integer("number_of_accused").default(0),
  numberOfArrests: integer("number_of_arrests").default(0),
  daysSinceOccurrence: integer("days_since_occurrence"),
  daysToChargesheet: integer("days_to_chargesheet"),
  isHighProfile: boolean("is_high_profile").default(false),
  isSensitive: boolean("is_sensitive").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const caseMasterRelations = relations(caseMaster, ({ one, many }) => ({
  district: one(districts, { fields: [caseMaster.districtCode], references: [districts.districtCode] }),
  unit: one(units, { fields: [caseMaster.unitCode], references: [units.unitCode] }),
  crimeHead: one(crimeHeads, { fields: [caseMaster.crimeHeadCode], references: [crimeHeads.crimeHeadCode] }),
  crimeSubHead: one(crimeSubHeads, { fields: [caseMaster.crimeSubHeadCode], references: [crimeSubHeads.crimeSubHeadCode] }),
  category: one(caseCategories, { fields: [caseMaster.categoryCode], references: [caseCategories.categoryCode] }),
  gravity: one(gravityOffences, { fields: [caseMaster.gravityCode], references: [gravityOffences.gravityCode] }),
  investigatingOfficerRelation: one(employees, { fields: [caseMaster.investigatingOfficer], references: [employees.employeeCode] }),
  victims: many(victims),
  accused: many(accused),
  complainant: many(complainantDetails),
  actSections: many(actSectionAssociation),
  arrests: many(arrestSurrender),
  chargesheets: many(chargesheetDetails),
  predictions: many(crimePredictions),
  recommendationLogs: many(recommendationLogs),
}));

// ─── Victim ──────────────────────────────────────────────────────

export const victims = pgTable("victims", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id").references(() => caseMaster.id).notNull(),
  victimName: varchar("victim_name", { length: 150 }).notNull(),
  victimAge: integer("victim_age"),
  victimGender: genderEnum("victim_gender").default("unknown"),
  victimOccupationCode: integer("victim_occupation_code").references(() => occupationMaster.occupationCode),
  victimReligionCode: integer("victim_religion_code").references(() => religionMaster.religionCode),
  victimAddress: varchar("victim_address", { length: 500 }),
  victimPhone: varchar("victim_phone", { length: 20 }),
  isInjured: boolean("is_injured").default(false),
  isDead: boolean("is_dead").default(false),
  relationshipWithAccused: varchar("relationship_with_accused", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const victimsRelations = relations(victims, ({ one }) => ({
  case: one(caseMaster, { fields: [victims.caseId], references: [caseMaster.id] }),
  occupation: one(occupationMaster, { fields: [victims.victimOccupationCode], references: [occupationMaster.occupationCode] }),
  religion: one(religionMaster, { fields: [victims.victimReligionCode], references: [religionMaster.religionCode] }),
}));

// ─── Accused ─────────────────────────────────────────────────────

export const accused = pgTable("accused", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id").references(() => caseMaster.id).notNull(),
  accusedName: varchar("accused_name", { length: 150 }).notNull(),
  accusedAge: integer("accused_age"),
  accusedGender: genderEnum("accused_gender").default("male"),
  accusedOccupationCode: integer("accused_occupation_code").references(() => occupationMaster.occupationCode),
  accusedReligionCode: integer("accused_religion_code").references(() => religionMaster.religionCode),
  accusedAddress: varchar("accused_address", { length: 500 }),
  accusedPhone: varchar("accused_phone", { length: 20 }),
  accusedStatus: accusedStatusEnum("accused_status").default("absconding"),
  isRepeatOffender: boolean("is_repeat_offender").default(false),
  previousCaseCount: integer("previous_case_count").default(0),
  criminalHistory: text("criminal_history"),
  gangAffiliation: varchar("gang_affiliation", { length: 100 }),
  alias: varchar("alias", { length: 100 }),
  identificationMarks: varchar("identification_marks", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const accusedRelations = relations(accused, ({ one, many }) => ({
  case: one(caseMaster, { fields: [accused.caseId], references: [caseMaster.id] }),
  occupation: one(occupationMaster, { fields: [accused.accusedOccupationCode], references: [occupationMaster.occupationCode] }),
  religion: one(religionMaster, { fields: [accused.accusedReligionCode], references: [religionMaster.religionCode] }),
  arrests: many(arrestSurrender),
}));

// ─── ComplainantDetails ──────────────────────────────────────────

export const complainantDetails = pgTable("complainant_details", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id").references(() => caseMaster.id).notNull(),
  complainantName: varchar("complainant_name", { length: 150 }).notNull(),
  complainantAge: integer("complainant_age"),
  complainantGender: genderEnum("complainant_gender").default("unknown"),
  complainantRelation: varchar("complainant_relation", { length: 50 }),
  complainantAddress: varchar("complainant_address", { length: 500 }),
  complainantPhone: varchar("complainant_phone", { length: 20 }),
  complainantOccupationCode: integer("complainant_occupation_code").references(() => occupationMaster.occupationCode),
  createdAt: timestamp("created_at").defaultNow(),
});

export const complainantDetailsRelations = relations(complainantDetails, ({ one }) => ({
  case: one(caseMaster, { fields: [complainantDetails.caseId], references: [caseMaster.id] }),
}));

// ─── ActSectionAssociation ───────────────────────────────────────

export const actSectionAssociation = pgTable("act_section_association", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id").references(() => caseMaster.id).notNull(),
  actName: varchar("act_name", { length: 100 }).notNull(),
  sectionNumber: varchar("section_number", { length: 50 }).notNull(),
  sectionDescription: varchar("section_description", { length: 200 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const actSectionAssociationRelations = relations(actSectionAssociation, ({ one }) => ({
  case: one(caseMaster, { fields: [actSectionAssociation.caseId], references: [caseMaster.id] }),
}));

// ─── ArrestSurrender ─────────────────────────────────────────────

export const arrestSurrender = pgTable("arrest_surrender", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id").references(() => caseMaster.id).notNull(),
  accusedId: uuid("accused_id").references(() => accused.id).notNull(),
  dateOfArrest: date("date_of_arrest"),
  arrestType: arrestTypeEnum("arrest_type").default("arrested"),
  arrestedBy: integer("arrested_by").references(() => employees.employeeCode),
  placeOfArrest: varchar("place_of_arrest", { length: 300 }),
  bailStatus: varchar("bail_status", { length: 30 }),
  bailDate: date("bail_date"),
  custodyStatus: varchar("custody_status", { length: 30 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const arrestSurrenderRelations = relations(arrestSurrender, ({ one }) => ({
  case: one(caseMaster, { fields: [arrestSurrender.caseId], references: [caseMaster.id] }),
  accusedPerson: one(accused, { fields: [arrestSurrender.accusedId], references: [accused.id] }),
  arrester: one(employees, { fields: [arrestSurrender.arrestedBy], references: [employees.employeeCode] }),
}));

// ─── ChargesheetDetails ──────────────────────────────────────────

export const chargesheetDetails = pgTable("chargesheet_details", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id").references(() => caseMaster.id).notNull(),
  chargesheetNumber: varchar("chargesheet_number", { length: 50 }).notNull(),
  dateOfChargesheet: date("date_of_chargesheet").notNull(),
  courtCode: integer("court_code").references(() => courts.courtCode),
  status: varchar("status", { length: 30 }),
  numberOfAccusedChargesheeted: integer("number_of_accused_chargesheeted"),
  numberOfWitnesses: integer("number_of_witnesses"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chargesheetDetailsRelations = relations(chargesheetDetails, ({ one }) => ({
  case: one(caseMaster, { fields: [chargesheetDetails.caseId], references: [caseMaster.id] }),
  court: one(courts, { fields: [chargesheetDetails.courtCode], references: [courts.courtCode] }),
}));

// ═══════════════════════════════════════════════════════════════════
// AI / ML TABLES
// ═══════════════════════════════════════════════════════════════════

// ─── CrimePrediction ─────────────────────────────────────────────

export const crimePredictions = pgTable("crime_predictions", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id").references(() => caseMaster.id),
  predictionType: predictionTypeEnum("prediction_type").notNull(),
  predictedValue: varchar("predicted_value", { length: 200 }).notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }).notNull(),
  modelVersion: varchar("model_version", { length: 50 }),
  featuresUsed: jsonb("features_used"),
  explanation: text("explanation"),
  recommendedAction: text("recommended_action"),
  historicalComparison: jsonb("historical_comparison"),
  districtCode: integer("district_code").references(() => districts.districtCode),
  unitCode: integer("unit_code").references(() => units.unitCode),
  predictionDate: date("prediction_date"),
  forecastHorizon: varchar("forecast_horizon", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const crimePredictionsRelations = relations(crimePredictions, ({ one }) => ({
  case: one(caseMaster, { fields: [crimePredictions.caseId], references: [caseMaster.id] }),
  district: one(districts, { fields: [crimePredictions.districtCode], references: [districts.districtCode] }),
  unit: one(units, { fields: [crimePredictions.unitCode], references: [units.unitCode] }),
}));

// ─── RiskScore ───────────────────────────────────────────────────

export const riskScores = pgTable("risk_scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  entityType: varchar("entity_type", { length: 30 }).notNull(),
  entityId: varchar("entity_id", { length: 100 }).notNull(),
  riskScore: decimal("risk_score", { precision: 5, scale: 2 }).notNull(),
  riskLevel: varchar("risk_level", { length: 20 }).notNull(),
  contributingFactors: jsonb("contributing_factors"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  districtCode: integer("district_code").references(() => districts.districtCode),
  unitCode: integer("unit_code").references(() => units.unitCode),
  createdAt: timestamp("created_at").defaultNow(),
});

export const riskScoresRelations = relations(riskScores, ({ one }) => ({
  district: one(districts, { fields: [riskScores.districtCode], references: [districts.districtCode] }),
  unit: one(units, { fields: [riskScores.unitCode], references: [units.unitCode] }),
}));

// ─── HotspotPrediction ───────────────────────────────────────────

export const hotspotPredictions = pgTable("hotspot_predictions", {
  id: uuid("id").defaultRandom().primaryKey(),
  districtCode: integer("district_code").references(() => districts.districtCode).notNull(),
  unitCode: integer("unit_code").references(() => units.unitCode),
  latitude: decimal("latitude", { precision: 10, scale: 6 }).notNull(),
  longitude: decimal("longitude", { precision: 10, scale: 6 }).notNull(),
  radiusKm: decimal("radius_km", { precision: 5, scale: 2 }),
  crimeType: varchar("crime_type", { length: 100 }),
  intensityScore: decimal("intensity_score", { precision: 5, scale: 2 }).notNull(),
  predictionDate: date("prediction_date").notNull(),
  forecastHorizonDays: integer("forecast_horizon_days").default(7),
  method: varchar("method", { length: 50 }),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const hotspotPredictionsRelations = relations(hotspotPredictions, ({ one }) => ({
  district: one(districts, { fields: [hotspotPredictions.districtCode], references: [districts.districtCode] }),
  unit: one(units, { fields: [hotspotPredictions.unitCode], references: [units.unitCode] }),
}));

// ─── KnowledgeGraphCache ─────────────────────────────────────────

export const knowledgeGraphCache = pgTable("knowledge_graph_cache", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceType: varchar("source_type", { length: 30 }).notNull(),
  sourceId: varchar("source_id", { length: 100 }).notNull(),
  targetType: varchar("target_type", { length: 30 }).notNull(),
  targetId: varchar("target_id", { length: 100 }).notNull(),
  relationType: relationTypeEnum("relation_type").notNull(),
  strength: decimal("strength", { precision: 5, scale: 2 }).default("1.00"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── EmbeddingStore ──────────────────────────────────────────────

export const embeddingStore = pgTable("embedding_store", {
  id: uuid("id").defaultRandom().primaryKey(),
  entityType: varchar("entity_type", { length: 30 }).notNull(),
  entityId: varchar("entity_id", { length: 100 }).notNull(),
  embedding: text("embedding"),
  modelUsed: varchar("model_used", { length: 100 }),
  dimension: integer("dimension"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── MLModelMetadata ─────────────────────────────────────────────

export const mlModelMetadata = pgTable("ml_model_metadata", {
  id: uuid("id").defaultRandom().primaryKey(),
  modelName: varchar("model_name", { length: 100 }).notNull(),
  modelType: varchar("model_type", { length: 50 }).notNull(),
  version: varchar("version", { length: 50 }).notNull(),
  status: modelStatusEnum("status").default("experimental"),
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }),
  f1Score: decimal("f1_score", { precision: 5, scale: 2 }),
  auc: decimal("auc", { precision: 5, scale: 4 }),
  trainingDate: date("training_date"),
  trainingDataSize: integer("training_data_size"),
  hyperparameters: jsonb("hyperparameters"),
  featureImportance: jsonb("feature_importance"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── RecommendationLog ───────────────────────────────────────────

export const recommendationLogs = pgTable("recommendation_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  caseId: uuid("case_id").references(() => caseMaster.id),
  recommendationType: varchar("recommendation_type", { length: 50 }).notNull(),
  recommendationText: text("recommendation_text").notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  source: varchar("source", { length: 50 }),
  userId: varchar("user_id", { length: 100 }),
  wasActioned: boolean("was_actioned").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const recommendationLogsRelations = relations(recommendationLogs, ({ one }) => ({
  case: one(caseMaster, { fields: [recommendationLogs.caseId], references: [caseMaster.id] }),
}));

// ─── CrimeTrendForecast ──────────────────────────────────────────

export const crimeTrendForecasts = pgTable("crime_trend_forecasts", {
  id: uuid("id").defaultRandom().primaryKey(),
  districtCode: integer("district_code").references(() => districts.districtCode).notNull(),
  crimeHeadCode: integer("crime_head_code").references(() => crimeHeads.crimeHeadCode),
  forecastDate: date("forecast_date").notNull(),
  predictedCount: integer("predicted_count").notNull(),
  lowerBound: integer("lower_bound"),
  upperBound: integer("upper_bound"),
  trendDirection: varchar("trend_direction", { length: 10 }),
  seasonality: jsonb("seasonality"),
  method: varchar("method", { length: 50 }),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const crimeTrendForecastsRelations = relations(crimeTrendForecasts, ({ one }) => ({
  district: one(districts, { fields: [crimeTrendForecasts.districtCode], references: [districts.districtCode] }),
  crimeHead: one(crimeHeads, { fields: [crimeTrendForecasts.crimeHeadCode], references: [crimeHeads.crimeHeadCode] }),
}));
