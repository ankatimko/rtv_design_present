// App.jsx — 4-level «Полотна» service inside Сервисы
(function () {
  const { useState, useMemo } = React;
  const C = window.POLOTNA_C;

  const LIVE_TITLE = "Ритмомерные часы: Я при часах или часовой механизм";

  // Top-level service list, for the «Сервисы» breadcrumb dropdown.
  const SERVICE_SIBLINGS = [
    { id: "polotna",    label: "Полотна", active: true,  meta: "новое" },
    { id: "azbuka",     label: "Азбука ритмомер",         meta: "" },
    { id: "calendar",   label: "Вертикальный календарь",  meta: "" },
    { id: "bank",       label: "Банк Ритмовремени",       meta: "" },
    { id: "performance",label: "Спектакли «СТ‑эффект»",   meta: "" },
  ];

  function App() {
    const [navId, setNavId] = useState("services");
    const [tab, setTab] = useState("services");      // services | favorites
    const [route, setRoute] = useState({ level: 1 }); // L1..L4
    const [search, setSearch] = useState("");
    const [headerPlaying, setHeaderPlaying] = useState(true);
    const [favorites, setFavorites] = useState(() => {
      try { return new Set(JSON.parse(localStorage.getItem("polotna:favorites") || "[]")); }
      catch (e) { return new Set(); }
    });

    React.useEffect(() => {
      localStorage.setItem("polotna:favorites", JSON.stringify([...favorites]));
    }, [favorites]);

    const toggleFav = (id) => {
      setFavorites((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
      });
    };

    // Resolved data for the current route
    const themes = window.POLOTNA.themes;
    const theme  = route.themeId  ? window.findTheme(route.themeId)                          : null;
    const type   = route.typeId   ? window.findType(route.themeId, route.typeId)             : null;
    const canvas = route.canvasId ? window.findCanvas(route.themeId, route.typeId, route.canvasId) : null;

    // Navigators
    const goL1 = () => setRoute({ level: 1 });
    const goL2 = (themeId)  => setRoute({ level: 2, themeId });
    const goL3 = (typeId)   => setRoute((r) => ({ level: 3, themeId: r.themeId, typeId }));
    const goL3From = (themeId, typeId) => setRoute({ level: 3, themeId, typeId });
    const goL4 = (canvasId) => setRoute((r) => ({ level: 4, themeId: r.themeId, typeId: r.typeId, canvasId }));
    const goL4From = (themeId, typeId, canvasId) => setRoute({ level: 4, themeId, typeId, canvasId });

    const searchResults = useMemo(() => window.searchPolotna(search), [search]);
    const onSearchPick = (r) => {
      setSearch("");
      if (r.kind === "theme")  goL2(r.themeId);
      if (r.kind === "type")   setRoute({ level: 3, themeId: r.themeId, typeId: r.typeId });
      if (r.kind === "canvas") setRoute({ level: 4, themeId: r.themeId, typeId: r.typeId, canvasId: r.canvasId });
    };

    // ── Breadcrumb builder ──────────────────────────────────────────
    const crumbs = (() => {
      const list = [];

      // 1. Сервисы — list of services in this section
      list.push({
        label: "Сервисы",
        onSelf: () => { setNavId("services"); setRoute({ level: 1 }); setTab("services"); },
        siblings: SERVICE_SIBLINGS.map((s) => ({ label: s.label, active: s.id === "polotna", meta: s.meta, onPick: () => { setRoute({ level: 1 }); } })),
      });

      // 2. Полотна — L1 (this *is* the service)
      list.push({
        label: "Полотна",
        terminal: route.level === 1,
        onSelf: goL1,
      });

      if (route.level >= 2 && theme) {
        // 3. Полотна «<тема>» — sibling list = the 4 themes
        list.push({
          label: `Полотна «${theme.title}»`,
          terminal: route.level === 2,
          onSelf: () => goL2(theme.id),
          siblings: themes.map((th) => ({
            label: `Полотна «${th.title}»`,
            active: th.id === theme.id,
            meta: `${th.canvasCount}`,
            onPick: () => goL2(th.id),
          })),
        });
      }
      if (route.level >= 3 && type && theme) {
        list.push({
          label: type.title,
          terminal: route.level === 3,
          onSelf: () => goL3From(theme.id, type.id),
          siblings: theme.types.map((ty) => ({
            label: ty.title,
            active: ty.id === type.id,
            meta: `${ty.canvasCount}`,
            onPick: () => goL3From(theme.id, ty.id),
          })),
        });
      }
      if (route.level >= 4 && canvas && type && theme) {
        list.push({
          label: canvas.title,
          terminal: true,
          siblings: type.canvases.map((c) => ({
            label: c.title,
            active: c.id === canvas.id,
            meta: window.fmtTime(c.totalDuration),
            onPick: () => goL4From(theme.id, type.id, c.id),
          })),
        });
      }
      return list;
    })();

    // ── Hero header content per level ───────────────────────────────
    let heroTitle, heroRight, levelTag;
    if (route.level === 1) {
      heroTitle = "Полотна";
      levelTag = "Раздел";
    }
    if (route.level === 2 && theme) {
      heroTitle = `Полотна «${theme.title}»`;
      levelTag  = "Тема";
    }
    if (route.level === 3 && type) {
      heroTitle = type.title;
      levelTag  = "Тип полотен";
    }
    if (route.level === 4 && canvas) {
      heroTitle = canvas.title;
      levelTag  = "Полотно";
      const isFav = favorites.has(canvas.id);
      heroRight = (
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={() => toggleFav(canvas.id)} title={isFav ? "Убрать из избранного" : "В избранное"} style={{
            background: "rgba(255,255,255,0.85)", border: `1px solid ${C.border}`,
            width: 34, height: 34, borderRadius: "50%", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: isFav ? C.magenta : C.muted,
          }}>
            <Icon name={isFav ? "star" : "star-border"} size={18} color={isFav ? C.magenta : C.muted} />
          </button>
          <div style={{ textAlign: "right", lineHeight: 1.1 }}>
            <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Длительность</div>
            <div style={{ color: C.magenta, fontSize: 26, fontWeight: 700, fontVariantNumeric: "tabular-nums", marginTop: 2 }}>
              {window.fmtTime(canvas.totalDuration)}
            </div>
          </div>
        </div>
      );
    }

    // Sidebar nav setup (matches existing design system)
    const NAV = [
      { id: "schedule", label: "Расписание", icon: "home" },
      { id: "media",    label: "Медиатека",  icon: "play" },
      { id: "services", label: "Сервисы",    icon: "grid" },
      { id: "personal", label: "Личный кабинет", icon: "user" },
      { id: "notifications", label: "Лента Ритмособытий", icon: "bell", badge: 2 },
      { id: "payment",  label: "Оплата трансляций", icon: "buy" },
      { id: "books",    label: "Электронные книги", icon: "book", disabled: true },
    ];

    // Favorites tab content
    const favoriteCanvases = [];
    themes.forEach((th) => th.types.forEach((ty) => ty.canvases.forEach((c) => {
      if (favorites.has(c.id)) favoriteCanvases.push({ theme: th, type: ty, canvas: c });
    })));

    return (
      <div style={{ minHeight: "100vh", background: C.page, paddingTop: 90 }}>
        <Header
          player={<HeaderPlayer
            title="Скандинавская гимнастика (Утро) — Озарин июля 2020"
            time="7:23 / 15:26"
            playing={headerPlaying}
            onPlay={() => setHeaderPlaying(!headerPlaying)}
          />}
          user={<HeaderUser name={"Длинное имя\nДлинная фамилия"} avatar="assets/event.png" notifications={2} />}
        />

        <div style={{
          maxWidth: 1305, margin: "0 auto", padding: "0 24px",
          display: "flex", alignItems: "flex-start", gap: 16,
        }}>
          <Sidebar
            live={{ thumb: "assets/album-cover.png", title: LIVE_TITLE }}
            miniPlayer={{ thumb: "assets/home-live-brain.png", title: "Ритмомера «Извлечение пользы из страха. Пустот…»" }}
            nav={{ items: NAV, activeId: "services", onSelect: setNavId }}
          />

          <main style={{ flex: 1, minWidth: 0, paddingTop: 24, paddingBottom: 32 }}>
            <ServicesTabs value={tab} onChange={setTab} />

            {tab === "services" ? (
              <React.Fragment>
                <HeroCard
                  level={levelTag}
                  title={heroTitle}
                  rightContent={heroRight}
                  breadcrumbSegments={crumbs}
                  search={search}
                  onSearch={setSearch}
                  searchResults={searchResults}
                  onSearchPick={onSearchPick}
                />

                {route.level === 1 ? (
                  <LevelThemes themes={themes} onPick={goL2} />
                ) : null}
                {route.level === 2 && theme ? (
                  <LevelCanvasTypes theme={theme} onPick={goL3} />
                ) : null}
                {route.level === 3 && theme && type ? (
                  <LevelCanvases theme={theme} type={type} onPick={goL4} favorites={favorites} onToggleFav={toggleFav} />
                ) : null}
                {route.level === 4 && canvas ? (
                  <PracticePlayer canvas={canvas} isFav={favorites.has(canvas.id)} onToggleFav={() => toggleFav(canvas.id)} />
                ) : null}
              </React.Fragment>
            ) : (
              <FavoritesScreen items={favoriteCanvases} onOpen={(th, ty, c) => { setTab("services"); goL4From(th.id, ty.id, c.id); }} onToggleFav={toggleFav} />
            )}
          </main>
        </div>
      </div>
    );
  }

  function FavoritesScreen({ items, onOpen, onToggleFav }) {
    if (items.length === 0) {
      return (
        <div style={{
          background: "#fff", border: `1px solid ${C.border}`, borderRadius: 14,
          padding: "48px 24px", textAlign: "center",
        }}>
          <div style={{ display: "inline-flex", width: 52, height: 52, borderRadius: "50%", background: "rgba(229,0,109,0.10)", color: C.magenta, alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <Icon name="star-border" size={22} color={C.magenta} />
          </div>
          <h3 style={{ margin: 0, color: C.blue, fontSize: 20 }}>Пока пусто</h3>
          <p style={{ margin: "6px 0 0", color: C.muted, fontSize: 14 }}>Откройте любое полотно и нажмите ★, чтобы добавить его сюда.</p>
        </div>
      );
    }
    return (
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {items.map(({ theme, type, canvas }) => (
          <div key={canvas.id} onClick={() => onOpen(theme, type, canvas)} style={{
            background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12,
            padding: "14px 16px", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 12,
            fontFamily: "var(--font-base)",
          }}>
            <span style={{
              width: 36, height: 36, borderRadius: "50%",
              background: `linear-gradient(135deg, ${theme.grad[0]}, ${theme.grad[1]})`,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              color: "#fff", flexShrink: 0,
            }}><Icon name="play" size={14} color="#fff" /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: C.navy, fontSize: 15, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{canvas.title}</div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>
                «{theme.title}» › {type.title} · {window.fmtTime(canvas.totalDuration)}
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onToggleFav(canvas.id); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: C.magenta }}>
              <Icon name="star" size={18} color={C.magenta} />
            </button>
          </div>
        ))}
      </div>
    );
  }

  // Mount
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
})();
