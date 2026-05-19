// Hero.jsx — rounded hero header card with decorative blobs + breadcrumb dropdowns + global search
(function () {
  const { useState, useRef, useEffect } = React;

  // Colour palette — user-specified tokens, slightly brighter than the
  // production design system but consistent with the same family.
  const C = {
    magenta:    "#E5006D",
    blue:       "#1B3FD8",
    navy:       "#2A2A4A",
    muted:      "#8A8FA3",
    page:       "#F4F5F9",
    heroBg:     "#EDE9F7",  // light lilac
    blobTeal:   "#BFE7E2",
    blobPink:   "#F6CFDE",
    blobLilac:  "#E1D7F2",
    tileLav:    "#F0EDF8",  // existing "Личное / Общее" tile background
    border:     "#E2E1EE",
  };
  window.POLOTNA_C = C;

  // ── Decorative blob background ─────────────────────────────────────
  function HeroBlobs() {
    return (
      <svg viewBox="0 0 1200 240" preserveAspectRatio="none" style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        pointerEvents: "none",
      }}>
        <defs>
          <radialGradient id="blobA" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.blobTeal} stopOpacity="0.85" />
            <stop offset="100%" stopColor={C.blobTeal} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blobB" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.blobPink} stopOpacity="0.75" />
            <stop offset="100%" stopColor={C.blobPink} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="blobC" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={C.blobLilac} stopOpacity="0.9" />
            <stop offset="100%" stopColor={C.blobLilac} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="120"  cy="200" rx="240" ry="160" fill="url(#blobA)" />
        <ellipse cx="980"  cy="60"  rx="320" ry="180" fill="url(#blobB)" />
        <ellipse cx="640"  cy="240" rx="380" ry="160" fill="url(#blobC)" />
        <ellipse cx="1140" cy="220" rx="180" ry="120" fill="url(#blobA)" />
      </svg>
    );
  }

  // ── Breadcrumb dropdown ────────────────────────────────────────────
  // Each segment can list siblings; clicking a sibling navigates to it
  // without going back up the tree.
  window.BreadcrumbBar = function BreadcrumbBar({ segments }) {
    // Collapse middle segments into "…" when path is long (>4 segments).
    let visible = segments;
    let collapsed = null;
    if (segments.length > 4) {
      collapsed = segments.slice(1, segments.length - 2);
      visible = [segments[0], { collapsed: true, items: collapsed }, ...segments.slice(-2)];
    }
    return (
      <nav style={{
        display: "flex", alignItems: "center", flexWrap: "wrap",
        gap: 4, fontSize: 14, color: C.navy,
        position: "relative", zIndex: 2,
      }}>
        {visible.map((seg, i) => (
          <React.Fragment key={i}>
            {i > 0 ? <span style={{ color: C.muted, padding: "0 4px" }}>›</span> : null}
            {seg.collapsed ? (
              <CrumbDropdown
                label="…"
                items={seg.items}
              />
            ) : (
              <CrumbDropdown
                label={seg.label}
                terminal={seg.terminal}
                items={seg.siblings || []}
                onPick={seg.onPick}
                onSelf={seg.onSelf}
              />
            )}
          </React.Fragment>
        ))}
      </nav>
    );
  };

  function CrumbDropdown({ label, items, terminal, onPick, onSelf }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
      if (!open) return;
      const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, [open]);

    const hasMenu = items && items.length > 0;
    return (
      <span ref={ref} style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
        <button
          onClick={() => {
            // Two-step affordance: clicking the segment text takes you
            // there (when it's not the current page), the caret opens
            // sibling list. We collapse it into one click: terminal
            // segments only open the menu; non-terminal also navigate.
            if (terminal) {
              if (hasMenu) setOpen(!open);
              else if (onSelf) onSelf();
            } else {
              if (onSelf) onSelf();
            }
          }}
          style={{
            background: "transparent", border: "none",
            padding: "4px 6px", borderRadius: 4,
            color: terminal ? C.navy : C.blue,
            fontWeight: terminal ? 600 : 500,
            fontSize: 14, cursor: "pointer",
            display: "inline-flex", alignItems: "center", gap: 4,
            fontFamily: "var(--font-base)",
          }}
        >
          <span style={{ textDecoration: !terminal ? "underline" : "none", textUnderlineOffset: 3, textDecorationColor: "rgba(27,63,216,0.35)" }}>{label}</span>
          {hasMenu ? (
            <span
              onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 16, height: 16, borderRadius: 8,
                background: open ? C.magenta : "rgba(27,63,216,0.08)",
                color: open ? "#fff" : C.blue,
                fontSize: 9, lineHeight: 1, transition: ".15s",
              }}
            >▾</span>
          ) : null}
        </button>
        {open && hasMenu ? (
          <div style={{
            position: "absolute", top: "100%", left: 0, marginTop: 6,
            minWidth: 240, maxWidth: 340,
            background: "#fff", border: `1px solid ${C.border}`,
            borderRadius: 8, boxShadow: "0 12px 32px rgba(10,39,74,0.16)",
            padding: 6, zIndex: 50,
            maxHeight: 320, overflowY: "auto",
          }}>
            {items.map((it, i) => (
              <button key={i} onClick={() => { setOpen(false); it.onPick && it.onPick(); onPick && onPick(it); }} style={{
                display: "flex", alignItems: "center", width: "100%",
                padding: "8px 10px", borderRadius: 4,
                background: it.active ? "rgba(229,0,109,0.08)" : "transparent",
                border: "none", cursor: "pointer", textAlign: "left",
                color: it.active ? C.magenta : C.navy,
                fontWeight: it.active ? 600 : 400,
                fontSize: 14, fontFamily: "var(--font-base)",
                gap: 8,
              }}
              onMouseEnter={(e) => { if (!it.active) e.currentTarget.style.background = "#F4F2FA"; }}
              onMouseLeave={(e) => { if (!it.active) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: it.active ? C.magenta : "rgba(27,63,216,0.35)",
                  flexShrink: 0,
                }} />
                <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.label}</span>
                {it.meta ? <span style={{ color: C.muted, fontSize: 12 }}>{it.meta}</span> : null}
              </button>
            ))}
          </div>
        ) : null}
      </span>
    );
  }

  // ── Hero card ──────────────────────────────────────────────────────
  window.HeroCard = function HeroCard({
    title, breadcrumbSegments, rightContent, infoText, level,
    search, onSearch, searchResults, onSearchPick,
  }) {
    return (
      <div style={{
        position: "relative",
        background: C.heroBg,
        borderRadius: 12,
        padding: "16px 20px",
        marginBottom: 16,
        overflow: "hidden",
        border: `1px solid ${C.border}`,
      }}>
        <HeroBlobs />

        {/* Info icon, top right */}
        <button title={infoText || "О разделе"} style={{
          position: "absolute", top: 12, right: 12, zIndex: 3,
          width: 24, height: 24, borderRadius: "50%",
          background: "rgba(255,255,255,0.85)",
          border: `1px solid ${C.border}`, color: C.blue,
          fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 700, fontSize: 13,
          cursor: "pointer",
        }}>i</button>

        {/* Level pill */}
        <div style={{
          position: "relative", zIndex: 2,
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "2px 8px", borderRadius: 999,
          background: "rgba(255,255,255,0.75)",
          color: C.magenta, fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
          textTransform: "uppercase", marginBottom: 6,
        }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.magenta }} />
          {level}
        </div>

        <h1 style={{
          position: "relative", zIndex: 2, margin: 0,
          color: C.blue, fontWeight: 700,
          fontSize: 24, lineHeight: "30px", letterSpacing: "0.005em",
          maxWidth: "calc(100% - 200px)",
        }}>{title}</h1>

        <div style={{ marginTop: 6, marginBottom: 0 }}>
          <BreadcrumbBar segments={breadcrumbSegments} />
        </div>

        {/* Global search across all levels */}
        <div style={{ position: "relative", zIndex: 2, marginTop: 10 }}>
          <SearchBox value={search} onChange={onSearch} results={searchResults} onPick={onSearchPick} />
        </div>

        {rightContent ? (
          <div style={{ position: "absolute", top: 14, right: 48, zIndex: 3 }}>{rightContent}</div>
        ) : null}
      </div>
    );
  };

  // ── Search across all Полотна levels ──────────────────────────────
  window.SearchBox = function SearchBox({ value, onChange, results, onPick }) {
    const [focused, setFocused] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
      const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setFocused(false); };
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    const open = focused && value && results && results.length > 0;

    return (
      <div ref={ref} style={{ position: "relative", maxWidth: 520 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "#fff", border: `1px solid ${C.border}`,
          borderRadius: 999, padding: "6px 12px", height: 32, boxSizing: "border-box",
          boxShadow: open ? "0 8px 24px rgba(10,39,74,0.10)" : "none",
          transition: ".15s",
        }}>
          <Icon name="search" size={16} color={C.muted} />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder="Поиск по всем Полотнам…"
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontFamily: "var(--font-base)", fontSize: 13, color: C.navy,
              minWidth: 0, padding: 0, lineHeight: "20px",
            }}
          />
          {value ? (
            <button onClick={() => onChange("")} style={{
              background: "transparent", border: "none", padding: 2, cursor: "pointer",
              color: C.muted, display: "inline-flex",
            }}><Icon name="close" size={14} color={C.muted} /></button>
          ) : null}
        </div>
        {open ? (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            background: "#fff", border: `1px solid ${C.border}`,
            borderRadius: 12, boxShadow: "0 16px 40px rgba(10,39,74,0.16)",
            padding: 6, zIndex: 60,
            maxHeight: 360, overflowY: "auto",
          }}>
            {results.map((r, i) => (
              <button key={i} onClick={() => onPick(r)} onMouseEnter={(e) => e.currentTarget.style.background = "#F4F2FA"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"} style={{
                display: "flex", flexDirection: "column", alignItems: "flex-start",
                width: "100%", padding: "8px 10px", borderRadius: 6,
                background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
                fontFamily: "var(--font-base)",
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: C.navy }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
                    padding: "2px 6px", borderRadius: 3,
                    background: r.kind === "theme" ? "rgba(229,0,109,0.10)" : r.kind === "type" ? "rgba(27,63,216,0.10)" : "rgba(11,142,118,0.10)",
                    color: r.kind === "theme" ? C.magenta : r.kind === "type" ? C.blue : "#0E8E76",
                  }}>{r.kind === "theme" ? "тема" : r.kind === "type" ? "тип" : "полотно"}</span>
                  <span style={{ fontWeight: 600 }}>{r.title}</span>
                </span>
                <span style={{ fontSize: 12, color: C.muted, marginLeft: 60, marginTop: 2 }}>
                  {r.path.join(" › ")} · <span style={{ color: C.magenta }}>{r.meta}</span>
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    );
  };
})();
