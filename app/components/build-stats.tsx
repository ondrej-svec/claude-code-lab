/**
 * BuildStats — statistics dashboard for the "Behind the scenes" chapter.
 * Standalone visual component that shows what it took to build this lab.
 * Rose-pine-moon palette hardcoded; pairs with lab's rose-pine tokens.
 */

// Rose-pine hex palette (matches app/globals.css dark mode)
const PALETTE = {
  purple: "#c4a7e7",
  teal: "#9ccfd8",
  peach: "#f6c177",
  rose: "#ea9a97",
  pink: "#eb6f92",
  ink: "#1a1525", // for text-on-colored-chip readability
} as const;

function Label({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <div
      style={{
        color: color ?? PALETTE.teal,
        textTransform: "uppercase",
        letterSpacing: "0.14em",
        fontSize: "11px",
        fontWeight: 700,
        fontFamily: "var(--font-mono), ui-monospace, monospace",
      }}
    >
      {children}
    </div>
  );
}

function HeroStat({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: "var(--surface-panel)",
        border: "1px solid var(--border)",
      }}
    >
      <Label>{label}</Label>
      <div
        style={{
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          fontSize: "clamp(1.7rem, 3vw, 2.2rem)",
          fontWeight: 700,
          color,
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.02em",
          marginTop: "8px",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          fontSize: "11px",
          color: "var(--text-muted)",
          marginTop: "4px",
          letterSpacing: "0.02em",
        }}
      >
        {sub}
      </div>
    </div>
  );
}

function StackedBar({
  segments,
}: {
  segments: { pct: number; color: string; label?: string }[];
}) {
  return (
    <div
      style={{
        display: "flex",
        height: "36px",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "inset 0 0 0 1px var(--border)",
        background: "var(--surface-soft)",
      }}
    >
      {segments.map((s, i) => (
        <div
          key={i}
          style={{
            width: `${s.pct}%`,
            background: s.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            fontSize: "11px",
            fontWeight: 700,
            color: PALETTE.ink,
            letterSpacing: "0.03em",
          }}
        >
          {s.label && s.pct > 2 ? s.label : ""}
        </div>
      ))}
    </div>
  );
}

function LegendRow({
  color,
  label,
  tokens,
  pct,
}: {
  color: string;
  label: string;
  tokens: string;
  pct: string;
}) {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
      style={{
        background: "var(--surface-soft)",
        border: "1px solid var(--border)",
      }}
    >
      <span
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "3px",
          background: color,
          flexShrink: 0,
        }}
      />
      <span
        className="flex-1 text-sm font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          fontSize: "13px",
          color: "var(--text-secondary)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {tokens}
      </span>
      <span
        style={{
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          fontSize: "11px",
          color: "var(--text-muted)",
        }}
      >
        {pct}
      </span>
    </div>
  );
}

function EffCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div
      className="p-4 rounded-lg"
      style={{
        background: "var(--surface-soft)",
        border: "1px solid var(--border)",
      }}
    >
      <Label>{label}</Label>
      <div
        style={{
          fontFamily: "var(--font-mono), ui-monospace, monospace",
          fontSize: "clamp(1.4rem, 2.2vw, 1.8rem)",
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
          marginTop: "8px",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "11.5px",
          color: "var(--text-muted)",
          marginTop: "6px",
          lineHeight: 1.45,
        }}
      >
        {hint}
      </div>
    </div>
  );
}

type Locale = "en" | "cs";

