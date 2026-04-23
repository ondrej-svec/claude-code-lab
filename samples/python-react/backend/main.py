from dataclasses import dataclass, asdict
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="cc-lab sample api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@dataclass
class Item:
    id: int
    name: str


class ItemInput(BaseModel):
    name: str


_items: list[Item] = [
    Item(1, "Onboarding checklist"),
    Item(2, "Weekly review"),
    Item(3, "Ship the thing"),
]
_next_id = 4


@app.get("/api/items")
def list_items() -> list[dict]:
    return [asdict(i) for i in _items]


@app.get("/api/items/{item_id}")
def get_item(item_id: int) -> dict:
    for item in _items:
        if item.id == item_id:
            return asdict(item)
    raise HTTPException(status_code=404, detail="not found")


@app.post("/api/items", status_code=201)
def create_item(payload: ItemInput) -> dict:
    global _next_id
    item = Item(id=_next_id, name=payload.name)
    _items.append(item)
    _next_id += 1
    return asdict(item)
