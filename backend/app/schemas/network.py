from pydantic import BaseModel


class NodeOut(BaseModel):
    id: str
    label: str
    node_type: str
    weight: float = 1.0


class EdgeOut(BaseModel):
    source: str
    target: str
    relation: str
    weight: float = 1.0


class NetworkGraph(BaseModel):
    nodes: list[NodeOut]
    edges: list[EdgeOut]


class RepeatOffender(BaseModel):
    accused_master_id: int
    accused_name: str
    case_count: int
