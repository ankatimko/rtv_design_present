// LevelScreens.jsx — L1 (themes), L2 (canvas types), L3 (canvases)
// Sizing principle: this is a content-dense app interface, not a marketing page.
// Default unit is 8px; tile heights are deliberately tight so 3+ items are
// visible without scrolling. L1 is the only level that uses colored banners —
// the deeper levels switch to neutral grid tiles so users feel the descent.
(function () {
  const C = window.POLOTNA_C;

  // ── L1: compact horizontal banner with a prominent meta strip ────
  //     (the parent Сервисы catalog uses bigger colored banners
  //      *without* the meta strip — that's the visual differentiator.)
  window.LevelThemes = function LevelThemes({ themes, onPick }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {themes.map((th) => (
          <button key={th.id} onClick={() => onPick(th.id)} style={{
            position: "relative", display: "block", width: "100%",
            border: "none", padding: 0, cursor: "pointer",
            borderRadius: 8, overflow: "hidden",
            background: `linear-gradient(96deg, ${th.grad[0]} 0%, ${th.grad[1]} 100%)`,
            color: "#fff", textAlign: "left",
            transition: ".15s",
            boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
            fontFamily: "var(--font-base)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 16px rgba(10,39,74,0.14)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 0 rgba(10,39,74,0.04)"; }}
          >
            <svg viewBox="0 0 800 120" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.28, pointerEvents: "none" }}>
              <circle cx="730" cy="20"  r="48" fill="rgba(255,255,255,0.40)" />
              <circle cx="660" cy="110" r="70" fill="rgba(255,255,255,0.14)" />
              <circle cx="80"  cy="115" r="44" fill="rgba(255,255,255,0.16)" />
            </svg>

            <div style={{
              position: "relative",
              display: "grid", gridTemplateColumns: "1fr auto",
              alignItems: "center", gap: 16,
              padding: "16px 20px",
              minHeight: 96,
            }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", opacity: 0.9, marginBottom: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#fff" }} />
                  Тема
                </div>
                <h2 style={{ margin: 0, color: "#fff", fontSize: 22, lineHeight: "26px", fontWeight: 700, letterSpacing: "0.005em" }}>
                  «{th.title}»
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: "18px", color: "rgba(255,255,255,0.92)", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {th.tagline}
                </p>
              </div>

              {/* Right-side meta strip — the marker that says "you are inside Полотна" */}
              <div style={{
                display: "flex", alignItems: "center", gap: 0,
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.22)",
                borderRadius: 6,
                padding: "8px 4px",
                color: "#fff", fontSize: 12, lineHeight: 1.1,
                backdropFilter: "blur(2px)",
              }}>
                <MetaCell value={th.canvasTypeCount} label="типа" />
                <MetaDivider />
                <MetaCell value={th.canvasCount} label="полотен" />
                <MetaDivider />
                <MetaCell value={window.fmtTime(th.totalDuration)} label="длительность" mono />
                <span style={{ padding: "0 12px 0 8px", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600 }}>
                  открыть <span style={{ fontSize: 14, lineHeight: 1 }}>›</span>
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  function MetaCell({ value, label, mono }) {
    return (
      <span style={{ padding: "0 10px", textAlign: "center", display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.1, gap: 2 }}>
        <span style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: mono ? "tabular-nums" : "normal" }}>{value}</span>
        <span style={{ fontSize: 10, opacity: 0.85, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</span>
      </span>
    );
  }
  function MetaDivider() {
    return <span style={{ width: 1, height: 22, background: "rgba(255,255,255,0.28)" }} />;
  }

  // ── L2: 2-col tiles for canvas types ──────────────────────────────
  window.LevelCanvasTypes = function LevelCanvasTypes({ theme, onPick }) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {theme.types.map((ty) => (
          <button key={ty.id} onClick={() => onPick(ty.id)} style={{
            position: "relative", textAlign: "left",
            background: "#fff", border: `1px solid ${C.border}`, borderRadius: 8,
            padding: "12px 14px 12px 16px",
            cursor: "pointer", transition: ".15s",
            fontFamily: "var(--font-base)",
            display: "grid", gridTemplateColumns: "auto 1fr", gap: 12,
            alignItems: "stretch",
            minHeight: 96,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(10,39,74,0.08)"; e.currentTarget.style.borderColor = "#D2CFE3"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = C.border; }}
          >
            {/* Theme-accent stripe on the left, no full-bleed color */}
            <span style={{
              width: 4, borderRadius: 2,
              background: `linear-gradient(180deg, ${theme.grad[0]}, ${theme.grad[1]})`,
              flexShrink: 0,
            }} />
            <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: theme.grad[0] }}>
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: theme.grad[0] }} />
                Тип полотен
              </div>
              <h3 style={{ margin: "1px 0 0", color: C.blue, fontSize: 16, lineHeight: "20px", fontWeight: 700 }}>
                {ty.title}
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: 13, lineHeight: "17px", color: C.navy, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                {ty.description}
              </p>
              <div style={{ marginTop: "auto", paddingTop: 6, display: "flex", gap: 12, fontSize: 12, color: C.muted, alignItems: "center" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Icon name="grid" size={11} color={C.muted} />
                  {ty.canvasCount} полотен
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Icon name="time" size={11} color={C.muted} />
                  {window.fmtTime(ty.totalDuration)}
                </span>
                <span style={{ marginLeft: "auto", color: C.blue, fontSize: 12, fontWeight: 500 }}>открыть ›</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  // ── L3: 2-col compact lavender tiles ──────────────────────────────
  window.LevelCanvases = function LevelCanvases({ theme, type, onPick, favorites, onToggleFav }) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {type.canvases.map((c) => {
          const fav = favorites.has(c.id);
          return (
            <div key={c.id} style={{
              position: "relative",
              background: C.tileLav, border: `1px solid ${C.border}`, borderRadius: 8,
              padding: "8px 12px", cursor: "pointer",
              transition: ".12s",
              fontFamily: "var(--font-base)",
              display: "flex", alignItems: "center", gap: 10,
              minHeight: 52,
            }}
            onClick={() => onPick(c.id)}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#E8E3F2"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.tileLav; }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "#fff", border: `1px solid ${C.border}`,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: C.magenta, flexShrink: 0,
              }}>
                <Icon name="play" size={11} color={C.magenta} />
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: C.navy, fontSize: 14, fontWeight: 600, lineHeight: "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {c.title}
                </div>
                <div style={{ fontSize: 12, color: C.muted, marginTop: 1, display: "flex", gap: 10, lineHeight: "14px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                    <Icon name="audio" size={10} color={C.muted} />
                    {c.fragmentCount} фрагм.
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
                    <Icon name="time" size={10} color={C.muted} />
                    {window.fmtTime(c.totalDuration)}
                  </span>
                </div>
              </div>
              <button title={fav ? "Убрать из избранного" : "В избранное"}
                onClick={(e) => { e.stopPropagation(); onToggleFav(c.id); }}
                style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  width: 24, height: 24, borderRadius: 4,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  color: fav ? C.magenta : "rgba(138,143,163,0.5)",
                }}>
                <Icon name={fav ? "star" : "star-border"} size={15} color={fav ? C.magenta : "rgba(138,143,163,0.6)"} />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  // ── Page-level shell: tabs row ────────────────────────────────────
  window.ServicesTabs = function ServicesTabs({ value, onChange }) {
    const items = [
      { id: "services",  label: "Сервисы" },
      { id: "favorites", label: "Избранное" },
    ];
    return (
      <div style={{ display: "flex", borderBottom: `2px solid ${C.border}`, marginBottom: 12, gap: 4 }}>
        {items.map((it) => {
          const active = value === it.id;
          return (
            <button key={it.id} onClick={() => onChange(it.id)} style={{
              background: "none", border: "none",
              padding: "8px 14px 10px",
              fontFamily: "var(--font-base)", fontSize: 14,
              fontWeight: active ? 700 : 500,
              color: active ? C.navy : C.muted,
              cursor: "pointer", position: "relative",
              borderBottom: active ? `2px solid ${C.magenta}` : "2px solid transparent",
              marginBottom: -2,
              transition: ".15s",
            }}>{it.label}</button>
          );
        })}
      </div>
    );
  };
})();
