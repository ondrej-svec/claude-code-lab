/**
 * Lab index loading skeleton — shown instantly during navigation from
 * the landing page (or any external entry) while the server streams
 * the chapter list. The sidebar lives in the layout and is handled by
 * the per-chapter loading.tsx; here we skeletonize the main column.
 */
export default function LabIndexLoading() {
  return (
    <div className="grid gap-10 md:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="md:sticky md:top-10 h-fit" />
      <main>
        <div className="max-w-2xl animate-pulse">
          {/* eyebrow */}
          <div
            className="h-3 w-24 rounded mb-3"
            style={{ background: "var(--border)" }}
          />
          {/* h1, two lines */}
          <div
            className="h-10 w-11/12 rounded mb-2"
            style={{ background: "var(--border)" }}
          />
          <div
            className="h-10 w-3/5 rounded mb-5"
            style={{ background: "var(--border)" }}
          />
          {/* lede */}
          <div className="space-y-3 mb-10">
            <div
              className="h-4 w-full rounded opacity-60"
              style={{ background: "var(--border)" }}
            />
            <div
              className="h-4 w-10/12 rounded opacity-60"
              style={{ background: "var(--border)" }}
            />
          </div>
          {/* nine chapter card placeholders */}
          <ol className="space-y-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <li
                key={i}
                className="p-5 rounded-xl border"
                style={{
                  background: "var(--surface-elevated)",
                  borderColor: "var(--border)",
                }}
              >
                <div
                  className="h-3 w-28 rounded mb-2 opacity-70"
                  style={{ background: "var(--border)" }}
                />
                <div
                  className="h-5 w-2/3 rounded mb-2"
                  style={{ background: "var(--border)" }}
                />
                <div
                  className="h-3 w-20 rounded opacity-60"
                  style={{ background: "var(--border)" }}
                />
              </li>
            ))}
          </ol>
        </div>
      </main>
    </div>
  );
}
