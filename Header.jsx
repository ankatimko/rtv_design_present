// Header.jsx — fixed top header on brand gradient with PIP audio player + user avatar
(function () {
  const { useState } = React;

  window.Header = function Header({ player, onMenu, user }) {
    return (
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 90, zIndex: 100,
        background: "var(--grad-brand)",
        display: "flex", alignItems: "stretch",
      }}>
        {/* Logo block — pinned over the sidebar column */}
        <a href="#" style={{
          width: 340, display: "flex", alignItems: "center",
          paddingLeft: 22, gap: 22, textDecoration: "none",
        }}>
          <img src="assets/logo.svg" alt="Ритмовремя‑ТВ" style={{ width: 113, height: 52, display: "block" }} />
        </a>

        {/* Player */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", paddingLeft: 12 }}>
          {player}
        </div>

        {/* User block */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, paddingRight: 28, paddingLeft: 16,
        }}>
          {user || null}
        </div>
      </header>
    );
  };

  // Inline header player (matches the fig 'Final/10' frame)
  window.HeaderPlayer = function HeaderPlayer({ title = "—", time = "0:00 / 0:00", playing, onPlay }) {
    return (
      <div style={{
        flex: 1, display: "flex", alignItems: "center", gap: 22,
        color: "#fff", fontSize: 14,
        paddingRight: 24,
      }}>
        <button style={iconBtn} title="Назад"><Icon name="media-prev" size={20} color="rgba(255,255,255,.85)" /></button>
        <button style={iconBtn} onClick={onPlay} title={playing ? "Пауза" : "Воспроизвести"}>
          <Icon name={playing ? "pause" : "play"} size={22} color="#fff" />
        </button>
        <button style={iconBtn} title="Вперёд"><Icon name="media-next" size={20} color="rgba(255,255,255,.85)" /></button>

        <div style={{
          flex: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          fontWeight: 500, paddingLeft: 6,
        }}>{title}</div>

        <span style={{ opacity: .85, fontVariantNumeric: "tabular-nums" }}>{time}</span>

        <button style={iconBtn} title="Повтор"><Icon name="media-repeat" size={18} color="rgba(255,255,255,.7)" /></button>
        <button style={iconBtn} title="Перемешать"><Icon name="media-mix"    size={18} color="rgba(255,255,255,.7)" /></button>
        <button style={iconBtn} title="Громкость"><Icon name="media-volume" size={20} color="rgba(255,255,255,.85)" /></button>
      </div>
    );
  };

  window.HeaderUser = function HeaderUser({ name = "Длинное имя\nДлинная фамилия", avatar, notifications = 0 }) {
    const [first, last] = name.split("\n");
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          color: "#fff", fontSize: 14, lineHeight: "18px", textAlign: "right", maxWidth: 160,
        }}>
          <div>{first}</div>
          <div style={{ opacity: .9 }}>{last}</div>
        </div>
        <div style={{ position: "relative", width: 44, height: 44 }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            background: avatar ? `url(${avatar}) center/cover` : "var(--c-light-gray)",
            border: "2px solid #fff",
          }} />
          {notifications > 0 ? (
            <span style={{
              position: "absolute", top: -2, right: -4,
              minWidth: 18, height: 18, padding: "0 5px",
              background: "var(--c-pink)", borderRadius: 10,
              color: "#fff", fontSize: 11, fontWeight: 700,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              border: "2px solid var(--grad-brand-solid, #2a3c8e)",
            }}>{notifications}</span>
          ) : null}
        </div>
      </div>
    );
  };

  const iconBtn = {
    background: "transparent", border: "none", cursor: "pointer", padding: 4,
    display: "inline-flex", alignItems: "center", color: "#fff",
  };
})();
