// App.jsx — wires the screens into a Design Canvas.
(function () {
  function App() {
    return (
      <React.Fragment>
        {/* Context / decisions banner */}
        <header
          style={{
            padding: "28px 60px 8px",
            color: "var(--c-text)",
            fontFamily: "var(--font-base)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "var(--c-gray)",
              textTransform: "uppercase",
              letterSpacing: ".08em",
              marginBottom: 6,
            }}
          >
            Ритмовремя‑ТВ · v1
          </div>
          <h1
            style={{
              fontSize: 32,
              lineHeight: "36px",
              margin: 0,
              color: "var(--c-blue)",
              fontWeight: 700,
              letterSpacing: ".005em",
            }}
          >
            Уведомления и новости — web + mobile
          </h1>
          <p
            style={{
              marginTop: 8,
              maxWidth: 920,
              fontSize: 14,
              lineHeight: "21px",
              color: "var(--c-blue-gray)",
            }}
          >
            Лента ленты «Уведомления и новости» (страница{" "}
            <code style={{ fontFamily: "inherit", color: "var(--c-blue)" }}>/notifications</code>) и
            новый виджет‑колокольчик в глобальной шапке. Карточки новостей работают
            с превью‑изображением и без, уведомления — со ссылкой и без. Кликните
            по любому артборду, чтобы развернуть его на весь экран; в раскрытом
            виде колокольчик и список интерактивны.
          </p>
        </header>

        <DesignCanvas>
          <DCSection
            id="desktop"
            title="Desktop · ≥ 1280 px"
            subtitle="Полная страница ленты + поповер уведомлений в шапке"
          >
            <DCArtboard
              id="desktop-page"
              label="Страница /notifications"
              width={1280}
              height={1520}
            >
              <DesktopNotifications />
            </DCArtboard>

            <DCArtboard
              id="desktop-bell-open"
              label="Шапка — поповер колокольчика открыт"
              width={1280}
              height={900}
            >
              <DesktopNotifications openBell />
            </DCArtboard>

            <DCArtboard
              id="desktop-empty"
              label="Пустое состояние"
              width={1280}
              height={760}
            >
              <DesktopNotificationsEmpty />
            </DCArtboard>
          </DCSection>

          <DCSection
            id="mobile"
            title="Mobile · 390 px"
            subtitle="Та же лента, шапка‑полоса, поповер‑шторка под шапкой"
          >
            <DCArtboard
              id="mobile-page"
              label="Лента /notifications"
              width={390}
              height={1640}
            >
              <MobileNotifications />
            </DCArtboard>

            <DCArtboard
              id="mobile-bell-open"
              label="Поповер открыт"
              width={390}
              height={844}
            >
              <MobileNotifications openBell />
            </DCArtboard>

            <DCArtboard
              id="mobile-empty"
              label="Пустое состояние"
              width={390}
              height={844}
            >
              <MobileNotificationsEmpty />
            </DCArtboard>
          </DCSection>

          <DCSection
            id="anatomy"
            title="Анатомия"
            subtitle="Карточки новости и уведомления — все сочетания"
          >
            <DCArtboard
              id="anatomy-news-image"
              label="Новость с изображением"
              width={820}
              height={340}
            >
              <AnatomyFrame>
                <FullNewsRow item={ANATOMY_NEWS_IMAGE} />
              </AnatomyFrame>
            </DCArtboard>
            <DCArtboard
              id="anatomy-news-plain"
              label="Новость без изображения"
              width={820}
              height={260}
            >
              <AnatomyFrame>
                <FullNewsRow item={ANATOMY_NEWS_PLAIN} />
              </AnatomyFrame>
            </DCArtboard>
            <DCArtboard
              id="anatomy-notification-link"
              label="Уведомление со ссылкой"
              width={820}
              height={260}
            >
              <AnatomyFrame>
                <FullNewsRow item={ANATOMY_NOTIF_LINK} />
              </AnatomyFrame>
            </DCArtboard>
            <DCArtboard
              id="anatomy-notification-plain"
              label="Уведомление без ссылки"
              width={820}
              height={220}
            >
              <AnatomyFrame>
                <FullNewsRow item={ANATOMY_NOTIF_PLAIN} />
              </AnatomyFrame>
            </DCArtboard>

            <DCArtboard
              id="anatomy-bell-isolated"
              label="Поповер · крупно"
              width={460}
              height={620}
            >
              <BellAnatomy />
            </DCArtboard>
          </DCSection>
        </DesignCanvas>
      </React.Fragment>
    );
  }

  // ── Helpers ──────────────────────────────────────────────────────
  function DesktopNotificationsEmpty() {
    // Render the full desktop chrome but with all-empty list to show the empty state in context.
    const orig = window.SAMPLE_ITEMS;
    React.useEffect(() => {
      window.SAMPLE_ITEMS = [];
      return () => { window.SAMPLE_ITEMS = orig; };
    }, []);
    return <DesktopNotifications />;
  }

  function MobileNotificationsEmpty() {
    const orig = window.SAMPLE_ITEMS;
    React.useEffect(() => {
      window.SAMPLE_ITEMS = [];
      return () => { window.SAMPLE_ITEMS = orig; };
    }, []);
    return <MobileNotifications />;
  }

  function AnatomyFrame({ children }) {
    return (
      <div
        style={{
          background: "#fff",
          border: "var(--block-border)",
          borderRadius: "var(--radius)",
          margin: 20,
          overflow: "hidden",
          fontFamily: "var(--font-base)",
          color: "var(--c-text)",
        }}
      >
        {children}
      </div>
    );
  }

  function BellAnatomy() {
    const items = window.SAMPLE_ITEMS.slice(0, 5);
    return (
      <div
        style={{
          background: "var(--grad-brand)",
          height: "100%",
          padding: 40,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          fontFamily: "var(--font-base)",
        }}
      >
        <div style={{ position: "relative", paddingTop: 28 }}>
          <div style={{ position: "absolute", top: -8, right: 18 }}>
            <BellButton unreadCount={3} open />
          </div>
          <div
            style={{
              position: "relative",
              marginTop: 60,
            }}
          >
            <span
              style={{
                position: "absolute",
                top: -7,
                right: 28,
                width: 14,
                height: 14,
                background: "#fff",
                transform: "rotate(45deg)",
                borderLeft: "1px solid var(--c-border)",
                borderTop: "1px solid var(--c-border)",
              }}
            />
            <BellPopover
              items={items}
              onItemClick={() => {}}
              onMarkAll={() => {}}
              onSeeAll={() => {}}
            />
          </div>
        </div>
      </div>
    );
  }

  // Anatomy sample items
  const ANATOMY_NEWS_IMAGE = {
    id: "an1",
    type: "news",
    title: "Аудиотека теперь и в Android",
    body:
      "Рады сообщить, что в обновлённой версии приложения для Android доступна аудиотека.",
    image: "ds/assets/home-live-brain.png",
    date: "22.07.2020",
    time: "09:00",
    unread: true,
    link: { href: "#", label: "Читать всю новость" },
  };
  const ANATOMY_NEWS_PLAIN = {
    id: "an2",
    type: "news",
    title: "Тема номера: «Часовой механизм»",
    body:
      "Опубликовано продолжение цикла «Ритмомерные часы»: «Я при часах или часовой механизм».",
    date: "19.07.2020",
    time: "10:14",
    unread: false,
    link: { href: "#", label: "Открыть статью" },
  };
  const ANATOMY_NOTIF_LINK = {
    id: "an3",
    type: "notification",
    title: "Подписка «Спектакли» истекает",
    body:
      "Ваша подписка на серию «СТ‑эффект» заканчивается 30.07.2020. Продлите её, чтобы не пропустить премьеры.",
    date: "22.07.2020",
    time: "08:15",
    unread: true,
    link: { href: "#", label: "Продлить подписку" },
  };
  const ANATOMY_NOTIF_PLAIN = {
    id: "an4",
    type: "notification",
    title: "Платёж принят",
    body:
      "Оплата подписки «Вертикальный календарь» на 12 месяцев успешно прошла. Доступ открыт до 21.07.2021.",
    date: "21.07.2020",
    time: "20:31",
    unread: false,
  };

  // Mount
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
})();
