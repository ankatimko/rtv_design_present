// Footer.jsx — bottom footer on brand gradient (light copy, payment icons)
(function () {
  window.Footer = function Footer() {
    return (
      <footer style={{
        background: "var(--grad-brand)",
        color: "#fff",
        padding: "44px 0 28px",
      }}>
        <div style={{
          maxWidth: 1305, margin: "0 auto", padding: "0 24px",
          display: "grid", gridTemplateColumns: "auto 1fr 1fr auto", gap: 56,
        }}>
          <img src="assets/logo.svg" alt="" style={{ width: 113, height: 52 }} />

          <div>
            <h5 style={{ color: "var(--c-pink)", fontSize: 16, margin: "0 0 14px", fontWeight: 700 }}>Контакты</h5>
            <div style={{ fontSize: 13, lineHeight: 1.85, color: "rgba(255,255,255,.85)" }}>
              <div>Учредитель: ООО «ЦИФЕРБЛАТ‑Ы»</div>
              <div>Главный Редактор: Светлана</div>
              <div>Николаевна Солнцева</div>
              <div>Телефон редакции: +7 (812) 309‑16‑22</div>
            </div>
          </div>

          <div>
            <h5 style={{ color: "var(--c-pink)", fontSize: 16, margin: "0 0 14px", fontWeight: 700 }}>Техподдержка</h5>
            <div style={{ fontSize: 13, lineHeight: 1.85, color: "rgba(255,255,255,.85)" }}>
              <div>Email: live@rithm‑time.tv</div>
              <div>Браузер</div>
              <div>Скорость</div>
            </div>
          </div>

          <div>
            <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
              <PayBadge label="🛡" hint="3D Secure" />
              <PayBadge label="MC" />
              <PayBadge label="VISA" />
              <PayBadge label="МИР" />
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.85, color: "rgba(255,255,255,.85)", textAlign: "right" }}>
              <div>Правила продажи</div>
              <div>Оферта</div>
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 32, paddingTop: 18, textAlign: "center",
          fontSize: 11, color: "rgba(255,255,255,.4)",
          borderTop: "1px solid rgba(255,255,255,.12)",
          maxWidth: 1305, marginLeft: "auto", marginRight: "auto",
        }}>
          Интеллектуальная собственность. Все права защищены. © Ритмовремя‑ТВ, 2020
        </div>
      </footer>
    );
  };

  function PayBadge({ label, hint }) {
    return (
      <span title={hint} style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        height: 24, minWidth: 40, padding: "0 8px",
        background: "rgba(255,255,255,.95)", color: "var(--c-blue)",
        borderRadius: 3, fontSize: 11, fontWeight: 700,
        letterSpacing: ".05em",
      }}>{label}</span>
    );
  }
})();
