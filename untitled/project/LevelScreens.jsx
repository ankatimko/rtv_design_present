// LevelScreens.jsx — L1 (themes), L2 (canvas types), L3 (canvases)
// Sizing principle: this is a content-dense app interface, not a marketing page.
// Default unit is 8px; tile heights are deliberately tight so 3+ items are
// visible without scrolling. L1 is the only level that uses colored banners —
// the deeper levels switch to neutral grid tiles so users feel the descent.
(function () {
  const C = window.POLOTNA_C;

  // ── L1: deep book-colour tiles with the cover illustration on the right ──
  //
  // Tile = the book's deep colour (tonal gradient, ~18% darker on the right
  // edge). The cover's *illustration only* — figures + light rays, cropped
  // out of the cover and pre-masked into a radial alpha falloff (see
  // assets/illust-*.png) — sits on the right and dissolves into the colour
  // field, with no author/title text and no hard edge.
  window.LevelThemes = function LevelThemes({ themes, onPick }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {themes.map((th) => (
          <button key={th.id} onClick={() => onPick(th.id)} style={{
            position: "relative", display: "block", width: "100%",
            border: "none", padding: 0, cursor: "pointer",
            borderRadius: 10, overflow: "hidden",
            // Tonal gradient: from base colour to ~15-20% darker version of itself.
            background: `linear-gradient(96deg, ${th.grad[0]} 0%, ${th.grad[1]} 100%)`,
            color: "#fff", textAlign: "left",
            transition: ".15s",
            boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
            fontFamily: "var(--font-base)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 20px rgba(10,39,74,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 0 rgba(10,39,74,0.04)"; }}
          >
            {/* Cover illustration ONLY (figures + rays, no author/title text), already
                radial-alpha-masked at source so its edges dissolve into the tile colour. */}
            {th.cover ? (
              <img
                src={th.cover}
                alt=""
                aria-hidden="true"
                style={{
                  position: "absolute", top: "50%", right: 0,
                  transform: "translateY(-50%)",
                  height: "175%", width: "auto", maxWidth: "44%",
                  objectFit: "contain", objectPosition: "right center",
                  opacity: 0.78, pointerEvents: "none",
                  // mix-blend-mode `screen` keeps the cover's glowing rays bright on
                  // the deep tile and lets dark pixels become invisible — exactly the
                  // "no black box" / glow-through-colour effect we want.
                  mixBlendMode: "screen",
                  // extra soft fade on the left edge so it bleeds further into the gradient
                  WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 30%, #000 100%)",
                          maskImage: "linear-gradient(90deg, transparent 0%, #000 30%, #000 100%)",
                }}
              />
            ) : null}
            {/* Left-side darken overlay to keep headline crisp over the rays */}
            <span style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: `linear-gradient(90deg, ${th.grad[0]} 0%, ${th.grad[0]}cc 36%, transparent 60%)`,
            }} />

            <div style={{
              position: "relative",
              display: "grid", gridTemplateColumns: "1fr auto",
              alignItems: "center", gap: 16,
              padding: "14px 22px",
              minHeight: 96,
            }}>
              <div style={{ minWidth: 0, maxWidth: "min(520px, 56%)" }}>
                <h2 style={{ margin: 0, color: "#fff", fontSize: 22, lineHeight: "26px", fontWeight: 700, letterSpacing: "0.005em" }}>
                  «{th.title}»
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: "18px", color: "rgba(255,255,255,0.86)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {th.tagline}
                </p>
              </div>

              <div style={{
                display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6,
                color: "#fff",
                marginRight: "clamp(150px, 34%, 290px)",
              }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 14,
                  background: "rgba(0,0,0,0.22)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 6,
                  padding: "6px 12px",
                  backdropFilter: "blur(3px)",
                  WebkitBackdropFilter: "blur(3px)",
                }}>
                  <MetaCell value={th.canvasTypeCount} label={window.pluralize(th.canvasTypeCount, ["тип","типа","типов"])} />
                  <MetaDivider />
                  <MetaCell value={th.canvasCount} label={window.pluralize(th.canvasCount, ["полотно","полотна","полотен"])} />
                </div>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 12, fontWeight: 600,
                  color: "rgba(255,255,255,0.92)",
                  padding: "3px 9px", borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                }}>
                  открыть <span style={{ fontSize: 14, lineHeight: 1 }}>›</span>
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    );
  };

  function MetaCell({ value, label }) {
    return (
      <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.05, gap: 1, minWidth: 48 }}>
        <span style={{ fontSize: 17, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{value}</span>
        <span style={{ fontSize: 10, opacity: 0.78, letterSpacing: "0.02em" }}>{label}</span>
      </span>
    );
  }
  function MetaDivider() {
    return <span style={{ width: 1, height: 22, background: "rgba(255,255,255,0.24)" }} />;
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
                  {window.plurN(ty.canvasCount, ["полотно","полотна","полотен"])}
                </span>
                {/* Duration removed at the type level — it lives on each canvas. */}
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
