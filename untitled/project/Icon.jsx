// Icon.jsx
// Lucide-style monoline icons (1.5 stroke), tinted to match codebase .icon_* modifiers.
// In production, swap each icon for `<use xlink:href="/img/new/sprite/svgSprite.svg#NAME"/>`.

(function () {
  const I = (path, opts = {}) => ({ path, ...opts });

  const ICONS = {
    // — sprite #play (filled triangle)
    play:        I("M8 5v14l11-7z", { filled: true }),
    pause:       I("M6 4h4v16H6zM14 4h4v16h-4z", { filled: true }),
    "play-round": I("M12 2a10 10 0 100 20 10 10 0 000-20zm-2 6l8 4-8 4z", { filled: true }),

    "media-prev":   I("M6 4v16M7 12l13-9v18z", { filled: false }),
    "media-next":   I("M18 4v16M17 12L4 21V3z",   { filled: false }),
    "media-volume": I("M3 9v6h4l5 4V5L7 9H3z M16 8a5 5 0 010 8 M19 5a9 9 0 010 14"),
    "media-repeat": I("M17 1l4 4-4 4 M3 11V9a4 4 0 014-4h14 M7 23l-4-4 4-4 M21 13v2a4 4 0 01-4 4H3"),
    "media-mix":    I("M16 3h5v5 M21 3l-6 6 M16 21h5v-5 M21 21l-6-6 M3 3l6 6 M3 21l6-6"),

    star:       I("M12 2l3 7 7 .8-5.2 4.7L18 22l-6-3.5L6 22l1.2-7.5L2 9.8 9 9z", { filled: true }),
    "star-border": I("M12 2l3 7 7 .8-5.2 4.7L18 22l-6-3.5L6 22l1.2-7.5L2 9.8 9 9z"),

    plus:       I("M12 5v14M5 12h14"),
    close:      I("M18 6L6 18M6 6l12 12"),
    search:     I("M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-5-5"),
    calendar:   I("M4 7h16v13H4zM4 7V4h4v3M16 4v3M4 11h16"),
    time:       I("M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2"),
    clock:      I("M12 3a9 9 0 100 18 9 9 0 000-18zM12 7v5l3 2"),
    expand:     I("M4 4h6M4 4v6M20 4h-6M20 4v6M4 20h6M4 20v-6M20 20h-6M20 20v-6"),
    "arrow-down": I("M6 9l6 6 6-6"),
    "hide-pass":I("M3 12s4-7 9-7 9 7 9 7-4 7-9 7-9-7-9-7zM12 9a3 3 0 100 6 3 3 0 000-6z"),
    lock:       I("M5 11h14v10H5zM8 11V7a4 4 0 018 0v4"),

    audio:      I("M9 19V5l11-2v14M9 19a3 3 0 11-6 0 3 3 0 016 0zM20 17a3 3 0 11-6 0 3 3 0 016 0z"),
    video:      I("M3 6h13v12H3zM16 10l5-3v10l-5-3"),
    album:      I("M12 3a9 9 0 100 18 9 9 0 000-18zM12 9a3 3 0 100 6 3 3 0 000-6z"),
    books:      I("M4 5h6v15H4zM10 5h4v15h-4zM14 5l5 1-3 14-5-1z"),
    heading:    I("M5 4v16M5 12h11M16 4v16"),
    buy:        I("M3 4h2l3 12h10l3-9H6 M9 21a1 1 0 110-2 1 1 0 010 2zM18 21a1 1 0 110-2 1 1 0 010 2z"),
    cart:       I("M3 4h2l3 12h10l3-9H6 M9 21a1 1 0 110-2 1 1 0 010 2zM18 21a1 1 0 110-2 1 1 0 010 2z"),
    check:      I("M5 12l5 5L20 7"),
    flag:       I("M5 3v18 M5 4h12l-2 5 2 5H5", { filled: true }),
    home:       I("M3 12 L12 4 L21 12 V21 H3 Z"),
    grid:       I("M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"),
    user:       I("M12 4a4 4 0 100 8 4 4 0 000-8zM4 21c0-4 4-7 8-7s8 3 8 7"),
    book:       I("M4 4h12a4 4 0 014 4v12H8a4 4 0 01-4-4z M4 4v12"),
    bell:       I("M6 19h12l-2-2v-5a4 4 0 00-8 0v5l-2 2 M10 21a2 2 0 004 0"),
    settings:   I("M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.2 2.2M16.9 16.9l2.2 2.2M4.9 19.1l2.2-2.2M16.9 7.1l2.2-2.2"),
  };

  window.Icon = function Icon({ name, size = 18, color, className = "", style = {} }) {
    const spec = ICONS[name] || ICONS.close;
    const fill = spec.filled ? "currentColor" : "none";
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={fill}
        stroke="currentColor"
        strokeWidth={spec.filled ? 0 : 1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={{ color: color, flexShrink: 0, ...style }}
      >
        <path d={spec.path} />
      </svg>
    );
  };
})();
