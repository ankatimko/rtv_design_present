// Screens.jsx — composed pages mounted inside design-canvas artboards.
(function () {
  const { useState, useMemo } = React;

  // Shared state hook: items + tab + filtering + read-state mutations.
  function useNotificationsState(initialItems) {
    const [items, setItems] = useState(initialItems);
    const [tab, setTab] = useState("all");
    const [from, setFrom] = useState("20.07.2019");
    const [to, setTo] = useState("23.07.2020");

    const counts = useMemo(() => ({
      all: items.length,
      notifications: items.filter((i) => i.type === "notification").length,
      news: items.filter((i) => i.type === "news").length,
    }), [items]);

    const filtered = useMemo(() => items.filter((n) =>
      tab === "all" ? true : tab === "notifications" ? n.type === "notification" : n.type === "news"
    ), [items, tab]);

    const unreadCount = items.filter((i) => i.unread).length;

    const markRead = (id) => setItems((curr) => curr.map((i) => i.id === id ? { ...i, unread: false } : i));
    const markAll  = ()   => setItems((curr) => curr.map((i) => ({ ...i, unread: false })));

    return { items, tab, setTab, from, to, setFrom, setTo, counts, filtered, unreadCount, markRead, markAll };
  }

  // ── Desktop page ─────────────────────────────────────────────────
  window.DesktopNotifications = function DesktopNotifications({ openBell = false, empty = false }) {
    const seed = empty
      ? window.SAMPLE_ITEMS.map((i) => ({ ...i, unread: false }))
      : window.SAMPLE_ITEMS;
    const s = useNotificationsState(seed);
    const [bellOpen, setBellOpen] = useState(openBell);

    // Up to 5 most-recent items in the popover, unread-first.
    const popoverItems = useMemo(() => {
      const sorted = [...s.items].sort((a, b) => (b.unread ? 1 : 0) - (a.unread ? 1 : 0));
      return sorted.slice(0, 5);
    }, [s.items]);

    return (
      <div
        data-screen-label="Desktop · Notifications"
        style={{
          width: "100%",
          height: "100%",
          background: "var(--c-bg)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--font-base)",
          color: "var(--c-text)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <BrandHeader
          bell={
            <div style={{ position: "relative" }}>
              <BellButton
                unreadCount={s.unreadCount}
                open={bellOpen}
                onToggle={() => setBellOpen((v) => !v)}
              />
              {bellOpen ? (
                <div
                  style={{
                    position: "absolute",
                    top: 56,
                    right: -8,
                    zIndex: 50,
                  }}
                >
                  {/* caret */}
                  <span
                    style={{
                      position: "absolute",
                      top: -7,
                      right: 18,
                      width: 14,
                      height: 14,
                      background: "#fff",
                      transform: "rotate(45deg)",
                      borderLeft: "1px solid var(--c-border)",
                      borderTop: "1px solid var(--c-border)",
                    }}
                  />
                  <BellPopover
                    items={popoverItems}
                    onItemClick={(it) => { s.markRead(it.id); }}
                    onMarkAll={s.markAll}
                    onSeeAll={() => setBellOpen(false)}
                  />
                </div>
              ) : null}
            </div>
          }
        />

        {/* Body */}
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            padding: "0 24px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 16,
              maxWidth: 1305,
              width: "100%",
              alignItems: "flex-start",
            }}
          >
            <MiniSidebar />
            <main style={{ flex: 1, minWidth: 0, padding: "24px 0 40px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 18,
                  gap: 16,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--c-gray)",
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                      marginBottom: 6,
                    }}
                  >
                    Личный кабинет
                  </div>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 28,
                      lineHeight: "32px",
                      color: "var(--c-blue)",
                      fontWeight: 700,
                      letterSpacing: ".005em",
                    }}
                  >
                    Уведомления и новости
                  </h2>
                </div>
                <div style={{ fontSize: 13, color: "var(--c-gray)", textAlign: "right" }}>
                  Всего {s.counts.all} записей<br />
                  {s.unreadCount > 0 ? (
                    <span style={{ color: "var(--c-pink)", fontWeight: 500 }}>
                      {s.unreadCount} непрочитано
                    </span>
                  ) : (
                    <span>все прочитаны</span>
                  )}
                </div>
              </div>

              {/* Main card */}
              <div
                style={{
                  background: "#fff",
                  border: "var(--block-border)",
                  borderRadius: "var(--radius)",
                  marginBottom: 16,
                  overflow: "hidden",
                }}
              >
                <FilterStrip
                  tab={s.tab}
                  setTab={s.setTab}
                  counts={s.counts}
                  from={s.from}
                  to={s.to}
                  onFrom={s.setFrom}
                  onTo={s.setTo}
                  onMarkAll={s.markAll}
                />
                <div>
                  {s.filtered.length === 0 ? (
                    <EmptyListState />
                  ) : (
                    s.filtered.map((item) => (
                      <FullNewsRow
                        key={item.id}
                        item={item}
                        onClick={() => s.markRead(item.id)}
                      />
                    ))
                  )}
                </div>
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "var(--c-gray)",
                  textAlign: "center",
                  padding: "8px 0 24px",
                }}
              >
                записи старше года → <a href="#" style={{ fontSize: 12 }}>архив ленты</a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  };

  // ── Mobile page ──────────────────────────────────────────────────
  window.MobileNotifications = function MobileNotifications({ openBell = false, empty = false }) {
    const seed = empty
      ? window.SAMPLE_ITEMS.map((i) => ({ ...i, unread: false }))
      : window.SAMPLE_ITEMS;
    const s = useNotificationsState(seed);
    const [bellOpen, setBellOpen] = useState(openBell);

    const popoverItems = useMemo(() => {
      const sorted = [...s.items].sort((a, b) => (b.unread ? 1 : 0) - (a.unread ? 1 : 0));
      return sorted.slice(0, 5);
    }, [s.items]);

    return (
      <div
        data-screen-label="Mobile · Notifications"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "var(--c-bg)",
          fontFamily: "var(--font-base)",
          color: "var(--c-text)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <MobileTopbar
          title="Уведомления и новости"
          bell={
            <BellButton
              unreadCount={s.unreadCount}
              open={bellOpen}
              onToggle={() => setBellOpen((v) => !v)}
              size={20}
            />
          }
        />

        {/* Filter strip — sticky */}
        <div style={{ background: "#fff", borderBottom: "1px solid var(--c-border)" }}>
          <FilterStrip
            tab={s.tab}
            setTab={s.setTab}
            counts={s.counts}
            mobile
            onMarkAll={s.markAll}
          />
        </div>

        {/* Meta row — count + mark all */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 16px",
            fontSize: 12,
            color: "var(--c-gray)",
            background: "#fff",
            borderBottom: "1px solid var(--c-border)",
          }}
        >
          <span>
            {s.filtered.length} записей
            {s.unreadCount > 0 ? (
              <span style={{ color: "var(--c-pink)", marginLeft: 6 }}>· {s.unreadCount} новых</span>
            ) : null}
          </span>
          {s.unreadCount > 0 ? (
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); s.markAll(); }}
              style={{ fontSize: 12 }}
            >
              прочитать все
            </a>
          ) : null}
        </div>

        {/* Scrollable list */}
        <div style={{ flex: 1, overflowY: "auto", background: "#fff" }}>
          {s.filtered.length === 0 ? (
            <EmptyListState />
          ) : (
            s.filtered.map((item) => (
              <FullNewsRow
                key={item.id}
                item={item}
                mobile
                onClick={() => s.markRead(item.id)}
              />
            ))
          )}
        </div>

        <MobileTabBar active="notifications" />

        {/* Mobile bell popover — full-width sheet under the topbar */}
        {bellOpen ? (
          <div
            onClick={() => setBellOpen(false)}
            style={{
              position: "absolute",
              top: 56,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(10,39,74,.5)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              zIndex: 40,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <BellPopover
                items={popoverItems}
                mobile
                onItemClick={(it) => { s.markRead(it.id); setBellOpen(false); }}
                onMarkAll={s.markAll}
                onSeeAll={() => setBellOpen(false)}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  };

  // ── Empty‑state for the main list ────────────────────────────────
  function EmptyListState() {
    return (
      <div
        style={{
          padding: "72px 24px",
          textAlign: "center",
          color: "var(--c-gray)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--c-bg-blue)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="flag" size={28} color="var(--c-light-blue)" />
        </div>
        <div
          style={{
            fontSize: 18,
            color: "var(--c-blue)",
            fontWeight: 500,
            marginTop: 4,
          }}
        >
          В этой ленте пока пусто
        </div>
        <div style={{ fontSize: 14, color: "var(--c-gray)", maxWidth: 340, lineHeight: "21px" }}>
          Новые сообщения о трансляциях, подписках и публикациях будут появляться здесь.
        </div>
      </div>
    );
  }
})();
