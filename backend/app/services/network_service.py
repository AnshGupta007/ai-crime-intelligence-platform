import networkx as nx
from networkx.algorithms.community import greedy_modularity_communities
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession


async def get_accused_network(db: AsyncSession, accused_id: int, depth: int):
    rows = (await db.execute(text("""
        SELECT DISTINCT a.accused_name, cm.crime_no, cm.case_master_id
        FROM accused a
        JOIN case_masters cm ON a.case_master_id = cm.case_master_id
        WHERE a.accused_master_id = :id
    """), {"id": accused_id})).fetchall()

    nodes = [{"id": f"accused-{accused_id}", "label": rows[0][0] if rows else "Unknown",
              "node_type": "accused", "weight": 1.0}]
    edges = []
    case_ids = set()

    for r in rows:
        case_id = r[2]
        if case_id not in case_ids:
            case_ids.add(case_id)
            nodes.append({"id": f"case-{case_id}", "label": r[1], "node_type": "case", "weight": 0.8})
            edges.append({"source": f"accused-{accused_id}", "target": f"case-{case_id}",
                          "relation": "ACCUSED_IN", "weight": 1.0})

    return {"nodes": nodes, "edges": edges}


async def get_repeat_offenders(db: AsyncSession, min_cases: int):
    rows = (await db.execute(text("""
        SELECT a.accused_master_id, a.accused_name, COUNT(DISTINCT a.case_master_id) AS case_count
        FROM accused a
        GROUP BY a.accused_master_id, a.accused_name
        HAVING COUNT(DISTINCT a.case_master_id) >= :min_cases
        ORDER BY case_count DESC
    """), {"min_cases": min_cases})).fetchall()
    return [{"accused_master_id": r[0], "accused_name": r[1], "case_count": r[2]} for r in rows]


async def detect_communities(db: AsyncSession):
    co_accused = (await db.execute(text("""
        SELECT a1.accused_name, a2.accused_name, COUNT(DISTINCT a1.case_master_id) AS weight
        FROM accused a1
        JOIN accused a2 ON a1.case_master_id = a2.case_master_id
            AND a1.accused_master_id < a2.accused_master_id
        GROUP BY a1.accused_name, a2.accused_name
        HAVING COUNT(DISTINCT a1.case_master_id) >= 2
    """))).fetchall()

    G = nx.Graph()
    for r in co_accused:
        G.add_edge(r[0], r[1], weight=r[2])

    communities = []
    if G.number_of_nodes() > 0:
        raw_comms = list(greedy_modularity_communities(G))
        for i, comm in enumerate(raw_comms):
            communities.append({
                "id": i,
                "size": len(comm),
                "members": sorted(list(comm)),
            })

    return {
        "communities": communities,
        "total_nodes": G.number_of_nodes(),
        "total_edges": G.number_of_edges(),
    }


async def search_accused(db: AsyncSession, q: str):
    rows = (await db.execute(text("""
        SELECT accused_master_id, accused_name, COUNT(DISTINCT case_master_id) AS case_count
        FROM accused
        WHERE accused_name ILIKE :q
        GROUP BY accused_master_id, accused_name
        ORDER BY case_count DESC
        LIMIT 20
    """), {"q": f"%{q}%"})).fetchall()
    return [{"accused_master_id": r[0], "accused_name": r[1], "case_count": r[2]} for r in rows]


async def get_case_network(db: AsyncSession, case_id: int):
    rows = (await db.execute(text("""
        SELECT a.accused_master_id, a.accused_name
        FROM accused a
        WHERE a.case_master_id = :id
    """), {"id": case_id})).fetchall()

    nodes = [{"id": f"case-{case_id}", "label": f"Case #{case_id}", "node_type": "case", "weight": 1.0}]
    edges = []
    for r in rows:
        nodes.append({"id": f"accused-{r[0]}", "label": r[1], "node_type": "accused", "weight": 0.8})
        edges.append({"source": f"case-{case_id}", "target": f"accused-{r[0]}", "relation": "HAS_ACCUSED", "weight": 1.0})
    return {"nodes": nodes, "edges": edges}