const COPY = {
  en: {
    noteTitle: "Zero incremental cost.",
    noteBody:
      "All work ran on a Claude Max subscription. The $845 is the API-rate equivalent — what the same token usage would have cost at pay-as-you-go — not what was actually billed.",
    tokenHeading: "~1 billion input-equivalent tokens",
    tokenSub:
      "Cache read dominates at 97.4 %. Claude Code's prompt cache means most of the input is re-read from short-lived cache, not freshly processed. That's the efficiency that makes long agentic sessions affordable.",
    cacheBody: "of all input tokens came from cache reads.",
    cacheSmall:
      "Fresh input was only 85 K tokens — the agent re-used its warm context aggressively.",
    modelHeading: "Opus 4.7 on main · Haiku & Sonnet on subagents",
    modelSub:
      "Main sessions ran on Claude Opus 4.7. Subagents picked lighter models for scoped tasks — Haiku 4.5 for lookups, Sonnet 4.6 for medium-depth, Opus when they needed main-thread reasoning.",
    mainLabel: "Main sessions",
    subLabel: "Subagents",
    msgsLabel: "messages",
    sessionHeading: "Where the compute went, hour by hour",
    sessionSub:
      "Build #2 carried 55 % of total cost and spawned 41 subagents while parsing the workshop briefing and running the V2 agentic rewrite. The other sessions cluster around 10–15 %.",
    colSession: "Session",
    colCost: "Cost share",
    colDuration: "Duration",
    colSubs: "Subagents",
    colTools: "Tool calls",
    colOutput: "Output tok",
    colCostApi: "Cost (API-rate)",
    effHeading: "What each user instruction actually bought",
    toolsPerTurn: "Tool calls / user turn",
    toolsHint:
      "167 user turns → 2,090 tool calls. Claude operated ~12 steps per instruction, on average.",
    costPerTurn: "Cost / user turn",
    costHint:
      "API-rate value per human instruction. On a Max subscription the incremental cost is $0.",
    outputPerHour: "Output tok / hour",
    outputHint:
      "Averaged across 14 hours of session time. Roughly 150 pages of text per hour at peak — much of it generated during unattended /work runs.",
    subsPerHour: "Subagents / hour",
    subsHint:
      "107 spawned across 14 h of session time. Heavy parallelization on research and audit tasks.",
    cacheHit: "Cache hit rate",
    cacheHint:
      "973 M cache-read vs. 26 M cache-write. Long sessions amortize context heavily.",
    subShare: "Subagent cost share",
    subShareHint:
      "$19 of $845. Subagents stay cheap by running Haiku / Sonnet for scoped tasks.",
    arcHeading: "Correction rate fell as the working pattern settled",
    arcSub:
      "The fraction of user messages containing pushback language (no, wait, actually, that is not) dropped from 45 % in the heaviest build session to 26 % in the most recent — a quantified learning curve across the arc.",
    arcTitle: "Correction rate by session — 45 % → 26 %",
    arcHead: "19-point drop",
    shippedHeading: "Concrete output of the 14 hours",
    methodology: "Methodology",
    methodologyBody: (
      <>
        Numbers extracted from Claude Code&apos;s local session jsonl transcripts.
        Cost is calculated at{" "}
        <a
          href="https://platform.claude.com/docs/en/about-claude/pricing"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: PALETTE.teal }}
        >
          current Anthropic API rates
        </a>{" "}
        with the correct cache-tier multipliers: 5-minute cache write at
        1.25 ×, 1-hour cache write at 2 ×, cache read at 0.1 × of base input.
        Opus 4.7 is $5 / $25 per million tokens (input / output), Sonnet 4.6
        is $3 / $15, Haiku 4.5 is $1 / $5. The developer runs on a Claude Max
        subscription, so actual incremental spend is $0 — the $845 figure is
        the equivalent value at pay-as-you-go pricing, useful as a benchmark
        for what the same token usage would cost outside a subscription.
        Token totals include both main sessions and their nested subagent
        transcripts. Tool calls include Claude Code built-ins and MCP tools.
      </>
    ),
  },
  cs: {
    noteTitle: "Nulový dodatečný náklad.",
    noteBody:
      "Všechna tato práce běžela na předplatném Claude Max. $845 je ekvivalent API sazby — to, co by stejná spotřeba tokenů stála při pay-as-you-go — ne to, co bylo skutečně naúčtováno.",
    tokenHeading: "~1 miliarda vstupně-ekvivalentních tokenů",
    tokenSub:
      "Čtení z cache tvoří 97,4 %. Díky prompt cache v Claude Code se většina vstupu jen znovu čte z krátkodobé cache, nezpracovává se čerstvě. To je efektivita, která dělá dlouhá agentická sezení finančně udržitelná.",
    cacheBody: "všech vstupních tokenů pocházelo ze čtení cache.",
    cacheSmall:
      "Čerstvý vstup byl jen 85 K tokenů — agent agresivně recykloval rozpracovaný kontext.",
    modelHeading: "Opus 4.7 na hlavní lince · Haiku a Sonnet na subagentech",
    modelSub:
      "Hlavní sezení běžela na Claude Opus 4.7. Subagenti šli po lehčích modelech pro úkoly s úzkým záběrem — Haiku 4.5 na vyhledávání, Sonnet 4.6 na středně náročné, Opus tam, kde bylo potřeba uvažování na úrovni hlavního vlákna.",
    mainLabel: "Hlavní sezení",
    subLabel: "Subagenti",
    msgsLabel: "zpráv",
    sessionHeading: "Kam šla výpočetní kapacita, hodinu po hodině",
    sessionSub:
      "Build #2 nesl 55 % celkových nákladů a vystřelil 41 subagentů, zatímco parsoval briefing k workshopu a projížděl V2 agentický přepis. Ostatní sezení se drží kolem 10–15 %.",
    colSession: "Sezení",
    colCost: "Podíl na nákladech",
    colDuration: "Délka",
    colSubs: "Subagenti",
    colTools: "Volání nástrojů",
    colOutput: "Výstupní tok",
    colCostApi: "Cena (API sazba)",
    effHeading: "Co přesně jeden uživatelský pokyn koupil",
    toolsPerTurn: "Volání nástrojů / pokyn",
    toolsHint:
      "167 uživatelských tahů → 2 090 volání nástrojů. Claude v průměru provedl ~12 kroků na pokyn.",
    costPerTurn: "Cena / pokyn",
    costHint:
      "Hodnota v API sazbě na jeden lidský pokyn. Na Max předplatném je dodatečný náklad $0.",
    outputPerHour: "Výstupní tok / hod",
    outputHint:
      "Průměr přes 14 hodin doby otevřených sezení. Při špičce zhruba 150 stran textu za hodinu — velká část vznikla během běhů /work bez dozoru.",
    subsPerHour: "Subagenti / hod",
    subsHint:
      "107 během 14 h doby otevřených sezení. Silná paralelizace na průzkumných a auditních úkolech.",
    cacheHit: "Cache hit rate",
    cacheHint:
      "973 M cache read vs. 26 M cache write. Dlouhá sezení kontext dobře amortizují.",
    subShare: "Podíl subagentů na nákladech",
    subShareHint:
      "$19 z $845. Subagenti drží cenu dole tím, že na úzké úkoly běží Haiku / Sonnet.",
    arcHeading: "Míra oprav klesla, jak se pracovní vzor usadil",
    arcSub:
      "Podíl uživatelských zpráv s jazykem zpětné vazby (ne, počkej, vlastně, to není ono) klesl ze 45 % v nejtěžším build sezení na 26 % v tom nejčerstvějším — vyčíslená učící křivka napříč obloukem.",
    arcTitle: "Míra oprav podle sezení — 45 % → 26 %",
    arcHead: "Pokles o 19 bodů",
    shippedHeading: "Konkrétní výstup 14 hodin",
    methodology: "Metodika",
    methodologyBody: (
      <>
        Čísla extrahována z lokálních jsonl transkriptů sezení Claude Code.
        Cena spočítaná v{" "}
        <a
          href="https://platform.claude.com/docs/en/about-claude/pricing"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: PALETTE.teal }}
        >
          aktuálních API sazbách Anthropicu
        </a>{" "}
        se správnými násobiteli pro cache: 5-min cache write 1,25 ×, 1-h
        cache write 2 ×, cache read 0,1 × základního vstupu. Opus 4.7 je
        $5 / $25 za milion tokenů (vstup / výstup), Sonnet 4.6 $3 / $15,
        Haiku 4.5 $1 / $5. Vývojář jede na předplatném Claude Max, takže
        skutečný dodatečný výdaj je $0 — $845 je ekvivalentní hodnota při
        pay-as-you-go, užitečná jako benchmark, kolik by stejná spotřeba
        tokenů stála mimo předplatné. Součty tokenů zahrnují hlavní sezení
        i vnořené subagent transkripty. Volání nástrojů počítá vestavěné
        nástroje Claude Code i MCP nástroje.
      </>
    ),
  },
};

