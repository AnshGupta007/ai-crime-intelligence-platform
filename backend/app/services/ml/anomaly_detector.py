from sklearn.ensemble import IsolationForest
import numpy as np


class AnomalyDetector:
    def __init__(self, contamination: float = 0.05):
        self.model = IsolationForest(contamination=contamination, random_state=42)

    def fit_predict(self, features: np.ndarray):
        labels = self.model.fit_predict(features)
        scores = self.model.score_samples(features)
        results = []
        for i, (label, score) in enumerate(zip(labels, scores)):
            results.append({
                "index": i,
                "is_anomaly": bool(label == -1),
                "anomaly_score": round(float(1 - (score + 0.5) / 1.5), 4),
            })
        return results
