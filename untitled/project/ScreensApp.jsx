// ScreensApp.jsx — mounts the 4 static Полотна screens onto a Design Canvas.
(function () {
  // Each artboard renders one self-contained screen of the Полотна service.
  // Width is the same across the four so they line up; heights vary by content.
  const W = 1040;

  function App() {
    return (
      <DesignCanvas>
        <DCSection
          id="polotna-screens"
          title="Полотна — экраны"
          subtitle="L1 → L4 как отдельные статические экраны (вместо одного динамического)"
        >
          <DCArtboard id="L1" label="L1 · Полотна (главная)"           width={W} height={780}>
            <ScreenL1 />
          </DCArtboard>
          <DCArtboard id="L2" label="L2 · Полотна «Всё об энергии»"    width={W} height={780}>
            <ScreenL2 />
          </DCArtboard>
          <DCArtboard id="L3" label="L3 · Знаковые полотна"            width={W} height={780}>
            <ScreenL3 />
          </DCArtboard>
          <DCArtboard id="L3-open" label="L3 · Раскрытый список типов полотен" width={W} height={780}>
            <ScreenL3DropdownOpen />
          </DCArtboard>
          <DCArtboard id="L4" label="L4 · Знакоподсказка для тела"     width={W} height={980}>
            <ScreenL4 />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    );
  }

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
})();
