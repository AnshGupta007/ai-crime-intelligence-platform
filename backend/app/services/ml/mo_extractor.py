from collections import defaultdict
from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer


class MOExtractor:
    def __init__(self, n_clusters: int = 5):
        self.vectorizer = TfidfVectorizer(
            max_features=100,
            stop_words=["the", "a", "an", "and", "or", "in", "on", "at", "to", "of", "was", "had", "with"]
        )
        self.n_clusters = n_clusters

    def extract_patterns(self, brief_facts_list: list[str]) -> list[dict]:
        """Extract MO signatures from case facts using TF-IDF keyword importance."""
        if not brief_facts_list:
            return []
        try:
            tfidf_matrix = self.vectorizer.fit_transform(brief_facts_list)
            feature_names = self.vectorizer.get_feature_names_out()
            patterns = []
            for i, text in enumerate(brief_facts_list):
                row = tfidf_matrix[i].toarray()[0]
                top_indices = row.argsort()[-5:][::-1]
                top_keywords = [feature_names[j] for j in top_indices if row[j] > 0]
                patterns.append({
                    "signature": " ".join(top_keywords) if top_keywords else "unspecified_mo",
                    "keywords": top_keywords,
                    "tfidf_score": float(row.sum()),
                })
            return patterns
        except Exception:
            keywords = ["forced", "entered", "threatened", "snatched", "broke into", "parked", "phishing", "ransom", "gang", "stolen"]
            patterns = []
            for text in brief_facts_list:
                found = [kw for kw in keywords if kw.lower() in text.lower()]
                patterns.append({"signature": " ".join(found) if found else "general_theft", "keywords": found})
            return patterns

    def cluster_by_mo(self, cases: list[dict]) -> list[dict]:
        """Group cases by MO similarity using KMeans clustering on TF-IDF vectors."""
        if not cases:
            return []
        if len(cases) < self.n_clusters:
            return [{
                "cluster_id": 0,
                "case_ids": [c.get("case_master_id", idx) for idx, c in enumerate(cases)],
                "mo_signature": "primary_cluster",
                "size": len(cases),
            }]
        try:
            texts = [c.get("brief_facts", c.get("description", "")) for c in cases]
            tfidf_matrix = self.vectorizer.fit_transform(texts)
            n_c = min(self.n_clusters, len(cases))
            kmeans = KMeans(n_clusters=n_c, random_state=42, n_init=10)
            labels = kmeans.fit_predict(tfidf_matrix)
            feature_names = self.vectorizer.get_feature_names_out()

            clusters = defaultdict(list)
            for i, label in enumerate(labels):
                cid = cases[i].get("case_master_id", i)
                clusters[int(label)].append(cid)

            result = []
            for cluster_id, case_ids in clusters.items():
                center = kmeans.cluster_centers_[cluster_id]
                top_words = [feature_names[j] for j in center.argsort()[-4:][::-1] if center[j] > 0]
                result.append({
                    "cluster_id": int(cluster_id),
                    "case_ids": case_ids,
                    "mo_signature": " | ".join(top_words) if top_words else "general_modus_operandi",
                    "size": len(case_ids),
                })
            return result
        except Exception:
            return [{
                "cluster_id": 0,
                "case_ids": [c.get("case_master_id", idx) for idx, c in enumerate(cases)],
                "mo_signature": "general_modus_operandi",
                "size": len(cases),
            }]
