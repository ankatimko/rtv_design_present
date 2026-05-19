// App.jsx — design-canvas composition for the v2 Уведомления & Новости design.
(function () {
  function App() {
    return (
      <React.Fragment>
        <header style={{
          padding: "32px 60px 12px",
          color: "var(--c-text)", fontFamily: "var(--font-base)",
        }}>
          <div style={{
            fontSize: 12, color: "var(--c-gray)",
            textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 8,
          }}>
            Ритмовремя‑ТВ · v2 · редакционная вёрстка
          </div>
          <h1 style={{
            fontSize: 34, lineHeight: "40px", margin: 0,
            color: "var(--c-blue)", fontWeight: 700, letterSpacing: ".005em",
          }}>
            Уведомления и Новости
          </h1>
          <p style={{
            marginTop: 10, maxWidth: 920, fontSize: 14, lineHeight: "22px",
            color: "var(--c-blue-gray)",
          }}>
            Две раздельные вкладки — <strong>Новости</strong> (редакционный поток
            с обложками и анонсами) и <strong>Уведомления</strong> (компактный
            журнал событий по подпискам). Колокольчик в шапке открывает
            короткую сводку и ведёт на полный список. Кликните любой артборд,
            чтобы развернуть его и пощёлкать вкладки/колокольчик.
          </p>
        </header>

        <DesignCanvas>
          <DCSection
            id="desktop"
            title="Desktop · ≥ 1280 px"
            subtitle="Сайдбар, шапка с плеером, колокольчик с превью"
          >
            <DCArtboard id="desktop-news" label="Страница «Новости»" width={1280} height={1700}>
              <DesktopFeed initialTab="news" />
            </DCArtboard>

            <DCArtboard id="desktop-notifs" label="Страница «Уведомления»" width={1280} height={1340}>
              <DesktopFeed initialTab="notifications" />
            </DCArtboard>

            <DCArtboard id="desktop-bell" label="Поповер колокольчика" width={1280} height={900}>
              <DesktopFeed initialTab="news" openBell />
            </DCArtboard>

            <DCArtboard id="desktop-empty" label="Всё прочитано" width={1280} height={1100}>
              <DesktopFeed initialTab="notifications" allRead />
            </DCArtboard>
          </DCSection>

          <DCSection
            id="mobile"
            title="Mobile · 390 px"
            subtitle="Шапка‑полоса, сегментированные вкладки, поповер‑шторка"
          >
            <DCArtboard id="mobile-news" label="«Новости»" width={390} height={1840}>
              <MobileFeed initialTab="news" />
            </DCArtboard>

            <DCArtboard id="mobile-notifs" label="«Уведомления»" width={390} height={1620}>
              <MobileFeed initialTab="notifications" />
            </DCArtboard>

            <DCArtboard id="mobile-bell" label="Поповер открыт" width={390} height={844}>
              <MobileFeed initialTab="news" openBell />
            </DCArtboard>

            <DCArtboard id="mobile-empty" label="Всё прочитано" width={390} height={1100}>
              <MobileFeed initialTab="notifications" allRead />
            </DCArtboard>
          </DCSection>

          <DCSection
            id="article"
            title="Подробный просмотр новости"
            subtitle="Редакционный layout статьи · Desktop + Mobile"
          >
            <DCArtboard id="article-desktop" label="Desktop · статья" width={1280} height={3300}>
              <DesktopArticle />
            </DCArtboard>
            <DCArtboard id="article-mobile" label="Mobile · статья" width={390} height={3100}>
              <MobileArticle />
            </DCArtboard>
          </DCSection>

          <DCSection id="anatomy" title="Анатомия" subtitle="Карточки во всех вариантах">
            <DCArtboard id="anatomy-news-hero" label="Hero‑карточка новости" width={860} height={460}>
              <Frame>
                <HeroNewsCard item={ANATOMY.heroNews} onClick={() => {}} />
              </Frame>
            </DCArtboard>
            <DCArtboard id="anatomy-news-img" label="Новость с миниатюрой" width={680} height={260}>
              <Frame>
                <NewsCard item={ANATOMY.newsImage} onClick={() => {}} />
              </Frame>
            </DCArtboard>
            <DCArtboard id="anatomy-news-plain" label="Новость без изображения" width={680} height={220}>
              <Frame>
                <NewsCard item={ANATOMY.newsPlain} onClick={() => {}} />
              </Frame>
            </DCArtboard>
            <DCArtboard id="anatomy-notif-link" label="Уведомление со ссылкой" width={680} height={200}>
              <Frame>
                <NotificationRow item={ANATOMY.notifLink} onClick={() => {}} />
              </Frame>
            </DCArtboard>
            <DCArtboard id="anatomy-notif-plain" label="Уведомление без ссылки" width={680} height={180}>
              <Frame>
                <NotificationRow item={ANATOMY.notifPlain} onClick={() => {}} />
              </Frame>
            </DCArtboard>
            <DCArtboard id="anatomy-bell" label="Поповер колокольчика" width={500} height={620}>
              <BellShowcase />
            </DCArtboard>
          </DCSection>
        </DesignCanvas>
      </React.Fragment>
    );
  }

  function Frame({ children }) {
    return (
      <div style={{
        padding: 24, height: "100%",
        background: "var(--c-bg)",
        fontFamily: "var(--font-base)", color: "var(--c-text)",
      }}>{children}</div>
    );
  }

  function BellShowcase() {
    const items = window.SAMPLE_NOTIFICATIONS.slice(0, 5);
    return (
      <div style={{
        background: "var(--grad-brand)", height: "100%",
        padding: "40px 28px",
        display: "flex", justifyContent: "center", alignItems: "flex-start",
        fontFamily: "var(--font-base)",
      }}>
        <div style={{ position: "relative", paddingTop: 8 }}>
          <div style={{ position: "absolute", top: 0, right: 22 }}>
            <BellButton unreadCount={3} open />
          </div>
          <div style={{ marginTop: 68, position: "relative" }}>
            <span style={{
              position: "absolute", top: -7, right: 32,
              width: 14, height: 14, background: "#fff", transform: "rotate(45deg)",
              borderLeft: "1px solid var(--c-border)",
              borderTop: "1px solid var(--c-border)",
            }} />
            <BellPopover items={items} onItemClick={() => {}} onMarkAll={() => {}} onSeeAll={() => {}} />
          </div>
        </div>
      </div>
    );
  }

  const ANATOMY = {
    heroNews: window.SAMPLE_NEWS[0],
    newsImage: window.SAMPLE_NEWS[3],
    newsPlain: window.SAMPLE_NEWS[2],
    notifLink: window.SAMPLE_NOTIFICATIONS[1],
    notifPlain: window.SAMPLE_NOTIFICATIONS[2],
  };

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
})();
