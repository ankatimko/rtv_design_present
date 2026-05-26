// MatrixPanel.jsx — L4 with right-side schema panel (matrix + chips + quote).
//
//   Variants:
//     • CanvasPlayerWithMatrix         — chip cloud (для "Знаковых полотен")
//     • CanvasPlayerWithMatrixSections — playlist split by subheaders
//       (для полотен из «Всё о времени»). Adds a переизлучатель block
//       between the first and second sections.
//
//   The right panel is a single component that takes (canvas, currentIdx,
//   playing, onPick). The current fragment's mapped cell pulses with a
//   smooth fade-in/fade-out, the corresponding chip also pulses, and the
//   quote text below crossfades. All three stay synced via currentIdx.
(function () {
  const { useState, useEffect, useRef, useMemo } = React;
  const C = window.POLOTNA_C;

  // ── One-shot style injection (pulse keyframes, scrollable wrapper) ──
  function ensureStyles() {
    if (document.getElementById("mp-styles")) return;
    const s = document.createElement("style");
    s.id = "mp-styles";
    s.textContent = `
@keyframes mp-pulse-cell {
  0%, 100% { box-shadow: 0 0 0 0 rgba(124,58,237,0.45); background: #EFE7FB; transform: scale(1); }
  50%      { box-shadow: 0 0 0 6px rgba(124,58,237,0); background: #DDCFF6; transform: scale(1.03); }
}
@keyframes mp-pulse-chip {
  0%, 100% { box-shadow: 0 0 0 0 rgba(229,0,109,0.35); background: #FCEDF3; border-color: #E5006D; }
  50%      { box-shadow: 0 0 0 5px rgba(229,0,109,0);  background: #FFFFFF; border-color: #F39EBE; }
}
@keyframes mp-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: none; }
}
.mp-pulse-cell { animation: mp-pulse-cell 1.6s ease-in-out infinite; }
.mp-pulse-chip { animation: mp-pulse-chip 1.6s ease-in-out infinite; }
.mp-fade-in    { animation: mp-fade-in .3s ease-out; }
`;
    document.head.appendChild(s);
  }

  // ── "Знакорядные" chip names (the labels the right column shows) ──
  // Pulled from the production screenshot; 30 unique chips, occasionally
  // repeated by the natural fragment-to-chip mapping below.
  const CHIP_NAMES = [
    "Активы радости",      "Ёмко обо всём",       "Красота координат",
    "Реальность Йот",      "Экспертный экипаж",   "Хладастейный характер",
    "Фамилия и форма",     "Газовые гроздья",     "Ласки любви",
    "От ума до разума",    "Жар жизни",           "Власть времени",
    "Изысканная щедрость", "Сила слова",          "Бестселлер богатства",
    "Ясность перемещения", "Юпитер в действии",   "Полное признание",
    "Нормы первенства",    "Щит щели",            "Запас здоровья",
    "Универсум успеха",    "Широта мышления",     "Цена цели",
    "Достойный выбор",     "Чудеса часов",        "Темы тайны",
    "Разумное решение",    "Нежные и жёсткие знаки", "Изъятие ритма",
    "Ориентир собственника","Единый полдень",     "Объять Ять",
    "Молчание мудрого",    "Становление вихря",
  ];

  // Fragment-titles used by the new canvas variants (richer than the
  // generic "вступление, ладони…" titles from data.js). Cycles per index.
  const FRAGMENT_TITLES = [
    "Субстанция сердца", "Активы радости",      "Ёмко обо всём",
    "Красота координат", "Хладастейный характер","Экспертный экипаж",
    "Реальность Йот",    "Активы радости",      "Ласки любви",
    "Фамилия и форма",   "Газовые гроздья",     "Жар жизни",
    "От ума до разума",  "Власть времени",      "Сила слова",
    "Изысканная щедрость","Юпитер в действии",  "Полное признание",
    "Бестселлер богатства","Ясность перемещения","Запас здоровья",
    "Универсум успеха",  "Цена цели",           "Достойный выбор",
    "Чудеса часов",      "Темы тайны",          "Изъятие ритма",
    "Разумное решение",  "Ориентир собственника","Единый полдень",
    "Объять Ять",        "Молчание мудрого",
  ];

  // Short editorial quote bodies, attached to each fragment by index.
  // Kept generic/symbolic — they're in the brand's domain-language voice.
  const QUOTES = [
    "Красота позволяет мозгу работать с предзнаками и послезнаками. В слове «красота» содержится «кра(сота)» от информосот.",
    "Радость — это активное действие, а не состояние ожидания. Когда мозг радуется, он усваивает в десятки раз быстрее.",
    "Ёмкость — это способность удержать в себе всё названное одним словом, не теряя смысловых оттенков.",
    "Координаты человека прорисовываются заново каждый раз, как только он назвал себя по-новому.",
    "Хладастейность — это умение оставаться в собственном ритме, когда вокруг ускоряются.",
    "Экипаж собирается из тех, кто умеет молчать в одном ритме. Слова приходят потом.",
    "Йот — это та малая величина, через которую проходит весь объём.",
    "Любовь не передаётся словами — она передаётся через паузы между словами.",
    "Фамилия — это форма, в которую вмещается линия. Имя — это содержание формы.",
    "Гроздья названий собираются на ветке одного и того же корня.",
    "Жар жизни рождается из соприкосновения двух разнотемповых половин.",
    "Время — это то, что ты можешь дать, не уменьшая себя.",
    "Щедрость — это форма щедроты, в которой нет траты.",
    "Слово, сказанное вовремя, переразмещает пространство вокруг говорящего.",
    "Юпитер в действии — это длительность, которая не торопится.",
    "Признание — это возвращение названия тому, кто его уже носил.",
    "Первенство не в скорости, а в направлении, выбранном первым.",
    "Щель — это место, через которое проходит луч; щит — то, что её сохраняет.",
    "Здоровье — это запас, который не показывают, пока он есть.",
    "Универсум успеха собирается из тех мелочей, что названы вовремя.",
    "Широта мышления — это число одновременно удерживаемых имён.",
    "Цена цели становится понятной только тому, кто её уже оплатил.",
    "Выбор достоин ровно настолько, насколько готов быть названным вслух.",
    "Часы — это чудо, потому что они переводят длительность в делимое.",
    "Тайна — это тема, которая ещё не была пройдена в чтении.",
    "Решение разумно, когда его можно повторить дважды без потери.",
    "Знаки нежные и знаки жёсткие чередуются ритмом — без чередования нет шага.",
    "Ритм можно изъять, но место, где он стоял, останется тёплым.",
    "Собственник ориентируется на то, что он уже однажды отдал.",
    "Полдень один — у звёздного, солнечного, лунного и планетарного времени он совпадает.",
    "Ять — это знак, который сохраняет, не удерживая.",
    "Молчание мудрого слышно громче слова неопытного.",
  ];

  // ─────────────────────────────────────────────────────────────────
  //  Right-pane sub-components
  // ─────────────────────────────────────────────────────────────────

  // 10-cell radastei matrix. Layout (rows × cols):
  //   row 0:  1   10
  //   row 1:  2    9
  //   row 2:  3    8
  //   row 3:  4    7
  //   row 4:  5    6
  // Arrows are drawn as a single SVG overlay following the production schema.
  function MatrixGrid({ activeCell, title, prev, next }) {
    const cells = [
      { n: 1,  row: 0, col: 0 }, { n: 10, row: 0, col: 1 },
      { n: 2,  row: 1, col: 0 }, { n: 9,  row: 1, col: 1 },
      { n: 3,  row: 2, col: 0 }, { n: 8,  row: 2, col: 1 },
      { n: 4,  row: 3, col: 0 }, { n: 7,  row: 3, col: 1 },
      { n: 5,  row: 4, col: 0 }, { n: 6,  row: 4, col: 1 },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ color: C.navy, fontSize: 17, fontWeight: 700, textAlign: "center" }}>{title}</div>
        <div style={{
          position: "relative",
          width: 240, height: 320,
          border: `1.5px solid ${C.navy}`,
          background: "#fff",
          borderRadius: 2,
        }}>
          {/* Cells */}
          <div style={{
            position: "absolute", inset: 0,
            display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "repeat(5, 1fr)",
          }}>
            {cells.map((cell) => {
              const isActive = cell.n === activeCell;
              const borderR = cell.col === 0 ? `1.5px solid ${C.navy}` : "none";
              const borderB = cell.row < 4   ? `1.5px solid ${C.navy}` : "none";
              return (
                <div key={cell.n} style={{
                  gridColumn: cell.col + 1, gridRow: cell.row + 1,
                  borderRight: borderR, borderBottom: borderB,
                  position: "relative",
                  fontFamily: "var(--font-base)",
                }}>
                  {/* Number label, corner-anchored — top-left for left col, top-right for right col */}
                  <span style={{
                    position: "absolute",
                    top: 6,
                    left:  cell.col === 0 ? 8 : "auto",
                    right: cell.col === 1 ? 8 : "auto",
                    color: isActive ? "#7C3AED" : C.navy,
                    fontSize: 18, fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                    zIndex: 2,
                    transition: "color .3s",
                  }}>
                    {cell.n}
                  </span>
                  {/* Active highlight overlay */}
                  {isActive ? (
                    <span
                      className="mp-pulse-cell"
                      style={{
                        position: "absolute", inset: 4,
                        borderRadius: 4, zIndex: 1, pointerEvents: "none",
                      }}
                    />
                  ) : null}
                </div>
              );
            })}
          </div>
          {/* SVG arrows overlay */}
          <svg viewBox="0 0 240 320" width="240" height="320" style={{
            position: "absolute", inset: 0, pointerEvents: "none",
          }}>
            <defs>
              <marker id="mp-arrow" viewBox="0 0 10 10" refX="8.5" refY="5"
                      markerWidth="7" markerHeight="7" orient="auto">
                <path d="M0,1.5 L8.5,5 L0,8.5 L2,5 Z" fill={C.navy} />
              </marker>
              <marker id="mp-arrow-soft" viewBox="0 0 10 10" refX="8.5" refY="5"
                      markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,1.5 L8.5,5 L0,8.5 L2,5 Z" fill={C.muted} />
              </marker>
            </defs>
            <g stroke={C.navy} strokeWidth="1.2" fill="none" strokeLinecap="round" markerEnd="url(#mp-arrow)">
              {/* Left column going down — 1→2, 2→3, 3→4, 4→5 (each arrow crosses a row border) */}
              <line x1="60"  y1="48"  x2="60"  y2="82"  />
              <line x1="60"  y1="112" x2="60"  y2="146" />
              <line x1="60"  y1="176" x2="60"  y2="210" />
              <line x1="60"  y1="240" x2="60"  y2="274" />
              {/* Bottom: 5 → 6 (crosses column border) */}
              <line x1="78"  y1="296" x2="162" y2="296" />
              {/* Right column going up — 6→7, 7→8, 8→9, 9→10 */}
              <line x1="180" y1="272" x2="180" y2="238" />
              <line x1="180" y1="208" x2="180" y2="174" />
              <line x1="180" y1="144" x2="180" y2="110" />
              <line x1="180" y1="80"  x2="180" y2="46"  />
              {/* Top: 10 → 1 (crosses column border) */}
              <line x1="162" y1="44"  x2="78"  y2="44"  />
            </g>
            {/* Diagonal hint: 10 → 5 — subtle, dashed, doesn't compete with the snake path */}
            <line x1="168" y1="58" x2="72" y2="278"
                  stroke={C.muted} strokeWidth="0.9" strokeDasharray="3 4"
                  fill="none" opacity="0.55"
                  markerEnd="url(#mp-arrow-soft)" />
          </svg>
        </div>
        {/* Prev / next labels */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, marginTop: 4 }}>
          {prev ? <div style={{ color: C.muted, fontSize: 13 }}>{prev}</div> : null}
          {next ? <div style={{ color: C.muted, fontSize: 13 }}>{next}</div> : null}
        </div>
      </div>
    );
  }

  // Chip cloud — wrap grid of 35 знакоряд names. Active chip pulses pink.
  function ChipCloud({ activeChipIdx, onPickChip }) {
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0,1fr))",
        gap: 6,
      }}>
        {CHIP_NAMES.map((name, i) => {
          const isActive = i === activeChipIdx;
          return (
            <div
              key={i}
              onClick={onPickChip ? () => onPickChip(i) : undefined}
              className={isActive ? "mp-pulse-chip" : ""}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                textAlign: "center",
                fontFamily: "var(--font-base)",
                fontSize: 11, lineHeight: "13px",
                color: isActive ? C.magenta : C.navy,
                fontWeight: isActive ? 600 : 400,
                background: isActive ? "#FCEDF3" : "#fff",
                border: `1px solid ${isActive ? C.magenta : "#D8D6E5"}`,
                borderRadius: 4,
                padding: "8px 6px",
                minHeight: 38,
                cursor: onPickChip ? "pointer" : "default",
                transition: "background .25s, color .25s, border-color .25s",
              }}
            >
              {name}
            </div>
          );
        })}
      </div>
    );
  }

  // Active quote text below the matrix/chips.
  function ActiveQuote({ quote, expanded, onToggle }) {
    return (
      <div className="mp-fade-in" key={quote} style={{
        background: "#F4ECF2",
        borderLeft: `4px solid ${C.magenta}`,
        padding: "16px 18px",
        borderRadius: 4,
        fontFamily: "var(--font-base)",
      }}>
        <p style={{
          margin: 0,
          color: C.navy,
          fontSize: 13.5, lineHeight: "20px",
          fontStyle: "italic",
          display: expanded ? "block" : "-webkit-box",
          WebkitLineClamp: expanded ? "unset" : 4,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}>
          «{quote}»
        </p>
        <button onClick={onToggle} style={{
          marginTop: 8, background: "transparent", border: "none",
          color: C.blue, fontSize: 12, fontWeight: 500, cursor: "pointer",
          padding: 0, textDecoration: "underline",
          fontFamily: "var(--font-base)",
        }}>
          {expanded ? "Свернуть" : "Развернуть"}
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  //  Compact player bar — reused by both shells
  // ─────────────────────────────────────────────────────────────────
  function CompactPlayerBar({ playing, position, total, currentTitle, currentIdx, totalFragments, onPlayPause, onRewind, onForward, onRestart }) {
    const pct = (position / total) * 100;
    return (
      <div style={{
        background: "#fff", borderRadius: 10, border: `1px solid ${C.border}`,
        padding: "12px 16px", marginBottom: 14,
        boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <button onClick={onPlayPause} title={playing ? "Пауза" : "Воспроизвести"} style={{
          width: 42, height: 42, borderRadius: "50%",
          background: C.magenta, border: "none", cursor: "pointer", color: "#fff",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 10px rgba(229,0,109,0.30)", flexShrink: 0,
        }}>
          <Icon name={playing ? "pause" : "play"} size={16} color="#fff" />
        </button>
        <button onClick={onRewind} title="−10 сек" style={miniBtn(C)}>
          <Icon name="media-prev" size={14} color={C.blue} />
        </button>
        <button onClick={onForward} title="+10 сек" style={miniBtn(C)}>
          <Icon name="media-next" size={14} color={C.blue} />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: playing ? C.magenta : "rgba(138,143,163,0.6)" }} />
            {playing ? "сейчас играет" : "пауза"}
            <span style={{ color: "rgba(138,143,163,0.6)" }}>·</span>
            <span>фрагмент {currentIdx + 1} из {totalFragments}</span>
          </div>
          <div style={{ color: C.navy, fontSize: 14, fontWeight: 600, marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {currentTitle}
          </div>
          {/* Slim progress strip */}
          <div style={{
            marginTop: 6, height: 3, background: "rgba(138,143,163,0.20)", borderRadius: 2,
            position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", left: 0, top: 0, bottom: 0,
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${C.magenta}, #FF4D8F)`,
              transition: "width .08s linear",
            }} />
          </div>
        </div>
        <div style={{ textAlign: "right", color: C.navy, fontVariantNumeric: "tabular-nums", fontSize: 12, minWidth: 60 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.magenta }}>{window.fmtTime(position)}</div>
          <div style={{ color: C.muted, fontSize: 11 }}>из {window.fmtTime(total)}</div>
        </div>
      </div>
    );
  }

  function miniBtn(C) {
    return {
      width: 32, height: 32, borderRadius: "50%",
      background: "rgba(27,63,216,0.06)", border: "none", cursor: "pointer",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
    };
  }

  // ─────────────────────────────────────────────────────────────────
  //  Shared shell: hoists playback state + renders left list + right panel
  // ─────────────────────────────────────────────────────────────────
  function useFragmentPlayback(canvas) {
    ensureStyles();
    const total = canvas.totalDuration;
    const offsets = useMemo(() => {
      const out = []; let acc = 0;
      canvas.fragments.forEach((f) => { out.push(acc); acc += f.duration; });
      return out;
    }, [canvas.id]);

    const [position, setPosition] = useState(0);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
      if (!playing) return;
      let last = performance.now();
      let id;
      const tick = (t) => {
        const dt = (t - last) / 1000; last = t;
        setPosition((p) => {
          const next = p + dt;
          if (next >= total) { setPlaying(false); return total; }
          return next;
        });
        id = requestAnimationFrame(tick);
      };
      id = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(id);
    }, [playing, total]);

    // Current fragment index
    let currentIdx = 0;
    {
      let acc = 0;
      for (let i = 0; i < canvas.fragments.length; i++) {
        const f = canvas.fragments[i];
        if (position < acc + f.duration) { currentIdx = i; break; }
        acc += f.duration;
        currentIdx = canvas.fragments.length - 1;
      }
    }

    const seek = (sec) => setPosition(Math.max(0, Math.min(total, sec)));
    const seekToFragment = (i) => seek(offsets[i] + 0.001);

    return {
      position, setPosition,
      playing, setPlaying,
      total, offsets, currentIdx,
      seek, seekToFragment,
    };
  }

  // ─────────────────────────────────────────────────────────────────
  //  Variant A: chip-cloud right pane (Знакоподсказка для тела)
  // ─────────────────────────────────────────────────────────────────
  window.CanvasPlayerWithMatrix = function CanvasPlayerWithMatrix({ canvas }) {
    const p = useFragmentPlayback(canvas);
    const [quoteOpen, setQuoteOpen] = useState(false);

    const currentChipIdx = p.currentIdx % CHIP_NAMES.length;
    const currentQuote = QUOTES[p.currentIdx % QUOTES.length];
    const currentMatrixCell = (p.currentIdx % 10) + 1;

    // Override fragment titles with rich ones, for this variant only.
    const richTitles = canvas.fragments.map((f, i) => FRAGMENT_TITLES[i % FRAGMENT_TITLES.length]);

    return (
      <div>
        <CompactPlayerBar
          playing={p.playing} position={p.position} total={p.total}
          currentTitle={richTitles[p.currentIdx]}
          currentIdx={p.currentIdx}
          totalFragments={canvas.fragments.length}
          onPlayPause={() => p.setPlaying((x) => !x)}
          onRewind={() => p.seek(p.position - 10)}
          onForward={() => p.seek(p.position + 10)}
          onRestart={() => { p.seek(0); p.setPlaying(true); }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 14, alignItems: "start" }}>
          {/* LEFT — playlist */}
          <Playlist
            fragments={canvas.fragments}
            titles={richTitles}
            currentIdx={p.currentIdx}
            playing={p.playing}
            onPickFragment={p.seekToFragment}
            maxHeight={760}
          />

          {/* RIGHT — chip cloud + active quote */}
          <div style={{
            background: "#fff", borderRadius: 10, border: `1px solid ${C.border}`,
            padding: 16,
            display: "flex", flexDirection: "column", gap: 14,
            boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
          }}>
            <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Знакоряды полотна
            </div>
            <ChipCloud activeChipIdx={currentChipIdx} />
            <div style={{ height: 1, background: C.border }} />
            <div className="mp-fade-in" key={p.currentIdx} style={{ color: C.navy, fontSize: 14, fontWeight: 700 }}>
              {CHIP_NAMES[currentChipIdx]}
            </div>
            <ActiveQuote quote={currentQuote} expanded={quoteOpen} onToggle={() => setQuoteOpen((x) => !x)} />
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────
  //  Variant B: matrix right pane + sectioned playlist
  //  (used for "Всё о времени" canvases — Урок Радастеи N, etc.)
  // ─────────────────────────────────────────────────────────────────
  window.CanvasPlayerWithMatrixSections = function CanvasPlayerWithMatrixSections({ canvas, sections }) {
    const p = useFragmentPlayback(canvas);
    const [quoteOpen, setQuoteOpen] = useState(false);

    // Time-themed fragment titles ("Урок Радастеи 12", "Урок Радастеи 4"…)
    const timeTitles = canvas.fragments.map((f, i) => {
      const num = ((i * 7 + 12) % 108) + 1; // pseudo-random but deterministic
      return `Урок Радастеи ${num}`;
    });

    const currentMatrixCell = (p.currentIdx % 10) + 1;
    const currentQuote = QUOTES[p.currentIdx % QUOTES.length];

    return (
      <div>
        <CompactPlayerBar
          playing={p.playing} position={p.position} total={p.total}
          currentTitle={timeTitles[p.currentIdx]}
          currentIdx={p.currentIdx}
          totalFragments={canvas.fragments.length}
          onPlayPause={() => p.setPlaying((x) => !x)}
          onRewind={() => p.seek(p.position - 10)}
          onForward={() => p.seek(p.position + 10)}
          onRestart={() => { p.seek(0); p.setPlaying(true); }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 14, alignItems: "start" }}>
          {/* LEFT — sectioned playlist */}
          <SectionedPlaylist
            fragments={canvas.fragments}
            titles={timeTitles}
            sections={sections}
            currentIdx={p.currentIdx}
            playing={p.playing}
            onPickFragment={p.seekToFragment}
          />

          {/* RIGHT — matrix + active quote */}
          <div style={{
            background: "#fff", borderRadius: 10, border: `1px solid ${C.border}`,
            padding: 18,
            display: "flex", flexDirection: "column", gap: 14,
            boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
          }}>
            <MatrixGrid
              activeCell={currentMatrixCell}
              title={timeTitles[p.currentIdx]}
              prev={`Урок Радастеи ${((p.currentIdx + 4) * 7 + 12) % 108 + 1}`}
              next={`Урок Радастеи ${((p.currentIdx + 1) * 7 + 12) % 108 + 1}`}
            />
            <ActiveQuote quote={currentQuote} expanded={quoteOpen} onToggle={() => setQuoteOpen((x) => !x)} />
          </div>
        </div>
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────
  //  Playlist (flat, used by chip variant)
  // ─────────────────────────────────────────────────────────────────
  function Playlist({ fragments, titles, currentIdx, playing, onPickFragment, maxHeight }) {
    return (
      <div style={{
        background: "#fff", borderRadius: 10, border: `1px solid ${C.border}`,
        overflow: "hidden",
        boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
        maxHeight, overflowY: maxHeight ? "auto" : "visible",
      }}>
        {fragments.map((f, i) => (
          <PlaylistRow key={f.id}
            index={i}
            title={titles[i]}
            duration={f.duration}
            isCurrent={i === currentIdx}
            playing={playing}
            isLast={i === fragments.length - 1}
            onPick={() => onPickFragment(i)}
          />
        ))}
      </div>
    );
  }

  function PlaylistRow({ index, title, duration, isCurrent, playing, isLast, onPick }) {
    return (
      <div onClick={onPick} style={{
        display: "grid", gridTemplateColumns: "44px 1fr auto", alignItems: "center", gap: 10,
        padding: "10px 18px",
        cursor: "pointer",
        background: isCurrent ? "rgba(229,0,109,0.06)" : "#fff",
        borderBottom: isLast ? "none" : `1px solid ${C.border}`,
        transition: ".12s",
        fontFamily: "var(--font-base)",
        minHeight: 44,
      }}
      onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.background = "#FAF8FE"; }}
      onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.background = "#fff"; }}
      >
        <div style={{ textAlign: "center" }}>
          {isCurrent ? (
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: 26, height: 26, borderRadius: "50%",
              background: C.magenta, color: "#fff",
            }}>
              <Icon name={playing ? "pause" : "play"} size={11} color="#fff" />
            </span>
          ) : (
            <span style={{ color: C.muted, fontSize: 13, fontVariantNumeric: "tabular-nums" }}>{index + 1}</span>
          )}
        </div>
        <div style={{
          color: isCurrent ? C.magenta : C.navy,
          fontSize: 14, fontWeight: isCurrent ? 600 : 400,
          lineHeight: "18px",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {title}
        </div>
        <div style={{
          color: isCurrent ? C.magenta : C.muted,
          fontSize: 12, fontVariantNumeric: "tabular-nums", minWidth: 40, textAlign: "right",
        }}>
          {window.fmtTime(duration)}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  //  Sectioned playlist — splits fragments into 3 groups, inserts a
  //  переизлучатель block between sections 1 and 2.
  // ─────────────────────────────────────────────────────────────────
  function SectionedPlaylist({ fragments, titles, sections, currentIdx, playing, onPickFragment }) {
    // sections is [{ title, range: [start, end] }, ...]
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 760, overflowY: "auto" }}>
        {sections.map((sec, si) => (
          <React.Fragment key={si}>
            <div style={{
              padding: "0 4px",
              color: C.navy, fontSize: 13, fontWeight: 700,
              letterSpacing: "0.005em", lineHeight: "18px",
              marginTop: si > 0 ? 4 : 0,
            }}>
              {sec.title}
            </div>
            <div style={{
              background: "#fff", borderRadius: 10, border: `1px solid ${C.border}`,
              overflow: "hidden",
              boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
            }}>
              {fragments.slice(sec.range[0], sec.range[1]).map((f, j) => {
                const i = sec.range[0] + j;
                return (
                  <PlaylistRow key={f.id}
                    index={i}
                    title={titles[i]}
                    duration={f.duration}
                    isCurrent={i === currentIdx}
                    playing={playing}
                    isLast={j === sec.range[1] - sec.range[0] - 1}
                    onPick={() => onPickFragment(i)}
                  />
                );
              })}
            </div>

          </React.Fragment>
        ))}
      </div>
    );
  }

  // The переизлучатель — a distinct block, not a regular fragment row.
  // Wider, decorative, with a hint that it is a special action.
  function PereizluchatelBlock() {
    return (
      <div style={{
        background: `linear-gradient(96deg, #EDE9F7 0%, #DFD7EF 100%)`,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        padding: "14px 16px",
        display: "grid", gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 12,
        boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
        fontFamily: "var(--font-base)",
      }}>
        <span style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "#fff", border: `1px solid ${C.border}`,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          color: C.magenta, flexShrink: 0,
        }}>
          <Icon name="media-repeat" size={16} color={C.magenta} />
        </span>
        <div style={{ minWidth: 0 }}>
          <div style={{
            color: C.muted, fontSize: 10, fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            Переизлучатель
          </div>
          <div style={{ color: C.navy, fontSize: 14, fontWeight: 600, marginTop: 2 }}>
            Блок переизлучения · отдельный режим
          </div>
          <div style={{ color: C.muted, fontSize: 12, marginTop: 1 }}>
            Не входит в плейлист Радостей. Запускается отдельно.
          </div>
        </div>
        <button style={{
          background: C.magenta, color: "#fff", border: "none",
          padding: "8px 14px", borderRadius: 999, cursor: "pointer",
          fontFamily: "var(--font-base)", fontSize: 12, fontWeight: 600,
          display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <Icon name="play" size={11} color="#fff" />
          запустить
        </button>
      </div>
    );
  }
})();
