// data.js — the [test] Полотна dataset (4 themes × 4 canvas types × N canvases × M fragments)
(function () {
  // Helper: format mm:ss
  window.fmtTime = function fmtTime(sec) {
    if (!Number.isFinite(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Rough fragment generator — keeps the dataset compact but realistic.
  function makeFragments(prefix, count) {
    const parts = [
      "вступление", "настройка", "ладони", "лоб", "темя", "глаза",
      "уши", "горло", "сердце", "лёгкие", "диафрагма", "печень",
      "почки", "позвоночник", "плечи", "кисти", "колени", "стопы",
      "пальцы рук", "пальцы ног", "кожа", "мышцы", "кости", "кровь",
      "поток ладоней", "поток сердца", "поток дыхания", "поток шага",
      "ритм утра", "ритм полудня", "ритм вечера", "ритм ночи",
      "знак вверх", "знак вниз", "знак влево", "знак вправо",
      "знак света", "знак тепла", "знак воды", "знак воздуха",
      "сборка", "удержание", "проверка", "закрепление",
      "переход", "выход", "пауза", "завершение",
    ];
    return parts.slice(0, count).map((label, i) => ({
      id: `${prefix}-f${i + 1}`,
      idx: i + 1,
      title: label.charAt(0).toUpperCase() + label.slice(1),
      // 3–9 second fragments — exact lengths make the timeline ticks land at
      // visibly different spots without doing any pretend math.
      duration: 3 + ((i * 7) % 7),
    }));
  }

  function totalDuration(fragments) {
    return fragments.reduce((s, f) => s + f.duration, 0);
  }

  // ── Level 3 canvases under «Знаковые полотна / Всё об энергии» ──
  const energySign = [
    { id: "zn-body-podskazka", title: "Знакоподсказка для тела",   fragments: makeFragments("zn-body-podskazka", 48) },
    { id: "zn-body-podsvetka", title: "Знакоподсветка для тела",   fragments: makeFragments("zn-body-podsvetka", 36) },
    { id: "zn-body-znak",      title: "Знак для тела",             fragments: makeFragments("zn-body-znak", 24) },
    { id: "zn-hleb-podskazka", title: "Знакоподсказка Хлеб",       fragments: makeFragments("zn-hleb-podskazka", 18) },
    { id: "zn-voda-podskazka", title: "Знакоподсказка Вода",       fragments: makeFragments("zn-voda-podskazka", 20) },
    { id: "zn-svet-podskazka", title: "Знакоподсказка Свет",       fragments: makeFragments("zn-svet-podskazka", 16) },
  ];

  // Generic small canvas set, used as the L3 list under canvas-types
  // we haven't bothered to author by hand.
  function genericCanvases(prefix, names) {
    return names.map((title, i) => ({
      id: `${prefix}-${i}`,
      title,
      fragments: makeFragments(`${prefix}-${i}`, 12 + ((i * 3) % 12)),
    }));
  }

  // ── Canvas-type lists per theme ─────────────────────────────────
  const themes = [
    {
      id: "energy",
      title: "Всё об энергии",
      shortTitle: "энергии",
      tagline: "Ритмомерные полотна для работы с энергетическим телом и потоками.",
      // theme colour pair (banner gradient)
      grad: ["#E5006D", "#FF6B7D"],
      types: [
        { id: "znak",   title: "Знаковые полотна",     description: "Полотна на основе ритмомерных знаков для тела и быта.", canvases: energySign },
        { id: "unique", title: "Уникальные полотна",   description: "Особые однократные практики, записанные в озарины.",     canvases: genericCanvases("e-unique", ["Поток предрассветный", "Озарин июльского полудня", "Ритм одной минуты", "Сборка дня", "Завершение цикла"]) },
        { id: "fire",   title: "Огненосные полотна",   description: "Энергоёмкие практики с акцентом на разогрев и сборку.",  canvases: genericCanvases("e-fire", ["Огонь ладоней", "Огонь сердца", "Огонь шага", "Огонь дыхания"]) },
        { id: "study",  title: "Учебные полотна",      description: "Базовые практики для тех, кто только начинает.",         canvases: genericCanvases("e-study", ["Урок 1 · Ладони", "Урок 2 · Лоб", "Урок 3 · Сердце", "Урок 4 · Позвоночник", "Урок 5 · Дыхание", "Урок 6 · Сборка"]) },
      ],
    },
    {
      id: "info",
      title: "Всё об информации",
      shortTitle: "информации",
      tagline: "Полотна, передающие информационную ткань ритмомерных образов.",
      grad: ["#1B3FD8", "#5B7EF7"],
      types: [
        { id: "znak",   title: "Знаковые полотна",   description: "Информационные знаки в чтении и письме.",     canvases: genericCanvases("i-znak",   ["Знак прочтения", "Знак записи", "Знак ответа", "Знак вопроса"]) },
        { id: "unique", title: "Уникальные полотна", description: "Информационные срезы по конкретным датам.",    canvases: genericCanvases("i-unique", ["Срез 21.06", "Срез 22.09", "Срез 21.12"]) },
        { id: "fire",   title: "Огненосные полотна", description: "Информационная плотность повышенной яркости.", canvases: genericCanvases("i-fire",   ["Светопись", "Скоропись", "Жаропись"]) },
        { id: "study",  title: "Учебные полотна",    description: "Чтение и письмо ритмомерных знаков с нуля.",   canvases: genericCanvases("i-study",  ["Урок 1 · Чтение", "Урок 2 · Письмо", "Урок 3 · Ответ", "Урок 4 · Сборка"]) },
      ],
    },
    {
      id: "space",
      title: "Всё о пространстве",
      shortTitle: "пространстве",
      tagline: "Работа с пространственными слоями: тело, комната, дом, путь.",
      grad: ["#0E8E76", "#4BB7C9"],
      types: [
        { id: "znak",   title: "Знаковые полотна",   description: "Знаки пространства тела и среды.",         canvases: genericCanvases("s-znak",   ["Знак комнаты", "Знак двери", "Знак угла", "Знак окна"]) },
        { id: "unique", title: "Уникальные полотна", description: "Полотна для конкретных мест и переходов.", canvases: genericCanvases("s-unique", ["Дорога", "Перрон", "Лестница"]) },
        { id: "fire",   title: "Огненосные полотна", description: "Разогрев пространства вокруг тела.",       canvases: genericCanvases("s-fire",   ["Огонь комнаты", "Огонь дороги", "Огонь дома"]) },
        { id: "study",  title: "Учебные полотна",    description: "Сборка пространственного слоя поэтапно.",  canvases: genericCanvases("s-study",  ["Урок 1 · Точка", "Урок 2 · Линия", "Урок 3 · Объём", "Урок 4 · Слой"]) },
      ],
    },
    {
      id: "time",
      title: "Всё о времени",
      shortTitle: "времени",
      tagline: "Ритмомерные часы, календарь, минута, час и сутки в практике.",
      grad: ["#6E3CF2", "#B57BFF"],
      types: [
        { id: "znak",   title: "Знаковые полотна",   description: "Знаки времени: минута, час, сутки, ритм.",     canvases: genericCanvases("t-znak",   ["Знак минуты", "Знак часа", "Знак суток", "Знак ритма"]) },
        { id: "unique", title: "Уникальные полотна", description: "Одиночные временные практики и переходы.",     canvases: genericCanvases("t-unique", ["Минута тишины", "Час равновесия", "Сутки сборки"]) },
        { id: "fire",   title: "Огненосные полотна", description: "Уплотнённое время — короткие плотные сессии.", canvases: genericCanvases("t-fire",   ["Огонь минуты", "Огонь часа", "Огонь сборки"]) },
        { id: "study",  title: "Учебные полотна",    description: "Учимся читать ритмомерные часы.",              canvases: genericCanvases("t-study",  ["Урок 1 · Минута", "Урок 2 · Час", "Урок 3 · Сутки", "Урок 4 · Ритм"]) },
      ],
    },
  ];

  // Roll-ups: total fragment count + total duration per node.
  themes.forEach((th) => {
    let typeTotalFr = 0, typeTotalDur = 0, canvasCount = 0;
    th.types.forEach((ty) => {
      let frC = 0, durC = 0;
      ty.canvases.forEach((c) => {
        c.totalDuration = totalDuration(c.fragments);
        c.fragmentCount = c.fragments.length;
        frC  += c.fragmentCount;
        durC += c.totalDuration;
      });
      ty.canvasCount    = ty.canvases.length;
      ty.fragmentCount  = frC;
      ty.totalDuration  = durC;
      canvasCount   += ty.canvasCount;
      typeTotalFr   += frC;
      typeTotalDur  += durC;
    });
    th.canvasTypeCount = th.types.length;
    th.canvasCount     = canvasCount;
    th.fragmentCount   = typeTotalFr;
    th.totalDuration   = typeTotalDur;
  });

  window.POLOTNA = { themes };

  // Lookup helpers
  window.findTheme  = (id) => themes.find((t) => t.id === id);
  window.findType   = (themeId, typeId) => {
    const th = window.findTheme(themeId);
    return th ? th.types.find((t) => t.id === typeId) : null;
  };
  window.findCanvas = (themeId, typeId, canvasId) => {
    const ty = window.findType(themeId, typeId);
    return ty ? ty.canvases.find((c) => c.id === canvasId) : null;
  };

  // Flat global search index — title + breadcrumb path + duration.
  window.searchPolotna = function searchPolotna(q) {
    q = (q || "").trim().toLowerCase();
    if (!q) return [];
    const out = [];
    themes.forEach((th) => {
      if (th.title.toLowerCase().includes(q)) {
        out.push({ kind: "theme",  themeId: th.id, title: th.title, path: ["Полотна"], meta: `${th.canvasCount} полотен · ${fmtTime(th.totalDuration)}` });
      }
      th.types.forEach((ty) => {
        if (ty.title.toLowerCase().includes(q)) {
          out.push({ kind: "type", themeId: th.id, typeId: ty.id, title: ty.title, path: ["Полотна", `Полотна «${th.title}»`], meta: `${ty.canvasCount} полотен · ${fmtTime(ty.totalDuration)}` });
        }
        ty.canvases.forEach((c) => {
          if (c.title.toLowerCase().includes(q)) {
            out.push({ kind: "canvas", themeId: th.id, typeId: ty.id, canvasId: c.id, title: c.title, path: ["Полотна", `Полотна «${th.title}»`, ty.title], meta: `${c.fragmentCount} фрагментов · ${fmtTime(c.totalDuration)}` });
          }
        });
      });
    });
    return out.slice(0, 24);
  };
})();
