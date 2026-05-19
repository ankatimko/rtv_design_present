// Screens.jsx — composed News / Notifications pages, v2.
(function () {
  const { useState, useMemo } = React;

  function useFeedState(seedNews, seedNotifs) {
    const [news, setNews] = useState(seedNews);
    const [notifs, setNotifs] = useState(seedNotifs);

    const counts = {
      news: news.length,
      notifications: notifs.length,
    };
    const unread = {
      news: news.filter((i) => i.unread).length,
      notifications: notifs.filter((i) => i.unread).length,
    };
    const popoverItems = useMemo(() => {
      // Merge notifications + news teaser → newest first, capped to 5
      const merged = [
        ...notifs.map((n) => ({ ...n })),
      ];
      // sort by date+time desc-ish (date string DD.MM.YYYY)
      merged.sort((a, b) => {
        const ka = a.date.split(".").reverse().join("") + a.time.replace(":", "");
        const kb = b.date.split(".").reverse().join("") + b.time.replace(":", "");
        return kb.localeCompare(ka);
      });
      return merged.slice(0, 5);
    }, [notifs]);

    const markNewsRead   = (id) => setNews((c)   => c.map((i) => i.id === id ? { ...i, unread: false } : i));
    const markNotifRead  = (id) => setNotifs((c) => c.map((i) => i.id === id ? { ...i, unread: false } : i));
    const markAllNotifs  = ()   => setNotifs((c) => c.map((i) => ({ ...i, unread: false })));
    const markAllNews    = ()   => setNews((c)   => c.map((i) => ({ ...i, unread: false })));

    return {
      news, notifs, counts, unread, popoverItems,
      markNewsRead, markNotifRead, markAllNotifs, markAllNews,
    };
  }

  // ── Desktop shell (header + sidebar + main column) ───────────────
  function DesktopShell({ activeTab, setActiveTab, counts, bellOpen, setBellOpen, unreadTotal, popoverItems, onItemClick, onMarkAllPopover, title, subtitle, children }) {
    return (
      <div
        data-screen-label="Desktop · News & Notifications"
        style={{
          width: "100%", height: "100%",
          background: "var(--c-bg)",
          display: "flex", flexDirection: "column",
          fontFamily: "var(--font-base)", color: "var(--c-text)",
          overflow: "hidden", position: "relative",
        }}
      >
        <BrandHeader
          bell={
            <div style={{ position: "relative" }}>
              <BellButton
                unreadCount={unreadTotal}
                open={bellOpen}
                onToggle={() => setBellOpen((v) => !v)}
              />
              {bellOpen ? (
                <div style={{ position: "absolute", top: 56, right: -8, zIndex: 50 }}>
                  <span style={{
                    position: "absolute", top: -7, right: 20,
                    width: 14, height: 14, background: "#fff",
                    transform: "rotate(45deg)",
                    borderLeft: "1px solid var(--c-border)",
                    borderTop: "1px solid var(--c-border)",
                  }} />
                  <BellPopover
                    items={popoverItems}
                    onItemClick={onItemClick}
                    onMarkAll={onMarkAllPopover}
                    onSeeAll={() => { setBellOpen(false); setActiveTab("notifications"); }}
                  />
                </div>
              ) : null}
            </div>
          }
        />

        <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "0 24px", overflowY: "auto" }}>
          <div style={{ display: "flex", gap: 16, maxWidth: 1305, width: "100%", alignItems: "flex-start" }}>
            <MiniSidebar activeId="news" />
            <main style={{ flex: 1, minWidth: 0, padding: "24px 0 48px" }}>
              {/* Page header */}
              <div style={{ marginBottom: 18 }}>
                <h1 style={{
                  margin: 0, fontSize: 30, lineHeight: "36px",
                  color: "var(--c-blue)", fontWeight: 700, letterSpacing: ".005em",
                }}>{title}</h1>
                <p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--c-gray)" }}>{subtitle}</p>
              </div>

              <PageTabs value={activeTab} onChange={setActiveTab} counts={counts} />
              {children}
            </main>
          </div>
        </div>
      </div>
    );
  }

  // ── Desktop screen ───────────────────────────────────────────────
  window.DesktopFeed = function DesktopFeed({ initialTab = "news", openBell = false, allRead = false }) {
    const seedN = allRead
      ? window.SAMPLE_NEWS.map((i) => ({ ...i, unread: false }))
      : window.SAMPLE_NEWS;
    const seedU = allRead
      ? window.SAMPLE_NOTIFICATIONS.map((i) => ({ ...i, unread: false }))
      : window.SAMPLE_NOTIFICATIONS;
    const s = useFeedState(seedN, seedU);
    const [tab, setTab] = useState(initialTab);
    const [bellOpen, setBellOpen] = useState(openBell);

    const unreadTotal = s.unread.notifications;
    const title = tab === "news" ? "Новости" : "Уведомления";
    const subtitle = tab === "news"
      ? "Анонсы, обновления и события Ритмовремя‑ТВ"
      : "Напоминания и ответы по вашим подпискам";

    return (
      <DesktopShell
        activeTab={tab}
        setActiveTab={setTab}
        counts={s.counts}
        bellOpen={bellOpen}
        setBellOpen={setBellOpen}
        unreadTotal={unreadTotal}
        popoverItems={s.popoverItems}
        onItemClick={(it) => s.markNotifRead(it.id)}
        onMarkAllPopover={s.markAllNotifs}
        title={title}
        subtitle={subtitle}
      >
        {tab === "news" ? (
          <NewsListDesktop
            items={s.news}
            unread={s.unread.news}
            onMarkAll={s.markAllNews}
            onItemClick={s.markNewsRead}
          />
        ) : (
          <NotificationsListDesktop
            items={s.notifs}
            unread={s.unread.notifications}
            onMarkAll={s.markAllNotifs}
            onItemClick={s.markNotifRead}
          />
        )}
      </DesktopShell>
    );
  };

  function NewsListDesktop({ items, unread, onMarkAll, onItemClick }) {
    if (items.length === 0) return <EmptyState label="Новостей пока нет" />;
    const [hero, ...rest] = items;
    return (
      <React.Fragment>
        <StatusBanner unreadCount={unread} total={items.length} onMarkAll={onMarkAll} />
        <HeroNewsCard item={hero} onClick={() => onItemClick(hero.id)} />
        {rest.map((item) => (
          <NewsCard key={item.id} item={item} onClick={() => onItemClick(item.id)} />
        ))}
        <LoadMore />
      </React.Fragment>
    );
  }

  function NotificationsListDesktop({ items, unread, onMarkAll, onItemClick }) {
    if (items.length === 0) return <EmptyState label="Уведомлений пока нет" />;
    return (
      <React.Fragment>
        <StatusBanner unreadCount={unread} total={items.length} onMarkAll={onMarkAll} />
        {items.map((item) => (
          <NotificationRow key={item.id} item={item} onClick={() => onItemClick(item.id)} />
        ))}
        <LoadMore />
      </React.Fragment>
    );
  }

  function LoadMore() {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "24px 0 8px" }}>
        <button style={{
          background: "transparent",
          border: "1px solid var(--c-border)",
          color: "var(--c-light-blue)",
          padding: "10px 28px", borderRadius: "var(--radius)",
          fontFamily: "var(--font-base)", fontSize: 13, fontWeight: 700,
          fontVariant: "small-caps", textTransform: "lowercase", letterSpacing: ".04em",
          cursor: "pointer", transition: ".2s",
        }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--c-bg-blue)";
            e.currentTarget.style.borderColor = "var(--c-light-blue)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "var(--c-border)";
          }}
        >
          показать ещё
        </button>
      </div>
    );
  }

  function EmptyState({ label }) {
    return (
      <div style={{
        padding: "100px 24px", textAlign: "center", color: "var(--c-gray)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
        background: "#fff", border: "1px solid var(--c-border)",
        borderRadius: "var(--radius)",
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%",
          background: "var(--c-bg-blue)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="check" size={28} color="var(--c-light-blue)" />
        </div>
        <div style={{ fontSize: 18, color: "var(--c-blue)", fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 14, color: "var(--c-gray)", maxWidth: 360, lineHeight: "21px" }}>
          Когда что‑то опубликуют — публикация появится здесь.
        </div>
      </div>
    );
  }

  // ── Mobile screen ────────────────────────────────────────────────
  window.MobileFeed = function MobileFeed({ initialTab = "news", openBell = false, allRead = false }) {
    const seedN = allRead
      ? window.SAMPLE_NEWS.map((i) => ({ ...i, unread: false }))
      : window.SAMPLE_NEWS;
    const seedU = allRead
      ? window.SAMPLE_NOTIFICATIONS.map((i) => ({ ...i, unread: false }))
      : window.SAMPLE_NOTIFICATIONS;
    const s = useFeedState(seedN, seedU);
    const [tab, setTab] = useState(initialTab);
    const [bellOpen, setBellOpen] = useState(openBell);

    const unreadTotal = s.unread.notifications;
    const title = tab === "news" ? "Новости" : "Уведомления";
    const subtitle = tab === "news"
      ? "Анонсы и события Ритмовремя‑ТВ"
      : "Напоминания по подпискам";

    return (
      <div
        data-screen-label="Mobile · News & Notifications"
        style={{
          width: "100%", height: "100%",
          background: "var(--c-bg)",
          display: "flex", flexDirection: "column",
          fontFamily: "var(--font-base)", color: "var(--c-text)",
          overflow: "hidden", position: "relative",
        }}
      >
        <MobileTopbar
          title={title}
          subtitle={subtitle}
          bell={
            <BellButton
              unreadCount={unreadTotal}
              open={bellOpen}
              onToggle={() => setBellOpen((v) => !v)}
            />
          }
        />

        <div style={{ background: "#fff" }}>
          <PageTabs value={tab} onChange={setTab} counts={s.counts} mobile />
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px 16px" }}>
          {tab === "news" ? (
            s.news.length === 0 ? <EmptyState label="Новостей пока нет" /> : (
              <React.Fragment>
                <StatusBanner unreadCount={s.unread.news} total={s.news.length} onMarkAll={s.markAllNews} />
                {/* On mobile, hero collapses to top news card with image */}
                {s.news.map((item) => (
                  item.image ? (
                    <HeroNewsCard key={item.id} item={item} mobile onClick={() => s.markNewsRead(item.id)} />
                  ) : (
                    <NewsCard key={item.id} item={item} mobile onClick={() => s.markNewsRead(item.id)} />
                  )
                ))}
              </React.Fragment>
            )
          ) : (
            s.notifs.length === 0 ? <EmptyState label="Уведомлений пока нет" /> : (
              <React.Fragment>
                <StatusBanner unreadCount={s.unread.notifications} total={s.notifs.length} onMarkAll={s.markAllNotifs} />
                {s.notifs.map((item) => (
                  <NotificationRow key={item.id} item={item} mobile onClick={() => s.markNotifRead(item.id)} />
                ))}
              </React.Fragment>
            )
          )}
        </div>

        <MobileTabBar active="news" />

        {bellOpen ? (
          <div
            onClick={() => setBellOpen(false)}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(10,39,74,.55)",
              backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
              zIndex: 40,
              display: "flex", flexDirection: "column",
            }}
          >
            <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 64 }}>
              <BellPopover
                items={s.popoverItems}
                mobile
                onItemClick={(it) => { s.markNotifRead(it.id); setBellOpen(false); }}
                onMarkAll={s.markAllNotifs}
                onSeeAll={() => { setBellOpen(false); setTab("notifications"); }}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  };
})();
