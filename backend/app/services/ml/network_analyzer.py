import networkx as nx
from networkx.algorithms.community import greedy_modularity_communities


class NetworkAnalyzer:
    def build_graph(self, edges: list[tuple]) -> nx.Graph:
        G = nx.Graph()
        G.add_edges_from(edges)
        return G

    def detect_communities(self, G: nx.Graph):
        communities = list(greedy_modularity_communities(G))
        return [{"id": i, "members": list(c), "size": len(c)} for i, c in enumerate(communities)]

    def centrality(self, G: nx.Graph):
        return {
            "degree": dict(nx.degree_centrality(G)),
            "betweenness": dict(nx.betweenness_centrality(G)),
            "clustering": dict(nx.clustering(G)),
        }
