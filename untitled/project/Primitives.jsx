// Primitives.jsx
// Button, Input, Card, Pill — strict mirrors of style.sass / base.sass.

(function () {
  const { useState } = React;

  // ── Button ────────────────────────────────────────────────────────
  // Production: `.btn` (primary), `.btn-2` (outline), `.button_transparent` (ghost).
  // Always lowercase content → small-caps via CSS.
  const BTN_BASE = {
    fontFamily: "var(--font-base)",
    fontSize: 14,
    fontWeight: 500,
    lineHeight: "24px",
    padding: "6px 22px",
    borderRadius: "var(--radius)",
    border: "2px solid var(--c-light-blue)",
    background: "var(--c-light-blue)",
    color: "#fff",
    fontVariant: "small-caps",
    textTransform: "lowercase",
    letterSpacing: 0,
    cursor: "pointer",
    transition: ".4s",
    outline: "none",
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  };

  window.Button = function Button({ variant = "primary", disabled, icon, children, style = {}, ...rest }) {
    const [hover, setHover] = useState(false);
    const [active, setActive] = useState(false);

    const variantStyle =
      variant === "outline" ? { background: "#fff", color: "var(--c-light-blue)" } :
      variant === "ghost"   ? { background: "transparent", borderColor: "transparent", color: "var(--c-light-blue)", padding: "6px 10px" } :
      {};

    const stateStyle = disabled
      ? { background: "var(--c-light-gray)", borderColor: "var(--c-light-gray)", color: "#fff", boxShadow: "none", cursor: "default" }
      : active ? { boxShadow: "var(--sh-active)" }
      : hover  ? { boxShadow: "var(--sh-hover)" }
      : {};

    return (
      <button
        {...rest}
        disabled={disabled}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => { setHover(false); setActive(false); }}
        onMouseDown={() => setActive(true)}
        onMouseUp={() => setActive(false)}
        style={{ ...BTN_BASE, ...variantStyle, ...stateStyle, ...style }}
      >
        {icon ? <Icon name={icon} size={16} /> : null}
        {children}
      </button>
    );
  };

  // ── Input ─────────────────────────────────────────────────────────
  window.Input = function Input({ error, style = {}, suffix, ...rest }) {
    const [focused, setFocused] = useState(false);
    const border = error
      ? "1px solid var(--c-error)"
      : focused
        ? "1px solid var(--c-gray)"
        : "var(--ui-border)";
    return (
      <div style={{ position: "relative", width: "100%" }}>
        <input
          {...rest}
          onFocus={(e) => { setFocused(true); rest.onFocus && rest.onFocus(e); }}
          onBlur={(e)  => { setFocused(false); rest.onBlur && rest.onBlur(e); }}
          style={{
            width: "100%",
            padding: "8px 12px",
            paddingRight: suffix ? 38 : 12,
            borderRadius: "var(--radius)",
            border,
            background: "var(--c-white)",
            fontSize: 16,
            lineHeight: "21px",
            color: "var(--c-text)",
            height: 40,
            outline: "none",
            fontFamily: "var(--font-base)",
            boxSizing: "border-box",
            transition: ".25s",
            ...style,
          }}
        />
        {suffix ? (
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", color: "var(--c-pink)", cursor: "pointer" }}>
            {suffix}
          </span>
        ) : null}
      </div>
    );
  };

  // ── Card / ContentBlock ───────────────────────────────────────────
  window.Card = function Card({ gray, children, style = {}, ...rest }) {
    return (
      <div
        {...rest}
        style={{
          background: gray ? "var(--c-lightest-gray)" : "var(--c-white)",
          border: "var(--block-border)",
          borderRadius: "var(--radius)",
          marginBottom: 16,
          ...style,
        }}
      >
        {children}
      </div>
    );
  };

  window.CardHeader = function CardHeader({ title, right }) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        minHeight: 58, padding: "0 32px",
        borderBottom: "1px solid var(--c-border)",
      }}>
        <h3 style={{ margin: 0, fontSize: 20, lineHeight: "24px", letterSpacing: "0.005em" }}>{title}</h3>
        {right}
      </div>
    );
  };

  window.CardBody = function CardBody({ children, style = {} }) {
    return <div style={{ padding: "20px 32px 28px", ...style }}>{children}</div>;
  };

  // ── Pill / tag (live indicator) ───────────────────────────────────
  window.LiveDot = function LiveDot({ size = 8, style = {} }) {
    return <span style={{ display: "inline-block", width: size, height: size, borderRadius: "50%", background: "var(--c-pink)", flexShrink: 0, ...style }} />;
  };

  // ── Radio (pink/blue variants) ────────────────────────────────────
  window.Radio = function Radio({ checked, label, color = "blue", onChange }) {
    const c = color === "pink" ? "var(--c-pink)" : "var(--c-light-blue)";
    return (
      <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 14, color: "var(--c-text)" }}>
        <span style={{
          position: "relative",
          width: 14, height: 14, borderRadius: "50%",
          border: `1px solid ${checked ? c : "var(--c-gray)"}`,
          boxSizing: "border-box",
        }}>
          {checked ? <span style={{
            position: "absolute", inset: 3, borderRadius: "50%", background: c,
          }} /> : null}
        </span>
        <input type="radio" checked={!!checked} onChange={onChange} style={{ display: "none" }} />
        {label}
      </label>
    );
  };

  // ── Tabs ──────────────────────────────────────────────────────────
  window.Tabs = function Tabs({ value, onChange, items }) {
    return (
      <div style={{ display: "flex", borderBottom: "2px solid var(--c-border)", gap: 0 }}>
        {items.map((it) => {
          const active = value === it.id;
          return (
            <button key={it.id} onClick={() => onChange(it.id)} style={{
              background: "none", border: "none", padding: "12px 22px 14px",
              fontFamily: "var(--font-base)", fontSize: 15,
              fontWeight: active ? 700 : 400,
              color: active ? "var(--c-blue)" : "var(--c-gray)",
              cursor: "pointer", position: "relative",
              borderBottom: active ? "2px solid var(--c-pink)" : "2px solid transparent",
              marginBottom: -2,
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              {it.icon ? <Icon name={it.icon} size={14} color={active ? "var(--c-pink)" : "var(--c-gray)"} /> : null}
              {it.label}
            </button>
          );
        })}
      </div>
    );
  };
})();
