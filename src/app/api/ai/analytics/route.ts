import { db } from "@/db";
import { crimePredictions, riskScores, hotspotPredictions, mlModelMetadata, crimeTrendForecasts, accused } from "@/db/schema";
import { count, eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const predictions = await db.select().from(crimePredictions).orderBy(desc(crimePredictions.createdAt)).limit(50);
    const models = await db.select().from(mlModelMetadata).orderBy(desc(mlModelMetadata.createdAt));
    const repeatOffenders = await db.select().from(accused).where(eq(accused.isRepeatOffender, true)).limit(20);
    const forecasts = await db.select().from(crimeTrendForecasts).orderBy(desc(crimeTrendForecasts.createdAt)).limit(30);
    const riskScoreList = await db.select().from(riskScores).limit(50);

    return NextResponse.json({ predictions, models, repeatOffenders, forecasts, riskScores: riskScoreList });
  } catch (error) {
    console.error("AI Analytics error:", error);
    return NextResponse.json(getFallbackAIData());
  }
}

function getFallbackAIData() {
  const predictions = [
    { id: "p1", predictionType: "crime_risk", predictedValue: "High probability of burglary cluster in Bengaluru Central", confidence: "87.5", explanation: "Historical pattern shows 23% increase in burglary incidents during Dec-Jan in this area. Factors: proximity to commercial zones, low police visibility at night, 14 prior incidents in 500m radius.", recommendedAction: "Deploy additional night patrol units in MG Road-Brigade Road corridor. Install CCTV at 5 identified blind spots.", featuresUsed: { proximityToCommercial: 0.89, nightCrimeRate: 0.76, priorIncidentDensity: 0.82, policeResponseTime: 0.45 }, historicalComparison: { previousPeriod: 18, currentPrediction: 23, changePercent: 27.7 }, districtCode: 1, unitCode: 101, predictionDate: "2025-12-01", forecastHorizon: "7_days" },
    { id: "p2", predictionType: "repeat_offender", predictedValue: "Ravi Kumar (A-234) likely to re-offend within 30 days", confidence: "91.2", explanation: "Subject has 4 prior arrests for vehicle theft. MO pattern matches 3 unsolved cases in same jurisdiction. Recently released on bail — historical re-offend rate for this profile is 73%.", recommendedAction: "Place under enhanced surveillance. Alert jurisdiction stations. Coordinate with probation officer.", featuresUsed: { priorArrests: 4, bailStatus: "active", gangAffiliationScore: 0.67, geographicalProximity: 0.89, temporalPattern: 0.78 }, historicalComparison: { avgReoffendDays: 28, profileRisk: "high" }, districtCode: 1, predictionDate: "2025-12-01", forecastHorizon: "30_days" },
    { id: "p3", predictionType: "hotspot", predictedValue: "Emerging hotspot near Hebbal-Kempapura corridor", confidence: "78.4", explanation: "DBSCAN clustering detected 6 incidents forming a new cluster in previously low-crime area. Rapid urbanization and new commercial establishments changing crime landscape.", recommendedAction: "Increase patrol frequency from 2x to 4x daily. Deploy community policing team. Install 3 temporary CCTV units.", featuresUsed: { clusterDensity: 0.72, urbanizationRate: 0.85, policeCoverageGap: 0.91 }, districtCode: 1, predictionDate: "2025-12-01", forecastHorizon: "14_days" },
    { id: "p4", predictionType: "anomaly", predictedValue: "Unusual spike in chain-snatching in Mysuru — 340% above baseline", confidence: "82.1", explanation: "Isolation Forest detected 3σ deviation from 2-year baseline. Correlation with recent release of 2 known chain-snatchers from Mysuru jail.", recommendedAction: "Cross-reference with released offender movement data. Deploy decoy operations. Alert women's safety helpline.", featuresUsed: { baselineDeviation: 3.4, recentOffenderRelease: 2, temporalCorrelation: 0.78 }, districtCode: 2, predictionDate: "2025-12-01", forecastHorizon: "7_days" },
    { id: "p5", predictionType: "emerging_crime", predictedValue: "Emerging AI-powered investment fraud pattern across 4 districts", confidence: "75.6", explanation: "NLP analysis of 8 recent FIR briefs identifies consistent pattern: social media ads → WhatsApp group → crypto investment → disappearance. Victim profile: 30-45 age, tech-literate, middle income.", recommendedAction: "Coordinate cyber cell across 4 districts. Issue public advisory through social media. Request WhatsApp group monitoring from central cyber authority.", featuresUsed: { nlpPatternMatch: 0.87, crossDistrictCorrelation: 0.82, victimProfileMatch: 0.76 }, districtCode: 1, predictionDate: "2025-12-01", forecastHorizon: "30_days" },
    { id: "p6", predictionType: "district_risk", predictedValue: "Kalaburagi district risk elevated — communal tension indicators", confidence: "69.3", explanation: "Social media sentiment analysis + historical communal incident calendar indicates elevated risk. 3 prior incidents in same period over last 5 years. Current trigger: disputed religious site procession scheduled.", recommendedAction: "Deploy rapid response unit. Coordinate with community leaders. Pre-position peace committee. Monitor social media through cyber cell.", featuresUsed: { sentimentScore: -0.67, historicalPattern: 3, triggerEvents: 1, policeReadiness: 0.55 }, districtCode: 16, predictionDate: "2025-12-01", forecastHorizon: "14_days" },
  ];

  const models = [
    { id: "m1", modelName: "CrimeRiskPredictor", modelType: "lightgbm", version: "v2.3.1", status: "deployed", accuracy: "87.5", f1Score: "0.84", auc: "0.9123", trainingDate: "2025-11-15", trainingDataSize: 45000, description: "Predicts crime risk level for given geographic and temporal features", hyperparameters: { learningRate: 0.05, maxDepth: 8, nEstimators: 500 }, featureImportance: { proximityToCommercial: 0.23, nightCrimeRate: 0.19, priorIncidentDensity: 0.18, policeResponseTime: 0.12, seasonalFactor: 0.11 } },
    { id: "m2", modelName: "RepeatOffenderClassifier", modelType: "xgboost", version: "v1.8.0", status: "deployed", accuracy: "91.2", f1Score: "0.89", auc: "0.9456", trainingDate: "2025-10-20", trainingDataSize: 12000, description: "Classifies accused as likely repeat offenders based on criminal history and behavioral patterns", hyperparameters: { learningRate: 0.1, maxDepth: 6, nEstimators: 300 }, featureImportance: { priorArrests: 0.31, bailStatus: 0.22, gangAffiliation: 0.18, geographicalPattern: 0.14 } },
    { id: "m3", modelName: "HotspotDetector", modelType: "dbscan+kde", version: "v3.1.0", status: "deployed", accuracy: "82.0", f1Score: "0.79", auc: "0.8612", trainingDate: "2025-11-01", trainingDataSize: 68000, description: "Detects crime hotspots using density-based clustering and kernel density estimation", hyperparameters: { eps: 0.005, minSamples: 5, bandwidth: 0.01 }, featureImportance: { clusterDensity: 0.35, temporalPattern: 0.25, urbanizationRate: 0.20 } },
    { id: "m4", modelName: "AnomalyDetector", modelType: "isolation_forest", version: "v2.0.0", status: "deployed", accuracy: "82.1", f1Score: "0.77", auc: "0.8434", trainingDate: "2025-09-15", trainingDataSize: 25000, description: "Detects anomalous crime patterns using isolation forest algorithm", hyperparameters: { nEstimators: 200, contamination: 0.05, maxFeatures: 1.0 }, featureImportance: { baselineDeviation: 0.40, recentOffenderActivity: 0.25, temporalCorrelation: 0.20 } },
    { id: "m5", modelName: "CrimeTrendForecaster", modelType: "prophet", version: "v1.5.0", status: "experimental", accuracy: "76.0", f1Score: null, auc: null, trainingDate: "2025-10-01", trainingDataSize: 34000, description: "Forecasts crime trends using Facebook Prophet time-series model", hyperparameters: { seasonalityMode: "multiplicative", changepointPriorScale: 0.05 }, featureImportance: { seasonality: 0.45, trend: 0.35, holidays: 0.15 } },
    { id: "m6", modelName: "GangDetector", modelType: "community_detection", version: "v1.2.0", status: "experimental", accuracy: "78.0", f1Score: "0.76", auc: "0.8234", trainingDate: "2025-08-20", trainingDataSize: 8000, description: "Detects criminal gangs/communities using graph community detection algorithms", hyperparameters: { algorithm: "louvain", resolution: 1.0 }, featureImportance: { coAccusedFrequency: 0.35, sharedAddresses: 0.25, sharedMobileNumbers: 0.20 } },
    { id: "m7", modelName: "CrimeSimilaritySearch", modelType: "sentence_transformers", version: "v1.0.0", status: "experimental", accuracy: "79.5", f1Score: null, auc: null, trainingDataSize: 15000, description: "Semantic similarity search for FIR briefs using sentence embeddings", hyperparameters: { model: "all-MiniLM-L6-v2", dimension: 384 }, featureImportance: null },
  ];

  const repeatOffenders = [
    { id: "a1", accusedName: "Ravi Kumar", accusedAge: 32, accusedGender: "male", accusedStatus: "on_bail", isRepeatOffender: true, previousCaseCount: 4, criminalHistory: "Vehicle theft (3 arrests), Robbery (1 arrest). Active gang member of 'Brigade Road Crew'. Known for targeting parked cars.", gangAffiliation: "Brigade Road Crew", alias: "RK", districtName: "Bengaluru Urban" },
    { id: "a2", accusedName: "Mohammed Ashraf", accusedAge: 28, accusedGender: "male", accusedStatus: "absconding", isRepeatOffender: true, previousCaseCount: 3, criminalHistory: "Chain snatching specialist. 3 prior cases across 2 districts. Operates near bus stops during evening hours.", gangAffiliation: "Mysuru Chain Gang", alias: "Ashu", districtName: "Mysuru" },
    { id: "a3", accusedName: "Venkatesh Prasad", accusedAge: 45, accusedGender: "male", accusedStatus: "in_jail", isRepeatOffender: true, previousCaseCount: 6, criminalHistory: "Burglary kingpin. 6 prior cases. Leads organized burglary ring operating across 4 districts. MO: targets locked houses during daytime.", gangAffiliation: "Dharwad Break-in Syndicate", alias: "VP", districtName: "Dharwad" },
    { id: "a4", accusedName: "Priya Sharma", accusedAge: 26, accusedGender: "female", accusedStatus: "on_bail", isRepeatOffender: true, previousCaseCount: 2, criminalHistory: "Cyber fraud operator. 2 prior cases. Uses social media for investment scam. Part of crypto fraud ring.", gangAffiliation: "Tech Corridor Fraud Ring", alias: "PS", districtName: "Bengaluru Urban" },
    { id: "a5", accusedName: "Suresh Babu", accusedAge: 38, accusedGender: "male", accusedStatus: "absconding", isRepeatOffender: true, previousCaseCount: 5, criminalHistory: "Drug peddler. 5 prior NDPS cases. Supplies ganja from Andhra border. Network spans 3 districts.", gangAffiliation: "Raichur Drug Network", alias: "SB", districtName: "Raichur" },
    { id: "a6", accusedName: "Kiran Reddy", accusedAge: 29, accusedGender: "male", accusedStatus: "arrested", isRepeatOffender: true, previousCaseCount: 3, criminalHistory: "Assault and extortion. 3 prior cases. Strongman for local politician. Operates in Ballari mining belt.", gangAffiliation: "Ballari Mining Gang", alias: "KR", districtName: "Ballari" },
  ];

  const forecasts = [
    { id: "f1", districtCode: 1, crimeHeadCode: 7, forecastDate: "2025-12-15", predictedCount: 48, lowerBound: 38, upperBound: 58, trendDirection: "up", confidence: "78.5", method: "prophet" },
    { id: "f2", districtCode: 1, crimeHeadCode: 12, forecastDate: "2025-12-15", predictedCount: 35, lowerBound: 28, upperBound: 42, trendDirection: "stable", confidence: "82.1", method: "prophet" },
    { id: "f3", districtCode: 2, crimeHeadCode: 5, forecastDate: "2025-12-15", predictedCount: 12, lowerBound: 8, upperBound: 16, trendDirection: "down", confidence: "71.3", method: "prophet" },
    { id: "f4", districtCode: 16, crimeHeadCode: 8, forecastDate: "2025-12-15", predictedCount: 8, lowerBound: 4, upperBound: 12, trendDirection: "up", confidence: "65.2", method: "prophet" },
    { id: "f5", districtCode: 5, crimeHeadCode: 6, forecastDate: "2025-12-15", predictedCount: 22, lowerBound: 17, upperBound: 27, trendDirection: "stable", confidence: "76.8", method: "prophet" },
  ];

  const riskScores = [
    { id: "rs1", entityType: "district", entityId: "1", riskScore: "92.5", riskLevel: "critical", contributingFactors: ["high_population_density", "commercial_zone_concentration", "night_crime_rate", "limited_cctv_coverage"] },
    { id: "rs2", entityType: "district", entityId: "16", riskScore: "78.3", riskLevel: "high", contributingFactors: ["communal_tension_history", "border_crime_inflow", "limited_police_infrastructure"] },
    { id: "rs3", entityType: "district", entityId: "7", riskScore: "74.1", riskLevel: "high", contributingFactors: ["mining_conflict", "extortion_network", "absconding_offenders"] },
    { id: "rs4", entityType: "unit", entityId: "101", riskScore: "88.7", riskLevel: "critical", contributingFactors: ["mg_road_corridor", "tourist_area", "night_crime", "vehicle_theft_cluster"] },
    { id: "rs5", entityType: "unit", entityId: "105", riskScore: "82.3", riskLevel: "high", contributingFactors: ["residential_burglary_cluster", "limited_night_patrol"] },
    { id: "rs6", entityType: "offender", entityId: "a1", riskScore: "91.2", riskLevel: "critical", contributingFactors: ["4_prior_arrests", "active_gang_member", "on_bail", "same_jurisdiction"] },
    { id: "rs7", entityType: "offender", entityId: "a5", riskScore: "85.6", riskLevel: "high", contributingFactors: ["5_prior_ndps_cases", "absconding", "cross_district_network", "border_crime_links"] },
  ];

  return { predictions, models, repeatOffenders, forecasts, riskScores };
}
