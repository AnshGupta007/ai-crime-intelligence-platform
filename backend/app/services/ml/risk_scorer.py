class RiskScorer:
    def calculate_district_risk(self, district_stats: dict) -> dict:
        score = 0.0
        score += min(district_stats.get("incident_count_30d", 0) / 100, 3)
        score += min(district_stats.get("incident_count_90d_avg", 0) / 100, 2)
        score += min(abs(district_stats.get("trend_slope", 0)) * 10, 2)
        score += min(district_stats.get("hotspot_count", 0) * 0.5, 1.5)
        score += min(district_stats.get("repeat_offender_count", 0) * 0.3, 1.5)
        score = round(min(score, 10), 1)

        if score >= 8:
            level = "critical"
        elif score >= 6:
            level = "high"
        elif score >= 4:
            level = "medium"
        else:
            level = "low"

        return {"risk_score": score, "risk_level": level}