const DELIVERABLES: Record<Locale, { value: string; label: string }[]> = {
  en: [
    { value: "9", label: "chapters" },
    { value: "2", label: "locales · EN + CS" },
    { value: "18", label: "chapter routes" },
    { value: "2", label: "sample projects" },
    { value: "1", label: "companion skill" },
    { value: "11", label: "deployed commits" },
    { value: "4", label: "generated diagrams" },
    { value: "1", label: "Heart-of-Gold hero" },
    { value: "14", label: "passing tests" },
    { value: "1", label: "Playwright E2E" },
    { value: "1", label: "copy-editor pass" },
  ],
  cs: [
    { value: "9", label: "kapitol" },
    { value: "2", label: "jazyky · EN + CS" },
    { value: "18", label: "cest kapitol" },
    { value: "2", label: "ukázkové projekty" },
    { value: "1", label: "doprovodný skill" },
    { value: "11", label: "deploynutých commitů" },
    { value: "4", label: "generovaných diagramů" },
    { value: "1", label: "Heart-of-Gold hero" },
    { value: "14", label: "procházejících testů" },
    { value: "1", label: "Playwright E2E" },
    { value: "1", label: "copy-editor pass" },
  ],
};

const SESSIONS_EN = [
  { time: "20:03 build #1", bar: 14, dur: "2 h 17 m", subs: 14, tools: 351, out: "941 K", cost: "$122" },
  { time: "22:02 build #2", bar: 55, dur: "~27 h wall", subs: 41, tools: 729, out: "2.4 M", cost: "$462" },
  { time: "22:04 parallel", bar: 11, dur: "1 h 47 m", subs: 15, tools: 223, out: "790 K", cost: "$89" },
  { time: "22:21 small", bar: 1, dur: "16 m", subs: 3, tools: 26, out: "54 K", cost: "$7" },
  { time: "23:49 final push", bar: 9, dur: "1 h 27 m", subs: 7, tools: 304, out: "455 K", cost: "$74" },
  { time: "09:16 current", bar: 11, dur: "~11 h wall", subs: 27, tools: 186, out: "606 K", cost: "$90" },
];

