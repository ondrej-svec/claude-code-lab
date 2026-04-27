using CCLab.Sample.Models;

namespace CCLab.Sample.Stores;

public class EntryStore
{
    private static readonly string FixedTimestamp =
        new DateTimeOffset(2026, 4, 27, 12, 0, 0, TimeSpan.Zero).ToString("o");

    private readonly List<Entry> _entries = new()
    {
        new Entry(
            Id: 1,
            Title: "On the towel, and why you should always know where it is",
            Body: "A towel is about the most massively useful thing an interstellar hitchhiker can have. " +
                  "Partly it has great practical value: wrap it around you for warmth on the cold moons of " +
                  "Jaglan Beta, sleep under it on the marble-sanded beaches of Santraginus V, wet it for " +
                  "use in hand-to-hand combat. More importantly, a towel has immense psychological value. " +
                  "Any strag who can hitch the length of the Galaxy, rough it, and still know where their " +
                  "towel is, is clearly a person to be reckoned with.",
            Badge: "mostly-harmless",
            Contributor: "Ford Prefect",
            CreatedAt: FixedTimestamp,
            Locale: "en",
            Tags: new[] { "preparedness", "essentials" }
        ),
        new Entry(
            Id: 2,
            Title: "The Babel Fish",
            Body: "Small, yellow, leech-like, and probably the oddest thing in the Universe. It feeds on " +
                  "brainwave energy from those around it and excretes a telepathic matrix into the brain " +
                  "of its host. The practical upshot is that if you stick one in your ear, you can " +
                  "instantly understand anything said to you in any language. Effectively removes all " +
                  "barriers to communication between different races and cultures — which has, in turn, " +
                  "caused more and bloodier wars than anything else in the history of creation.",
            Badge: "mostly-harmless",
            Contributor: "The Guide",
            CreatedAt: FixedTimestamp,
            Locale: "en",
            Tags: new[] { "communication", "biology" }
        ),
        new Entry(
            Id: 3,
            Title: "Vogon poetry",
            Body: "Vogon poetry is, of course, the third worst in the Universe. The second worst is that " +
                  "of the Azgoths of Kria; during a recitation the poet's own large intestine, in a " +
                  "desperate attempt to escape, leapt straight up through his neck and throttled his " +
                  "brain. The very worst was written by Paula Nancy Millstone Jennings of Greenbridge, " +
                  "Essex, England, and was destroyed along with the Earth in the demolition of the " +
                  "planet. If you find yourself within earshot of a Vogon recital, your only chance is " +
                  "to compliment the poetry until the poet either weeps or explodes.",
            Badge: "mostly-dangerous",
            Contributor: "Slartibartfast",
            CreatedAt: FixedTimestamp,
            Locale: "en",
            Tags: new[] { "danger", "art" }
        ),
        new Entry(
            Id: 4,
            Title: "O ručníku, a proč ho mít vždy po ruce",
            Body: "Ručník je ta nejužitečnější věc, kterou si galaktický stopař může vzít s sebou na " +
                  "cestu. Zahřeje, poslouží jako lůžko, filtr na pitnou vodu, signální vlajka i " +
                  "provizorní zbraň. Má ale především psychologickou hodnotu. Kdokoli prošel půl " +
                  "galaxie, přespal v zákopu na Betelgeuse a stále ví, kde má svůj ručník, je " +
                  "nepochybně osoba, která ví, co dělá — a okolí se k němu podle toho chová.",
            Badge: "mostly-harmless",
            Contributor: "Ford Prefect",
            CreatedAt: FixedTimestamp,
            Locale: "cs",
            Tags: new[] { "příprava", "základy" }
        ),
        new Entry(
            Id: 5,
            Title: "Babylonská rybka",
            Body: "Drobná, žlutá, podobná pijavici. Živí se mozkovou energií svého okolí a vylučuje do " +
                  "mozku hostitele telepatickou matrici. Stručně řečeno: strčíte si ji do ucha a " +
                  "okamžitě rozumíte čemukoli, co vám kdo řekne v jakémkoli jazyce. Vědci ji považují " +
                  "za jeden z nejmocnějších argumentů proti existenci Boha — neboť něco tak " +
                  "nepravděpodobně užitečného nemohlo vzniknout náhodou.",
            Badge: "mostly-harmless",
            Contributor: "The Guide",
            CreatedAt: FixedTimestamp,
            Locale: "cs",
            Tags: new[] { "komunikace", "biologie" }
        ),
        new Entry(
            Id: 6,
            Title: "Vogonská poezie",
            Body: "Vogonská poezie je třetí nejhorší ve známém vesmíru. Druhá nejhorší pochází od " +
                  "Azgothů z Krie a běžně způsobuje, že se posluchačovi vlastní střeva pokusí proklát " +
                  "hrudník v zoufalé snaze uniknout. Pokud se ocitnete na recitálu Vogona, jediná " +
                  "šance na přežití je poezii nahlas chválit. Vogon buď upadne do sebelítostné " +
                  "letargie, nebo exploduje radostí — v obou případech získáte krátkou chvíli na útěk.",
            Badge: "mostly-dangerous",
            Contributor: "Slartibartfast",
            CreatedAt: FixedTimestamp,
            Locale: "cs",
            Tags: new[] { "nebezpečí", "umění" }
        ),
    };

    private int _nextId = 7;

    public IEnumerable<Entry> All(string? locale = null) =>
        locale is null ? _entries : _entries.Where(e => e.Locale == locale);

    public Entry? FindById(int id) => _entries.FirstOrDefault(e => e.Id == id);

    public Entry Add(EntryInput input)
    {
        var contributor = string.IsNullOrWhiteSpace(input.Contributor) ? "Anonymous" : input.Contributor!.Trim();
        var locale = input.Locale ?? "en";
        var badge = input.Badge ?? "unknown";
        var tags = (input.Tags ?? Array.Empty<string>())
            .Where(t => !string.IsNullOrWhiteSpace(t))
            .Take(10)
            .Select(t => t.Trim()[..Math.Min(20, t.Trim().Length)])
            .ToList();

        var entry = new Entry(
            Id: _nextId++,
            Title: input.Title.Trim(),
            Body: input.Body.Trim(),
            Badge: badge,
            Contributor: contributor,
            CreatedAt: DateTimeOffset.UtcNow.ToString("o"),
            Locale: locale,
            Tags: tags
        );
        _entries.Add(entry);
        return entry;
    }
}
