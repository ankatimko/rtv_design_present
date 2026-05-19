// Components.jsx — News & Notifications v2 building blocks.
// Editorial style: hero news, separated tabs (Новости / Уведомления),
// time-stacked notification rows, refined bell popover.
(function () {
  const { useState, useMemo } = React;

  // ── Russian short month names for compact date stamps ────────────
  const RU_MONTH_SHORT = ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  function parseRu(date) {
    // input "23.07.2026"
    const [d, m, y] = date.split(".").map((n) => parseInt(n, 10));
    return { d, m, y };
  }
  window.shortDate = function (date) {
    const { d, m } = parseRu(date);
    return `${d} ${RU_MONTH_SHORT[m - 1]}`;
  };
  window.longDate = function (date) {
    const { d, m, y } = parseRu(date);
    const full = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    return `${d} ${full[m - 1]} ${y} г.`;
  };

  // ── Sample data ──────────────────────────────────────────────────
  // News are editorial: title + body + optional cover image + link to article.
  // Notifications are transactional: title + short body + optional link.
  window.SAMPLE_NEWS = [
    {
      id: "n1",
      hero: true,
      category: "Медиатека",
      title: "Новинки Медиатеки. Май 2026",
      excerpt:
        "Опубликованы две премьеры месяца — книга «Струна Взаимопроникновения», часть 2, и фильм «Сила в энергию. Энергия в силу». Доступ открыт всем подписчикам.",
      image: "ds/assets/home-live-brain.png",
      date: "14.05.2026",
      time: "18:33",
      readTime: "4 мин",
      unread: true,
    },
    {
      id: "n2",
      category: "Расписание",
      title: "7–9 мая — Экспедиции в Человечество",
      excerpt:
        "Напоминаем параметры трёх «Экспедиций в человечество»: даты, ведущие, формат включений и порядок задавания вопросов.",
      date: "07.05.2026",
      time: "14:22",
      readTime: "3 мин",
      unread: true,
    },
    {
      id: "n3",
      category: "Анонс",
      title: "Запись Авторского Озарина «Улучшение опор» — в медиатеке",
      excerpt:
        "Доступ открыт на 24 часа после активации. Активировать запись можно до конца месяца — после этого материал переедет в архив.",
      date: "06.05.2026",
      time: "11:44",
      readTime: "1 мин",
      unread: false,
    },
    {
      id: "n4",
      category: "Расписание",
      title: "4–6 мая — Экспедиции в Радастею",
      excerpt:
        "Напоминаем параметры трёх «Экспедиций в Радастею» — три маршрута, три ведущих, три повестки. Регистрация участников закрыта.",
      image: "ds/assets/album-cover.png",
      date: "04.05.2026",
      time: "11:14",
      readTime: "3 мин",
      unread: false,
    },
    {
      id: "n5",
      category: "Сообщество",
      title: "Поздравляем с Днём стрелочки: ритмологический рисунок",
      excerpt:
        "Обращение Евдокии Дмитриевны и задание на канале МирХлир — опубликовано на главной.",
      date: "17.02.2026",
      time: "15:22",
      readTime: "2 мин",
      unread: false,
    },
  ];

  window.SAMPLE_NOTIFICATIONS = [
    {
      id: "u1",
      title: "Новинки медиатеки",
      body:
        "Книга «Струна Взаимопроникновения», часть 2. Фильм «Сила в энергию. Энергия в силу».",
      date: "15.05.2026",
      time: "12:45",
      unread: true,
      link: { href: "#/media", label: "Открыть медиатеку" },
    },
    {
      id: "u2",
      title: "Улучшение опор",
      body:
        "Запись Авторского Озарина размещена в медиатеке. После активации видео будет доступно для просмотра в течение 24 часов.",
      date: "07.05.2026",
      time: "17:34",
      unread: true,
      link: { href: "#/media/ozarin", label: "Активировать запись" },
    },
    {
      id: "u3",
      title: "Макрорадаст 2026",
      body:
        "Макрорадаст пройдёт с 10 июня по 14 июня 2026 года в г. Санкт‑Петербурге. Купить билеты и узнать подробную информацию можно на сайте Ирлем‑Практик.",
      date: "06.04.2026",
      time: "16:15",
      unread: true,
    },
    {
      id: "u4",
      title: "День стрелочки · ритмологический рисунок",
      body:
        "Обращение и задание уже на канале МирХлир — нажмите чтобы перейти.",
      date: "17.02.2026",
      time: "15:22",
      unread: false,
      link: { href: "#/news/strelochka", label: "Перейти" },
    },
    {
      id: "u5",
      title: "Платёж принят",
      body:
        "Оплата подписки «Вертикальный календарь» прошла успешно. Доступ открыт до 21.05.2027.",
      date: "20.04.2026",
      time: "20:31",
      unread: false,
    },
    {
      id: "u6",
      title: "Подписка «Спектакли» истекает",
      body:
        "Серия «СТ‑эффект» завершается 30.05.2026. Продлите её, чтобы не пропустить премьеры.",
      date: "12.04.2026",
      time: "08:15",
      unread: false,
      link: { href: "#/payment", label: "Продлить" },
    },
  ];

  // ── Brand header (desktop) ───────────────────────────────────────
  window.BrandHeader = function BrandHeader({ bell, user = { name: "Анна Солнышко‑Тимко", avatar: "ds/assets/event.png" } }) {
    return (
      <header
        style={{
          height: 90,
          background: "var(--grad-brand)",
          display: "flex",
          alignItems: "stretch",
          flexShrink: 0,
          color: "#fff",
        }}
      >
        <a
          href="#"
          style={{
            width: 308,
            display: "flex",
            alignItems: "center",
            paddingLeft: 22,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <img src="ds/assets/logo.svg" alt="Ритмовремя‑ТВ" style={{ width: 113, height: 52 }} />
        </a>

        {/* Inline player placeholder (matches kit) */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 18, paddingLeft: 16, color: "#fff", fontSize: 14 }}>
          <button style={iconBtn}><Icon name="media-prev" size={18} color="rgba(255,255,255,.7)" /></button>
          <button style={iconBtn}><Icon name="play" size={22} color="#fff" /></button>
          <button style={iconBtn}><Icon name="media-next" size={18} color="rgba(255,255,255,.7)" /></button>
          <div style={{ flex: 1, minWidth: 0, paddingLeft: 12, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: .9 }}>
            Год Улучшений · 2026 год
          </div>
          <span style={{ fontVariantNumeric: "tabular-nums", opacity: .8 }}>0:00 / 0:00</span>
          <button style={iconBtn}><Icon name="media-repeat" size={16} color="rgba(255,255,255,.6)" /></button>
          <button style={iconBtn}><Icon name="media-mix" size={16} color="rgba(255,255,255,.6)" /></button>
          <button style={iconBtn}><Icon name="media-volume" size={18} color="rgba(255,255,255,.7)" /></button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, paddingLeft: 16, paddingRight: 24, position: "relative" }}>
          {bell}
          <HeaderUser name={user.name} avatar={user.avatar} />
        </div>
      </header>
    );
  };

  const iconBtn = {
    background: "transparent", border: "none", cursor: "pointer", padding: 4,
    display: "inline-flex", alignItems: "center", color: "#fff",
  };

  function HeaderUser({ name, avatar }) {
    const parts = (name || "").split(" ");
    const first = parts.slice(0, 1).join(" ");
    const last  = parts.slice(1).join(" ");
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ color: "#fff", fontSize: 14, lineHeight: "18px", textAlign: "right" }}>
          <div>{first}</div>
          <div style={{ opacity: .85 }}>{last}</div>
        </div>
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: avatar ? `url(${avatar}) center/cover` : "var(--c-light-gray)",
          border: "2px solid rgba(255,255,255,.6)", flexShrink: 0,
        }} />
      </div>
    );
  }

  // ── Bell button ──────────────────────────────────────────────────
  window.BellButton = function BellButton({ unreadCount = 0, open, onToggle }) {
    return (
      <button
        onClick={onToggle}
        aria-label="Уведомления"
        style={{
          position: "relative", width: 44, height: 44,
          borderRadius: "50%",
          background: open ? "rgba(255,255,255,.18)" : "transparent",
          border: "none", cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          transition: ".4s", padding: 0, flexShrink: 0,
        }}
      >
        <Icon name="bell" size={22} color="#fff" />
        {unreadCount > 0 ? (
          <span style={{
            position: "absolute", top: 4, right: 4,
            minWidth: 20, height: 20, padding: "0 6px",
            background: "var(--c-pink)", borderRadius: 10,
            color: "#fff", fontSize: 11, fontWeight: 700,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #3a3590", boxSizing: "content-box",
            lineHeight: 1, fontVariantNumeric: "tabular-nums",
          }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>
    );
  };

  // ── Bell popover (refined) ───────────────────────────────────────
  window.BellPopover = function BellPopover({ items = [], onItemClick, onMarkAll, onSeeAll, mobile, style = {} }) {
    const unreadCount = items.filter((i) => i.unread).length;
    return (
      <div
        style={{
          width: mobile ? "100%" : 400,
          background: "#fff",
          borderRadius: mobile ? 0 : "var(--radius)",
          border: mobile ? "none" : "1px solid var(--c-border)",
          boxShadow: mobile ? "none" : "0 18px 50px -10px rgba(10,39,74,.35), 0 4px 12px rgba(10,39,74,.1)",
          overflow: "hidden",
          display: "flex", flexDirection: "column",
          ...style,
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 20px 14px", borderBottom: "1px solid var(--c-border)", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, minWidth: 0 }}>
            <h4 style={{ margin: 0, fontSize: 16, lineHeight: "20px", color: "var(--c-blue)", fontWeight: 700 }}>
              Уведомления
            </h4>
            {unreadCount > 0 ? (
              <span style={{
                background: "var(--c-pink)", color: "#fff",
                fontSize: 11, fontWeight: 700, padding: "2px 8px",
                borderRadius: 10, lineHeight: 1, fontVariantNumeric: "tabular-nums",
              }}>{unreadCount} новых</span>
            ) : (
              <span style={{ fontSize: 13, color: "var(--c-gray)" }}>всё прочитано</span>
            )}
          </div>
          {unreadCount > 0 ? (
            <a href="#" onClick={(e) => { e.preventDefault(); onMarkAll && onMarkAll(); }}
              style={{ fontSize: 13, color: "var(--c-light-blue)", textDecoration: "none", whiteSpace: "nowrap" }}>
              прочитать все
            </a>
          ) : null}
        </div>

        <div style={{ maxHeight: mobile ? "calc(100vh - 180px)" : 440, overflowY: "auto" }}>
          {items.length === 0 ? (
            <EmptyPopoverState />
          ) : (
            items.map((it, i) => (
              <PopoverRow
                key={it.id}
                item={it}
                onClick={() => onItemClick && onItemClick(it)}
                isLast={i === items.length - 1}
              />
            ))
          )}
        </div>

        <a href="#/notifications" onClick={(e) => { e.preventDefault(); onSeeAll && onSeeAll(); }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "14px 20px", borderTop: "1px solid var(--c-border)",
            color: "var(--c-light-blue)", fontSize: 14, fontWeight: 500,
            textDecoration: "none", background: "var(--c-lightest-gray)",
            fontVariant: "small-caps", textTransform: "lowercase", letterSpacing: ".02em",
          }}>
          все уведомления <span style={{ fontSize: 16, textTransform: "none" }}>→</span>
        </a>
      </div>
    );
  };

  function EmptyPopoverState() {
    return (
      <div style={{
        padding: "44px 24px", textAlign: "center", color: "var(--c-gray)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "var(--c-bg-blue)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginBottom: 4,
        }}>
          <Icon name="check" size={24} color="var(--c-light-blue)" />
        </div>
        <div style={{ fontSize: 15, color: "var(--c-blue)", fontWeight: 500 }}>
          Новых уведомлений нет
        </div>
        <div style={{ fontSize: 13, color: "var(--c-gray)", lineHeight: "18px", maxWidth: 260 }}>
          Когда что‑то произойдёт — мы напишем сюда.
        </div>
      </div>
    );
  }

  function PopoverRow({ item, onClick, isLast }) {
    const [hover, setHover] = useState(false);
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "grid",
          gridTemplateColumns: "8px 1fr auto",
          gap: 12, alignItems: "flex-start", width: "100%", textAlign: "left",
          padding: "14px 20px",
          background: hover ? "var(--c-lightest-gray)" : "#fff",
          border: "none",
          borderBottom: isLast ? "none" : "1px solid var(--c-border)",
          cursor: "pointer", fontFamily: "var(--font-base)",
          color: "var(--c-text)", transition: ".15s",
        }}
      >
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: item.unread ? "var(--c-pink)" : "transparent",
          marginTop: 7, flexShrink: 0,
        }} />
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: 14, lineHeight: "20px",
            fontWeight: item.unread ? 500 : 400,
            color: "var(--c-blue)", marginBottom: 3,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {item.title}
          </div>
          <div style={{
            fontSize: 13, lineHeight: "18px", color: "var(--c-text)",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {item.body}
          </div>
          {item.link ? (
            <div style={{ marginTop: 6, fontSize: 12, color: "var(--c-light-blue)", display: "inline-flex", alignItems: "center", gap: 4 }}>
              {item.link.label} <span style={{ fontSize: 14 }}>→</span>
            </div>
          ) : null}
        </div>
        <div style={{
          textAlign: "right", fontSize: 11, color: "var(--c-gray)",
          fontVariantNumeric: "tabular-nums", lineHeight: "15px", whiteSpace: "nowrap", paddingTop: 2,
        }}>
          <div style={{ color: "var(--c-blue-gray)", fontSize: 12, fontWeight: 500 }}>{item.time}</div>
          <div>{window.shortDate(item.date)}</div>
        </div>
      </button>
    );
  }

  // ── Sidebar (matches reference) ──────────────────────────────────
  window.MiniSidebar = function MiniSidebar({ activeId = "news" }) {
    const items = [
      { id: "schedule",       label: "Расписание",            icon: "home" },
      { id: "news",           label: "Новости",               icon: "heading" },
      { id: "media",          label: "Медиатека",             icon: "play" },
      { id: "services",       label: "Сервисы",               icon: "grid" },
      { id: "personal",       label: "Личный кабинет",        icon: "user" },
      { id: "payment",        label: "Оплата трансляций",     icon: "buy" },
      { id: "ritmo-feed",     label: "Лента Ритмособытий",    icon: "flag" },
      { id: "books",          label: "Электронные книги",     icon: "book" },
      { id: "magic-room",     label: "Волшебная комната",     icon: "star" },
      { id: "ray-duty",       label: "Лучевое дежурство",     icon: "star-border" },
      { id: "ritmo-tasting",  label: "Дегустация Ритмовремени", icon: "album" },
    ];
    return (
      <aside
        style={{
          width: 308, flexShrink: 0,
          background: "var(--grad-nav)",
          borderRadius: "var(--radius)",
          padding: "18px 0 22px",
          alignSelf: "flex-start", marginTop: 24,
          border: "1px solid rgba(255,255,255,.55)",
        }}
      >
        <nav>
          {items.map((it) => {
            const active = it.id === activeId;
            return (
              <a
                key={it.id}
                href={"#/" + it.id}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "9px 24px 9px 21px",
                  textDecoration: "none",
                  color: active ? "var(--c-pink)" : "var(--c-blue)",
                  fontWeight: active ? 700 : 400,
                  fontSize: 15,
                  borderLeft: active ? "3px solid var(--c-pink)" : "3px solid transparent",
                  position: "relative",
                  transition: ".2s",
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "var(--c-light-blue)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "var(--c-blue)"; }}
              >
                <Icon name={it.icon} size={18} color={active ? "var(--c-pink)" : "currentColor"} />
                <span style={{ flex: 1 }}>{it.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>
    );
  };

  // ── Page-level tabs (Новости / Уведомления) ──────────────────────
  window.PageTabs = function PageTabs({ value, onChange, counts, mobile }) {
    const items = [
      { id: "news",          label: "Новости",     count: counts.news },
      { id: "notifications", label: "Уведомления", count: counts.notifications },
    ];
    return (
      <div style={{
        display: "flex", gap: 0,
        borderBottom: "1px solid var(--c-border)",
        marginBottom: mobile ? 0 : 28,
        padding: mobile ? "0 12px" : 0,
      }}>
        {items.map((t) => {
          const active = value === t.id;
          return (
            <button key={t.id} onClick={() => onChange(t.id)} style={{
              background: "none", border: "none",
              padding: mobile ? "14px 18px 16px" : "14px 4px 18px",
              marginRight: mobile ? 0 : 36,
              fontFamily: "var(--font-base)", fontSize: mobile ? 15 : 18,
              fontWeight: active ? 700 : 400,
              color: active ? "var(--c-blue)" : "var(--c-gray)",
              cursor: "pointer", position: "relative",
              borderBottom: active ? "3px solid var(--c-pink)" : "3px solid transparent",
              marginBottom: -1,
              display: "inline-flex", alignItems: "center", gap: 10,
              letterSpacing: ".005em",
              transition: ".2s",
            }}>
              {t.label}
              {t.count > 0 ? (
                <span style={{
                  background: active ? "var(--c-pink)" : "var(--c-bg-blue)",
                  color: active ? "#fff" : "var(--c-light-blue)",
                  fontSize: 11, fontWeight: 700,
                  padding: "2px 8px", borderRadius: 10,
                  lineHeight: 1, fontVariantNumeric: "tabular-nums",
                }}>{t.count}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    );
  };

  // ── Hero news card (editorial) ───────────────────────────────────
  window.HeroNewsCard = function HeroNewsCard({ item, mobile, onClick }) {
    const [hover, setHover] = useState(false);
    return (
      <article
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "grid",
          gridTemplateColumns: mobile ? "1fr" : "minmax(0, 1fr) minmax(0, 1fr)",
          gap: 0,
          background: "#fff",
          border: "1px solid var(--c-border)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
          marginBottom: 16,
          cursor: "pointer",
          boxShadow: hover ? "0 10px 30px -8px rgba(10,39,74,.18)" : "0 1px 0 rgba(10,39,74,.04)",
          transform: hover ? "translateY(-1px)" : "none",
          transition: ".25s ease",
        }}
      >
        <div style={{
          aspectRatio: mobile ? "16 / 9" : "auto",
          minHeight: mobile ? undefined : 320,
          background: `url(${item.image}) center/cover, var(--grad-brand)`,
          position: "relative",
          order: mobile ? 0 : 0,
        }}>
          {item.unread ? (
            <span style={{
              position: "absolute", top: 16, left: 16,
              background: "var(--c-pink)", color: "#fff",
              fontSize: 11, fontWeight: 700, padding: "5px 10px",
              borderRadius: 2, textTransform: "uppercase", letterSpacing: ".06em",
            }}>новое</span>
          ) : null}
        </div>
        <div style={{
          padding: mobile ? "20px 20px 22px" : "36px 36px 36px 36px",
          display: "flex", flexDirection: "column", justifyContent: "center", gap: 14,
          minWidth: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 11, color: "var(--c-pink)", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: ".08em",
            }}>{item.category}</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--c-light-gray)" }} />
            <span style={{
              fontSize: 13, color: "var(--c-gray)",
              display: "inline-flex", alignItems: "center", gap: 6,
              fontVariantNumeric: "tabular-nums",
            }}>
              <Icon name="calendar" size={12} color="var(--c-pink)" />
              {window.longDate(item.date)} · {item.time}
            </span>
          </div>
          <h2 style={{
            margin: 0, fontSize: mobile ? 22 : 28, lineHeight: mobile ? "28px" : "34px",
            color: "var(--c-blue)", fontWeight: 700, letterSpacing: ".005em",
            textWrap: "balance",
          }}>{item.title}</h2>
          <p style={{
            margin: 0, fontSize: 14, lineHeight: "22px", color: "var(--c-text)",
          }}>{item.excerpt}</p>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginTop: 4,
          }}>
            <a href="#" onClick={(e) => e.stopPropagation()} style={{
              fontFamily: "var(--font-base)", fontSize: 14, fontWeight: 700,
              color: "var(--c-light-blue)",
              fontVariant: "small-caps", textTransform: "lowercase", letterSpacing: ".04em",
              textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              читать далее <span style={{ fontSize: 18, textTransform: "none" }}>→</span>
            </a>
            <span style={{ fontSize: 12, color: "var(--c-gray)", display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name="time" size={12} color="var(--c-gray)" />
              {item.readTime}
            </span>
          </div>
        </div>
      </article>
    );
  };

  // ── Standard news card (with optional image) ─────────────────────
  window.NewsCard = function NewsCard({ item, mobile, onClick }) {
    const [hover, setHover] = useState(false);
    const hasImage = !!item.image;
    return (
      <article
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: "#fff",
          border: "1px solid var(--c-border)",
          borderRadius: "var(--radius)",
          padding: 0,
          marginBottom: 12,
          cursor: "pointer",
          display: "grid",
          gridTemplateColumns: hasImage && !mobile ? "200px 1fr" : "1fr",
          gap: 0,
          overflow: "hidden",
          boxShadow: hover ? "0 8px 24px -10px rgba(10,39,74,.18)" : "none",
          transform: hover ? "translateY(-1px)" : "none",
          transition: ".25s ease",
          position: "relative",
        }}
      >
        {item.unread ? (
          <span style={{
            position: "absolute", top: 18, right: 18,
            width: 8, height: 8, borderRadius: "50%", background: "var(--c-pink)",
          }} />
        ) : null}
        {hasImage ? (
          <div style={{
            aspectRatio: mobile ? "16 / 9" : "auto",
            background: `url(${item.image}) center/cover, var(--c-bg-blue)`,
            minHeight: mobile ? undefined : 160,
          }} />
        ) : null}
        <div style={{
          padding: mobile ? "18px 18px 20px" : "22px 28px 22px",
          display: "flex", flexDirection: "column", gap: 8, minWidth: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 11, color: "var(--c-pink)", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: ".08em",
            }}>{item.category}</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--c-light-gray)" }} />
            <span style={{
              fontSize: 12, color: "var(--c-gray)",
              display: "inline-flex", alignItems: "center", gap: 5,
              fontVariantNumeric: "tabular-nums",
            }}>
              <Icon name="calendar" size={11} color="var(--c-pink)" />
              {window.longDate(item.date)} · {item.time}
            </span>
          </div>
          <h3 style={{
            margin: 0, fontSize: mobile ? 17 : 19, lineHeight: mobile ? "23px" : "26px",
            color: "var(--c-blue)", fontWeight: 700, letterSpacing: ".005em",
            textWrap: "balance",
          }}>{item.title}</h3>
          <p style={{
            margin: 0, fontSize: 14, lineHeight: "21px", color: "var(--c-text)",
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>{item.excerpt}</p>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4,
          }}>
            <a href="#" onClick={(e) => e.stopPropagation()} style={{
              fontFamily: "var(--font-base)", fontSize: 13, fontWeight: 700,
              color: "var(--c-light-blue)",
              fontVariant: "small-caps", textTransform: "lowercase", letterSpacing: ".04em",
              textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}>
              читать далее <span style={{ fontSize: 16, textTransform: "none" }}>→</span>
            </a>
            <span style={{ fontSize: 11, color: "var(--c-gray)", display: "inline-flex", alignItems: "center", gap: 5 }}>
              <Icon name="time" size={11} color="var(--c-gray)" />
              {item.readTime}
            </span>
          </div>
        </div>
      </article>
    );
  };

  // ── Notification row (compact, time stacked right) ───────────────
  window.NotificationRow = function NotificationRow({ item, mobile, onClick }) {
    const [hover, setHover] = useState(false);
    const hasLink = !!item.link;
    return (
      <article
        onClick={() => { hasLink && onClick && onClick(); }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "grid",
          gridTemplateColumns: mobile ? "8px 1fr auto" : "10px 1fr auto",
          gap: mobile ? 10 : 18, alignItems: "flex-start",
          background: hover && hasLink ? "var(--c-lightest-gray)" : "#fff",
          border: "1px solid var(--c-border)",
          borderRadius: "var(--radius)",
          padding: mobile ? "16px 14px 16px 12px" : "20px 24px 20px 18px",
          marginBottom: 10,
          cursor: hasLink ? "pointer" : "default",
          transition: ".15s",
          boxShadow: hover && hasLink ? "0 4px 12px -4px rgba(10,39,74,.12)" : "none",
        }}
      >
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: item.unread ? "var(--c-pink)" : "transparent",
          marginTop: 8, flexShrink: 0,
        }} />
        <div style={{ minWidth: 0 }}>
          <h4 style={{
            margin: 0, marginBottom: 4,
            fontSize: mobile ? 15 : 16, lineHeight: mobile ? "20px" : "22px",
            color: "var(--c-blue)",
            fontWeight: item.unread ? 700 : 500, letterSpacing: ".005em",
          }}>{item.title}</h4>
          <p style={{
            margin: 0, fontSize: 13, lineHeight: "19px", color: "var(--c-text)",
          }}>{item.body}</p>
          {hasLink ? (
            <a href={item.link.href} onClick={(e) => e.stopPropagation()} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              marginTop: 8, fontSize: 13, color: "var(--c-light-blue)",
              textDecoration: "none", fontWeight: 500,
            }}>
              {item.link.label} <span style={{ fontSize: 14 }}>→</span>
            </a>
          ) : null}
        </div>
        <div style={{
          textAlign: "right",
          fontSize: 12, color: "var(--c-gray)",
          fontVariantNumeric: "tabular-nums",
          lineHeight: mobile ? "16px" : "18px",
          whiteSpace: "nowrap",
        }}>
          <div style={{
            color: "var(--c-blue-gray)",
            fontSize: mobile ? 13 : 14, fontWeight: 500,
            marginBottom: 2,
          }}>{item.time}</div>
          <div>{window.shortDate(item.date)}</div>
        </div>
      </article>
    );
  };

  // ── Mobile chrome ────────────────────────────────────────────────
  window.MobileTopbar = function MobileTopbar({ title, subtitle, bell }) {
    return (
      <header style={{
        background: "var(--grad-brand)",
        padding: "10px 12px 14px",
        flexShrink: 0,
        color: "#fff",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
          <img src="ds/assets/logo.svg" alt="Ритмовремя‑ТВ" style={{ height: 32 }} />
          {bell}
        </div>
        <h1 style={{
          margin: 0, fontSize: 24, lineHeight: "28px",
          color: "#fff", fontWeight: 700, letterSpacing: ".005em",
        }}>{title}</h1>
        {subtitle ? (
          <p style={{ margin: "4px 0 0", fontSize: 13, opacity: .8 }}>{subtitle}</p>
        ) : null}
      </header>
    );
  };

  window.MobileTabBar = function MobileTabBar({ active = "news" }) {
    const tabs = [
      { id: "schedule", label: "Эфир", icon: "home" },
      { id: "media", label: "Медиа", icon: "play" },
      { id: "news", label: "Лента", icon: "heading" },
      { id: "personal", label: "Кабинет", icon: "user" },
    ];
    return (
      <nav style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        background: "#fff", borderTop: "1px solid var(--c-border)",
        height: 64, flexShrink: 0,
      }}>
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <a key={t.id} href={"#/" + t.id} style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3,
              textDecoration: "none",
              color: isActive ? "var(--c-pink)" : "var(--c-gray)",
              fontSize: 11, fontWeight: isActive ? 500 : 400,
            }}>
              <Icon name={t.icon} size={20} color={isActive ? "var(--c-pink)" : "var(--c-gray)"} />
              {t.label}
            </a>
          );
        })}
      </nav>
    );
  };

  // ── Status banner above lists ────────────────────────────────────
  window.StatusBanner = function StatusBanner({ unreadCount, total, onMarkAll }) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 0 16px", gap: 12, flexWrap: "wrap",
      }}>
        <div style={{ fontSize: 14, color: "var(--c-gray)" }}>
          {unreadCount > 0 ? (
            <span>
              <span style={{ color: "var(--c-pink)", fontWeight: 600 }}>{unreadCount} новых</span>
              <span style={{ margin: "0 8px", color: "var(--c-light-gray)" }}>·</span>
              всего {total}
            </span>
          ) : (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--c-success)" }}>
              <Icon name="check" size={13} color="var(--c-success)" />
              Все уведомления прочитаны · всего {total}
            </span>
          )}
        </div>
        {unreadCount > 0 ? (
          <a href="#" onClick={(e) => { e.preventDefault(); onMarkAll && onMarkAll(); }} style={{
            fontSize: 13, fontWeight: 500, color: "var(--c-light-blue)",
          }}>прочитать все</a>
        ) : null}
      </div>
    );
  };
})();
