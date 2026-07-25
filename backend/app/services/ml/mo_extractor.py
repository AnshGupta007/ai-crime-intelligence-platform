import re
from collections import Counter


class MOExtractor:
    def extract_patterns(self, brief_facts_list: list[str]) -> list[dict]:
        patterns = []
        keywords = ["forced", "entered", "threatened", "snatched", "broke into",
                    "parked", "phishing", "ransom", "gang", "stolen"]
        for text in brief_facts_list:
            found = [kw for kw in keywords if kw.lower() in text.lower()]
            if found:
                patterns.append({"signature": " ".join(found), "keywords": found})
        return patterns

    def cluster_by_mo(self, cases: list[dict]) -> list[dict]:
        return []
