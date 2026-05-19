// Sidebar.jsx — left aside with live card, mini player, and nav menu
(function () {
  window.Sidebar = function Sidebar({ live, miniPlayer, nav }) {
    return (
      <aside style={{
        width: 340, paddingLeft: 22, paddingTop: 24, flexShrink: 0,
        boxSizing: "border-box",
        display: "flex", flexDirection: "column", gap: 16,
      }}>
        {live ? <LiveAsideCard {...live} /> : null}
        {miniPlayer ? <MiniPlayerCard {...miniPlayer} /> : null}
        <NavMenu items={nav.items} activeId={nav.activeId} onSelect={nav.onSelect} />
      </aside>
    );
  };

  // ── Top of sidebar: "Сейчас в эфире" card with thumbnail ─────────
  window.LiveAsideCard = function LiveAsideCard({ thumb, title, onClick }) {
    return (
      <div onClick={onClick} style={{
        background: "var(--grad-nav)",
        borderRadius: "var(--radius)",
        padding: 14,
        cursor: "pointer",
      }}>
        <div style={{
          width: "100%", aspectRatio: "16 / 9",
          background: thumb ? `url(${thumb}) center/cover` : "var(--c-light-gray)",
          borderRadius: "var(--radius)",
          position: "relative",
        }}>
          <button title="Звук" style={{
            position: "absolute", right: 8, bottom: 8,
            width: 28, height: 28, borderRadius: 4,
            background: "rgba(10,39,74,.5)",
            border: "none", color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}>
            <Icon name="media-volume" size={14} color="#fff" />
          </button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, color: "var(--c-blue)", fontWeight: 700, fontSize: 15 }}>
          <LiveDot size={10} />
          <span>Сейчас в эфире</span>
        </div>
        <div style={{ fontSize: 13, color: "var(--c-text)", marginTop: 4, lineHeight: "19px" }}>
          {title}
        </div>
      </div>
    );
  };

  // ── A second card: queued / mini-player ──────────────────────────
  window.MiniPlayerCard = function MiniPlayerCard({ thumb, title, onClick }) {
    return (
      <div onClick={onClick} style={{
        background: "var(--grad-nav)",
        borderRadius: "var(--radius)",
        padding: 14,
        display: "flex", gap: 12, alignItems: "center",
        cursor: "pointer",
      }}>
        <div style={{
          width: 92, height: 60, borderRadius: 3,
          background: thumb ? `url(${thumb}) center/cover` : "var(--c-light-gray)",
          flexShrink: 0,
          position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="play-round" size={24} color="rgba(255,255,255,.9)" />
          </div>
        </div>
        <div style={{
          fontSize: 13, color: "var(--c-blue)", fontWeight: 500, lineHeight: "18px",
          display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>{title}</div>
      </div>
    );
  };

  // ── Nav menu ─────────────────────────────────────────────────────
  window.NavMenu = function NavMenu({ items, activeId, onSelect }) {
    return (
      <nav style={{
        background: "var(--grad-nav)",
        borderRadius: "var(--radius)",
        padding: "28px 28px 20px",
      }}>
        {items.map((it) => {
          const active = it.id === activeId;
          const baseColor = it.disabled ? "var(--c-gray)" : active ? "var(--c-pink)" : "var(--c-blue)";
          return (
            <div key={it.id}>
              <div
                onClick={() => !it.disabled && onSelect(it.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  paddingBottom: 22, fontSize: 16,
                  color: baseColor,
                  cursor: it.disabled ? "default" : "pointer",
                  transition: ".2s",
                }}
              >
                <Icon name={it.icon} size={20} color={baseColor} />
                <span>{it.label}</span>
                {it.badge ? (
                  <span style={{
                    marginLeft: "auto", background: "var(--c-pink)", color: "#fff",
                    fontSize: 11, fontWeight: 700,
                    borderRadius: 10, padding: "2px 8px",
                  }}>{it.badge}</span>
                ) : null}
              </div>
              {active && it.children ? (
                <div style={{ marginLeft: 32, marginTop: -10, marginBottom: 14 }}>
                  {it.children.map((c) => (
                    <div key={c.id} onClick={(e) => { e.stopPropagation(); !c.disabled && onSelect(c.id); }} style={{
                      position: "relative", paddingBottom: 14,
                      fontSize: 14, cursor: c.disabled ? "default" : "pointer",
                      color: c.disabled ? "var(--c-gray)" : c.active ? "var(--c-pink)" : "var(--c-blue)",
                    }}>
                      <span style={{
                        position: "absolute", left: -15, top: 8,
                        width: 4, height: 4, borderRadius: "50%",
                        background: c.disabled ? "var(--c-gray)" : c.active ? "var(--c-pink)" : "var(--c-blue)",
                      }} />
                      {c.label}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    );
  };
})();
