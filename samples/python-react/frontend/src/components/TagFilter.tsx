export function TagFilter({
  tags,
  active,
  onToggle,
}: {
  tags: string[];
  active: string | null;
  onToggle: (tag: string | null) => void;
}) {
  if (tags.length === 0) return null;
  return (
    <div className="tag-filter" role="group" aria-label="Filter by tag">
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          className="tag-chip"
          data-active={active === tag}
          onClick={() => onToggle(active === tag ? null : tag)}
        >
          #{tag}
        </button>
      ))}
    </div>
  );
}
