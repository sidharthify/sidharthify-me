(function () {
  "use strict";

  const body = document.body;
  const ROOT = body.dataset.root || "";
  const HOME = body.dataset.cwd === "~";
  const isMobile = () => window.matchMedia("(max-width: 760px), (pointer: coarse)").matches;

  const LS = {
    get(k, d) {
      try {
        const v = localStorage.getItem("sidh." + k);
        return v === null ? d : JSON.parse(v);
      } catch (e) {
        return d;
      }
    },
    set(k, v) {
      try { localStorage.setItem("sidh." + k, JSON.stringify(v)); } catch (e) {}
    },
  };

  const TERM_SVG =
    '<svg viewBox="0 0 48 48" aria-hidden="true">' +
    '<rect x="4" y="7" width="40" height="34" rx="5" fill="#181825" stroke="#45475a"></rect>' +
    '<rect x="4" y="7" width="40" height="8" rx="5" fill="#313244"></rect>' +
    '<circle cx="10" cy="11" r="1.5" fill="#f38ba8"></circle><circle cx="15" cy="11" r="1.5" fill="#f9e2af"></circle><circle cx="20" cy="11" r="1.5" fill="#a6e3a1"></circle>' +
    '<path d="M11 24l6 4-6 4" fill="none" stroke="#a6e3a1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path>' +
    '<line x1="21" y1="33" x2="32" y2="33" stroke="#cba6f7" stroke-width="2.5" stroke-linecap="round"></line>' +
    "</svg>";

  const FOLDER_SVG =
    '<svg viewBox="0 0 48 48" aria-hidden="true">' +
    '<path d="M5 11h13l4 4h21a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V13a2 2 0 0 1 2-2z" fill="#89b4fa" stroke="#6c7086"></path>' +
    '<path d="M3 19h42v20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V19z" fill="#74a0f0"></path>' +
    "</svg>";

  const TRACKS = [
    { file: "shine_on_you_crazy_diamond.mp3", title: "Shine On You Crazy Diamond", artist: "Pink Floyd", album: "Wish You Were Here", genre: "Progressive Rock", dur: "26:01", src: "assets/audio/shineonyoucrazydiamond-preview.mp3", art: "assets/images/wishyouwerehere.jpg" },
    { file: "fearless.mp3", title: "Fearless", artist: "Pink Floyd", album: "Meddle", genre: "Progressive Rock", dur: "6:08", src: "assets/audio/fearless-preview.mp3", art: "assets/images/meddle.jpg" },
    { file: "echoes.mp3", title: "Echoes", artist: "Pink Floyd", album: "Meddle", genre: "Progressive Rock", dur: "23:31", src: "assets/audio/echoes-preview.mp3", art: "assets/images/meddle.jpg" },
    { file: "time.mp3", title: "Time", artist: "Pink Floyd", album: "The Dark Side of the Moon", genre: "Progressive Rock", dur: "6:53", src: "assets/audio/time-preview.mp3", art: "assets/images/thedarksideofthemoon.jpg" },
    { file: "money.mp3", title: "Money", artist: "Pink Floyd", album: "The Dark Side of the Moon", genre: "Progressive Rock", dur: "6:22", src: "assets/audio/money-preview.mp3", art: "assets/images/thedarksideofthemoon.jpg" },
    { file: "the_great_gig_in_the_sky.mp3", title: "The Great Gig In The Sky", artist: "Pink Floyd", album: "The Dark Side of the Moon", genre: "Progressive Rock", dur: "4:44", src: "assets/audio/the-great-gig-in-the-sky-preview.mp3", art: "assets/images/thedarksideofthemoon.jpg" },
    { file: "cheerleader.mp3", title: "Cheerleader", artist: "Porter Robinson", album: "Smile! :D", genre: "Electropop", dur: "3:57", src: "assets/audio/cheerleader-preview.mp3", art: "assets/images/cheerleader.jpg" },
    { file: "musician.mp3", title: "Musician", artist: "Porter Robinson", album: "Nurture", genre: "Electropop", dur: "3:58", src: "assets/audio/musician-preview.mp3", art: "assets/images/musician.jpg" },
    { file: "backwoods.mp3", title: "Backwoods", artist: "Kill Bill: The Rapper", album: "RAMONA", genre: "Indie Rap", dur: "3:04", src: "assets/audio/backwoods-preview.mp3", art: "assets/images/backwoods.jpg" },
    { file: "xtal.mp3", title: "Xtal", artist: "Aphex Twin", album: "Selected Ambient Works", genre: "Ambient Techno", dur: "4:51", src: "assets/audio/xtal-preview.mp3", art: "assets/images/xtal.jpg" },
    { file: "color_your_night.mp3", title: "Color Your Night", artist: "Lotus Juice", album: "Persona 3 Reload", genre: "Jazz Fusion", dur: "3:44", src: "assets/audio/color-your-night-preview.mp3", art: "assets/images/coloryournight.jpg" },
    { file: "tong_poo.mp3", title: "Tong Poo", artist: "Yellow Magic Orchestra", album: "Yellow Magic Orchestra", genre: "Synthpop", dur: "6:15", src: "assets/audio/tongpoo-preview.mp3", art: "assets/images/tongpoo.jpg" },
    { file: "roundabout.mp3", title: "Roundabout", artist: "Yes", album: "Fragile", genre: "Progressive Rock", dur: "8:39", src: "assets/audio/roundabout-preview.mp3", art: "assets/images/roundabout.jpg" },
    { file: "i_really_want_to_stay_at_your_house.mp3", title: "I Really Want to Stay at Your House", artist: "Rosa Walton", album: "Cyberpunk 2077: Radio, Vol. 2", genre: "Synthpop", dur: "4:06", src: "assets/audio/i-really-want-to-stay-preview.mp3", art: "assets/images/i-really-want-to-stay.jpg" },
    { file: "whos_ready_for_tomorrow.mp3", title: "Who's Ready for Tomorrow", artist: "Rat Boy & IBDY", album: "Cyberpunk 2077: Radio, Vol. 2", genre: "Electronic", dur: "1:56", src: "assets/audio/whos-ready-for-tomorrow-preview.mp3", art: "assets/images/whos-ready-for-tomorrow.jpg" },
    { file: "theme_of_ken.mp3", title: "Theme of Ken", artist: "Capcom Sound Team", album: "Street Fighter V OST", genre: "Game Soundtrack", dur: "3:04", src: "assets/audio/theme-of-ken-preview.mp3", art: "assets/images/theme-of-ken.jpg" },
    { file: "shelter.mp3", title: "Shelter", artist: "Porter Robinson & Madeon", album: "Shelter", genre: "Future Bass", dur: "3:38", src: "assets/audio/shelter-preview.mp3", art: "assets/images/shelter.jpg" },
    { file: "genes_rock_a_bye.mp3", title: "Gene's Rock-A-Bye", artist: "Masafumi Takada", album: "God Hand OST", genre: "Game Soundtrack", dur: "2:57", src: "assets/audio/genes-rock-a-bye-preview.mp3", art: "assets/images/genes-rock-a-bye.jpg" },
    { file: "echoes_live_at_pompeii.mp3", title: "Echoes (Live at Pompeii)", artist: "Pink Floyd", album: "At Pompeii MCMLXXII", genre: "Progressive Rock", dur: "11:55", src: "assets/audio/echoes-pompeii-preview.mp3", art: "assets/images/echoes-pompeii.jpg" },
  ];

  const PHOTOS = [
    { id: "syd-barrett", src: "assets/images/syd-barrett.webp", file: "syd_barrett_1967.jpg", def: { xf: 0.02, yf: 0.03 } },
    { id: "dsotm", src: "assets/images/dsotm-stained-glass.webp", file: "dark_side_of_the_moon.png", def: { xf: 0.02, yf: 0.18 } },
    { id: "terry-davis", src: "assets/images/terry-davis.jpeg", file: "Terry_A._Davis_(cropped).jpg", def: { xf: 0.02, yf: 0.33 } },
    { id: "kiryu", src: "assets/images/kiryu.jpg", file: "kiryu_kazuma_yakuza0.jpg", def: { xf: 0.02, yf: 0.48 } },
    { id: "linus", src: "assets/images/linus-torvalds.webp", file: "featured_torvalds_linux.jpg", def: { xf: 0.9, yf: 0.03 } },
    { id: "never-fade-away", src: "assets/images/never-fade-away.jpeg", file: "johnny-silverhand-cyberpunk.jpg", def: { xf: 0.9, yf: 0.18 } },
    { id: "shine-on", src: "assets/images/shine-on-diamond.jpeg", file: "shine_on_you_crazy_diamond.jpg", def: { xf: 0.9, yf: 0.33 } },
  ];

  const DOCS = {
    "projects.md": {
      heading: "# things i've worked on",
      items: [
        ["yaap (yet another aosp project)", "maintainer / contributor"],
        ["cipherOS", "maintainer"],
        ["device trees & ports", "nothing phone 2a/2a+, realme 8i / narzo 50 4g, realme 9 5g SE, pixel 7 / 7 pro — maintainer, co-lead, contributor, tester"],
        ["lineageos contributions", "rewriting legacy hidl hardware abstraction layers to aidl, building kernels"],
        ["nixos + homelab", "self-hosted plex, radarr, sonarr, prowlarr"],
        ["cwr engine port (arma cwa)", "ported a 20-year-old game engine to android arm64 with a custom opengl es 3.2 backend"],
        ["syd", "lightweight command-line tool for nixOS"],
        ["breathe", "android app designed to monitor real-time AQI across Jammu & Kashmir"],
      ],
    },
    "skills.md": {
      heading: "# a collection of my skills",
      items: [
        ["c & modern c++", "engine rendering backends, kernelspace c, aosp c++, custom math libraries"],
        ["python and bash", "file manipulation and some scripting"],
        ["graphics programming & glsl", "opengl es 3.2, custom vertex/fragment shaders, rewriting fixed-function pipelines"],
        ["git", "general knowledge and familiarity"],
        ["linux", "general commandline knowledge"],
        ["aosp", "device trees, HALs (aidl/hidl), soong, android.bp, overlays, fastboot, adb"],
        ["nix/nixOS", "flakes, the distro and the nix language itself"],
        ["css/html/javascript", "enough to make this website, and contributions to yaaprom.org. no frameworks"],
        ["kotlin", "android frameworks"],
      ],
    },
  };

  const SOCIALS = [
    ["github", "https://github.com/sidharthify", "fa-github"],
    ["telegram", "https://t.me/arteryring1", "fa-telegram"],
    ["twitter / x", "https://x.com/sidharthify", "fa-x-twitter"],
  ];

  const DOC_SVG =
    '<svg viewBox="0 0 48 48" aria-hidden="true">' +
    '<path d="M11 4h18l8 8v32a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#313244" stroke="#6c7086"></path>' +
    '<path d="M29 4l8 8h-8z" fill="#585b70"></path>' +
    '<line x1="15" y1="24" x2="33" y2="24" stroke="#89b4fa" stroke-width="2"></line>' +
    '<line x1="15" y1="30" x2="33" y2="30" stroke="#6c7086" stroke-width="2"></line>' +
    '<line x1="15" y1="36" x2="27" y2="36" stroke="#6c7086" stroke-width="2"></line>' +
    "</svg>";

  const SOCIALS_SVG =
    '<svg viewBox="0 0 48 48" aria-hidden="true">' +
    '<path d="M5 11h13l4 4h21a2 2 0 0 1 2 2v22a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V13a2 2 0 0 1 2-2z" fill="#f9e2af" stroke="#6c7086"></path>' +
    '<path d="M3 19h42v20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V19z" fill="#f0d68a"></path>' +
    "</svg>";

  const PLAYLIST = TRACKS.map((t) => Object.assign({}, t, { src: ROOT + t.src, art: ROOT + t.art }));

  let zTop = 10;
  let activeId = null;
  const wins = {};
  let termWin = null;
  let taskbar, taskItems;
  let surf;
  let MUSIC = [];

  function ensureSurf() {
    if (!surf) surf = document.querySelector(".desktop-surface");
    return surf;
  }

  function savePlayer(w) {
    if (!w || !w.audio) return;
    LS.set("player", { open: true, idx: w.idx, time: w.audio.currentTime || 0, paused: w.audio.paused, min: !!w.min });
  }

  function clampPos(el, x, y) {
    const w = el.offsetWidth || 360;
    const h = el.offsetHeight || 60;
    return [
      Math.max(0, Math.min(x, Math.max(0, surf.clientWidth - w))),
      Math.max(0, Math.min(y, Math.max(0, surf.clientHeight - h))),
    ];
  }

  function place(el, saved, defFn) {
    const p = saved || defFn();
    const [x, y] = clampPos(el, p.x, p.y);
    el.style.left = x + "px";
    el.style.top = y + "px";
  }

  function setActive(id) {
    activeId = id;
    Object.values(wins).forEach((w) => {
      if (w.tb) w.tb.classList.toggle("active", w.id === id && !w.min && w.el.style.display !== "none");
    });
  }

  function focusWin(w) {
    w.el.style.zIndex = ++zTop;
    setActive(w.id);
  }

  function draggable(w) {
    const handle = w.el.querySelector(".term-titlebar, .win-bar");
    if (!handle) return;
    handle.style.touchAction = "none";
    handle.addEventListener("pointerdown", (e) => {
      if (e.button !== 0 || e.target.closest(".term-dots, .win-dots")) return;
      if (w.max) return;
      e.preventDefault();
      focusWin(w);
      const sr = surf.getBoundingClientRect();
      const r = w.el.getBoundingClientRect();
      const offX = e.clientX - r.left, offY = e.clientY - r.top;
      handle.setPointerCapture(e.pointerId);
      w.el.classList.add("is-dragging");
      const move = (ev) => {
        const [x, y] = clampPos(w.el, ev.clientX - sr.left - offX, ev.clientY - sr.top - offY);
        w.el.style.left = x + "px";
        w.el.style.top = y + "px";
      };
      const up = () => {
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", up);
        w.el.classList.remove("is-dragging");
        if (w.persistPos) w.persistPos(parseFloat(w.el.style.left) || 0, parseFloat(w.el.style.top) || 0);
      };
      handle.addEventListener("pointermove", move);
      handle.addEventListener("pointerup", up);
    });
  }

  function minimize(w) {
    w.el.style.display = "none";
    w.min = true;
    if (w.persistState) w.persistState();
    setActive(null);
    if (w.tb) w.tb.classList.add("minimized");
  }

  function restore(w) {
    w.el.style.display = "";
    w.min = false;
    if (w.persistState) w.persistState();
    if (w.tb) w.tb.classList.remove("minimized");
    focusWin(w);
  }

  function toggleMax(w) {
    w.max = !w.max;
    w.el.classList.toggle("maximized", w.max);
    if (w.persistState) w.persistState();
    focusWin(w);
  }

  function closeWin(w) {
    if (w.kind === "terminal") {
      w.el.style.display = "none";
      w.min = false;
      if (w.persistState) w.persistState();
      if (w.tb) w.tb.classList.add("minimized");
      setActive(null);
    } else {
      if (w.audio) w.audio.pause();
      w.el.remove();
      if (w.tb) w.tb.remove();
      delete wins[w.id];
      if (w.kind === "player") LS.set("player", { open: false });
      LS.set("iv.open", Object.keys(wins).filter((k) => wins[k].kind === "image"));
    }
  }

  function wireControls(w) {
    const bar = w.el.querySelector(".term-titlebar, .win-bar");
    const red = bar.querySelector(".dot-red");
    const yellow = bar.querySelector(".dot-yellow");
    const green = bar.querySelector(".dot-green");
    if (red) red.addEventListener("click", (e) => { e.stopPropagation(); closeWin(w); });
    if (yellow) yellow.addEventListener("click", (e) => { e.stopPropagation(); minimize(w); });
    if (green) green.addEventListener("click", (e) => { e.stopPropagation(); toggleMax(w); });
    bar.querySelector(".term-dots, .win-dots").classList.add("win-controls");
    w.el.addEventListener("pointerdown", () => focusWin(w));
  }

  function addTaskItem(w) {
    const b = document.createElement("button");
    b.className = "tb-item";
    b.innerHTML =
      (w.kind === "terminal" ? '<span class="tb-ico">' + TERM_SVG + "</span>" : '<span class="tb-dot"></span>') +
      '<span class="tb-title">' + w.title + "</span>";
    b.addEventListener("click", () => {
      if (w.el.style.display === "none" || w.min) restore(w);
      else if (activeId === w.id) minimize(w);
      else focusWin(w);
    });
    taskItems.appendChild(b);
    w.tb = b;
  }

  function registerTerminal() {
    const el = document.querySelector(".terminal");
    if (!el) return null;
    const w = { id: "terminal", el, kind: "terminal", title: el.dataset.wtitle || "alacritty ~ zsh", min: false, max: false };
    w.persistPos = (x, y) => LS.set("win.terminal", { x, y });
    w.persistState = () => LS.set("term.state", { min: w.min, max: w.max, closed: w.el.style.display === "none" });
    place(el, LS.get("win.terminal", null), () => ({ x: (surf.clientWidth - el.offsetWidth) / 2, y: 16 }));
    wireControls(w);
    draggable(w);
    addTaskItem(w);
    wins[w.id] = w;
    const st = LS.get("term.state", null);
    if (st) {
      if (st.max) { w.max = true; el.classList.add("maximized"); }
      if (st.closed || st.min) { el.style.display = "none"; w.min = !!st.min; if (w.tb) w.tb.classList.add("minimized"); }
    }
    focusWin(w);
    return w;
  }

  function openViewer(p) {
    if (wins[p.id]) { restore(wins[p.id]); return; }
    const el = document.createElement("section");
    el.className = "window imgviewer";
    el.innerHTML =
      '<div class="win-bar">' +
      '<span class="win-dots"><i class="dot-red"></i><i class="dot-yellow"></i><i class="dot-green"></i></span>' +
      '<span class="term-title"><b>' + p.file + "</b> — gwenview</span><span></span></div>" +
      '<div class="iv-body"><img src="' + ROOT + p.src + '" alt="' + p.file + '" draggable="false"></div>';
    surf.appendChild(el);
    const w = { id: p.id, el, kind: "image", title: p.file, min: false, max: false };
    w.persistPos = (x, y) => LS.set("win.iv." + p.id, { x, y });
    const n = Object.values(wins).filter((x) => x.kind === "image").length;
    place(el, LS.get("win.iv." + p.id, null), () => ({ x: surf.clientWidth / 2 - 200 + n * 30, y: 40 + n * 30 }));
    wireControls(w);
    draggable(w);
    addTaskItem(w);
    wins[p.id] = w;
    focusWin(w);
    LS.set("iv.open", Object.keys(wins).filter((k) => wins[k].kind === "image"));
  }

  function makeIcon(layer, p) {
    const el = document.createElement("div");
    el.className = "dz-icon";
    el.innerHTML =
      '<div class="dz-thumb"><img src="' + ROOT + p.src + '" alt="' + p.file + '" draggable="false"></div>' +
      '<span class="dz-label">' + p.file + "</span>";
    layer.appendChild(el);
    place(el, LS.get("icon." + p.id, null), () => ({ x: p.def.xf * surf.clientWidth, y: p.def.yf * surf.clientHeight }));
    iconDrag(el, (x, y) => LS.set("icon." + p.id, { x, y }));
    el.addEventListener("dblclick", () => openViewer(p));
    return el;
  }

  function terminalIcon(layer) {
    const el = document.createElement("div");
    el.className = "dz-icon dz-app";
    el.innerHTML = '<div class="dz-appicon">' + TERM_SVG + '</div><span class="dz-label">alacritty</span>';
    layer.appendChild(el);
    place(el, LS.get("icon.terminal", null), () => ({ x: 0.9 * surf.clientWidth, y: 0.78 * surf.clientHeight }));
    iconDrag(el, (x, y) => LS.set("icon.terminal", { x, y }));
    el.addEventListener("dblclick", () => { if (termWin) restore(termWin); });
    return el;
  }

  function iconDrag(el, onEnd) {
    el.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      const sr = surf.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      const offX = e.clientX - r.left, offY = e.clientY - r.top;
      let moved = false;
      el.setPointerCapture(e.pointerId);
      const move = (ev) => {
        moved = true;
        el.classList.add("is-dragging");
        const [x, y] = clampPos(el, ev.clientX - sr.left - offX, ev.clientY - sr.top - offY);
        el.style.left = x + "px";
        el.style.top = y + "px";
      };
      const up = () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerup", up);
        el.classList.remove("is-dragging");
        if (moved) onEnd(parseFloat(el.style.left) || 0, parseFloat(el.style.top) || 0);
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerup", up);
    });
  }

  function buildTaskbar() {
    taskbar = document.createElement("div");
    taskbar.className = "taskbar";
    taskbar.innerHTML = '<div class="tb-left"></div><div class="tb-items"></div>';
    body.appendChild(taskbar);
    taskItems = taskbar.querySelector(".tb-items");
    const launch = document.createElement("button");
    launch.className = "tb-launch";
    launch.title = "open terminal";
    launch.innerHTML = TERM_SVG;
    launch.addEventListener("click", () => { if (termWin) restore(termWin); });
    taskbar.querySelector(".tb-left").appendChild(launch);
  }

  function fmt(s) {
    if (!isFinite(s)) return "0:00";
    s = Math.floor(s);
    return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
  }

  const PLAYER_HTML =
    '<div class="win-bar">' +
    '<span class="win-dots"><i class="dot-red"></i><i class="dot-yellow"></i><i class="dot-green"></i></span>' +
    '<span class="term-title"><b>Elisa</b> <span class="pl-winname"></span></span><span></span></div>' +
    '<div class="pl-body">' +
    '<img class="pl-art" alt="album art" draggable="false">' +
    '<div class="pl-title"></div><div class="pl-artist"></div><div class="pl-metaline"></div>' +
    '<input class="pl-seek" type="range" min="0" max="100" value="0" step="0.1" aria-label="seek">' +
    '<div class="pl-times"><span class="pl-cur">0:00</span><span class="pl-total">0:00</span></div>' +
    '<div class="pl-controls">' +
    '<button class="pl-prev" aria-label="previous"><svg viewBox="0 0 24 24"><path d="M7 6h2v12H7z"/><path d="M20 6v12l-9-6z"/></svg></button>' +
    '<button class="pl-play" aria-label="play or pause"><svg class="i-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg><svg class="i-pause" viewBox="0 0 24 24"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg></button>' +
    '<button class="pl-next" aria-label="next"><svg viewBox="0 0 24 24"><path d="M15 6h2v12h-2z"/><path d="M4 6l9 6-9 6z"/></svg></button>' +
    "</div>" +
    '<audio class="pl-audio" preload="metadata"></audio></div>';

  function loadTrack(w, idx, opts) {
    opts = opts || {};
    w.idx = (idx + PLAYLIST.length) % PLAYLIST.length;
    const t = PLAYLIST[w.idx];
    const el = w.el;
    el.querySelector(".pl-art").src = t.art;
    el.querySelector(".pl-title").textContent = t.title;
    el.querySelector(".pl-artist").textContent = t.artist + (t.album ? " — " + t.album : "");
    el.querySelector(".pl-metaline").textContent = (t.genre ? t.genre + " · " : "") + t.dur;
    el.querySelector(".pl-winname").textContent = "— " + t.file;
    w.audio.src = t.src;
    w.startAt = opts.time || 0;
    if (opts.autoplay !== false) w.audio.play().catch(() => {});
    MUSIC.forEach((m, i) => { if (m.el) m.el.classList.toggle("playing", i === w.idx); });
    savePlayer(w);
  }

  function wirePlayer(w) {
    const el = w.el, a = w.audio;
    const seek = el.querySelector(".pl-seek");
    const cur = el.querySelector(".pl-cur");
    const tot = el.querySelector(".pl-total");
    let lastSave = 0;
    el.querySelector(".pl-play").addEventListener("click", () => { if (a.paused) a.play(); else a.pause(); });
    el.querySelector(".pl-prev").addEventListener("click", () => loadTrack(w, w.idx - 1));
    el.querySelector(".pl-next").addEventListener("click", () => loadTrack(w, w.idx + 1));
    a.addEventListener("play", () => { el.classList.add("playing"); savePlayer(w); });
    a.addEventListener("pause", () => { el.classList.remove("playing"); savePlayer(w); });
    a.addEventListener("ended", () => loadTrack(w, w.idx + 1));
    a.addEventListener("loadedmetadata", () => {
      tot.textContent = fmt(a.duration);
      if (w.startAt) { try { a.currentTime = w.startAt; } catch (e) {} w.startAt = 0; }
    });
    a.addEventListener("timeupdate", () => {
      if (a.duration) { seek.value = (a.currentTime / a.duration) * 100; cur.textContent = fmt(a.currentTime); }
      const now = Date.now();
      if (now - lastSave > 2000) { lastSave = now; savePlayer(w); }
    });
    seek.addEventListener("input", () => { if (a.duration) a.currentTime = (seek.value / 100) * a.duration; });
  }

  function buildPlayer() {
    ensureSurf();
    const el = document.createElement("section");
    el.className = "window player";
    el.innerHTML = PLAYER_HTML;
    surf.appendChild(el);
    const w = { id: "player", el, kind: "player", title: "Elisa", min: false, max: false, audio: el.querySelector(".pl-audio"), idx: 0 };
    w.persistState = () => savePlayer(w);
    wirePlayer(w);
    if (!isMobile()) {
      w.persistPos = (x, y) => LS.set("win.player", { x, y });
      place(el, LS.get("win.player", null), () => ({ x: surf.clientWidth / 2 - 170, y: 36 }));
      wireControls(w);
      draggable(w);
      addTaskItem(w);
    } else {
      const red = el.querySelector(".dot-red");
      if (red) red.addEventListener("click", () => { w.audio.pause(); el.remove(); delete wins.player; LS.set("player", { open: false }); });
    }
    wins.player = w;
    return w;
  }

  function openPlayer(idx) {
    let w = wins.player;
    if (!w) w = buildPlayer();
    else {
      w.el.style.display = "";
      w.min = false;
      if (w.tb) w.tb.classList.remove("minimized");
    }
    loadTrack(w, idx, { autoplay: true });
    if (!isMobile()) focusWin(w);
  }

  function restorePlayer() {
    const st = LS.get("player", null);
    if (!st || !st.open) return;
    if (!ensureSurf()) return;
    const w = buildPlayer();
    loadTrack(w, st.idx || 0, { autoplay: !st.paused, time: st.time || 0 });
    if (st.min && !isMobile()) minimize(w);
  }

  function sidhOpen(name) {
    if (!name || !ensureSurf()) return false;
    const n = name.replace(/\/$/, "");
    if (n === "music") { openMusicFolder(); return true; }
    if (n === "socials") { openSocials(); return true; }
    if (DOCS[n]) { openDoc(n); return true; }
    const ph = PHOTOS.find((p) => p.file === name);
    if (ph) { openViewer(ph); return true; }
    const ti = TRACKS.findIndex((t) => t.file === name);
    if (ti >= 0) { openPlayer(ti); return true; }
    return false;
  }
  window.sidhOpen = sidhOpen;

  function buildGrid(container) {
    MUSIC = TRACKS.map((t) => {
      const b = document.createElement("button");
      b.className = "fm-file";
      b.innerHTML =
        '<span class="fm-thumb"><img src="' + ROOT + t.art + '" alt="" loading="lazy"></span>' +
        '<span class="fm-name">' + t.file + "</span>";
      container.appendChild(b);
      return Object.assign({}, t, { el: b, src: ROOT + t.src, art: ROOT + t.art });
    });
    const ev = isMobile() ? "click" : "dblclick";
    MUSIC.forEach((m, i) => m.el.addEventListener(ev, () => openPlayer(i)));
  }

  function openMusicFolder() {
    ensureSurf();
    if (!surf) return;
    let w = wins.music;
    if (w) {
      w.el.style.display = "";
      w.min = false;
      if (w.tb) w.tb.classList.remove("minimized");
      focusWin(w);
      return;
    }
    const el = document.createElement("section");
    el.className = "window filemanager";
    el.innerHTML =
      '<div class="win-bar"><span class="win-dots"><i class="dot-red"></i><i class="dot-yellow"></i><i class="dot-green"></i></span>' +
      '<span class="term-title"><b>Dolphin</b> — /home/sidharthify/music</span><span></span></div>' +
      '<div class="term-body fm-body"><div class="fm-toolbar"><span class="fm-path">home / sidharthify / music</span>' +
      '<span class="fm-count">' + TRACKS.length + ' items · double-click to play</span></div><div class="fm-grid"></div></div>';
    surf.appendChild(el);
    buildGrid(el.querySelector(".fm-grid"));
    w = { id: "music", el, kind: "folder", title: "Dolphin — ~/music", min: false, max: false };
    w.persistPos = (x, y) => LS.set("win.music", { x, y });
    place(el, LS.get("win.music", null), () => ({ x: surf.clientWidth / 2 - 300, y: 24 }));
    wireControls(w);
    draggable(w);
    addTaskItem(w);
    wins.music = w;
    focusWin(w);
  }

  function musicFolderIcon(layer) {
    const el = document.createElement("div");
    el.className = "dz-icon dz-app";
    el.innerHTML = '<div class="dz-appicon">' + FOLDER_SVG + '</div><span class="dz-label">music</span>';
    layer.appendChild(el);
    place(el, LS.get("icon.music", null), () => ({ x: 0.02 * surf.clientWidth, y: 0.63 * surf.clientHeight }));
    iconDrag(el, (x, y) => LS.set("icon.music", { x, y }));
    el.addEventListener("dblclick", openMusicFolder);
    return el;
  }

  function openDoc(name) {
    ensureSurf();
    if (!surf) return;
    const doc = DOCS[name];
    if (!doc) return;
    const id = "doc:" + name;
    if (wins[id]) {
      const w = wins[id];
      w.el.style.display = "";
      w.min = false;
      if (w.tb) w.tb.classList.remove("minimized");
      focusWin(w);
      return;
    }
    const rows = doc.items
      .map(([t, s]) => '<li class="row"><span class="dot" aria-hidden="true"></span><div><div class="row-title">' + t + '</div><div class="row-sub">' + s + "</div></div></li>")
      .join("");
    const el = document.createElement("section");
    el.className = "window docviewer";
    el.innerHTML =
      '<div class="win-bar"><span class="win-dots"><i class="dot-red"></i><i class="dot-yellow"></i><i class="dot-green"></i></span>' +
      '<span class="term-title"><b>kate</b> — ' + name + "</span><span></span></div>" +
      '<div class="term-body doc-body"><div class="doc-h">' + doc.heading + '</div><ul class="rows">' + rows + "</ul></div>";
    surf.appendChild(el);
    const off = name === "skills.md" ? 40 : 0;
    const w = { id: id, el, kind: "doc", title: "kate — " + name, min: false, max: false };
    w.persistPos = (x, y) => LS.set("win." + id, { x, y });
    place(el, LS.get("win." + id, null), () => ({ x: surf.clientWidth / 2 - 250 + off, y: 26 + off }));
    wireControls(w);
    draggable(w);
    addTaskItem(w);
    wins[id] = w;
    focusWin(w);
  }

  function docIcon(layer, name, xf, yf) {
    const el = document.createElement("div");
    el.className = "dz-icon dz-app";
    el.innerHTML = '<div class="dz-appicon">' + DOC_SVG + '</div><span class="dz-label">' + name + "</span>";
    layer.appendChild(el);
    place(el, LS.get("icon." + name, null), () => ({ x: xf * surf.clientWidth, y: yf * surf.clientHeight }));
    iconDrag(el, (x, y) => LS.set("icon." + name, { x, y }));
    el.addEventListener("dblclick", () => openDoc(name));
    return el;
  }

  function openSocials() {
    ensureSurf();
    if (!surf) return;
    if (wins.socials) {
      const w = wins.socials;
      w.el.style.display = "";
      w.min = false;
      if (w.tb) w.tb.classList.remove("minimized");
      focusWin(w);
      return;
    }
    const items = SOCIALS
      .map(([label, href, ic]) => '<a class="soc-item" href="' + href + '" target="_blank" rel="noopener"><span class="soc-ic"><i class="fa-brands ' + ic + '"></i></span><span class="soc-label">' + label + "</span></a>")
      .join("");
    const el = document.createElement("section");
    el.className = "window socialswin";
    el.innerHTML =
      '<div class="win-bar"><span class="win-dots"><i class="dot-red"></i><i class="dot-yellow"></i><i class="dot-green"></i></span>' +
      '<span class="term-title"><b>Dolphin</b> — /home/sidharthify/socials</span><span></span></div>' +
      '<div class="term-body soc-body">' + items + "</div>";
    surf.appendChild(el);
    const w = { id: "socials", el, kind: "folder", title: "Dolphin — ~/socials", min: false, max: false };
    w.persistPos = (x, y) => LS.set("win.socials", { x, y });
    place(el, LS.get("win.socials", null), () => ({ x: surf.clientWidth / 2 - 150, y: 40 }));
    wireControls(w);
    draggable(w);
    addTaskItem(w);
    wins.socials = w;
    focusWin(w);
  }

  function socialsIcon(layer) {
    const el = document.createElement("div");
    el.className = "dz-icon dz-app";
    el.innerHTML = '<div class="dz-appicon">' + SOCIALS_SVG + '</div><span class="dz-label">socials</span>';
    layer.appendChild(el);
    place(el, LS.get("icon.socials", null), () => ({ x: 0.02 * surf.clientWidth, y: 0.78 * surf.clientHeight }));
    iconDrag(el, (x, y) => LS.set("icon.socials", { x, y }));
    el.addEventListener("dblclick", openSocials);
    return el;
  }

  function initMusicMobile() {
    if (!(HOME && isMobile())) return;
    const main = document.querySelector("main");
    if (!main) return;
    const sec = document.createElement("section");
    sec.className = "mobile-music";
    sec.innerHTML = '<h2>~/music</h2><div class="fm-grid"></div>';
    main.appendChild(sec);
    buildGrid(sec.querySelector(".fm-grid"));
  }

  function initDesktop() {
    surf = document.querySelector(".desktop-surface");
    if (!surf) return;
    buildTaskbar();
    termWin = registerTerminal();
    if (HOME) {
      const layer = document.querySelector(".desktop-icons");
      if (layer) {
        terminalIcon(layer);
        musicFolderIcon(layer);
        socialsIcon(layer);
        docIcon(layer, "projects.md", 0.9, 0.48);
        docIcon(layer, "skills.md", 0.9, 0.63);
        PHOTOS.forEach((p) => makeIcon(layer, p));
      }
      LS.get("iv.open", []).forEach((id) => {
        const p = PHOTOS.find((x) => x.id === id);
        if (p) openViewer(p);
      });
    }
  }

  function keyOf(li) {
    return (li.textContent || "").replace(/^\s*\d+\s*/, "").trim();
  }
  function renumber(list) {
    Array.from(list.children).forEach((li, i) => {
      const n = li.querySelector(".ws-num");
      if (n) n.textContent = i + 1;
    });
  }
  function initReorder() {
    const list = document.querySelector(".workspaces");
    if (!list) return;
    const order = LS.get("ws.order", null);
    if (order) {
      order.forEach((k) => {
        const li = Array.from(list.children).find((x) => keyOf(x) === k);
        if (li) list.appendChild(li);
      });
    }
    renumber(list);
    if (isMobile()) return;
    Array.from(list.children).forEach((li) => {
      li.setAttribute("draggable", "true");
      const a = li.querySelector("a");
      if (a) a.setAttribute("draggable", "false");
      li.addEventListener("dragstart", (e) => {
        li.classList.add("ws-dragging");
        e.dataTransfer.effectAllowed = "move";
        try { e.dataTransfer.setData("text/plain", keyOf(li)); } catch (_) {}
      });
      li.addEventListener("dragend", () => {
        li.classList.remove("ws-dragging");
        LS.set("ws.order", Array.from(list.children).map(keyOf));
        renumber(list);
      });
      li.addEventListener("dragover", (e) => {
        e.preventDefault();
        const dragging = list.querySelector(".ws-dragging");
        if (!dragging || dragging === li) return;
        const r = li.getBoundingClientRect();
        list.insertBefore(dragging, e.clientX - r.left < r.width / 2 ? li : li.nextSibling);
      });
    });
  }

  window.addEventListener("sidh-open-music", openMusicFolder);
  window.addEventListener("beforeunload", () => { if (wins.player) savePlayer(wins.player); });

  document.addEventListener("DOMContentLoaded", () => {
    initReorder();
    if (!isMobile()) initDesktop();
    initMusicMobile();
    restorePlayer();
  });
})();
