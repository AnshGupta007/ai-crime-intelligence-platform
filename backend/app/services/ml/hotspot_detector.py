from sklearn.cluster import DBSCAN
import numpy as np


class HotspotDetector:
    def __init__(self, eps_meters: float = 500, min_samples: int = 3):
        self.eps = eps_meters / 111320.0
        self.min_samples = min_samples
        self.model = DBSCAN(eps=self.eps, min_samples=self.min_samples)

    def detect(self, df):
        if len(df) < self.min_samples:
            return []
        coords = df[["latitude", "longitude"]].values
        labels = self.model.fit_predict(coords)
        clusters = []
        for label in set(labels):
            if label == -1:
                continue
            mask = labels == label
            cluster_points = coords[mask]
            clusters.append({
                "center_lat": float(np.mean(cluster_points[:, 0])),
                "center_lon": float(np.mean(cluster_points[:, 1])),
                "radius_meters": self.eps * 111320,
                "incident_count": int(np.sum(mask)),
            })
        return clusters
