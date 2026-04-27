from dataclasses import dataclass, field, asdict
from datetime import datetime, timezone
from typing import Literal

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="The Guide — sample API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


Badge = Literal["mostly-harmless", "mostly-dangerous", "unknown"]
Locale = Literal["en", "cs"]


@dataclass
class Entry:
    id: int
    title: str
    body: str
    badge: Badge
    contributor: str
    created_at: str
    locale: Locale
    tags: list[str] = field(default_factory=list)


class EntryInput(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    body: str = Field(min_length=1, max_length=4000)
    badge: Badge = "unknown"
    contributor: str = Field(default="Anonymous", min_length=1, max_length=80)
    locale: Locale = "en"
    tags: list[str] = Field(default_factory=list, max_length=10)


def _seed() -> list[Entry]:
    fixed = datetime(2026, 4, 27, 12, 0, 0, tzinfo=timezone.utc).isoformat()
    return [
        Entry(
            id=1,
            title="On the towel, and why you should always know where it is",
            body=(
                "A towel is about the most massively useful thing an interstellar "
                "hitchhiker can have. Partly it has great practical value: wrap it "
                "around you for warmth on the cold moons of Jaglan Beta, sleep "
                "under it on the marble-sanded beaches of Santraginus V, wet it "
                "for use in hand-to-hand combat. More importantly, a towel has "
                "immense psychological value. Any strag who can hitch the length "
                "of the Galaxy, rough it, and still know where their towel is, is "
                "clearly a person to be reckoned with."
            ),
            badge="mostly-harmless",
            contributor="Ford Prefect",
            created_at=fixed,
            locale="en",
            tags=["preparedness", "essentials"],
        ),
        Entry(
            id=2,
            title="The Babel Fish",
            body=(
                "Small, yellow, leech-like, and probably the oddest thing in the "
                "Universe. It feeds on brainwave energy from those around it and "
                "excretes a telepathic matrix into the brain of its host. The "
                "practical upshot is that if you stick one in your ear, you can "
                "instantly understand anything said to you in any language. "
                "Effectively removes all barriers to communication between "
                "different races and cultures — which has, in turn, caused more "
                "and bloodier wars than anything else in the history of creation."
            ),
            badge="mostly-harmless",
            contributor="The Guide",
            created_at=fixed,
            locale="en",
            tags=["communication", "biology"],
        ),
        Entry(
            id=3,
            title="Vogon poetry",
            body=(
                "Vogon poetry is, of course, the third worst in the Universe. The "
                "second worst is that of the Azgoths of Kria; during a recitation "
                "the poet's own large intestine, in a desperate attempt to escape, "
                "leapt straight up through his neck and throttled his brain. The "
                "very worst was written by Paula Nancy Millstone Jennings of "
                "Greenbridge, Essex, England, and was destroyed along with the "
                "Earth in the demolition of the planet. If you find yourself "
                "within earshot of a Vogon recital, your only chance is to "
                "compliment the poetry until the poet either weeps or explodes."
            ),
            badge="mostly-dangerous",
            contributor="Slartibartfast",
            created_at=fixed,
            locale="en",
            tags=["danger", "art"],
        ),
        Entry(
            id=4,
            title="O ručníku, a proč ho mít vždy po ruce",
            body=(
                "Ručník je ta nejužitečnější věc, kterou si galaktický stopař může "
                "vzít s sebou na cestu. Zahřeje, poslouží jako lůžko, filtr na "
                "pitnou vodu, signální vlajka i provizorní zbraň. Má ale především "
                "psychologickou hodnotu. Kdokoli prošel půl galaxie, přespal v "
                "zákopu na Betelgeuse a stále ví, kde má svůj ručník, je "
                "nepochybně osoba, která ví, co dělá — a okolí se k němu podle "
                "toho chová."
            ),
            badge="mostly-harmless",
            contributor="Ford Prefect",
            created_at=fixed,
            locale="cs",
            tags=["příprava", "základy"],
        ),
        Entry(
            id=5,
            title="Babylonská rybka",
            body=(
                "Drobná, žlutá, podobná pijavici. Živí se mozkovou energií svého "
                "okolí a vylučuje do mozku hostitele telepatickou matrici. "
                "Stručně řečeno: strčíte si ji do ucha a okamžitě rozumíte "
                "čemukoli, co vám kdo řekne v jakémkoli jazyce. Vědci ji "
                "považují za jeden z nejmocnějších argumentů proti existenci "
                "Boha — neboť něco tak nepravděpodobně užitečného nemohlo "
                "vzniknout náhodou."
            ),
            badge="mostly-harmless",
            contributor="The Guide",
            created_at=fixed,
            locale="cs",
            tags=["komunikace", "biologie"],
        ),
        Entry(
            id=6,
            title="Vogonská poezie",
            body=(
                "Vogonská poezie je třetí nejhorší ve známém vesmíru. Druhá "
                "nejhorší pochází od Azgothů z Krie a běžně způsobuje, že se "
                "posluchačovi vlastní střeva pokusí proklát hrudník v zoufalé "
                "snaze uniknout. Pokud se ocitnete na recitálu Vogona, jediná "
                "šance na přežití je poezii nahlas chválit. Vogon buď upadne do "
                "sebelítostné letargie, nebo exploduje radostí — v obou "
                "případech získáte krátkou chvíli na útěk."
            ),
            badge="mostly-dangerous",
            contributor="Slartibartfast",
            created_at=fixed,
            locale="cs",
            tags=["nebezpečí", "umění"],
        ),
    ]


_entries: list[Entry] = _seed()
_next_id: int = max(e.id for e in _entries) + 1


@app.get("/api/entries")
def list_entries(
    locale: Locale | None = Query(default=None, description="Filter by locale"),
) -> list[dict]:
    items = _entries if locale is None else [e for e in _entries if e.locale == locale]
    return [asdict(e) for e in items]


@app.get("/api/entries/{entry_id}")
def get_entry(entry_id: int) -> dict:
    for entry in _entries:
        if entry.id == entry_id:
            return asdict(entry)
    raise HTTPException(status_code=404, detail="entry not found")


@app.post("/api/entries", status_code=201)
def create_entry(payload: EntryInput) -> dict:
    global _next_id
    cleaned_tags = [t.strip()[:20] for t in payload.tags if t.strip()]
    entry = Entry(
        id=_next_id,
        title=payload.title.strip(),
        body=payload.body.strip(),
        badge=payload.badge,
        contributor=payload.contributor.strip(),
        created_at=datetime.now(timezone.utc).isoformat(),
        locale=payload.locale,
        tags=cleaned_tags,
    )
    _entries.append(entry)
    _next_id += 1
    return asdict(entry)
