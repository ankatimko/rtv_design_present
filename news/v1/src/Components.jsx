// Components.jsx — News & Notifications building blocks for desktop + mobile.
// All visual choices grounded in the Ритмовремя‑ТВ design system tokens.
(function () {
  const { useState, useRef, useEffect } = React;

  // ── Sample data shared across both viewports ─────────────────────
  // Mix of: notification-with-link, notification-no-link, news-with-image,
  // news-no-image, plain news; unread/read; varying lengths.
  window.SAMPLE_ITEMS = [
    {
      id: 1,
      type: "notification",
      title: "Банк Ритмовремени",
      body:
        "Ближайшая трансляция «Банк Ритмовремени» пройдёт 24.07.2020 в 19:00 по московскому времени.",
      date: "23.07.2020",
      time: "11:42",
      unread: true,
      link: { href: "#/schedule", label: "К расписанию" },
    },
    {
      id: 2,
      type: "news",
      title: "Аудиотека теперь и в Android",
      body:
        "Рады сообщить, что в обновлённой версии приложения для Android доступна аудиотека.",
      body2:
        "Обращаем ваше внимание, что формат медиатеки изменился — теперь подписку можно оформлять сразу на серии материалов: Вертикальный календарь, Банк Ритмовремени, Внутри Главной книги, Спектакли, Аудиокниги.",
      image: "ds/assets/home-live-brain.png",
      date: "22.07.2020",
      time: "09:00",
      unread: true,
      link: { href: "#/news/2", label: "Читать всю новость" },
    },
    {
      id: 3,
      type: "notification",
      title: "Подписка «Спектакли» истекает",
      body:
        "Ваша подписка на серию «СТ‑эффект» заканчивается 30.07.2020. Продлите её, чтобы не пропустить премьеры.",
      date: "22.07.2020",
      time: "08:15",
      unread: true,
      link: { href: "#/payment", label: "Продлить подписку" },
    },
    {
      id: 4,
      type: "notification",
      title: "Платёж принят",
      body:
        "Оплата подписки «Вертикальный календарь» на 12 месяцев успешно прошла. Доступ открыт до 21.07.2021.",
      date: "21.07.2020",
      time: "20:31",
      unread: false,
    },
    {
      id: 5,
      type: "news",
      title: "Озарин июля 2020 — на сайте",
      body:
        "Озарин июля 2020 — «Извлечение пользы из страха. Пустоты ритма» — опубликован в медиатеке и доступен подписчикам.",
      image: "ds/assets/album-cover.png",
      date: "20.07.2020",
      time: "12:00",
      unread: false,
      link: { href: "#/media/audio/ozarin-7-2020", label: "Слушать" },
    },
    {
      id: 6,
      type: "news",
      title: "Тема номера: «Часовой механизм»",
      body:
        "Опубликовано продолжение цикла «Ритмомерные часы»: «Я при часах или часовой механизм».",
      date: "19.07.2020",
      time: "10:14",
      unread: false,
    },
    {
      id: 7,
      type: "notification",
      title: "Чат включён в эфире «Внутри Главной книги»",
      body:
        "Во время трансляции 25.07.2020 будет доступен живой чат.",
      date: "18.07.2020",
      time: "16:40",
      unread: false,
    },
  ];

  // ── Brand header (desktop) ───────────────────────────────────────
  // Pared‑down header from the kit — keeps the brand gradient + logo,
  // drops the inline player so the bell widget is the focus.
  window.BrandHeader = function BrandHeader({
    compact,
    bell,
    user = { name: "Длинное имя\nДлинная фамилия", avatar: "ds/assets/event.png" },
  }) {
    return (
      <header
        style={{
          height: compact ? 64 : 90,
          background: "var(--grad-brand)",
          display: "flex",
          alignItems: "stretch",
          flexShrink: 0,
        }}
      >
        <a
          href="#"
          style={{
            width: compact ? 220 : 340,
            display: "flex",
            alignItems: "center",
            paddingLeft: compact ? 16 : 22,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <img
            src="ds/assets/logo.svg"
            alt="Ритмовремя‑ТВ"
            style={{ width: compact ? 92 : 113, height: compact ? 42 : 52, display: "block" }}
          />
        </a>

        {/* Mid spacer — placeholder for inline player on /schedule */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            paddingLeft: 24,
            color: "rgba(255,255,255,.55)",
            fontSize: 13,
            fontStyle: "italic",
          }}
        >
          <span style={{ opacity: .8 }}>—</span>
        </div>

        {/* Right cluster: bell + user */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            paddingRight: 24,
            paddingLeft: 12,
            position: "relative",
          }}
        >
          {bell}
          <HeaderUser name={user.name} avatar={user.avatar} />
        </div>
      </header>
    );
  };

  function HeaderUser({ name, avatar }) {
    const [first, last] = (name || "").split("\n");
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            color: "#fff",
            fontSize: 14,
            lineHeight: "18px",
            textAlign: "right",
            maxWidth: 160,
          }}
        >
          <div>{first}</div>
          <div style={{ opacity: .85 }}>{last}</div>
        </div>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: avatar ? `url(${avatar}) center/cover` : "var(--c-light-gray)",
            border: "2px solid #fff",
            flexShrink: 0,
          }}
        />
      </div>
    );
  }

  // ── Bell button + popover ────────────────────────────────────────
  window.BellButton = function BellButton({
    unreadCount = 0,
    open,
    onToggle,
    size = 22,
  }) {
    return (
      <button
        onClick={onToggle}
        aria-label="Уведомления"
        style={{
          position: "relative",
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: open ? "rgba(255,255,255,.18)" : "transparent",
          border: "none",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: ".4s",
          padding: 0,
        }}
      >
        <Icon name="bell" size={size} color="#fff" />
        {unreadCount > 0 ? (
          <span
            style={{
              position: "absolute",
              top: 4,
              right: 4,
              minWidth: 20,
              height: 20,
              padding: "0 6px",
              background: "var(--c-pink)",
              borderRadius: 10,
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid #2a3c8e",
              boxSizing: "content-box",
              lineHeight: 1,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>
    );
  };

  // ── Bell popover (the dropdown that opens under the bell) ────────
  window.BellPopover = function BellPopover({
    items = [],
    onItemClick,
    onMarkAll,
    onSeeAll,
    style = {},
    mobile,
  }) {
    const unreadCount = items.filter((i) => i.unread).length;
    return (
      <div
        style={{
          width: mobile ? "100%" : 380,
          maxHeight: mobile ? "calc(100vh - 64px)" : 520,
          background: "#fff",
          borderRadius: mobile ? 0 : "var(--radius)",
          border: mobile ? "none" : "1px solid var(--c-border)",
          boxShadow: mobile ? "none" : "var(--sh-card)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          ...style,
        }}
      >
        {/* Popover header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 18px 12px",
            borderBottom: "1px solid var(--c-border)",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, minWidth: 0 }}>
            <h4
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: "20px",
                color: "var(--c-blue)",
                fontWeight: 700,
              }}
            >
              Уведомления
            </h4>
            {unreadCount > 0 ? (
              <span style={{ fontSize: 13, color: "var(--c-gray)" }}>
                {unreadCount} новых
              </span>
            ) : null}
          </div>
          {unreadCount > 0 ? (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onMarkAll && onMarkAll();
              }}
              style={{
                fontSize: 13,
                color: "var(--c-light-blue)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              прочитать все
            </a>
          ) : null}
        </div>

        {/* List */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {items.length === 0 ? (
            <EmptyPopoverState />
          ) : (
            items.map((it) => (
              <PopoverRow key={it.id} item={it} onClick={() => onItemClick && onItemClick(it)} />
            ))
          )}
        </div>

        {/* Footer */}
        <a
          href="#/notifications"
          onClick={(e) => {
            e.preventDefault();
            onSeeAll && onSeeAll();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: "14px 18px",
            borderTop: "1px solid var(--c-border)",
            color: "var(--c-light-blue)",
            fontSize: 14,
            fontWeight: 500,
            textDecoration: "none",
            background: "var(--c-lightest-gray)",
          }}
        >
          Все уведомления <span style={{ fontSize: 16 }}>→</span>
        </a>
      </div>
    );
  };

  function EmptyPopoverState() {
    return (
      <div
        style={{
          padding: "44px 24px",
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
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--c-bg-blue)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="bell" size={22} color="var(--c-light-blue)" />
        </div>
        <div style={{ fontSize: 14, color: "var(--c-text)" }}>
          Новых уведомлений нет
        </div>
        <div style={{ fontSize: 13, color: "var(--c-gray)", lineHeight: "18px" }}>
          Когда что‑то произойдёт — мы напишем сюда.
        </div>
      </div>
    );
  }

  // Compact row used inside the popover.
  function PopoverRow({ item, onClick }) {
    const [hover, setHover] = useState(false);
    const isFlag = item.type === "notification";
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "grid",
          gridTemplateColumns: "10px 1fr",
          gap: 10,
          alignItems: "flex-start",
          width: "100%",
          textAlign: "left",
          padding: "12px 18px",
          background: hover ? "var(--c-lightest-gray)" : "transparent",
          border: "none",
          borderBottom: "1px solid var(--c-border)",
          cursor: "pointer",
          fontFamily: "var(--font-base)",
          color: "var(--c-text)",
          transition: ".2s",
        }}
      >
        {/* Unread dot column (always present, invisible when read) */}
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: item.unread ? "var(--c-pink)" : "transparent",
            marginTop: 7,
            flexShrink: 0,
          }}
        />

        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
            <Icon
              name={isFlag ? "flag" : "heading"}
              size={11}
              color={isFlag ? "var(--c-pink)" : "var(--c-light-blue)"}
            />
            <span
              style={{
                fontSize: 11,
                color: "var(--c-gray)",
                textTransform: "uppercase",
                letterSpacing: ".04em",
                fontWeight: 500,
              }}
            >
              {isFlag ? "Уведомление" : "Новость"}
            </span>
            <span style={{ fontSize: 11, color: "var(--c-gray)" }}>·</span>
            <span style={{ fontSize: 11, color: "var(--c-gray)", fontVariantNumeric: "tabular-nums" }}>
              {item.date} {item.time}
            </span>
          </div>
          <div
            style={{
              fontSize: 14,
              lineHeight: "19px",
              fontWeight: item.unread ? 500 : 400,
              color: "var(--c-blue)",
              marginBottom: 3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {item.title}
          </div>
          <div
            style={{
              fontSize: 13,
              lineHeight: "18px",
              color: "var(--c-text)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.body}
          </div>
          {item.link ? (
            <div
              style={{
                marginTop: 6,
                fontSize: 12,
                color: "var(--c-light-blue)",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              {item.link.label} <span style={{ fontSize: 14 }}>→</span>
            </div>
          ) : null}
        </div>
      </button>
    );
  }

  // ── Full‑page row (the /notifications page list item) ────────────
  // Two layouts coexist:
  //   • news WITH image — image sits to the right (desktop) or below (mobile)
  //   • news/notification WITHOUT image — full‑width text
  // Notifications WITH link render a chevron CTA; WITHOUT link the row is
  // purely informational.
  window.FullNewsRow = function FullNewsRow({ item, mobile, onClick }) {
    const isFlag = item.type === "notification";
    const hasImage = !!item.image;
    return (
      <article
        onClick={onClick}
        style={{
          position: "relative",
          padding: mobile ? "18px 16px 18px 20px" : "22px 28px 22px 32px",
          borderBottom: "1px solid var(--c-border)",
          cursor: item.link ? "pointer" : "default",
          background: item.unread
            ? "linear-gradient(90deg, rgba(218,18,114,.04) 0%, rgba(218,18,114,0) 60%)"
            : "transparent",
        }}
      >
        {/* Unread indicator stripe at far left */}
        {item.unread ? (
          <span
            style={{
              position: "absolute",
              left: 0,
              top: 22,
              bottom: 22,
              width: 3,
              background: "var(--c-pink)",
              borderRadius: 0,
            }}
            aria-hidden="true"
          />
        ) : null}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: hasImage && !mobile ? "1fr 240px" : "1fr",
            gap: hasImage && !mobile ? 28 : 0,
            alignItems: "flex-start",
          }}
        >
          {/* TEXT COLUMN */}
          <div style={{ minWidth: 0 }}>
            {/* Meta row */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexWrap: "wrap",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "3px 9px 3px 7px",
                  borderRadius: 2,
                  background: isFlag ? "rgba(218,18,114,.10)" : "rgba(20,118,205,.10)",
                  color: isFlag ? "var(--c-pink)" : "var(--c-light-blue)",
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                  fontWeight: 700,
                }}
              >
                <Icon name={isFlag ? "flag" : "heading"} size={11} />
                {isFlag ? "Уведомление" : "Новость"}
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: "var(--c-gray)",
                  fontVariantNumeric: "tabular-nums",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Icon name="time" size={12} />
                {item.date} · {item.time}
              </span>
              {item.unread ? (
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--c-pink)",
                    textTransform: "uppercase",
                    letterSpacing: ".05em",
                    fontWeight: 700,
                  }}
                >
                  непрочитано
                </span>
              ) : null}
            </div>

            <h3
              style={{
                fontSize: mobile ? 17 : 20,
                lineHeight: mobile ? "22px" : "26px",
                margin: 0,
                marginBottom: 8,
                color: "var(--c-blue)",
                fontWeight: 700,
                letterSpacing: ".005em",
              }}
            >
              {item.title}
            </h3>

            <p
              style={{
                fontSize: 14,
                lineHeight: "21px",
                color: "var(--c-text)",
                margin: 0,
              }}
            >
              {item.body}
            </p>

            {/* Mobile image lives in the text flow, after the body */}
            {hasImage && mobile ? (
              <img
                src={item.image}
                alt=""
                style={{
                  marginTop: 14,
                  width: "100%",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                  borderRadius: 2,
                  display: "block",
                }}
              />
            ) : null}

            {item.body2 ? (
              <p
                style={{
                  fontSize: 14,
                  lineHeight: "21px",
                  color: "var(--c-text)",
                  margin: "12px 0 0",
                }}
              >
                {item.body2}
              </p>
            ) : null}

            {/* CTA / link */}
            {item.link ? (
              <a
                href={item.link.href}
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 12,
                  fontSize: 14,
                  color: "var(--c-light-blue)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                {item.link.label}
                <span style={{ fontSize: 16 }}>→</span>
              </a>
            ) : null}
          </div>

          {/* IMAGE COLUMN (desktop only) */}
          {hasImage && !mobile ? (
            <img
              src={item.image}
              alt=""
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                objectFit: "cover",
                borderRadius: 2,
                display: "block",
              }}
            />
          ) : null}
        </div>
      </article>
    );
  };

  // ── Mobile chrome ────────────────────────────────────────────────
  window.MobileTopbar = function MobileTopbar({ title, bell, onBack }) {
    return (
      <header
        style={{
          height: 56,
          background: "var(--grad-brand)",
          display: "flex",
          alignItems: "center",
          padding: "0 8px 0 4px",
          flexShrink: 0,
          gap: 4,
        }}
      >
        <button
          onClick={onBack}
          style={{
            width: 44,
            height: 44,
            background: "transparent",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          aria-label="Назад"
        >
          <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
        <div
          style={{
            flex: 1,
            color: "#fff",
            fontSize: 17,
            fontWeight: 500,
            letterSpacing: ".005em",
            minWidth: 0,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </div>
        {bell}
      </header>
    );
  };

  // ── Sticky filter strip used at top of /notifications ────────────
  window.FilterStrip = function FilterStrip({ tab, setTab, counts, mobile, from, to, onFrom, onTo, onMarkAll }) {
    const tabs = [
      { id: "all", label: "Все", count: counts.all },
      { id: "notifications", label: "Уведомления", icon: "flag", count: counts.notifications },
      { id: "news", label: "Новости", icon: "heading", count: counts.news },
    ];
    return (
      <div
        style={{
          display: "flex",
          alignItems: mobile ? "stretch" : "center",
          justifyContent: "space-between",
          padding: mobile ? "8px 8px 0" : "10px 28px 0",
          flexDirection: mobile ? "column" : "row",
          gap: mobile ? 4 : 16,
          borderBottom: "2px solid var(--c-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 0,
            overflowX: mobile ? "auto" : "visible",
            marginBottom: mobile ? -2 : 0,
          }}
        >
          {tabs.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  background: "none",
                  border: "none",
                  padding: mobile ? "10px 14px 12px" : "12px 22px 14px",
                  fontFamily: "var(--font-base)",
                  fontSize: mobile ? 14 : 15,
                  fontWeight: active ? 700 : 400,
                  color: active ? "var(--c-blue)" : "var(--c-gray)",
                  cursor: "pointer",
                  position: "relative",
                  borderBottom: active ? "2px solid var(--c-pink)" : "2px solid transparent",
                  marginBottom: -2,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  whiteSpace: "nowrap",
                }}
              >
                {t.icon ? (
                  <Icon
                    name={t.icon}
                    size={13}
                    color={active ? "var(--c-pink)" : "var(--c-gray)"}
                  />
                ) : null}
                {t.label}
                <span
                  style={{
                    fontSize: 12,
                    color: active ? "var(--c-pink)" : "var(--c-gray)",
                    fontVariantNumeric: "tabular-nums",
                    opacity: .85,
                  }}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>

        {!mobile ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 8 }}>
            <span style={{ fontSize: 13, color: "var(--c-gray)" }}>с</span>
            <Input value={from} onChange={(e) => onFrom(e.target.value)} style={{ width: 130, height: 34, fontSize: 14 }} />
            <span style={{ fontSize: 13, color: "var(--c-gray)" }}>по</span>
            <Input value={to} onChange={(e) => onTo(e.target.value)} style={{ width: 130, height: 34, fontSize: 14 }} />
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onMarkAll && onMarkAll(); }}
              style={{ fontSize: 13, marginLeft: 4, whiteSpace: "nowrap" }}
            >
              прочитать все
            </a>
          </div>
        ) : null}
      </div>
    );
  };

  // ── Compact sidebar (just enough chrome for the /notifications screen)
  window.MiniSidebar = function MiniSidebar({ activeId = "notifications" }) {
    const items = [
      { id: "schedule",      label: "Расписание",            icon: "home" },
      { id: "media",         label: "Медиатека",             icon: "play" },
      { id: "services",      label: "Сервисы",               icon: "grid" },
      { id: "personal",      label: "Личный кабинет",        icon: "user" },
      { id: "notifications", label: "Уведомления и новости", icon: "flag", badge: 3 },
      { id: "payment",       label: "Оплата трансляций",     icon: "buy" },
      { id: "books",         label: "Электронные книги",     icon: "book", disabled: true },
    ];
    return (
      <aside
        style={{
          width: 308,
          flexShrink: 0,
          background: "var(--grad-nav)",
          borderRadius: "var(--radius)",
          padding: "20px 0",
          alignSelf: "flex-start",
          marginTop: 24,
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
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "10px 24px",
                  textDecoration: "none",
                  color: it.disabled
                    ? "var(--c-light-gray)"
                    : active
                    ? "var(--c-pink)"
                    : "var(--c-blue)",
                  fontWeight: active ? 700 : 400,
                  fontSize: 15,
                  borderLeft: active ? "3px solid var(--c-pink)" : "3px solid transparent",
                  paddingLeft: 21,
                  pointerEvents: it.disabled ? "none" : undefined,
                  position: "relative",
                }}
              >
                <Icon
                  name={it.icon}
                  size={18}
                  color={
                    it.disabled
                      ? "var(--c-light-gray)"
                      : active
                      ? "var(--c-pink)"
                      : "var(--c-blue)"
                  }
                />
                <span style={{ flex: 1 }}>{it.label}</span>
                {it.badge ? (
                  <span
                    style={{
                      minWidth: 20,
                      height: 20,
                      padding: "0 6px",
                      borderRadius: 10,
                      background: "var(--c-pink)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 700,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {it.badge}
                  </span>
                ) : null}
              </a>
            );
          })}
        </nav>
        <div
          style={{
            marginTop: 18,
            padding: "16px 24px 4px",
            borderTop: "1px solid rgba(255,255,255,.5)",
            color: "var(--c-gray)",
            fontSize: 12,
            lineHeight: "18px",
          }}
        >
          ритмовремя‑тв · 2020
        </div>
      </aside>
    );
  };

  // ── Mobile bottom tab bar ────────────────────────────────────────
  window.MobileTabBar = function MobileTabBar({ active = "notifications" }) {
    const tabs = [
      { id: "schedule", label: "Эфир", icon: "home" },
      { id: "media", label: "Медиа", icon: "play" },
      { id: "notifications", label: "Лента", icon: "flag" },
      { id: "personal", label: "Кабинет", icon: "user" },
    ];
    return (
      <nav
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          background: "#fff",
          borderTop: "1px solid var(--c-border)",
          height: 64,
          flexShrink: 0,
        }}
      >
        {tabs.map((t) => {
          const isActive = t.id === active;
          return (
            <a
              key={t.id}
              href={"#/" + t.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                textDecoration: "none",
                color: isActive ? "var(--c-pink)" : "var(--c-gray)",
                fontSize: 11,
              }}
            >
              <Icon
                name={t.icon}
                size={20}
                color={isActive ? "var(--c-pink)" : "var(--c-gray)"}
              />
              {t.label}
            </a>
          );
        })}
      </nav>
    );
  };
})();
