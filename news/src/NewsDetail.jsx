// NewsDetail.jsx — editorial news article view (desktop + mobile).
(function () {
  const { useState } = React;

  // ── Sample long-form article content ─────────────────────────────
  // The article is composed of *blocks* so the same data drives mobile +
  // desktop and any future renderers (RSS, email digest, etc).
  window.SAMPLE_ARTICLE = {
    id: "n1",
    category: "Медиатека",
    title: "Новинки Медиатеки. Май 2026",
    lede:
      "Два премьерных материала месяца — продолжение книги «Струна Взаимопроникновения» и фильм «Сила в энергию. Энергия в силу». Доступ открыт всем подписчикам Ритмовремя‑ТВ.",
    cover: "ds/assets/home-live-brain.png",
    coverCaption: "Иллюстрация из лаборатории «Платы», осень 1997 г.",
    date: "14.05.2026",
    time: "18:33",
    readTime: "4 мин",
    author: { name: "Редакция Ритмовремя‑ТВ", avatar: "ds/assets/event.png" },
    blocks: [
      {
        kind: "p",
        text:
          "В мае 2026 года в медиатеке Ритмовремя‑ТВ открыт доступ к двум публикациям. Обе входят в линейку «Год Улучшений» — материалы выпускаются последовательно и доступны по любой действующей подписке.",
      },
      {
        kind: "quote",
        text:
          "Человек стал разумным с самого первого света. Как только появляется огонь — внимательная кастрюлька с названием «желудок» открывается наружу.",
        cite: "Евдокия Лучезарнова, «Сила в энергию. Энергия в силу»",
      },
      { kind: "h2", text: "Книга «Струна Взаимопроникновения», часть 2" },
      {
        kind: "p",
        text:
          "Книга продолжает серию, открывающую доступ к материалам масштабной лаборатории под общим названием «Платы», проходившей осенью 1997 года. Экспедиции на землю и в человечество, вход и работа в лабораториях, чтение знаков, создание плат и другие темы ждут вас на страницах этой книги.",
      },
      {
        kind: "media",
        media: {
          kind: "book",
          cover: "ds/assets/book-1.png",
          title: "Струна Взаимопроникновения · часть 2",
          subtitle: "Электронная книга · 312 страниц",
          cta: { label: "читать в Электронных книгах", href: "#/books/struna-2" },
        },
      },
      { kind: "h2", text: "Фильм «Сила в энергию. Энергия в силу»" },
      {
        kind: "p",
        text:
          "Не ошибёмся, если скажем, что этот фильм предназначен для самых любознательных и нестандартно‑мыслящих подписчиков сайта Ритмовремя‑ТВ. Посмотрев фильм, получите ответы на вопросы: что есть «энергия» в живой и неживой материи, как меняется сила в разные периоды личной истории, и какие практики стоит включить в распорядок дня.",
      },
      {
        kind: "list",
        items: [
          "Хронометраж: 1 ч 14 мин — без перерыва",
          "Запись с встречи 12 апреля 2026 года, г. Санкт‑Петербург",
          "Доступ ограничен сроком действия подписки",
          "Субтитры: русский · английский",
        ],
      },
      {
        kind: "media",
        media: {
          kind: "video",
          cover: "ds/assets/album-cover.png",
          title: "Сила в энергию. Энергия в силу",
          subtitle: "Фильм · 1 ч 14 мин · 12+",
          cta: { label: "смотреть в медиатеке", href: "#/media/film-sila" },
        },
      },
      { kind: "h2", text: "Где смотреть и что важно помнить" },
      {
        kind: "p",
        text:
          "Оба материала доступны в личном кабинете во вкладках «Медиатека» и «Электронные книги». Если у вас активна подписка на серию «Авторские Озарины» — материалы откроются автоматически, дополнительно их активировать не нужно.",
      },
      {
        kind: "callout",
        text:
          "До 31 мая в «Электронных книгах» открыта 7‑дневная пробная подписка для тех, кто ещё не оформлял её — вместе с майскими новинками будут доступны все архивные книги серии «Платы».",
      },
    ],
    tags: ["платы", "год улучшений", "медиатека", "электронные книги", "авторские озарины"],
  };

  window.SAMPLE_RELATED = [
    { id: "r1", category: "Анонс", title: "Авторский Озарин «Улучшение опор» — запись доступна", date: "06.05.2026", readTime: "1 мин", image: "ds/assets/album-cover.png" },
    { id: "r2", category: "Расписание", title: "4–6 мая — Экспедиции в Радастею. Три маршрута", date: "04.05.2026", readTime: "3 мин", image: "ds/assets/event.png" },
    { id: "r3", category: "Сообщество", title: "День стрелочки 2026: ритмологический рисунок", date: "17.02.2026", readTime: "2 мин", image: "ds/assets/book-1.png" },
  ];

  // ── Article body renderer (shared by desktop + mobile) ──────────
  window.ArticleBody = function ArticleBody({ blocks, mobile }) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: mobile ? 18 : 22 }}>
        {blocks.map((b, i) => <Block key={i} block={b} mobile={mobile} />)}
      </div>
    );
  };

  function Block({ block, mobile }) {
    const baseP = {
      margin: 0, fontSize: mobile ? 16 : 17, lineHeight: mobile ? "26px" : "28px",
      color: "var(--c-text)", textWrap: "pretty",
    };
    switch (block.kind) {
      case "p":
        return <p style={baseP}>{block.text}</p>;
      case "h2":
        return <h2 style={{
          margin: "10px 0 0", fontSize: mobile ? 22 : 26, lineHeight: mobile ? "28px" : "34px",
          color: "var(--c-blue)", fontWeight: 700, letterSpacing: ".005em",
        }}>{block.text}</h2>;
      case "list":
        return (
          <ul style={{
            margin: 0, padding: 0, listStyle: "none",
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {block.items.map((t, i) => (
              <li key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                fontSize: mobile ? 15 : 16, lineHeight: mobile ? "23px" : "25px",
                color: "var(--c-text)",
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "var(--c-pink)", marginTop: 9, flexShrink: 0,
                }} />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        );
      case "quote":
        return (
          <blockquote style={{
            margin: 0,
            padding: mobile ? "16px 18px 18px 22px" : "20px 28px 24px 32px",
            background: "linear-gradient(96deg, rgba(218,18,114,.05), rgba(20,118,205,.04))",
            borderLeft: "3px solid var(--c-pink)",
            borderRadius: 2,
          }}>
            <p style={{
              margin: 0, fontStyle: "italic",
              fontSize: mobile ? 17 : 19, lineHeight: mobile ? "27px" : "29px",
              color: "var(--c-blue)", letterSpacing: ".005em",
              textWrap: "balance",
            }}>«{block.text}»</p>
            {block.cite ? (
              <footer style={{
                marginTop: 10, fontSize: 13, color: "var(--c-gray)", fontStyle: "normal",
              }}>— {block.cite}</footer>
            ) : null}
          </blockquote>
        );
      case "callout":
        return (
          <div style={{
            display: "flex", alignItems: "flex-start", gap: 14,
            padding: mobile ? "16px 16px" : "18px 22px",
            background: "var(--c-bg-blue)",
            border: "1px solid rgba(20,118,205,.18)",
            borderRadius: "var(--radius)",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "var(--c-light-blue)", flexShrink: 0,
              display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff",
            }}>
              <Icon name="star" size={16} color="#fff" />
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: "22px", color: "var(--c-blue)" }}>{block.text}</p>
          </div>
        );
      case "media":
        return <MediaCard media={block.media} mobile={mobile} />;
      default:
        return null;
    }
  }

  function MediaCard({ media, mobile }) {
    const isVideo = media.kind === "video";
    return (
      <a href={media.cta.href} style={{
        display: "grid",
        gridTemplateColumns: mobile ? "1fr" : "200px 1fr",
        gap: 0, textDecoration: "none",
        background: "#fff",
        border: "1px solid var(--c-border)",
        borderRadius: "var(--radius)",
        overflow: "hidden", transition: ".25s ease",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 14px 32px -10px rgba(10,39,74,.22)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
      >
        <div style={{
          aspectRatio: mobile ? "16 / 9" : "auto",
          minHeight: mobile ? undefined : 150,
          background: `url(${media.cover}) center/cover, var(--c-bg-blue)`,
          position: "relative",
        }}>
          {isVideo ? (
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(10,39,74,.25)",
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "rgba(255,255,255,.95)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 18px rgba(0,0,0,.25)", color: "var(--c-pink)",
              }}>
                <Icon name="play" size={22} color="var(--c-pink)" />
              </div>
            </div>
          ) : null}
        </div>
        <div style={{
          padding: mobile ? "18px 18px 20px" : "22px 28px",
          display: "flex", flexDirection: "column", justifyContent: "center", gap: 6, minWidth: 0,
        }}>
          <span style={{
            fontSize: 11, color: isVideo ? "var(--c-pink)" : "var(--c-light-blue)",
            textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700,
          }}>
            {isVideo ? "Фильм в медиатеке" : "Электронная книга"}
          </span>
          <h4 style={{
            margin: 0, fontSize: 18, lineHeight: "24px",
            color: "var(--c-blue)", fontWeight: 700, letterSpacing: ".005em",
          }}>{media.title}</h4>
          <div style={{ fontSize: 13, color: "var(--c-gray)" }}>{media.subtitle}</div>
          <div style={{
            marginTop: 6, fontSize: 13, fontWeight: 700, color: "var(--c-light-blue)",
            fontVariant: "small-caps", textTransform: "lowercase", letterSpacing: ".04em",
            display: "inline-flex", alignItems: "center", gap: 8,
          }}>
            {media.cta.label} <span style={{ fontSize: 16, textTransform: "none" }}>→</span>
          </div>
        </div>
      </a>
    );
  }

  // ── Share strip ─────────────────────────────────────────────────
  window.ShareStrip = function ShareStrip({ compact }) {
    const channels = [
      { name: "Telegram", letter: "T", color: "#2AABEE" },
      { name: "VK",       letter: "V", color: "#0077FF" },
      { name: "Email",    letter: "@", color: "#596882" },
      { name: "Ссылка",   letter: "↗", color: "var(--c-light-blue)" },
    ];
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {!compact ? <span style={{ fontSize: 13, color: "var(--c-gray)" }}>поделиться</span> : null}
        {channels.map((c) => (
          <button key={c.name} title={c.name} style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "#fff", border: "1px solid var(--c-border)",
            color: c.color, cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 700, transition: ".2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = c.color; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = c.color; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = c.color; e.currentTarget.style.borderColor = "var(--c-border)"; }}>
            {c.letter}
          </button>
        ))}
      </div>
    );
  };

  // ── Tag chips ────────────────────────────────────────────────────
  window.TagChips = function TagChips({ tags }) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {tags.map((t) => (
          <a key={t} href={"#/tag/" + t} style={{
            display: "inline-flex", padding: "5px 12px",
            background: "var(--c-lightest-gray)",
            color: "var(--c-blue-gray)",
            fontSize: 13, fontWeight: 500,
            borderRadius: 999, textDecoration: "none",
            border: "1px solid var(--c-border)", transition: ".2s",
          }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--c-bg-blue)"; e.currentTarget.style.color = "var(--c-light-blue)"; e.currentTarget.style.borderColor = "var(--c-light-blue)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--c-lightest-gray)"; e.currentTarget.style.color = "var(--c-blue-gray)"; e.currentTarget.style.borderColor = "var(--c-border)"; }}
          >#{t}</a>
        ))}
      </div>
    );
  };

  // ── Related rail ─────────────────────────────────────────────────
  window.RelatedRail = function RelatedRail({ items, mobile, title = "Читать дальше" }) {
    return (
      <aside>
        <h3 style={{
          margin: 0, marginBottom: 14, fontSize: 13,
          color: "var(--c-gray)",
          textTransform: "uppercase", letterSpacing: ".1em", fontWeight: 700,
        }}>{title}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {items.map((it) => (
            <a key={it.id} href={"#/news/" + it.id} style={{
              display: "grid",
              gridTemplateColumns: mobile ? "96px 1fr" : "1fr",
              gap: mobile ? 14 : 0,
              textDecoration: "none", color: "var(--c-text)",
              background: "#fff",
              border: "1px solid var(--c-border)",
              borderRadius: "var(--radius)",
              overflow: "hidden", transition: ".2s",
            }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 8px 22px -10px rgba(10,39,74,.2)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
            >
              <div style={{
                aspectRatio: mobile ? "1 / 1" : "16 / 9",
                background: `url(${it.image}) center/cover, var(--c-bg-blue)`,
              }} />
              <div style={{
                padding: mobile ? "10px 12px 10px 0" : "14px 16px 16px",
                display: "flex", flexDirection: "column", gap: 6,
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "var(--c-pink)",
                  textTransform: "uppercase", letterSpacing: ".06em",
                }}>{it.category}</span>
                <h4 style={{
                  margin: 0,
                  fontSize: mobile ? 14 : 15, lineHeight: mobile ? "19px" : "21px",
                  color: "var(--c-blue)", fontWeight: 700, letterSpacing: ".005em",
                }}>{it.title}</h4>
                <div style={{
                  fontSize: 12, color: "var(--c-gray)",
                  display: "inline-flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>{window.shortDate(it.date)}</span>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--c-light-gray)" }} />
                  <span>{it.readTime}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </aside>
    );
  };

  function ArticleHeader({ article }) {
    return (
      <header style={{ marginBottom: 26 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <a href={"#/news/category/" + article.category} style={{
            fontSize: 12, fontWeight: 700, color: "var(--c-pink)",
            textTransform: "uppercase", letterSpacing: ".1em",
            textDecoration: "none",
            paddingRight: 12, borderRight: "1px solid var(--c-light-gray)",
          }}>{article.category}</a>
          <span style={{
            fontSize: 13, color: "var(--c-gray)",
            display: "inline-flex", alignItems: "center", gap: 6,
            fontVariantNumeric: "tabular-nums",
          }}>
            <Icon name="calendar" size={12} color="var(--c-pink)" />
            {window.longDate(article.date)} · {article.time}
          </span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--c-light-gray)" }} />
          <span style={{
            fontSize: 13, color: "var(--c-gray)",
            display: "inline-flex", alignItems: "center", gap: 5,
          }}>
            <Icon name="time" size={12} color="var(--c-gray)" />
            читать {article.readTime}
          </span>
        </div>
        <h1 style={{
          margin: 0, fontSize: 44, lineHeight: "52px",
          color: "var(--c-blue)", fontWeight: 700,
          letterSpacing: ".005em", textWrap: "balance",
        }}>{article.title}</h1>
      </header>
    );
  }

  function AuthorCard({ author }) {
    return (
      <div style={{
        background: "#fff",
        border: "1px solid var(--c-border)",
        borderRadius: "var(--radius)",
        padding: 18,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: `url(${author.avatar}) center/cover, var(--c-light-gray)`,
          border: "2px solid var(--c-border)", flexShrink: 0,
        }} />
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontSize: 11, color: "var(--c-gray)",
            textTransform: "uppercase", letterSpacing: ".08em",
            fontWeight: 700, marginBottom: 2,
          }}>Автор</div>
          <div style={{
            fontSize: 14, lineHeight: "20px",
            color: "var(--c-blue)", fontWeight: 700,
          }}>{author.name}</div>
        </div>
      </div>
    );
  }

  function ReactionBar() {
    const [reaction, setReaction] = useState(null);
    const opts = [
      { id: "like", label: "Полезно", icon: "check", count: 47 },
      { id: "star", label: "В избранное", icon: "star-border", count: 12 },
    ];
    return (
      <div style={{ display: "flex", gap: 8 }}>
        {opts.map((o) => {
          const active = reaction === o.id;
          return (
            <button key={o.id} onClick={() => setReaction(active ? null : o.id)} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "8px 14px", borderRadius: "var(--radius)",
              background: active ? "var(--c-bg-blue)" : "#fff",
              border: `1px solid ${active ? "var(--c-light-blue)" : "var(--c-border)"}`,
              color: active ? "var(--c-light-blue)" : "var(--c-blue-gray)",
              fontFamily: "var(--font-base)", fontSize: 13, fontWeight: 500,
              cursor: "pointer", transition: ".2s",
            }}>
              <Icon name={o.icon} size={14} color={active ? "var(--c-light-blue)" : "var(--c-blue-gray)"} />
              {o.label}
              <span style={{
                fontSize: 11, fontVariantNumeric: "tabular-nums",
                color: active ? "var(--c-light-blue)" : "var(--c-gray)",
                fontWeight: 700,
              }}>{o.count + (active ? 1 : 0)}</span>
            </button>
          );
        })}
      </div>
    );
  }

  function ArticleNav() {
    return (
      <nav style={{
        marginTop: 36, paddingTop: 24,
        borderTop: "1px solid var(--c-border)",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16,
      }}>
        <NavCard direction="prev" label="Предыдущая новость" title="Запись Авторского Озарина «Улучшение опор»" />
        <NavCard direction="next" label="Следующая новость" title="Новинки Медиатеки. Июнь 2026" />
      </nav>
    );
  }

  function NavCard({ direction, label, title }) {
    const prev = direction === "prev";
    return (
      <a href="#" style={{
        display: "flex", flexDirection: "column", gap: 8,
        padding: 18, borderRadius: "var(--radius)",
        background: "#fff", border: "1px solid var(--c-border)",
        textDecoration: "none",
        textAlign: prev ? "left" : "right", transition: ".2s",
      }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--c-light-blue)"; e.currentTarget.style.background = "var(--c-bg-blue)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--c-border)"; e.currentTarget.style.background = "#fff"; }}
      >
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          alignSelf: prev ? "flex-start" : "flex-end",
          fontSize: 11, color: "var(--c-gray)",
          textTransform: "uppercase", letterSpacing: ".08em", fontWeight: 700,
        }}>
          {prev ? <span>←</span> : null}{label}{!prev ? <span>→</span> : null}
        </div>
        <div style={{ fontSize: 15, lineHeight: "20px", color: "var(--c-blue)", fontWeight: 700 }}>{title}</div>
      </a>
    );
  }

  // ── Desktop article page ─────────────────────────────────────────
  window.DesktopArticle = function DesktopArticle() {
    const a = window.SAMPLE_ARTICLE;
    const [bellOpen, setBellOpen] = useState(false);
    const popoverItems = window.SAMPLE_NOTIFICATIONS.slice(0, 5);
    const unreadTotal = window.SAMPLE_NOTIFICATIONS.filter((i) => i.unread).length;

    return (
      <div
        data-screen-label="Desktop · Article"
        style={{
          width: "100%", height: "100%", background: "var(--c-bg)",
          display: "flex", flexDirection: "column",
          fontFamily: "var(--font-base)", color: "var(--c-text)",
          overflow: "hidden", position: "relative",
        }}
      >
        <BrandHeader
          bell={
            <div style={{ position: "relative" }}>
              <BellButton unreadCount={unreadTotal} open={bellOpen} onToggle={() => setBellOpen((v) => !v)} />
              {bellOpen ? (
                <div style={{ position: "absolute", top: 56, right: -8, zIndex: 50 }}>
                  <span style={{
                    position: "absolute", top: -7, right: 20, width: 14, height: 14, background: "#fff",
                    transform: "rotate(45deg)", borderLeft: "1px solid var(--c-border)", borderTop: "1px solid var(--c-border)",
                  }} />
                  <BellPopover items={popoverItems} onItemClick={() => {}} onMarkAll={() => {}} onSeeAll={() => setBellOpen(false)} />
                </div>
              ) : null}
            </div>
          }
        />

        <div style={{ flex: 1, display: "flex", justifyContent: "center", padding: "0 24px", overflowY: "auto" }}>
          <div style={{ display: "flex", gap: 16, maxWidth: 1305, width: "100%", alignItems: "flex-start" }}>
            <MiniSidebar activeId="news" />

            <main style={{ flex: 1, minWidth: 0, padding: "24px 0 56px" }}>
              <a href="#/news" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: 13, fontWeight: 700,
                color: "var(--c-light-blue)",
                fontVariant: "small-caps", textTransform: "lowercase", letterSpacing: ".06em",
                textDecoration: "none", marginBottom: 22,
              }}>
                <span style={{ fontSize: 16, textTransform: "none" }}>←</span> ко всем новостям
              </a>

              <div style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 300px",
                gap: 48, alignItems: "flex-start",
              }}>
                <article style={{ minWidth: 0 }}>
                  <ArticleHeader article={a} />

                  <figure style={{ margin: "0 0 32px" }}>
                    <div style={{
                      width: "100%", aspectRatio: "16 / 9",
                      background: `url(${a.cover}) center/cover, var(--c-bg-blue)`,
                      borderRadius: "var(--radius)",
                      boxShadow: "0 24px 60px -20px rgba(10,39,74,.35)",
                    }} />
                    {a.coverCaption ? (
                      <figcaption style={{
                        marginTop: 10, fontSize: 12, color: "var(--c-gray)",
                        fontStyle: "italic", letterSpacing: ".005em",
                      }}>{a.coverCaption}</figcaption>
                    ) : null}
                  </figure>

                  <p style={{
                    margin: "0 0 28px",
                    fontSize: 20, lineHeight: "30px",
                    color: "var(--c-blue)", fontWeight: 500,
                    letterSpacing: ".005em", textWrap: "pretty",
                  }}>{a.lede}</p>

                  <ArticleBody blocks={a.blocks} />

                  <div style={{
                    marginTop: 36, paddingTop: 22,
                    borderTop: "1px solid var(--c-border)",
                    display: "flex", flexDirection: "column", gap: 16,
                  }}>
                    <TagChips tags={a.tags} />
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      gap: 16, flexWrap: "wrap",
                    }}>
                      <ShareStrip />
                      <ReactionBar />
                    </div>
                  </div>

                  <ArticleNav />
                </article>

                <aside style={{
                  position: "sticky", top: 24,
                  display: "flex", flexDirection: "column", gap: 28,
                }}>
                  <AuthorCard author={a.author} />
                  <RelatedRail items={window.SAMPLE_RELATED} />
                </aside>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  };

  // ── Mobile article page ──────────────────────────────────────────
  window.MobileArticle = function MobileArticle() {
    const a = window.SAMPLE_ARTICLE;
    const [bellOpen, setBellOpen] = useState(false);
    const unreadTotal = window.SAMPLE_NOTIFICATIONS.filter((i) => i.unread).length;
    const popoverItems = window.SAMPLE_NOTIFICATIONS.slice(0, 5);

    return (
      <div
        data-screen-label="Mobile · Article"
        style={{
          width: "100%", height: "100%", background: "var(--c-bg)",
          display: "flex", flexDirection: "column",
          fontFamily: "var(--font-base)", color: "var(--c-text)",
          overflow: "hidden", position: "relative",
        }}
      >
        <header style={{
          background: "var(--grad-brand)",
          height: 56, flexShrink: 0,
          display: "flex", alignItems: "center", padding: "0 6px 0 0",
          color: "#fff",
        }}>
          <button style={{
            width: 44, height: 44, background: "transparent", border: "none",
            color: "#fff", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }} aria-label="Назад">
            <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <div style={{
            flex: 1, fontSize: 13, fontWeight: 500, opacity: .9,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>Новости</div>
          <BellButton unreadCount={unreadTotal} open={bellOpen} onToggle={() => setBellOpen((v) => !v)} />
        </header>

        <div style={{ flex: 1, overflowY: "auto" }}>
          <div style={{
            width: "100%", aspectRatio: "16 / 9",
            background: `url(${a.cover}) center/cover, var(--c-bg-blue)`,
          }} />

          <article style={{ padding: "20px 16px 8px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 12, flexWrap: "wrap",
            }}>
              <span style={{
                fontSize: 11, fontWeight: 700, color: "var(--c-pink)",
                textTransform: "uppercase", letterSpacing: ".08em",
              }}>{a.category}</span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--c-light-gray)" }} />
              <span style={{
                fontSize: 12, color: "var(--c-gray)",
                fontVariantNumeric: "tabular-nums",
              }}>{window.longDate(a.date)} · читать {a.readTime}</span>
            </div>

            <h1 style={{
              margin: 0, marginBottom: 10,
              fontSize: 28, lineHeight: "34px",
              color: "var(--c-blue)", fontWeight: 700,
              letterSpacing: ".005em", textWrap: "balance",
            }}>{a.title}</h1>

            {a.coverCaption ? (
              <p style={{ margin: "0 0 18px", fontSize: 12, color: "var(--c-gray)", fontStyle: "italic" }}>{a.coverCaption}</p>
            ) : null}

            <p style={{
              margin: "0 0 22px", fontSize: 17, lineHeight: "27px",
              color: "var(--c-blue)", fontWeight: 500, letterSpacing: ".005em",
            }}>{a.lede}</p>

            <ArticleBody blocks={a.blocks} mobile />

            <div style={{
              marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--c-border)",
              display: "flex", flexDirection: "column", gap: 18,
            }}>
              <TagChips tags={a.tags} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <ShareStrip compact />
                <ReactionBar />
              </div>
            </div>
          </article>

          <div style={{ padding: "8px 16px 24px" }}>
            <RelatedRail items={window.SAMPLE_RELATED} mobile />
          </div>
        </div>

        <MobileTabBar active="news" />

        {bellOpen ? (
          <div onClick={() => setBellOpen(false)} style={{
            position: "absolute", inset: 0,
            background: "rgba(10,39,74,.55)",
            backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
            zIndex: 40, display: "flex", flexDirection: "column",
          }}>
            <div onClick={(e) => e.stopPropagation()} style={{ marginTop: 56 }}>
              <BellPopover items={popoverItems} mobile onItemClick={() => setBellOpen(false)} onMarkAll={() => {}} onSeeAll={() => setBellOpen(false)} />
            </div>
          </div>
        ) : null}
      </div>
    );
  };
})();
