import { useEffect, useState } from "react";

type Item = { id: number; name: string };

export function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    fetch("/api/items")
      .then((r) => r.json())
      .then(setItems)
      .catch((e) => setError(String(e)));
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    const r = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: draft }),
    });
    const created = (await r.json()) as Item;
    setItems((prev) => [...prev, created]);
    setDraft("");
  }

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", maxWidth: 560, margin: "4rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "1.75rem", marginBottom: "1rem" }}>Items</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <ul style={{ padding: 0, listStyle: "none" }}>
        {items.map((item) => (
          <li key={item.id} style={{ padding: "0.5rem 0", borderBottom: "1px solid #eee" }}>
            <span style={{ color: "#888", marginRight: "0.5rem" }}>#{item.id}</span>
            {item.name}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAdd} style={{ marginTop: "1.5rem", display: "flex", gap: "0.5rem" }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="New item"
          style={{ flex: 1, padding: "0.5rem", border: "1px solid #ccc", borderRadius: 4 }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>Add</button>
      </form>
    </main>
  );
}
