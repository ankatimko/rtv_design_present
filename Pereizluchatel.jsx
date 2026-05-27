// Pereizluchatel.jsx
// ─────────────────────────────────────────────────────────────────
//  «Переизлучатель» widget (name not shown in UI).
//
//  Domain model
//  ────────────
//    • A master phrase (e.g. «ХЛАДАСТЕЯ») is being переизлучаема
//      letter by letter — one letter = one track = one Хладастея.
//    • A "Хладастея X" (where X is the letter) is a short poem
//      themed around that letter.
//    • The widget plays through the master phrase: when the current
//      letter's Хладастея finishes, focus moves to the next letter.
//
//  Layout (full width of column)
//  ─────────────────────────────
//      ┌──────────────────────────────────────────────────────────┐
//      │   Х  Л  [А]  Д  А  С  Т  Е  Я         ← master phrase    │
//      │             ↑ current letter, purple                      │
//      ├──────────────────────────┬───────────────────────────────┤
//      │  Хладастея Х    00:03    │  Хладастея А                  │
//      │ ▶ ╔══════════════════╗   │                               │
//      │   ║  Хладастея А     ║   │  Аль, Алá                     │
//      │   ║  ▶ ⏮ ▶ ⏭         ║   │  Ярчайший альянс              │
//      │   ║  ━━━●──────       ║   │  Фа надёжно ↓ заместил        │
//      │   ╚══════════════════╝   │  Факельным шествием           │
//      │   Хладастея Д    00:04   │  Хвала мудрецам               │
//      │   …scrollable…           │  Альфа — поток                │
//      └──────────────────────────┴───────────────────────────────┘
// ─────────────────────────────────────────────────────────────────
(function () {
  const { useState, useEffect, useRef } = React;

  const C = {
    accent:    "#7C3AED",
    accentBg:  "rgba(124,58,237,0.10)",
    accentBg2: "rgba(124,58,237,0.18)",
    navy:      "#0A274A",
    muted:     "#7A86A0",
    border:    "rgba(10,39,74,0.08)",
    softBg:    "#F7F5FC",
  };

  // ── install scrollbar style once ────────────────────────────────
  if (typeof document !== "undefined" && !document.getElementById("per-scroll-style")) {
    const s = document.createElement("style");
    s.id = "per-scroll-style";
    s.textContent = `
.per-scroll { scrollbar-width: thin; scrollbar-color: rgba(124,58,237,0.45) rgba(124,58,237,0.10); }
.per-scroll::-webkit-scrollbar { width: 8px; }
.per-scroll::-webkit-scrollbar-track { background: rgba(124,58,237,0.08); border-radius: 999px; }
.per-scroll::-webkit-scrollbar-thumb { background: rgba(124,58,237,0.45); border-radius: 999px; }
.per-scroll::-webkit-scrollbar-thumb:hover { background: rgba(124,58,237,0.65); }
`;
    document.head.appendChild(s);
  }

  const MASTER = "Встреча с Основным лучом";

  // Positions of non-space characters in MASTER — each is a track.
  const LETTER_POSITIONS = [];
  for (let i = 0; i < MASTER.length; i++) {
    if (MASTER[i] !== " ") LETTER_POSITIONS.push(i);
  }

  // ── reusable poem-body templates, cycled to assign one per letter ─
  const TRACK_BODIES = [
    ["Хлад, Хлáд", "Хвала хранителю", "Холодом ↑ небо звенит", "Хор хороводит", "Хвоя хвалит ветер", "Храм — храбрость"],
    ["Лад, Лáд", "Лазурная ложбина", "Льдом ↓ ладонь устелена", "Лето листает листы", "Лоза льнёт к лесу", "Луч — ласка"],
    ["Аль, Алá", "Ярчайший альянс", "Фа надёжно ↓ заместил", "Факельным шествием", "Хвала мудрецам", "Альфа — поток"],
    ["Дай, Дáр", "Долгий день дозревает", "Дрожь ↑ держит дыхание", "Двери двух домов", "Друг другу даём", "Дно — доверие"],
    ["Áз, Áра", "Архат говорит ясно", "Альт ↓ алмазу подобен", "Атом атома любит", "Аура — ариа", "Айсберг — архаика"],
    ["Сон, Сóн", "Свет смежает веки", "Снегом ↑ собрана память", "Сладко слово садится", "Сердце сурово смягчилось", "Соль — стержень"],
    ["Той, Тóн", "Тонкий тон тревожит", "Тёмный там и тут", "Точка тянется в простор", "Твердь — терпение", "Тропа — тяга"],
    ["Е, Éс-Éс", "Если б… тишина", "Если ↑ ярко прозрачно", "Если — Если? Эпоха!", "Если когда не сейчас", "Если — есть"],
    ["Яв, Ярь", "Ясное яблоко зреет", "Якорь ↓ якорит свечу", "Янтарь янтаря дороже", "Я-я — яркая полоса", "Ясень — ярус"],
  ];

  // Build one track per non-space character in MASTER.
  const TRACKS = LETTER_POSITIONS.map((pos, i) => ({
    letter: MASTER[pos].toUpperCase(),
    duration: 4 + (i % 3),
    body: TRACK_BODIES[i % TRACK_BODIES.length],
  }));

  function fmt(s) {
    const m = Math.floor(s / 60), r = Math.floor(s % 60);
    return `${String(m).padStart(2,"0")}:${String(r).padStart(2,"0")}`;
  }

  // ── master phrase — plain sentence, current letter highlighted ──
  function MasterPhraseStrip({ phrase, letterPositions, activeIdx, progress, onPickLetter }) {
    const activePos = letterPositions[activeIdx];
    const posToLetterIdx = {};
    letterPositions.forEach((p, li) => { posToLetterIdx[p] = li; });

    return (
      <div style={{
        background: C.softBg,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "12px 22px",
        margin: "4px 4px 10px",
        textAlign: "center",
        fontFamily: "var(--font-display, var(--font-base))",
      }}>
        <div style={{
          color: C.muted, fontSize: 10, fontWeight: 700,
          letterSpacing: "0.10em", textTransform: "uppercase",
          marginBottom: 4,
        }}>
          переизлучаем
        </div>
        <div style={{
          fontSize: 24, lineHeight: "30px", fontWeight: 500,
          color: C.navy, letterSpacing: "0.005em",
        }}>
          {[...phrase].map((ch, i) => {
            const isSpace = ch === " ";
            const letterIdx = posToLetterIdx[i];
            const isActive = i === activePos;
            if (isSpace) {
              return <span key={i}>&nbsp;</span>;
            }
            return (
              <span
                key={i}
                onClick={() => onPickLetter(letterIdx)}
                style={{
                  cursor: "pointer",
                  color: isActive ? C.accent : C.navy,
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? C.accentBg : "transparent",
                  borderRadius: 4,
                  padding: isActive ? "0 3px" : "0",
                  transition: "color 0.2s, background 0.2s",
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        <div style={{
          height: 3, borderRadius: 999,
          background: "rgba(124,58,237,0.10)",
          margin: "8px auto 0",
          maxWidth: 320, overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${((activeIdx + progress) / letterPositions.length) * 100}%`,
            background: C.accent,
            transition: "width 0.18s linear",
          }} />
        </div>
      </div>
    );
  }

  // ── side row (inactive track) ───────────────────────────────────
  function SideRow({ track, onPick }) {
    return (
      <div
        onClick={onPick}
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center", gap: 10,
          padding: "9px 14px",
          background: "#fff",
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          cursor: "pointer",
          opacity: 0.5,
          transition: "opacity 0.18s, transform 0.18s",
          fontFamily: "var(--font-base)",
          minHeight: 42,
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.5"; }}
      >
        <span style={{
          width: 22, height: 22, borderRadius: "50%",
          border: `1px solid ${C.border}`, background: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="play" size={9} color={C.navy} />
        </span>
        <div style={{
          color: C.navy, fontSize: 14, fontWeight: 500,
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          Хладастея {track.letter}
        </div>
        <span style={{
          color: C.muted, fontSize: 11, fontVariantNumeric: "tabular-nums",
          minWidth: 36, textAlign: "right",
        }}>
          {fmt(track.duration)}
        </span>
      </div>
    );
  }

  // ── active track card (center, big) ─────────────────────────────
  function ActiveCard({ track, playing, progress, onTogglePlay, onPrev, onNext, onSeek }) {
    const progressRef = useRef(null);

    function handleSeekClick(e) {
      const el = progressRef.current; if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      onSeek(Math.max(0, Math.min(1, x / rect.width)));
    }

    return (
      <div style={{
        background: C.accentBg,
        border: `1.5px solid ${C.accent}`,
        borderRadius: 10,
        padding: "12px 16px 12px",
        boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
        display: "flex", flexDirection: "column", gap: 10,
        fontFamily: "var(--font-base)",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
          <div style={{ color: C.accent, fontSize: 18, fontWeight: 700, flex: 1, minWidth: 0 }}>
            Хладастея {track.letter}
          </div>
          <div style={{
            color: C.accent, fontSize: 12, fontVariantNumeric: "tabular-nums",
            opacity: 0.8,
          }}>
            {fmt(progress * track.duration)} / {fmt(track.duration)}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={onPrev} style={ctrlSecondary}>
            <Icon name="media-prev" size={14} color={C.accent} />
          </button>
          <button onClick={onTogglePlay} style={ctrlPrimary}>
            <Icon name={playing ? "pause" : "play"} size={14} color="#fff" />
          </button>
          <button onClick={onNext} style={ctrlSecondary}>
            <Icon name="media-next" size={14} color={C.accent} />
          </button>

          <div
            ref={progressRef}
            onClick={handleSeekClick}
            style={{
              flex: 1, height: 6, background: "rgba(124,58,237,0.18)",
              borderRadius: 999, position: "relative", cursor: "pointer",
              marginLeft: 4,
            }}
          >
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: `${progress * 100}%`,
              background: C.accent, borderRadius: 999,
              transition: "width 0.15s linear",
            }} />
            <div style={{
              position: "absolute", left: `calc(${progress * 100}% - 7px)`, top: -4,
              width: 14, height: 14, borderRadius: "50%",
              background: "#fff", border: `2px solid ${C.accent}`,
              boxShadow: "0 1px 2px rgba(10,39,74,0.18)",
              transition: "left 0.15s linear",
            }} />
          </div>
        </div>
      </div>
    );
  }

  const ctrlPrimary = {
    width: 32, height: 32, borderRadius: "50%",
    background: C.accent, border: "none", color: "#fff",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", padding: 0,
  };
  const ctrlSecondary = {
    width: 28, height: 28, borderRadius: "50%",
    background: "#fff", border: `1px solid rgba(124,58,237,0.3)`,
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", padding: 0,
  };

  // ── scrollable carousel: prev tracks above, active centered, next below
  function TrackCarousel({ tracks, activeIdx, ...activeProps }) {
    // We render ALL tracks, with the active one as a big card and the
    // rest as compact rows. The container scrolls vertically and keeps
    // the active card centered in view at all times — the inner padding
    // is sized so any item can land at the exact center.
    const containerRef = useRef(null);
    const activeRef = useRef(null);
    const firstRunRef = useRef(true);

    useEffect(() => {
      const node = activeRef.current;
      const cont = containerRef.current;
      if (!node || !cont) return;
      const nodeTop = node.offsetTop;
      const nodeH   = node.offsetHeight;
      const contH   = cont.clientHeight;
      let target = nodeTop - (contH - nodeH) / 2;
      const maxScroll = Math.max(0, cont.scrollHeight - contH);
      target = Math.max(0, Math.min(maxScroll, target));
      cont.scrollTo({ top: target, behavior: firstRunRef.current ? "auto" : "smooth" });
      firstRunRef.current = false;
    }, [activeIdx]);

    return (
      <div
        ref={containerRef}
        className="per-scroll"
        style={{
          maxHeight: 320,
          overflowY: "auto",
          // Small padding — active will be centered when possible,
          // pushed against an edge near the list ends.
          padding: "6px 10px 6px 2px",
          display: "flex", flexDirection: "column", gap: 6,
          scrollBehavior: "smooth",
        }}
      >
        {tracks.map((t, i) => {
          if (i === activeIdx) {
            return (
              <div key={i} ref={activeRef}>
                <ActiveCard track={t} {...activeProps} />
              </div>
            );
          }
          return (
            <SideRow key={i} track={t} onPick={() => activeProps.onPick(i)} />
          );
        })}
      </div>
    );
  }

  // ── right pane — static text of the current Хладастея ───────────

  // ── windowed carousel: prev/active/next only, with fade links ────
  function TrackWindow({ tracks, activeIdx, ...activeProps }) {
    const prevIdx  = (activeIdx - 1 + tracks.length) % tracks.length;
    const nextIdx  = (activeIdx + 1) % tracks.length;
    const prevIdx2 = (activeIdx - 2 + tracks.length) % tracks.length;
    const nextIdx2 = (activeIdx + 2) % tracks.length;

    const linkStyle = {
      background: "transparent",
      border: "none",
      color: C.muted,
      fontSize: 12, fontWeight: 600,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      cursor: "pointer",
      padding: "4px 8px",
      opacity: 0.55,
      display: "inline-flex", alignItems: "center", gap: 6,
      transition: "opacity 0.18s, color 0.18s",
      fontFamily: "var(--font-base)",
    };

    return (
      <div style={{
        display: "flex", flexDirection: "column", gap: 6,
        alignItems: "stretch",
      }}>
        <div style={{ textAlign: "center", marginBottom: 2 }}>
          <button
            style={linkStyle}
            onClick={() => activeProps.onPick(prevIdx2)}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.95"; e.currentTarget.style.color = C.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.55"; e.currentTarget.style.color = C.muted; }}
          >
            ↑ Предыдущий
          </button>
        </div>
        <SideRow track={tracks[prevIdx]} onPick={() => activeProps.onPick(prevIdx)} />
        <ActiveCard track={tracks[activeIdx]} {...activeProps} />
        <SideRow track={tracks[nextIdx]} onPick={() => activeProps.onPick(nextIdx)} />
        <div style={{ textAlign: "center", marginTop: 2 }}>
          <button
            style={linkStyle}
            onClick={() => activeProps.onPick(nextIdx2)}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.95"; e.currentTarget.style.color = C.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.55"; e.currentTarget.style.color = C.muted; }}
          >
            Следующий ↓
          </button>
        </div>
      </div>
    );
  }

    function PhraseText({ track }) {
    return (
      <div style={{
        background: "#FBF7EF", // warm paper (matches the screenshot the user shared)
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "20px 26px",
        minHeight: 240,
        boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
        display: "flex", flexDirection: "column", gap: 12,
        transition: "background 0.2s",
      }}>
        <div style={{
          fontFamily: "var(--font-display, var(--font-base))",
          fontSize: 20, fontWeight: 700,
          color: C.navy,
          letterSpacing: "0.01em",
        }}>
          Хладастея {track.letter}
        </div>
        <div style={{
          fontFamily: "var(--font-display, var(--font-base))",
          fontSize: 17, lineHeight: "24px",
          color: C.navy,
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          {track.body.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>
    );
  }

  // ── the widget itself ───────────────────────────────────────────
  window.PereizluchatelWidget = function PereizluchatelWidget({
    phrase = MASTER, tracks = TRACKS, letterPositions = LETTER_POSITIONS,
    variant = "scroll",
  } = {}) {
    const [idx, setIdx] = useState(2); // start at the А track (matches the user-supplied example)
    const [playing, setPlaying] = useState(true);
    const [progress, setProgress] = useState(0.42);
    const [transitioning, setTransitioning] = useState(false);

    const cur = tracks[idx];

    useEffect(() => {
      if (!playing || transitioning) return;
      const step = 0.05;
      const id = setInterval(() => {
        setProgress((p) => {
          const np = p + step / cur.duration;
          if (np >= 1) {
            setTransitioning(true);
            setTimeout(() => {
              setIdx((i) => (i + 1) % tracks.length);
              setProgress(0);
              setTransitioning(false);
            }, 360);
            return 1;
          }
          return np;
        });
      }, 100);
      return () => clearInterval(id);
    }, [playing, cur.duration, transitioning, tracks.length]);

    function pickIndex(newIdx) {
      setTransitioning(true);
      setTimeout(() => {
        setIdx(newIdx);
        setProgress(0);
        setTransitioning(false);
      }, 200);
    }
    const goPrev = () => pickIndex((idx - 1 + tracks.length) % tracks.length);
    const goNext = () => pickIndex((idx + 1) % tracks.length);

    return (
      <div style={{
        background: "#fff",
        border: `1px solid ${C.border}`,
        borderRadius: 12,
        padding: "8px 12px 14px",
        boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
        fontFamily: "var(--font-base)",
      }}>
        <MasterPhraseStrip
          phrase={phrase}
          letterPositions={letterPositions}
          activeIdx={idx}
          progress={progress}
          onPickLetter={pickIndex}
        />
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(280px, 0.85fr) 1.15fr",
          gap: 16,
          alignItems: "stretch",
          opacity: transitioning ? 0.9 : 1,
          transition: "opacity 0.18s",
        }}>
          {variant === "window" ? (
            <TrackWindow
              tracks={tracks}
              activeIdx={idx}
              playing={playing}
              progress={progress}
              onTogglePlay={() => setPlaying((x) => !x)}
              onPrev={goPrev}
              onNext={goNext}
              onSeek={setProgress}
              onPick={pickIndex}
            />
          ) : (
            <TrackCarousel
              tracks={tracks}
              activeIdx={idx}
              playing={playing}
              progress={progress}
              onTogglePlay={() => setPlaying((x) => !x)}
              onPrev={goPrev}
              onNext={goNext}
              onSeek={setProgress}
              onPick={pickIndex}
            />
          )}
          <div style={{
            transition: "opacity 0.3s",
            opacity: transitioning ? 0 : 1,
          }}>
            <PhraseText track={cur} />
          </div>
        </div>
      </div>
    );
  };
})();
