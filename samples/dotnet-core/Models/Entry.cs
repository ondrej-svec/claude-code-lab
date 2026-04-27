namespace CCLab.Sample.Models;

public record Entry(
    int Id,
    string Title,
    string Body,
    string Badge,
    string Contributor,
    string CreatedAt,
    string Locale,
    IReadOnlyList<string> Tags
);

// Request shape for POST /api/entries. Validation is light — chapter
// exercises tighten this.
public record EntryInput(
    string Title,
    string Body,
    string? Badge = "unknown",
    string? Contributor = "Anonymous",
    string? Locale = "en",
    IReadOnlyList<string>? Tags = null
);