export function BuildStats({ locale = "en" }: { locale?: Locale }) {
  const t = COPY[locale];

  return (
    <div
      style={{
        fontFamily: "var(--font-body), Inter, sans-serif",
        color: "var(--text-secondary)",
        lineHeight: 1.55,
      }}
    >
      {/* HERO STATS */}
      <div
        className="grid gap-3 my-6"
        style={{
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
        }}
      >
        <HeroStat label={locale === "en" ? "Sessions" : "Sezení"} value="6" sub={locale === "en" ? "~14 h session time" : "~14 h otevřená"} color={PALETTE.purple} />
        <HeroStat label={locale === "en" ? "Subagents" : "Subagenti"} value="107" sub={locale === "en" ? "parallel research" : "paralelní průzkum"} color={PALETTE.teal} />
        <HeroStat label={locale === "en" ? "API-rate value" : "Hodnota v API sazbě"} value="$845" sub={locale === "en" ? "covered by Max plan" : "kryto Max plánem"} color={PALETTE.peach} />
        <HeroStat label={locale === "en" ? "Tool calls" : "Volání nástrojů"} value="2,090" sub="1,853 + 237" color={PALETTE.rose} />
      </div>

      <div
        className="my-6 rounded-lg p-4"
        style={{
          border: `1px solid ${PALETTE.teal}44`,
          background: `${PALETTE.teal}12`,
          fontSize: "13.5px",
          color: "var(--text-primary)",
        }}
      >
        <strong style={{ color: PALETTE.teal }}>{t.noteTitle}</strong>{" "}
        {t.noteBody}
      </div>

      {/* TOKEN FLOW */}
      <h3
        className="text-xl font-semibold mt-10 mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {t.tokenHeading}
      </h3>
      <p className="mb-4" style={{ color: "var(--text-secondary)" }}>{t.tokenSub}</p>

      <StackedBar
        segments={[
          { pct: 97.37, color: PALETTE.teal, label: "97.4%" },
          { pct: 2.63, color: PALETTE.peach },
          { pct: 0.53, color: PALETTE.rose },
          { pct: 0.01, color: PALETTE.purple },
        ]}
      />

      <div className="grid gap-2 mt-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <LegendRow color={PALETTE.teal} label={locale === "en" ? "Cache read" : "Cache read"} tokens="973 M" pct="97.4%" />
        <LegendRow color={PALETTE.peach} label={locale === "en" ? "Cache write" : "Cache write"} tokens="26 M" pct="2.6%" />
        <LegendRow color={PALETTE.rose} label={locale === "en" ? "Output" : "Výstup"} tokens="5.3 M" pct="0.53%" />
        <LegendRow color={PALETTE.purple} label={locale === "en" ? "Fresh input" : "Čerstvý vstup"} tokens="85 K" pct="0.01%" />
      </div>

      <div
        className="mt-4 rounded-lg p-4 grid gap-4"
        style={{
          gridTemplateColumns: "auto 1fr",
          alignItems: "center",
          border: `1px solid ${PALETTE.teal}55`,
          background: `${PALETTE.teal}10`,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            fontSize: "clamp(1.8rem, 3vw, 2.4rem)",
            fontWeight: 700,
            color: PALETTE.teal,
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          97.4 %
        </div>
        <div style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 500 }}>
          {t.cacheBody}
          <div style={{ color: "var(--text-muted)", fontSize: "12px", fontWeight: 400, marginTop: "4px" }}>
            {t.cacheSmall}
          </div>
        </div>
      </div>

      {/* MODEL MIX */}
      <h3
        className="text-xl font-semibold mt-10 mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {t.modelHeading}
      </h3>
      <p className="mb-4" style={{ color: "var(--text-secondary)" }}>{t.modelSub}</p>

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <div className="rounded-lg p-4" style={{ background: "var(--surface-soft)", border: "1px solid var(--border)" }}>
          <div className="flex justify-between items-baseline mb-3">
            <h4 className="font-semibold" style={{ color: "var(--text-primary)", fontSize: "15px" }}>
              {t.mainLabel} · 2,959 {t.msgsLabel}
            </h4>
            <span style={{ fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: "12px", color: "var(--text-muted)" }}>$826</span>
          </div>
          <StackedBar segments={[{ pct: 99.9, color: PALETTE.purple, label: "Opus 4.7 · 99.9%" }]} />
          <div className="mt-3 text-sm" style={{ color: "var(--text-primary)" }}>
            <code style={{ fontSize: "12px" }}>claude-opus-4-7</code> — 2,959 {t.msgsLabel}
          </div>
        </div>

        <div className="rounded-lg p-4" style={{ background: "var(--surface-soft)", border: "1px solid var(--border)" }}>
          <div className="flex justify-between items-baseline mb-3">
            <h4 className="font-semibold" style={{ color: "var(--text-primary)", fontSize: "15px" }}>
              {t.subLabel} · 412 {t.msgsLabel}
            </h4>
            <span style={{ fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: "12px", color: "var(--text-muted)" }}>$19</span>
          </div>
          <StackedBar
            segments={[
              { pct: 49, color: PALETTE.peach, label: "Haiku · 49%" },
              { pct: 26, color: PALETTE.teal, label: "Sonnet · 26%" },
              { pct: 25, color: PALETTE.purple, label: "Opus · 25%" },
            ]}
          />
          <div className="mt-3 text-sm flex flex-col gap-1" style={{ color: "var(--text-primary)" }}>
            <div style={{ fontSize: "12px" }}>
              <span style={{ color: PALETTE.peach }}>●</span>{" "}
              <code>claude-haiku-4-5</code> — 202 {t.msgsLabel}
            </div>
            <div style={{ fontSize: "12px" }}>
              <span style={{ color: PALETTE.teal }}>●</span>{" "}
              <code>claude-sonnet-4-6</code> — 109 {t.msgsLabel}
            </div>
            <div style={{ fontSize: "12px" }}>
              <span style={{ color: PALETTE.purple }}>●</span>{" "}
              <code>claude-opus-4-7</code> — 101 {t.msgsLabel}
            </div>
          </div>
        </div>
      </div>

      {/* PER-SESSION TABLE */}
      <h3
        className="text-xl font-semibold mt-10 mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {t.sessionHeading}
      </h3>
      <p className="mb-4" style={{ color: "var(--text-secondary)" }}>{t.sessionSub}</p>

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            minWidth: "700px",
            borderCollapse: "separate",
            borderSpacing: 0,
            fontFamily: "var(--font-mono), ui-monospace, monospace",
            fontSize: "12.5px",
          }}
        >
          <thead>
            <tr>
              {[t.colSession, t.colCost, t.colDuration, t.colSubs, t.colTools, t.colOutput, t.colCostApi].map((col, i) => (
                <th
                  key={i}
                  style={{
                    padding: "11px 10px",
                    textAlign: i === 0 ? "left" : "right",
                    fontSize: "10.5px",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: PALETTE.teal,
                    fontWeight: 600,
                    borderBottom: `1px solid ${PALETTE.teal}44`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SESSIONS_EN.map((s, i) => (
              <tr key={i}>
                <td style={{ padding: "11px 10px", color: "var(--text-primary)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{s.time}</td>
                <td style={{ padding: "11px 10px", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", justifyContent: "flex-end" }}>
                    <div style={{
                      width: `${Math.max(4, s.bar * 3)}px`,
                      height: "8px",
                      borderRadius: "4px",
                      background: `linear-gradient(90deg, ${PALETTE.purple}, ${PALETTE.teal})`,
                    }} />
                    <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{s.bar < 1 ? "<1 %" : `${s.bar} %`}</span>
                  </div>
                </td>
                <td style={{ padding: "11px 10px", textAlign: "right", color: "var(--text-secondary)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>{s.dur}</td>
                <td style={{ padding: "11px 10px", textAlign: "right", color: PALETTE.purple, fontWeight: 600, borderBottom: "1px solid var(--border)" }}>{s.subs}</td>
                <td style={{ padding: "11px 10px", textAlign: "right", color: "var(--text-secondary)", borderBottom: "1px solid var(--border)" }}>{s.tools}</td>
                <td style={{ padding: "11px 10px", textAlign: "right", color: "var(--text-secondary)", borderBottom: "1px solid var(--border)" }}>{s.out}</td>
                <td style={{ padding: "11px 10px", textAlign: "right", color: PALETTE.peach, fontWeight: 700, borderBottom: "1px solid var(--border)" }}>{s.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EFFICIENCY GRID */}
      <h3
        className="text-xl font-semibold mt-10 mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {t.effHeading}
      </h3>

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
        <EffCard label={t.toolsPerTurn} value="12.5" hint={t.toolsHint} />
        <EffCard label={t.costPerTurn} value="$5.06" hint={t.costHint} />
        <EffCard label={t.outputPerHour} value="377 K" hint={t.outputHint} />
        <EffCard label={t.subsPerHour} value="7.6" hint={t.subsHint} />
        <EffCard label={t.cacheHit} value="97.4 %" hint={t.cacheHint} />
        <EffCard label={t.subShare} value="2.3 %" hint={t.subShareHint} />
      </div>

      {/* CORRECTION ARC */}
      <h3
        className="text-xl font-semibold mt-10 mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {t.arcHeading}
      </h3>
      <p className="mb-4" style={{ color: "var(--text-secondary)" }}>{t.arcSub}</p>

      <div
        className="rounded-lg p-4"
        style={{
          background: "var(--surface-soft)",
          border: "1px solid var(--border)",
          maxWidth: "540px",
        }}
      >
        <Label>{t.arcTitle}</Label>
        <div
          style={{
            color: "var(--text-primary)",
            fontSize: "15px",
            fontWeight: 600,
            marginTop: "4px",
          }}
        >
          {t.arcHead}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", marginTop: "12px", height: "58px" }}>
          {[
            { v: "42%", h: 82, l: "build 1" },
            { v: "45%", h: 88, l: "build 2" },
            { v: "32%", h: 62, l: "parallel" },
            { v: "29%", h: 56, l: "small" },
            { v: "31%", h: 60, l: "final" },
            { v: "26%", h: 51, l: "current" },
          ].map((p, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: "6px", minWidth: 0 }}>
              <div style={{ fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: "12px", color: "var(--text-primary)", fontWeight: 700, marginBottom: "2px" }}>{p.v}</div>
              <div style={{
                width: "100%",
                height: `${p.h}%`,
                minHeight: "6px",
                borderRadius: "4px 4px 0 0",
                background: `linear-gradient(180deg, ${PALETTE.pink}, ${PALETTE.pink}55)`,
              }} />
              <div style={{ fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{p.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* DELIVERABLES CHIPS */}
      <h3
        className="text-xl font-semibold mt-10 mb-3"
        style={{ color: "var(--text-primary)" }}
      >
        {t.shippedHeading}
      </h3>
      <div className="flex flex-wrap gap-2">
        {DELIVERABLES[locale].map((d, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 11px",
              borderRadius: "999px",
              background: "var(--surface-panel)",
              border: "1px solid var(--border)",
              fontFamily: "var(--font-mono), ui-monospace, monospace",
              fontSize: "12px",
              color: "var(--text-secondary)",
            }}
          >
            <b style={{ color: "var(--text-primary)", fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{d.value}</b>
            {" "}{d.label}
          </span>
        ))}
      </div>

      {/* METHODOLOGY */}
      <div
        className="mt-10 rounded-lg p-4"
        style={{
          background: "var(--surface-soft)",
          border: "1px solid var(--border)",
          fontSize: "13px",
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "var(--text-secondary)" }}>{t.methodology}.</strong> {t.methodologyBody}
      </div>
    </div>
  );
}
