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
          <DCArtboard id="L1-soft" label="L1 · Полотна (главная) · пастельная, в палитре сайта" width={W} height={780}>
            <ScreenL1Soft />
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
          <DCArtboard id="L4-matrix" label="L4 · Знакоподсказка для тела · со схемой и цитатами" width={1280} height={1080}>
            <ScreenL4Matrix />
          </DCArtboard>
          <DCArtboard id="L4-time" label="L4 · Всё о времени · плейлист с подзаголовками + матрица" width={1280} height={1080}>
            <ScreenL4Time />
          </DCArtboard>
          <DCArtboard id="L4-time-pereizluchatel" label="L4 · Всё о времени · с блоком переизлучения" width={1280} height={1140}>
            <ScreenL4TimePereizluchatel />
          </DCArtboard>
          <DCArtboard id="L4-time-pereizluchatel-window" label="L4 · Всё о времени · переизлучение (prev/active/next + fade-ссылки)" width={1280} height={1180}>
            <ScreenL4TimePereizluchatelWindow />
          </DCArtboard>
          <DCArtboard id="L4-time-filled" label="L4 · Всё о времени · ячейка заливается цветом (пульс по цвету)" width={1280} height={1080}>
            <ScreenL4TimeFilled />
          </DCArtboard>
        </DCSection>

        <DCSection
          id="polotna-screens-archive"
          title="АРХИВ · ранние варианты L1"
          subtitle="Отложенные версии главной — оставлены для истории"
        >
          <DCArtboard id="L1-archive" label="АРХИВ · L1 · Полотна (главная)" width={W} height={780}>
            <ScreenL1 />
          </DCArtboard>
          <DCArtboard id="L1-bright-archive" label="АРХИВ · L1 · яркая версия" width={W} height={780}>
            <ScreenL1Bright />
          </DCArtboard>
          <DCArtboard id="L1-split-archive" label="АРХИВ · L1 · нейтральная половина → цвет" width={W} height={780}>
            <ScreenL1Split />
          </DCArtboard>
          <DCArtboard id="L1-soft-plain-archive" label="АРХИВ · L1 · пастельная без иллюстраций" width={W} height={780}>
            <ScreenL1SoftPlain />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    );
  }

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<App />);
})();
