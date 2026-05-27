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

  // ── L1 v2 — same screen with brighter brand-tuned tiles ─────────
  window.ScreenL1Bright = function ScreenL1Bright() {
    const crumbs = buildCrumbs({ level: 1 });
    return (
      <ScreenFrame>
        <HeroCard
          title="Полотна"
          breadcrumbSegments={crumbs}
          search="" onSearch={noop} searchResults={[]} onSearchPick={noop}
        />
        <LevelThemesBright themes={themes} onPick={noop} />
      </ScreenFrame>
    );
  };

  // ── L1 v3 — split: neutral left → brand colour right ────────────
  window.ScreenL1Split = function ScreenL1Split() {
    const crumbs = buildCrumbs({ level: 1 });
    return (
      <ScreenFrame>
        <HeroCard
          title="Полотна"
          breadcrumbSegments={crumbs}
          search="" onSearch={noop} searchResults={[]} onSearchPick={noop}
        />
        <LevelThemesSplit themes={themes} onPick={noop} />
      </ScreenFrame>
    );
  };

  // ── L1 v4 — soft pastel, in family with the rest of the site ────
  window.ScreenL1Soft = function ScreenL1Soft() {
    const crumbs = buildCrumbs({ level: 1 });
    return (
      <ScreenFrame>
        <HeroCard
          title="Полотна"
          breadcrumbSegments={crumbs}
          search="" onSearch={noop} searchResults={[]} onSearchPick={noop}
        />
        <LevelThemesSoft themes={themes} onPick={noop} />
      </ScreenFrame>
    );
  };

  // ── L1 v4b — soft pastel without cover illustrations ─────────────
  window.ScreenL1SoftPlain = function ScreenL1SoftPlain() {
    const crumbs = buildCrumbs({ level: 1 });
    return (
      <ScreenFrame>
        <HeroCard
          title="Полотна"
          breadcrumbSegments={crumbs}
          search="" onSearch={noop} searchResults={[]} onSearchPick={noop}
        />
        <LevelThemesSoftPlain themes={themes} onPick={noop} />
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

  // ── L4 v2 — Canvas player + right-side знакоряд chip cloud + active quote ─
  //   Adds an interactive schema panel on the right. The current playing
  //   fragment pulse-highlights both a знакоряд chip and a quote below.
  window.ScreenL4Matrix = function ScreenL4Matrix() {
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
        <CanvasPlayerWithMatrix canvas={canvas} />
      </ScreenFrame>
    );
  };

  // ── L4 v3 — «Всё о времени» variant with sectioned playlist + radastei matrix ─
  //   Playlist is split into three named sections; a "переизлучатель"
  //   block sits between sections 1 and 2 (not a regular fragment row).
  //   The matrix on the right pulses cell-by-cell as fragments advance.
  window.ScreenL4Time = function ScreenL4Time() {
    const theme  = window.findTheme("time");
    const type   = window.findType("time", "znak");
    const canvas = type.canvases[0]; // Знак минуты
    const crumbs = buildCrumbs({ level: 4, theme, type, canvas });

    // Split fragments into 3 sections by index range. Section titles
    // mirror the «Всё о времени» structure (Ладовид циклы / Кольцо Камней / Эго-я).
    const n = canvas.fragments.length;
    const a = Math.floor(n * 0.35);
    const b = Math.floor(n * 0.7);
    const sections = [
      { title: `Переизлучение названия «${canvas.title}» на циклах Ладовид`, range: [0, a] },
      { title: `Полотно времени для Кольца Камней на ЦиклоХладавит`,         range: [a, b] },
      { title: `Подкрутка для Эго-я`,                                         range: [b, n] },
    ];

    return (
      <ScreenFrame>
        <HeroCard
          title={canvas.title}
          breadcrumbSegments={crumbs}
          rightContent={<HeroFavRight canvas={canvas} />}
          search="" onSearch={noop} searchResults={[]} onSearchPick={noop}
        />
        <CanvasPlayerWithMatrixSections canvas={canvas} sections={sections} />
      </ScreenFrame>
    );
  };

  // ── L4 v4 — same as L4Time, but matrix cells fill fully and pulse by color only ─
  window.ScreenL4TimeFilled = function ScreenL4TimeFilled() {
    const theme  = window.findTheme("time");
    const type   = window.findType("time", "znak");
    const canvas = type.canvases[0];
    const crumbs = buildCrumbs({ level: 4, theme, type, canvas });

    const n = canvas.fragments.length;
    const a = Math.floor(n * 0.35);
    const b = Math.floor(n * 0.7);
    const sections = [
      { title: `Переизлучение названия «${canvas.title}» на циклах Ладовид`, range: [0, a] },
      { title: `Полотно времени для Кольца Камней на ЦиклоХладавит`,         range: [a, b] },
      { title: `Подкрутка для Эго-я`,                                         range: [b, n] },
    ];

    return (
      <ScreenFrame>
        <HeroCard
          title={canvas.title}
          breadcrumbSegments={crumbs}
          rightContent={<HeroFavRight canvas={canvas} />}
          search="" onSearch={noop} searchResults={[]} onSearchPick={noop}
        />
        <CanvasPlayerWithMatrixSections canvas={canvas} sections={sections} pulseStyle="filled" />
      </ScreenFrame>
    );
  };
  // ── L4 v5 — same as L4Time, but section 1 is the Pereizluchatel widget ─
  window.ScreenL4TimePereizluchatel = function ScreenL4TimePereizluchatel() {
    const theme  = window.findTheme("time");
    const type   = window.findType("time", "znak");
    const canvas = type.canvases[0];
    const crumbs = buildCrumbs({ level: 4, theme, type, canvas });

    const n = canvas.fragments.length;
    const a = Math.floor(n * 0.35);
    const b = Math.floor(n * 0.7);
    const sections = [
      { title: `Переизлучение названия «${canvas.title}» на циклах Ладовид`, range: [0, a] },
      { title: `Полотно времени для Кольца Камней на ЦиклоХладавит`,         range: [a, b] },
      { title: `Подкрутка для Эго-я`,                                         range: [b, n] },
    ];

    return (
      <ScreenFrame>
        <HeroCard
          title={canvas.title}
          breadcrumbSegments={crumbs}
          rightContent={<HeroFavRight canvas={canvas} />}
          search="" onSearch={noop} searchResults={[]} onSearchPick={noop}
        />
        <CanvasPlayerWithMatrixSections
          canvas={canvas}
          sections={sections}
          sectionWidgets={{ 0: <PereizluchatelWidget /> }}
        />
      </ScreenFrame>
    );
  };
  // ── L4 v6 — same as v5, but the Pereizluchatel uses windowed
  //   carousel (prev / active / next + fade Предыдущий / Следующий)
  window.ScreenL4TimePereizluchatelWindow = function ScreenL4TimePereizluchatelWindow() {
    const theme  = window.findTheme("time");
    const type   = window.findType("time", "znak");
    const canvas = type.canvases[0];
    const crumbs = buildCrumbs({ level: 4, theme, type, canvas });

    const n = canvas.fragments.length;
    const a = Math.floor(n * 0.35);
    const b = Math.floor(n * 0.7);
    const sections = [
      { title: `Переизлучение названия «${canvas.title}» на циклах Ладовид`, range: [0, a] },
      { title: `Полотно времени для Кольца Камней на ЦиклоХладавит`,         range: [a, b] },
      { title: `Подкрутка для Эго-я`,                                         range: [b, n] },
    ];

    return (
      <ScreenFrame>
        <HeroCard
          title={canvas.title}
          breadcrumbSegments={crumbs}
          rightContent={<HeroFavRight canvas={canvas} />}
          search="" onSearch={noop} searchResults={[]} onSearchPick={noop}
        />
        <CanvasPlayerWithMatrixSections
          canvas={canvas}
          sections={sections}
          sectionWidgets={{ 0: <PereizluchatelWidget variant="window" /> }}
        />
      </ScreenFrame>
    );
  };
})();
