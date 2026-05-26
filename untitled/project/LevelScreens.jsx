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
                  padding: "8px 14px", borderRadius: 999,
                  background: C.magenta, color: "#fff", border: "none",
                  fontFamily: "var(--font-base)", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: ".15s",
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

  // ── L1 v4 — Soft pastel tiles, pulled from the site palette ──────────
  //   Same four directions (green / red / violet / blue), but in the very
  //   soft pastel range the rest of the site already uses (the hero card's
  //   teal / pink / lilac blobs, the lilac heroBg, the lavender tile bg).
  //   Tiles read as siblings to the hero card, not as a separate "deep
  //   colour" zone. Text/metrics return to dark navy on the light field.
  const SOFT_GRADIENTS = {
    energy: ["#D5EFEB", "#A6D9D0"], // pastel teal-mint, in family with C.blobTeal
    info:   ["#FAE0EA", "#F1B8CC"], // pastel pink, in family with C.blobPink
    space:  ["#DDE6F8", "#B6C8EE"], // pastel sky-blue, sibling to blue/lilac
    time:   ["#ECE3F6", "#C9B6E6"], // pastel lilac, in family with C.heroBg
  };
  // A dark accent in the same hue, used for the title — keeps the
  // direction recognisable even when the field is very light.
  const SOFT_TITLE = {
    energy: "#1F6F60",
    info:   "#A6004F",
    space:  "#1B3FD8",
    time:   "#5B2EAE",
  };

  window.LevelThemesSoft = function LevelThemesSoft({ themes, onPick }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {themes.map((th) => {
          const grad = SOFT_GRADIENTS[th.id] || th.grad;
          const title = SOFT_TITLE[th.id] || C.blue;
          return (
            <button key={th.id} onClick={() => onPick(th.id)} style={{
              position: "relative", display: "block", width: "100%",
              border: `1px solid ${C.border}`, padding: 0, cursor: "pointer",
              borderRadius: 10, overflow: "hidden",
              background: `linear-gradient(96deg, ${grad[0]} 0%, ${grad[1]} 100%)`,
              color: C.navy, textAlign: "left",
              transition: ".15s",
              boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
              fontFamily: "var(--font-base)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 8px 20px ${grad[1]}66`; e.currentTarget.style.borderColor = "#D2CFE3"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 0 rgba(10,39,74,0.04)"; e.currentTarget.style.borderColor = C.border; }}
            >
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
                    opacity: 0.95, pointerEvents: "none",
                    // Soft left-edge fade so the illustration melts into the pastel field.
                    WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 30%, #000 100%)",
                            maskImage: "linear-gradient(90deg, transparent 0%, #000 30%, #000 100%)",
                  }}
                />
              ) : null}

              <div style={{
                position: "relative",
                display: "grid", gridTemplateColumns: "1fr auto",
                alignItems: "center", gap: 16,
                padding: "14px 22px",
                minHeight: 96,
              }}>
                <div style={{ minWidth: 0, maxWidth: "min(520px, 56%)" }}>
                  <h2 style={{ margin: 0, color: title, fontSize: 22, lineHeight: "26px", fontWeight: 700, letterSpacing: "0.005em" }}>
                    «{th.title}»
                  </h2>
                  <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: "18px", color: C.navy, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {th.tagline}
                  </p>
                </div>

                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6,
                  color: C.navy,
                  marginRight: "clamp(150px, 34%, 290px)",
                }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: "rgba(255,255,255,0.55)",
                    border: `1px solid rgba(255,255,255,0.7)`,
                    borderRadius: 6,
                    padding: "6px 12px",
                    backdropFilter: "blur(3px)",
                    WebkitBackdropFilter: "blur(3px)",
                  }}>
                    <SoftMetaCell value={th.canvasTypeCount} label={window.pluralize(th.canvasTypeCount, ["тип","типа","типов"])} />
                    <SoftMetaDivider />
                    <SoftMetaCell value={th.canvasCount} label={window.pluralize(th.canvasCount, ["полотно","полотна","полотен"])} />
                  </div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 999,
                    background: C.magenta, color: "#fff", border: "none",
                    fontFamily: "var(--font-base)", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", transition: ".15s",
                  }}>
                    открыть <span style={{ fontSize: 14, lineHeight: 1 }}>›</span>
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };
  function SoftMetaCell({ value, label }) {
    return (
      <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.05, gap: 1, minWidth: 48, color: C.navy }}>
        <span style={{ fontSize: 17, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{value}</span>
        <span style={{ fontSize: 10, opacity: 0.8, letterSpacing: "0.02em", color: C.muted }}>{label}</span>
      </span>
    );
  }
  function SoftMetaDivider() {
    return <span style={{ width: 1, height: 22, background: "rgba(42,42,74,0.18)" }} />;
  }

  // ── L1 v4b — Soft pastel, no cover illustrations ────────────────────
  //   Quieter sibling of LevelThemesSoft: same pastel field, same brand
  //   CTA, but the right side is given over to text/metrics — no book
  //   cover. Tagline gets its full width back, so it can breathe.
  window.LevelThemesSoftPlain = function LevelThemesSoftPlain({ themes, onPick }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {themes.map((th) => {
          const grad = SOFT_GRADIENTS[th.id] || th.grad;
          const title = SOFT_TITLE[th.id] || C.blue;
          return (
            <button key={th.id} onClick={() => onPick(th.id)} style={{
              position: "relative", display: "block", width: "100%",
              border: `1px solid ${C.border}`, padding: 0, cursor: "pointer",
              borderRadius: 10, overflow: "hidden",
              background: `linear-gradient(96deg, ${grad[0]} 0%, ${grad[1]} 100%)`,
              color: C.navy, textAlign: "left",
              transition: ".15s",
              boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
              fontFamily: "var(--font-base)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 8px 20px ${grad[1]}66`; e.currentTarget.style.borderColor = "#D2CFE3"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 0 rgba(10,39,74,0.04)"; e.currentTarget.style.borderColor = C.border; }}
            >
              <div style={{
                position: "relative",
                display: "grid", gridTemplateColumns: "1fr auto",
                alignItems: "center", gap: 24,
                padding: "16px 22px",
                minHeight: 96,
              }}>
                <div style={{ minWidth: 0 }}>
                  <h2 style={{ margin: 0, color: title, fontSize: 22, lineHeight: "26px", fontWeight: 700, letterSpacing: "0.005em" }}>
                    «{th.title}»
                  </h2>
                  <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: "18px", color: C.navy, maxWidth: 640, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {th.tagline}
                  </p>
                </div>

                <div style={{
                  display: "flex", alignItems: "center", gap: 14,
                  color: C.navy,
                }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: "rgba(255,255,255,0.55)",
                    border: `1px solid rgba(255,255,255,0.7)`,
                    borderRadius: 6,
                    padding: "6px 12px",
                    backdropFilter: "blur(3px)",
                    WebkitBackdropFilter: "blur(3px)",
                  }}>
                    <SoftMetaCell value={th.canvasTypeCount} label={window.pluralize(th.canvasTypeCount, ["тип","типа","типов"])} />
                    <SoftMetaDivider />
                    <SoftMetaCell value={th.canvasCount} label={window.pluralize(th.canvasCount, ["полотно","полотна","полотен"])} />
                  </div>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 999,
                    background: C.magenta, color: "#fff", border: "none",
                    fontFamily: "var(--font-base)", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", transition: ".15s",
                  }}>
                    открыть <span style={{ fontSize: 14, lineHeight: 1 }}>›</span>
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  // ── L1 v2 — Brighter, brand-aligned tiles ────────────────────────────
  //   Same layout as LevelThemes, but each plate uses a vivid, brand-tuned
  //   colour instead of the muted book-cover tone. Colours sit in the same
  //   hue family as each book (so the cover illustration still feels at
  //   home on top), but pushed in saturation/lightness toward the project's
  //   palette (brand magenta #E5006D, brand blue #1B3FD8) so the row reads
  //   as energetic and on-brand, not editorial-quiet.
  //
  //   To keep the bright tile readable behind the dropped-in cover
  //   illustration, we additionally apply `mix-blend-mode: lighten` instead
  //   of `screen` — the rays still glow through but tonal regions don't
  //   wash to white on a saturated bg.
  const BRIGHT_GRADIENTS = {
    energy: ["#10B981", "#047857"], // vivid emerald → forest
    info:   ["#E5006D", "#A6004F"], // brand magenta → deep magenta
    space:  ["#1B3FD8", "#0F2391"], // brand blue → midnight blue
    time:   ["#7C3AED", "#4C1D95"], // violet → deep violet
  };

  window.LevelThemesBright = function LevelThemesBright({ themes, onPick }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {themes.map((th) => {
          const grad = BRIGHT_GRADIENTS[th.id] || th.grad;
          return (
            <button key={th.id} onClick={() => onPick(th.id)} style={{
              position: "relative", display: "block", width: "100%",
              border: "none", padding: 0, cursor: "pointer",
              borderRadius: 10, overflow: "hidden",
              background: `linear-gradient(96deg, ${grad[0]} 0%, ${grad[1]} 100%)`,
              color: "#fff", textAlign: "left",
              transition: ".15s",
              boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
              fontFamily: "var(--font-base)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 10px 24px ${grad[0]}55`; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 0 rgba(10,39,74,0.04)"; }}
            >
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
                    opacity: 1, pointerEvents: "none",
                    // No blend mode on bright bg — `lighten`/`screen` hide the
                    // illustration's mid-tone figures against saturated colour.
                    // The PNG already has a radial alpha falloff, so it
                    // dissolves naturally without a blend mode.
                    WebkitMaskImage: "linear-gradient(90deg, transparent 0%, #000 30%, #000 100%)",
                            maskImage: "linear-gradient(90deg, transparent 0%, #000 30%, #000 100%)",
                  }}
                />
              ) : null}
              <span style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: `linear-gradient(90deg, ${grad[0]} 0%, ${grad[0]}cc 36%, transparent 60%)`,
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
                  <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: "18px", color: "rgba(255,255,255,0.92)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
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
                    background: "rgba(255,255,255,0.16)",
                    border: "1px solid rgba(255,255,255,0.22)",
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
                    padding: "8px 14px", borderRadius: 999,
                    background: C.magenta, color: "#fff", border: "none",
                    fontFamily: "var(--font-base)", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", transition: ".15s",
                  }}>
                    открыть <span style={{ fontSize: 14, lineHeight: 1 }}>›</span>
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  // ── L1 v3 — split tile: neutral left → brand colour right ───────────
  //   Each plate is split horizontally: the left ~55 % is a quiet warm-
  //   neutral surface (light lilac, picked from the hero card's heroBg so
  //   it sits in the brand) where the headline / tagline live in dark
  //   navy; the right half blooms into the bright brand-tuned colour and
  //   carries the cover illustration + metrics chip. The transition is a
  //   single smooth gradient through the middle of the tile — no hard seam.
  window.LevelThemesSplit = function LevelThemesSplit({ themes, onPick }) {
    // Soft, on-brand neutral for the left side. heroBg (#EDE9F7) reads as
    // "from the same family as the page hero" — better than a flat white.
    const NEUTRAL = "#EDE9F7";
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {themes.map((th) => {
          const grad = BRIGHT_GRADIENTS[th.id] || th.grad;
          return (
            <button key={th.id} onClick={() => onPick(th.id)} style={{
              position: "relative", display: "block", width: "100%",
              border: `1px solid ${C.border}`, padding: 0, cursor: "pointer",
              borderRadius: 10, overflow: "hidden",
              // Single linear gradient does the heavy lifting:
              //  0–38%  : flat neutral
              //  38–72% : smooth crossfade to brand colour
              //  72–100%: flat brand colour (deepening into grad[1] at edge)
              background: `linear-gradient(90deg,
                ${NEUTRAL}   0%,
                ${NEUTRAL}  38%,
                ${grad[0]}  72%,
                ${grad[1]} 100%)`,
              color: "#fff", textAlign: "left",
              transition: ".15s",
              boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
              fontFamily: "var(--font-base)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 10px 24px ${grad[0]}40`; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 0 rgba(10,39,74,0.04)"; }}
            >
              {/* Cover illustration sits on the coloured right half, blended
                  with `lighten` so the rays glow but the saturated bg holds. */}
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
                    opacity: 1, pointerEvents: "none",
                    // Normal blend; the PNG's built-in radial alpha is what
                    // dissolves the figure into the coloured right half.
                    // Hard cutoff on the LEFT via the mask so the illustration
                    // never crosses into the neutral half — the cover belongs
                    // to the colour.
                    WebkitMaskImage: "linear-gradient(90deg, transparent 0%, transparent 14%, #000 32%, #000 100%)",
                            maskImage: "linear-gradient(90deg, transparent 0%, transparent 14%, #000 32%, #000 100%)",
                  }}
                />
              ) : null}

              <div style={{
                position: "relative",
                display: "grid", gridTemplateColumns: "1fr auto",
                alignItems: "center", gap: 16,
                padding: "14px 22px",
                minHeight: 96,
              }}>
                {/* LEFT — dark text on neutral lilac */}
                <div style={{ minWidth: 0, maxWidth: "min(520px, 56%)" }}>
                  <h2 style={{ margin: 0, color: C.blue, fontSize: 22, lineHeight: "26px", fontWeight: 700, letterSpacing: "0.005em" }}>
                    «{th.title}»
                  </h2>
                  <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: "18px", color: C.navy, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {th.tagline}
                  </p>
                </div>

                {/* RIGHT — light text on the brand-coloured side */}
                <div style={{
                  display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6,
                  color: "#fff",
                  marginRight: "clamp(150px, 34%, 290px)",
                }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: "rgba(255,255,255,0.18)",
                    border: "1px solid rgba(255,255,255,0.28)",
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
                    padding: "8px 14px", borderRadius: 999,
                    background: C.magenta, color: "#fff", border: "none",
                    fontFamily: "var(--font-base)", fontSize: 13, fontWeight: 600,
                    cursor: "pointer", transition: ".15s",
                  }}>
                    открыть <span style={{ fontSize: 14, lineHeight: 1 }}>›</span>
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  };

  // ── L2: 2-col tiles for canvas types — quote-block field, normal hierarchy ─
  //   Same visual chrome as the site's pull-quotes (soft lavender-pink
  //   field, vertical pink stripe down the left edge, 4 px corners), but
  //   the content reads as a regular card: type name as the heading,
  //   description below in smaller body, count + open-arrow at the foot.
  window.LevelCanvasTypes = function LevelCanvasTypes({ theme, onPick }) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {theme.types.map((ty) => (
          <button key={ty.id} onClick={() => onPick(ty.id)} style={{
            position: "relative", textAlign: "left",
            // Soft lavender-pink field — same family as the site's quote blocks.
            background: "#F4ECF2",
            border: "none",
            // Pink stripe down the left edge.
            borderLeft: `4px solid ${C.magenta}`,
            borderRadius: 4,
            padding: "22px 28px 18px 28px",
            cursor: "pointer", transition: ".2s",
            fontFamily: "var(--font-base)",
            display: "flex", flexDirection: "column", gap: 6,
            minHeight: 132,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#EEE2EC";
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(10,39,74,0.06)";
            const arrow = e.currentTarget.querySelector('[data-quote-arrow]');
            if (arrow) arrow.style.transform = "translateX(3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#F4ECF2";
            e.currentTarget.style.boxShadow = "none";
            const arrow = e.currentTarget.querySelector('[data-quote-arrow]');
            if (arrow) arrow.style.transform = "translateX(0)";
          }}
          >
            {/* Title — the type name as the heading. */}
            <h3 style={{
              margin: 0,
              color: C.navy,
              fontSize: 18,
              lineHeight: "22px",
              fontWeight: 700,
              letterSpacing: "0.005em",
            }}>
              {ty.title}
            </h3>

            {/* Description — smaller body copy below the heading. */}
            <p style={{
              margin: 0,
              color: C.navy,
              fontSize: 13,
              lineHeight: "19px",
              fontWeight: 400,
              opacity: 0.85,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}>
              {ty.description}
            </p>

            {/* Footer row — canvas count + open arrow. */}
            <div style={{
              marginTop: "auto",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 12,
              fontSize: 12, lineHeight: "16px",
              color: C.muted,
            }}>
              <span>
                {window.plurN(ty.canvasCount, ["полотно","полотна","полотен"])}
              </span>
              <span data-quote-arrow style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                color: C.magenta, fontSize: 12, fontWeight: 600,
                flexShrink: 0,
                transition: "transform .2s",
              }}>
                открыть <span style={{ fontSize: 14, lineHeight: 1 }}>›</span>
              </span>
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
