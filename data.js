// data.js — the [test] Полотна dataset (4 themes × 4 canvas types × N canvases × M fragments)
(function () {
  // Helper: format mm:ss
  window.fmtTime = function fmtTime(sec) {
    if (!Number.isFinite(sec) || sec < 0) sec = 0;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Russian noun pluralization: pluralize(21, ["полотно","полотна","полотен"]) → "полотно"
  //   form 0 → 1, 21, 31… (mod10 == 1, except teens 11–19)
  //   form 1 → 2-4, 22-24… (mod10 2..4, except teens)
  //   form 2 → 0, 5-20, 25-30…
  window.pluralize = function pluralize(n, forms) {
    n = Math.abs(n) | 0;
    const mod10 = n % 10, mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 19) return forms[2];
    if (mod10 === 1) return forms[0];
    if (mod10 >= 2 && mod10 <= 4) return forms[1];
    return forms[2];
  };
  // Convenience: "21 полотно" / "14 полотен"
  window.plurN = function plurN(n, forms) { return `${n} ${window.pluralize(n, forms)}`; };

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
      // Muted, book-cover colour — tonal gradient (same hue, ~18% darker on the right).
      // Anchor: the deep emerald glow of the «Всё об энергии» cover.
      grad: ["#1F4E3D", "#143628"],
      cover: "assets/illust-energy.png",
      coverFull: "assets/cover-energy.png",
      types: [
        { id: "znak",   title: "Знаковые полотна",     description: "Знаковые полотна позволяют узнать окружающих вас людей — какие они в энергии, в информации и в пространстве.", canvases: energySign },
        { id: "unique", title: "Уникальные полотна",   description: "Уникальные полотна дают возможность коррекции самого себя.",     canvases: genericCanvases("e-unique", ["Поток предрассветный", "Озарин июльского полудня", "Ритм одной минуты", "Сборка дня", "Завершение цикла"]) },
        { id: "fire",   title: "Огненосные полотна",   description: "Огненосные полотна действуют из времени и влияют на вашу суть.",  canvases: genericCanvases("e-fire", ["Огонь ладоней", "Огонь сердца", "Огонь шага", "Огонь дыхания"]) },
        { id: "study",  title: "Учебные полотна",      description: "Учебные полотна позволят вам улучшить своё окружение в энергии.",         canvases: genericCanvases("e-study", ["Урок 1 · Ладони", "Урок 2 · Лоб", "Урок 3 · Сердце", "Урок 4 · Позвоночник", "Урок 5 · Дыхание", "Урок 6 · Сборка"]) },
      ],
    },
    {
      id: "info",
      title: "Всё об информации",
      shortTitle: "информации",
      tagline: "Полотна, передающие информационную ткань ритмомерных образов.",
      // Terracotta-bordeaux from the «Всё об информации» cover — not fuchsia.
      grad: ["#722A2C", "#4E1B1D"],
      cover: "assets/illust-info.png",
      coverFull: "assets/cover-info.png",
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
      // Muted blue-violet — pulled from the dual blue/pink figures of the cover.
      grad: ["#3A4380", "#272E5C"],
      cover: "assets/illust-space.png",
      coverFull: "assets/cover-space.png",
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
      // Deep indigo — closest to the multicoloured «Всё о времени» cover's dark field.
      grad: ["#2B2566", "#1A1645"],
      cover: "assets/illust-time.png",
      coverFull: "assets/cover-time.png",
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
