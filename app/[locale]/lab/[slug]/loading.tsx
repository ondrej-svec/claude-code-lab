/**
 * Chapter loading skeleton — shown instantly during sidebar navigation
 * while the new chapter's MDX is fetched and rendered.
 *
 * The `ChapterSidebar` lives in the parent layout, so it persists across
 * navigations (active state flips on click). This file only skeletonizes
 * the article area + right-side TOC.
 */
export default function ChapterLoading() {
  return (
    <>
      <main className="min-w-0">
        <article className="max-w-2xl animate-pulse">
          {/* eyebrow */}
          <div
            className="h-3 w-44 rounded mb-3"
            style={{ background: "var(--border)" }}
          />
          {/* h1 */}
          <div
            className="h-10 w-4/5 rounded mb-2"
            style={{ background: "var(--border)" }}
          />
          <div
            className="h-10 w-3/5 rounded mb-8"
            style={{ background: "var(--border)" }}
          />
          {/* intro paragraph */}
          <div className="space-y-3 mb-10">
            <div
              className="h-4 w-full rounded opacity-60"
              style={{ background: "var(--border)" }}
            />
            <div
              className="h-4 w-11/12 rounded opacity-60"
              style={{ background: "var(--border)" }}
            />
            <div
              className="h-4 w-4/5 rounded opacity-60"
              style={{ background: "var(--border)" }}
            />
          </div>
          {/* h2 */}
          <div
            className="h-6 w-1/2 rounded mb-4"
            style={{ background: "var(--border)" }}
          />
          {/* paragraph */}
          <div className="space-y-3 mb-10">
            <div
              className="h-4 w-full rounded opacity-60"
              style={{ background: "var(--border)" }}
            />
            <div
              className="h-4 w-10/12 rounded opacity-60"
              style={{ background: "var(--border)" }}
            />
            <div
              className="h-4 w-9/12 rounded opacity-60"
              style={{ background: "var(--border)" }}
            />
          </div>
          {/* figure / screenshot placeholder */}
          <div
            className="aspect-[16/10] w-full rounded-xl opacity-40 mb-10"
            style={{ background: "var(--border)" }}
          />
          {/* another paragraph */}
          <div className="space-y-3">
            <div
              className="h-4 w-11/12 rounded opacity-60"
              style={{ background: "var(--border)" }}
            />
            <div
              className="h-4 w-10/12 rounded opacity-60"
              style={{ background: "var(--border)" }}
            />
          </div>
        </article>
      </main>

      <aside className="hidden lg:block lg:sticky lg:top-10 h-fit">
        <div className="animate-pulse space-y-2.5">
          <div
            className="h-3 w-20 rounded mb-3"
            style={{ background: "var(--border)" }}
          />
          <div
            className="h-3 w-32 rounded opacity-60"
            style={{ background: "var(--border)" }}
          />
          <div
            className="h-3 w-28 rounded opacity-60"
            style={{ background: "var(--border)" }}
          />
          <div
            className="h-3 w-24 rounded opacity-60"
            style={{ background: "var(--border)" }}
          />
          <div
            className="h-3 w-30 rounded opacity-60"
            style={{ background: "var(--border)" }}
          />
        </div>
      </aside>
    </>
  );
}
