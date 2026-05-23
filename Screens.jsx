// Screens.jsx — Static, non-navigating versions of each Полотна level.
//
// The original `Полотна.html` is a single dynamic interface that swaps the
// main pane as you drill in. This file presents the SAME four states as
// separate fixed screens — one artboard per level — so they can be compared
// side-by-side without any interaction. Callbacks are no-ops; data is fixed.
(function () {
  const C = window.POLOTNA_C;
  const themes = window.POLOTNA.themes;
  const noop = () => {};

  // Build a static breadcrumb chain for any level. No live navigation —
  // dropdowns still render so the chrome looks correct, but onPick is noop.
  function buildCrumbs({ theme, type, canvas, level }) {
    const list = [];
    list.push({
      label: "Сервисы",
      onSelf: noop,
      siblings: [
        { label: "Полотна",                  active: true,  meta: "новое", onPick: noop },
        { label: "Азбука ритмомер",          active: false, meta: "",      onPick: noop },
        { label: "Вертикальный календарь",   active: false, meta: "",      onPick: noop },
        { label: "Банк Ритмовремени",        active: false, meta: "",      onPick: noop },
        { label: "Спектакли «СТ‑эффект»",    active: false, meta: "",      onPick: noop },
      ],
    });
    list.push({ label: "Полотна", terminal: level === 1, onSelf: noop });
    if (level >= 2 && theme) {
      list.push({
        label: `Полотна «${theme.title}»`,
        terminal: level === 2,
        onSelf: noop,
        siblings: themes.map((th) => ({ label: `Полотна «${th.title}»`, active: th.id === theme.id, meta: `${th.canvasCount}`, onPick: noop })),
      });
    }
    if (level >= 3 && type && theme) {
      list.push({
        label: type.title,
        terminal: level === 3,
        onSelf: noop,
        siblings: theme.types.map((ty) => ({ label: ty.title, active: ty.id === type.id, meta: `${ty.canvasCount}`, onPick: noop })),
      });
    }
    if (level >= 4 && canvas && type) {
      list.push({
        label: canvas.title,
        terminal: true,
        siblings: type.canvases.map((c) => ({ label: c.title, active: c.id === canvas.id, meta: window.fmtTime(c.totalDuration), onPick: noop })),
      });
    }
    return list;
  }

  // Optional: a fixed "Избранное" star block for the L4 hero right side
  function HeroFavRight({ canvas }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button style={{
          background: "rgba(255,255,255,0.85)", border: `1px solid ${C.border}`,
          width: 34, height: 34, borderRadius: "50%", cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          color: C.muted,
        }}><Icon name="star-border" size={18} color={C.muted} /></button>
        <div style={{ textAlign: "right", lineHeight: 1.1 }}>
          <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Длительность</div>
          <div style={{ color: C.magenta, fontSize: 26, fontWeight: 700, fontVariantNumeric: "tabular-nums", marginTop: 2 }}>
            {window.fmtTime(canvas.totalDuration)}
          </div>
        </div>
      </div>
    );
  }

  // Tabs row — purely visual, no state. Sits above the hero like in the real app.
  function StaticTabs() {
    const items = [
      { id: "services",  label: "Сервисы",   active: true  },
      { id: "favorites", label: "Избранное", active: false },
    ];
    return (
      <div style={{ display: "flex", borderBottom: `2px solid ${C.border}`, marginBottom: 12, gap: 4 }}>
        {items.map((it) => (
          <button key={it.id} style={{
            background: "none", border: "none",
            padding: "8px 14px 10px",
            fontFamily: "var(--font-base)", fontSize: 14,
            fontWeight: it.active ? 700 : 500,
            color: it.active ? C.navy : C.muted,
            cursor: "default", position: "relative",
            borderBottom: it.active ? `2px solid ${C.magenta}` : "2px solid transparent",
            marginBottom: -2,
          }}>{it.label}</button>
        ))}
      </div>
    );
  }

  // ── A common wrapper that gives each screen the page background + padding ──
  function ScreenFrame({ children }) {
    return (
      <div style={{
        background: C.page, padding: 24,
        fontFamily: "var(--font-base)", color: C.navy,
        minHeight: "100%", boxSizing: "border-box",
      }}>
        <StaticTabs />
        {children}
      </div>
    );
  }

  // ── L1 — Полотна (root of the service) ───────────────────────────
  window.ScreenL1 = function ScreenL1() {
    const crumbs = buildCrumbs({ level: 1 });
    return (
      <ScreenFrame>
        <HeroCard
          title="Полотна"
          breadcrumbSegments={crumbs}
          search="" onSearch={noop} searchResults={[]} onSearchPick={noop}
        />
        <LevelThemes themes={themes} onPick={noop} />
      </ScreenFrame>
    );
  };

  // ── L2 — Полотна «Всё об энергии» ────────────────────────────────
  window.ScreenL2 = function ScreenL2() {
    const theme = window.findTheme("energy");
    const crumbs = buildCrumbs({ level: 2, theme });
    return (
      <ScreenFrame>
        <HeroCard
          title={`Полотна «${theme.title}»`}
          breadcrumbSegments={crumbs}
          search="" onSearch={noop} searchResults={[]} onSearchPick={noop}
        />
        <LevelCanvasTypes theme={theme} onPick={noop} />
      </ScreenFrame>
    );
  };

  // ── L3 — Знаковые полотна (under Всё об энергии) ─────────────────
  window.ScreenL3 = function ScreenL3() {
    const theme = window.findTheme("energy");
    const type  = window.findType("energy", "znak");
    const crumbs = buildCrumbs({ level: 3, theme, type });
    return (
      <ScreenFrame>
        <HeroCard
          title={type.title}
          breadcrumbSegments={crumbs}
          search="" onSearch={noop} searchResults={[]} onSearchPick={noop}
        />
        <LevelCanvases theme={theme} type={type} onPick={noop} favorites={new Set()} onToggleFav={noop} />
      </ScreenFrame>
    );
  };

  // ── L3 — Same screen, with the terminal-segment dropdown forced open ──
  //   Variant for documentation / handoff so the open menu state can be
  //   reviewed without interacting. Identical to ScreenL3 otherwise.
  window.ScreenL3DropdownOpen = function ScreenL3DropdownOpen() {
    const theme = window.findTheme("energy");
    const type  = window.findType("energy", "znak");
    const crumbs = buildCrumbs({ level: 3, theme, type });
    // Mark the terminal (last) segment to render with its dropdown pre-opened.
    crumbs[crumbs.length - 1] = { ...crumbs[crumbs.length - 1], defaultOpen: true };
    return (
      <ScreenFrame>
        <HeroCard
          title={type.title}
          breadcrumbSegments={crumbs}
          search="" onSearch={noop} searchResults={[]} onSearchPick={noop}
        />
        <LevelCanvases theme={theme} type={type} onPick={noop} favorites={new Set()} onToggleFav={noop} />
      </ScreenFrame>
    );
  };

  // ── L4 — Single canvas player ─────────────────────────────────────
  window.ScreenL4 = function ScreenL4() {
    const theme  = window.findTheme("energy");
    const type   = window.findType("energy", "znak");
    const canvas = window.findCanvas("energy", "znak", "zn-body-podskazka");
    const crumbs = buildCrumbs({ level: 4, theme, type, canvas });
    return (
      <ScreenFrame>
        <HeroCard
          title={canvas.title}
          breadcrumbSegments={crumbs}
          rightContent={<HeroFavRight canvas={canvas} />}
          search="" onSearch={noop} searchResults={[]} onSearchPick={noop}
        />
        <PracticePlayer canvas={canvas} isFav={false} onToggleFav={noop} />
      </ScreenFrame>
    );
  };
})();
