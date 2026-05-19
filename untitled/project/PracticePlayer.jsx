// PracticePlayer.jsx — L4 single seamless practice player + chapter index
(function () {
  const { useState, useEffect, useRef, useMemo } = React;
  const C = window.POLOTNA_C;

  function findFragmentAt(fragments, sec) {
    let acc = 0;
    for (let i = 0; i < fragments.length; i++) {
      const f = fragments[i];
      if (sec < acc + f.duration) {
        return { index: i, fragment: f, localStart: acc, localEnd: acc + f.duration };
      }
      acc += f.duration;
    }
    return { index: fragments.length - 1, fragment: fragments[fragments.length - 1], localStart: acc - fragments[fragments.length - 1].duration, localEnd: acc };
  }

  function fragmentStartOffsets(fragments) {
    const offs = [];
    let acc = 0;
    fragments.forEach((f) => { offs.push(acc); acc += f.duration; });
    return offs;
  }

  window.PracticePlayer = function PracticePlayer({ canvas, isFav, onToggleFav }) {
    const total = canvas.totalDuration;
    const offsets = useMemo(() => fragmentStartOffsets(canvas.fragments), [canvas.id]);
    const storageKey = `polotna:pos:${canvas.id}`;
    const listenedKey = `polotna:listened:${canvas.id}`;

    // Restore position
    const [position, setPosition] = useState(() => {
      const v = Number(localStorage.getItem(storageKey) || 0);
      return Number.isFinite(v) && v >= 0 && v < total ? v : 0;
    });
    const [playing, setPlaying] = useState(false);
    const [volume, setVolume] = useState(0.7);
    const [showVolume, setShowVolume] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    // Listened-fragment set, persisted.
    const [listened, setListened] = useState(() => {
      try {
        const raw = JSON.parse(localStorage.getItem(listenedKey) || "[]");
        return new Set(raw);
      } catch (e) { return new Set(); }
    });

    // Persist position (debounced via rAF effect)
    useEffect(() => {
      const t = setTimeout(() => localStorage.setItem(storageKey, String(position)), 250);
      return () => clearTimeout(t);
    }, [position, storageKey]);

    // Persist listened set
    useEffect(() => {
      localStorage.setItem(listenedKey, JSON.stringify([...listened]));
    }, [listened, listenedKey]);

    // Tick playback
    useEffect(() => {
      if (!playing) return;
      let last = performance.now();
      let rafId;
      const tick = (t) => {
        const dt = (t - last) / 1000;
        last = t;
        setPosition((p) => {
          const next = p + dt;
          if (next >= total) {
            setPlaying(false);
            return total;
          }
          return next;
        });
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(rafId);
    }, [playing, total]);

    // Mark fragment as listened when we leave it (current crosses its end).
    useEffect(() => {
      const { index } = findFragmentAt(canvas.fragments, Math.min(position, total - 0.01));
      // mark all earlier fragments as listened
      setListened((prev) => {
        let changed = false;
        const next = new Set(prev);
        for (let i = 0; i < index; i++) {
          if (!next.has(canvas.fragments[i].id)) { next.add(canvas.fragments[i].id); changed = true; }
        }
        // if we're at the very end, include the last one too
        if (position >= total - 0.001 && !next.has(canvas.fragments[index].id)) {
          next.add(canvas.fragments[index].id); changed = true;
        }
        return changed ? next : prev;
      });
    }, [position, canvas.id, total]);

    const current = findFragmentAt(canvas.fragments, Math.min(position, total - 0.001));

    const seekTo = (sec) => {
      setPosition(Math.max(0, Math.min(total, sec)));
    };
    const seekToFragment = (i) => seekTo(offsets[i]);
    const rewind  = () => seekTo(position - 10);
    const forward = () => seekTo(position + 10);
    const playPause = () => setPlaying((p) => !p);
    const restart = () => { seekTo(0); setPlaying(true); };
    const continueLast = () => setPlaying(true);

    const listenedCount = canvas.fragments.filter((f) => listened.has(f.id) || (current.fragment.id === f.id && position > current.localStart + 0.5)).length;

    const pct = (position / total) * 100;
    const canResume = position > 1 && position < total - 0.5;

    return (
      <React.Fragment>
        {/* ── Main player card ────────────────────────────────────── */}
        <div style={{
          background: "#fff", borderRadius: 10, border: `1px solid ${C.border}`,
          padding: "14px 18px 12px", marginBottom: 12,
          boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Big play */}
            <button onClick={playPause} title={playing ? "Пауза" : "Воспроизвести"} style={{
              width: 48, height: 48, borderRadius: "50%",
              background: C.magenta, border: "none", cursor: "pointer",
              color: "#fff",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 6px 14px rgba(229,0,109,0.30)",
              flexShrink: 0,
              transition: ".15s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
            >
              <Icon name={playing ? "pause" : "play"} size={20} color="#fff" />
            </button>

            {/* Rewind / forward / volume */}
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <RoundIcon title="−10 сек" onClick={rewind} icon="media-prev" />
              <RoundIcon title="+10 сек" onClick={forward} icon="media-next" />
              <div style={{ position: "relative" }}>
                <RoundIcon title="Громкость" onClick={() => setShowVolume((s) => !s)} icon={volume === 0 ? "media-mix" : "media-volume"} />
                {showVolume ? (
                  <div style={{
                    position: "absolute", top: "110%", left: "50%", transform: "translateX(-50%)",
                    background: "#fff", border: `1px solid ${C.border}`, borderRadius: 10,
                    padding: "12px 14px", boxShadow: "0 12px 32px rgba(10,39,74,0.16)",
                    width: 160, zIndex: 5,
                  }}>
                    <input type="range" min="0" max="1" step="0.01" value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      style={{ width: "100%", accentColor: C.magenta }} />
                    <div style={{ fontSize: 11, color: C.muted, textAlign: "right", marginTop: 2 }}>{Math.round(volume * 100)}%</div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Timecode + current fragment */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: playing ? C.magenta : "rgba(138,143,163,0.6)" }} />
                {playing ? "сейчас играет" : "пауза"}
                <span style={{ color: "rgba(138,143,163,0.6)" }}>·</span>
                <span style={{ color: C.muted }}>фрагмент {current.index + 1} из {canvas.fragments.length}</span>
              </div>
              <div style={{ color: C.navy, fontSize: 14, fontWeight: 600, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {current.fragment.title}
              </div>
            </div>

            {/* Timecodes */}
            <div style={{ textAlign: "right", color: C.navy, fontVariantNumeric: "tabular-nums", fontSize: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: C.magenta }}>{window.fmtTime(position)}</div>
              <div style={{ color: C.muted, fontSize: 11 }}>из {window.fmtTime(total)}</div>
            </div>
          </div>

          {/* Timeline */}
          <Timeline
            position={position} total={total} pct={pct}
            offsets={offsets} fragments={canvas.fragments}
            current={current}
            onSeek={seekTo}
          />

          {/* Progress + continue */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
            <div style={{ fontSize: 13, color: C.muted, display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Icon name="check" size={14} color={C.magenta} />
              <span>прослушано <span style={{ color: C.navy, fontWeight: 600 }}>{listenedCount}</span> из <span style={{ color: C.navy, fontWeight: 600 }}>{canvas.fragments.length}</span> фрагментов</span>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              {canResume && !playing ? (
                <button onClick={continueLast} style={ctaBtn(C.magenta, "#fff")}>
                  <Icon name="play" size={14} color="#fff" />
                  Продолжить с {window.fmtTime(position)}
                </button>
              ) : null}
              <button onClick={restart} style={ctaBtn("transparent", C.blue, `1px solid ${C.border}`)}>
                <Icon name="media-repeat" size={14} color={C.blue} />
                С начала
              </button>
            </div>
          </div>
        </div>

        {/* ── Chapter index ─────────────────────────────────────────── */}
        <div style={{
          background: "#fff", borderRadius: 10, border: `1px solid ${C.border}`,
          boxShadow: "0 1px 0 rgba(10,39,74,0.04)",
          overflow: "hidden",
        }}>
          <button onClick={() => setCollapsed((c) => !c)} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            width: "100%", padding: "10px 16px", background: "transparent", border: "none",
            cursor: "pointer", fontFamily: "var(--font-base)",
            borderBottom: collapsed ? "none" : `1px solid ${C.border}`,
          }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: C.navy, fontSize: 14, fontWeight: 600 }}>
              <Icon name="heading" size={14} color={C.blue} />
              Оглавление практики
              <span style={{ color: C.muted, fontWeight: 400, fontSize: 12 }}>· {canvas.fragments.length} фрагментов</span>
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.blue, fontSize: 12, fontWeight: 500 }}>
              {collapsed ? "Развернуть оглавление" : "Свернуть оглавление"}
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: 18, height: 18, borderRadius: 4,
                background: "rgba(27,63,216,0.08)", color: C.blue,
                transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: ".15s",
                fontSize: 9,
              }}>▾</span>
            </span>
          </button>

          {!collapsed ? (
            <div role="list">
              {canvas.fragments.map((f, i) => {
                const isCurrent = i === current.index;
                const isDone = listened.has(f.id) || (isCurrent && position >= current.localEnd - 0.01);
                return (
                  <div role="listitem" key={f.id} onClick={() => seekToFragment(i)} style={{
                    display: "grid", gridTemplateColumns: "36px 1fr auto auto", alignItems: "center", gap: 12,
                    padding: "6px 16px",
                    cursor: "pointer",
                    background: isCurrent ? "rgba(229,0,109,0.06)" : "#fff",
                    borderBottom: i < canvas.fragments.length - 1 ? `1px solid ${C.border}` : "none",
                    transition: ".12s",
                    fontFamily: "var(--font-base)",
                    minHeight: 32,
                  }}
                  onMouseEnter={(e) => { if (!isCurrent) e.currentTarget.style.background = "#FAF8FE"; }}
                  onMouseLeave={(e) => { if (!isCurrent) e.currentTarget.style.background = "#fff"; }}
                  >
                    <div style={{ position: "relative", textAlign: "center" }}>
                      {isCurrent ? (
                        <span style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 22, height: 22, borderRadius: "50%",
                          background: C.magenta, color: "#fff",
                        }}>
                          <Icon name={playing ? "pause" : "play"} size={10} color="#fff" />
                        </span>
                      ) : (
                        <span style={{
                          display: "inline-block", color: isDone ? C.magenta : C.muted,
                          fontSize: 12, fontVariantNumeric: "tabular-nums", fontWeight: 500,
                        }}>{String(i + 1).padStart(2, "0")}</span>
                      )}
                    </div>
                    <div style={{
                      color: isCurrent ? C.magenta : C.navy,
                      fontSize: 13, fontWeight: isCurrent ? 600 : 400,
                      lineHeight: "18px",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{f.title}</div>
                    <div style={{ color: isDone ? C.magenta : "transparent", fontSize: 11, display: "inline-flex", alignItems: "center", gap: 3 }}>
                      {isDone ? <React.Fragment><Icon name="check" size={11} color={C.magenta} /> прослушано</React.Fragment> : "·"}
                    </div>
                    <div style={{ color: isCurrent ? C.magenta : C.muted, fontSize: 12, fontVariantNumeric: "tabular-nums", minWidth: 36, textAlign: "right" }}>
                      {window.fmtTime(f.duration)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      </React.Fragment>
    );
  };

  // ── Sub-component: Timeline ─────────────────────────────────────
  function Timeline({ position, total, pct, offsets, fragments, current, onSeek }) {
    const ref = useRef(null);
    const [hover, setHover] = useState(null);

    const onClick = (e) => {
      const r = ref.current.getBoundingClientRect();
      const x = e.clientX - r.left;
      onSeek((x / r.width) * total);
    };
    const onMove = (e) => {
      const r = ref.current.getBoundingClientRect();
      const x = e.clientX - r.left;
      setHover({ x, sec: (x / r.width) * total });
    };

    return (
      <div style={{ position: "relative", marginTop: 16, paddingTop: 10, paddingBottom: 6 }}>
        <div
          ref={ref}
          onClick={onClick}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          style={{
            position: "relative", height: 18,
            cursor: "pointer",
          }}
        >
          {/* track */}
          <div style={{
            position: "absolute", left: 0, right: 0, top: 7,
            height: 4, borderRadius: 2,
            background: "rgba(138,143,163,0.20)",
          }} />
          {/* played */}
          <div style={{
            position: "absolute", left: 0, top: 7,
            width: `${pct}%`, height: 4, borderRadius: 2,
            background: `linear-gradient(90deg, ${C.magenta} 0%, #FF4D8F 100%)`,
            transition: "width .08s linear",
          }} />
          {/* hover preview */}
          {hover ? (
            <div style={{
              position: "absolute", left: hover.x, top: -22, transform: "translateX(-50%)",
              padding: "2px 6px", borderRadius: 4,
              background: "rgba(10,39,74,0.85)", color: "#fff",
              fontSize: 11, fontVariantNumeric: "tabular-nums",
              pointerEvents: "none", whiteSpace: "nowrap",
            }}>{window.fmtTime(hover.sec)}</div>
          ) : null}
          {/* fragment ticks */}
          {offsets.map((off, i) => {
            if (i === 0) return null;
            const left = (off / total) * 100;
            const past = off <= position;
            return (
              <span key={i} style={{
                position: "absolute", left: `${left}%`, top: 5,
                width: 1, height: 8,
                background: past ? "rgba(255,255,255,0.85)" : "rgba(10,39,74,0.25)",
                transform: "translateX(-0.5px)",
                pointerEvents: "none",
              }} />
            );
          })}
          {/* playhead */}
          <span style={{
            position: "absolute", left: `${pct}%`, top: 1,
            width: 16, height: 16, borderRadius: "50%",
            background: "#fff", border: `3px solid ${C.magenta}`,
            transform: "translateX(-50%)",
            boxShadow: "0 2px 8px rgba(229,0,109,0.35)",
            pointerEvents: "none",
            transition: "left .08s linear",
          }} />
        </div>
        {/* timecode strip */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, color: C.muted, fontSize: 11, fontVariantNumeric: "tabular-nums" }}>
          <span>0:00</span>
          <span>{window.fmtTime(total / 2)}</span>
          <span>{window.fmtTime(total)}</span>
        </div>
      </div>
    );
  }

  function RoundIcon({ icon, onClick, title }) {
    return (
      <button onClick={onClick} title={title} style={{
        width: 36, height: 36, borderRadius: "50%",
        background: "rgba(27,63,216,0.06)", border: "none", cursor: "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        color: C.blue, transition: ".15s",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(27,63,216,0.12)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(27,63,216,0.06)"; }}
      >
        <Icon name={icon} size={16} color={C.blue} />
      </button>
    );
  }

  function ctaBtn(bg, color, border) {
    return {
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "8px 14px", borderRadius: 999,
      background: bg, color, border: border || "none",
      fontFamily: "var(--font-base)", fontSize: 13, fontWeight: 600,
      cursor: "pointer", transition: ".15s",
    };
  }
})();
