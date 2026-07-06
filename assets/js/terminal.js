(function () {
  "use strict";

  const body = document.body;
  const ROOT = body.dataset.root || "";
  let CWD = body.dataset.cwd || "~";

  const ROUTE = {
    "~": "",
    "~/about": "about/",
    "~/blog": "blogs/",
  };

  function openMusic() {
    window.dispatchEvent(new CustomEvent("sidh-open-music"));
  }

  const BLOGS = {
    "porting-arma-cwa": "blogs/blog-28-06-26/",
    "cbse-onmark": "blogs/blog-31-05-26/",
    "aqi-service-jk": "blogs/blog-10-2-26/",
    "pixel-kernel-bazel": "blogs/blog-14-12-25/",
    "nix-helper-script": "blogs/blog-18-10-25/",
    "device-trees-cleanup": "blogs/blog-25-06-25/",
    "aosp-device-trees": "blogs/blog-22-05-25/",
    "getting-into-aosp": "blogs/blog-18-05-25/",
    "dealing-with-aidl": "blogs/blog-17-05-25/",
  };
  Object.keys(BLOGS).forEach((s) => (ROUTE["~/blog/" + s] = BLOGS[s]));

  const PROJECTS = [
    ["yaap (yet another aosp project)", "maintainer / contributor"],
    ["cipherOS", "maintainer"],
    ["device trees & ports", "nothing phone 2a/2a+, realme 8i / narzo 50 4g, realme 9 5g SE, pixel 7 / 7 pro — maintainer, co-lead, contributor, tester"],
    ["lineageos contributions", "rewriting legacy hidl hardware abstraction layers to aidl, building kernels"],
    ["nixos + homelab", "self-hosted plex, radarr, sonarr, prowlarr"],
    ["cwr engine port (arma cwa)", "ported a 20-year-old game engine to android arm64 with a custom opengl es 3.2 backend"],
    ["syd", "lightweight command-line tool for nixOS"],
    ["breathe", "android app designed to monitor real-time AQI across Jammu & Kashmir"],
  ];

  const SKILLS = [
    ["c & modern c++", "engine rendering backends, kernelspace c, aosp c++, custom math libraries"],
    ["python and bash", "file manipulation and some scripting"],
    ["graphics programming & glsl", "opengl es 3.2, custom vertex/fragment shaders, rewriting fixed-function pipelines"],
    ["git", "general knowledge and familiarity"],
    ["linux", "general commandline knowledge"],
    ["aosp", "device trees, HALs (aidl/hidl), soong, android.bp, overlays, fastboot, adb"],
    ["nix/nixOS", "flakes, the distro and the nix language itself"],
    ["css/html/javascript", "enough to make this website, and contributions to yaaprom.org. no frameworks"],
    ["kotlin", "android frameworks"],
  ];

  const SOCIALS = [
    ["github", "https://github.com/sidharthify"],
    ["telegram", "https://t.me/arteryring1"],
    ["twitter / x", "https://x.com/sidharthify"],
  ];

  const ABOUT = [
    "i like low level systems and embedded programming.",
    "i tinker with android (aosp) and linux. i run nixOS on my main PC.",
    "i occasionally ship roms, write bash scripts and live in the UNIX terminal.",
  ];

  const FORTUNES = [
    "there is no dark side of the moon, really. matter of fact, it's all dark.",
    "talk is cheap. show me the code.  — linus",
    "an idiot admires complexity, a genius admires simplicity.  — terry a. davis",
    "shine on, you crazy diamond.",
    "the only intuitive interface is the nipple. everything else is learned.",
    "rm -rf / is not a personality trait.",
    "real programmers count from 0.",
    "there are only two hard things in cs: cache invalidation and naming things.",
  ];

  const TEASE = {
    mkdir: "mkdir: can't do that here, sorry :(",
    rmdir: "rmdir: can't do that here, sorry :(",
    rm: "rm: nice try. everything here stays put :(",
    touch: "touch: read-only filesystem, sorry :(",
    mv: "mv: can't move things around here, sorry :(",
    cp: "cp: can't do that here, sorry :(",
    chmod: "chmod: not your box to chmod, sorry :(",
    chown: "chown: it's all mine :(",
    ln: "ln: symlinks are a privilege you don't have here :(",
    dd: "dd: absolutely not.",
    mount: "mount: only root can do that, and you are not root :(",
    umount: "umount: nothing mounted here",
    vim: "vim: no editor here — try `cat` instead",
    nvim: "nvim: no editor here — try `cat` instead",
    nano: "nano: no editor here — try `cat` instead",
    emacs: "emacs: a great os, still looking for a decent website though",
    ssh: "ssh: connect to host: Connection refused (this is a browser)",
    scp: "scp: nowhere to copy to, sorry :(",
    curl: "curl: (7) couldn't connect — go touch grass instead",
    wget: "wget: nothing to fetch here but hyfetch",
    git: "git: not a git repository (but the source is on github)",
    make: "make: *** No rule to make target. this isn't your build server :(",
    gcc: "gcc: no input files (and no compiler down here)",
    apt: "apt: this is NixOS. we don't do that here.",
    "apt-get": "apt-get: this is NixOS. we don't do that here.",
    pacman: "pacman: wrong distro, buddy",
    yay: "yay: wrong distro, buddy",
    dnf: "dnf: wrong distro, buddy",
    emerge: "emerge: compiling... just kidding. wrong distro.",
    "nix-env": "nix-env: declaratively no.",
    reboot: "reboot: you can just refresh the page :)",
    poweroff: "poweroff: please don't",
    shutdown: "shutdown: please don't",
    halt: "halt: please don't",
    kill: "kill: (1) Operation not permitted",
    killall: "killall: no mercy, and no processes either",
    systemctl: "systemctl: Failed to connect to bus (there is no bus)",
    service: "service: no services here",
    crontab: "crontab: no time for cron",
    passwd: "passwd: you shall not pass(wd)",
    useradd: "useradd: this is a one-man machine",
    mkfs: "mkfs: i will pretend i didn't see that",
    fdisk: "fdisk: step away from the partition table",
    yes: "yes: y y y y y ... (imagine this, forever)",
    cmatrix: "cmatrix: the matrix has you — but not today",
    htop: "htop: everything is running fine, trust me",
    top: "top: all nominal. go outside.",
    strace: "strace: nothing to trace but my thoughts",
    sl: "sl: choo choo... but not today",
    sudo: "we don't serve root here.",
  };

  function listing(cwd) {
    if (cwd === "~") {
      return [
        { name: "about.md", type: "file", run: "cat about.md" },
        { name: "blog", type: "dir", go: "~/blog" },
        { name: "music", type: "dir", music: true },
        { name: "projects", type: "dir", run: "projects" },
        { name: "skills", type: "dir", run: "skills" },
        { name: "socials", type: "file", run: "socials" },
        { name: "README.md", type: "file", run: "cat README.md" },
      ];
    }
    if (cwd === "~/blog") {
      return Object.keys(BLOGS).map((s) => ({ name: s, type: "dir", go: "~/blog/" + s }));
    }
    if (cwd === "~/about") return [{ name: "about.md", type: "file", run: "cat about.md" }];
    if (cwd.startsWith("~/blog/")) {
      return [
        { name: "..", type: "dir", go: "~/blog" },
        { name: "README.md", type: "file", run: "cat README.md" },
      ];
    }
    return [];
  }

  function navTo(url) {
    window.location.href = url;
  }

  function goRoute(vpath) {
    navTo(ROOT + (ROUTE[vpath] || ""));
  }

  function startClock() {
    const el = document.querySelector(".panel-clock");
    if (!el) return;
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    function tick() {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      el.innerHTML =
        '<span class="clock-time">' + hh + ":" + mm + "</span> " +
        '<span class="clock-date">' + days[d.getDay()] + " " +
        String(d.getDate()).padStart(2, "0") + " " + mon[d.getMonth()] + "</span>";
    }
    tick();
    setInterval(tick, 15000);
  }

  const LOGCAT = [
    ["dim", "--------- beginning of main"],
    ["info", "01-07 01:32:07.104  1337  1337 I ActivityManager: Start proc 4821:com.sidharthify.breathe/u0a221 for activity"],
    ["dim", "01-07 01:32:07.221  4821  4821 D AndroidRuntime: >>>>>> START com.android.internal.os.ZygoteInit"],
    ["info", "01-07 01:32:07.336  4821  4821 I zygote64: Late-enabling -Xcheck:jni"],
    ["dim", "01-07 01:32:07.512  4821  4838 D BreatheApp: fetching AQI for grid 32.7266,74.8570"],
    ["info", "01-07 01:32:07.744  1201  1288 I ConnectivityService: NetworkAgentInfo [WIFI () - 121] validation passed"],
    ["dim", "01-07 01:32:07.901  4821  4838 D OkHttp: --> GET https://api.breathe.jk/v1/aqi?lat=32.72&lon=74.85"],
    ["info", "01-07 01:32:08.233  4821  4838 I OkHttp: <-- 200 OK (331ms)"],
    ["warn", "01-07 01:32:08.410  4821  4821 W BreatheApp: sensor tile stale (last update 42m ago), falling back to satellite"],
    ["dim", "01-07 01:32:08.588  1337  1502 D SurfaceFlinger: duplicate frame, dropping"],
    ["info", "01-07 01:32:08.720  4821  4821 I Choreographer: Skipped 31 frames! The application may be doing too much work on its main thread."],
    ["dim", "01-07 01:32:08.900  4821  4838 D Glide: loading marker icons into RecyclerView"],
    ["error", "01-07 01:32:09.140  4821  4838 E OkHttp: <-- HTTP FAILED: java.net.SocketTimeoutException: timeout"],
    ["warn", "01-07 01:32:09.155  4821  4838 W BreatheApp: retrying request (1/3)"],
    ["info", "01-07 01:32:09.602  4821  4838 I OkHttp: <-- 200 OK (447ms)"],
    ["dim", "01-07 01:32:09.780  1201  1201 D WifiService: acquireWifiLockLocked: WifiLock{...}"],
    ["info", "01-07 01:32:10.011  1337  1360 I ActivityManager: Displayed com.sidharthify.breathe/.MainActivity: +2s913ms"],
    ["dim", "01-07 01:32:10.240  4821  4821 D BreatheApp: AQI = 168 (unhealthy) — updating widget"],
    ["warn", "01-07 01:32:10.455  1088  1120 W SELinux: avc: denied { read } for scontext=u:r:untrusted_app"],
    ["dim", "01-07 01:32:10.700  4821  4890 D dalvikvm: GC_FOR_ALLOC freed 2048K, 14% free"],
    ["info", "01-07 01:32:11.020  4821  4821 I BreatheApp: notification posted: 'air quality is unhealthy'"],
    ["dim", "01-07 01:32:11.288  1337  1337 D PowerManagerService: lightsleep -> awake"],
    ["error", "01-07 01:32:11.503  2044  2044 E AudioFlinger: not enough memory for output buffer size=61440"],
    ["dim", "01-07 01:32:11.744  4821  4838 D BreatheApp: cached response for 15 min"],
    ["info", "01-07 01:32:12.100  1337  1502 I SurfaceFlinger: EventThread: 60.000 Hz"],
    ["dim", "01-07 01:32:12.360  4821  4821 D BreatheApp: idle — releasing wakelock"],
    ["dim", "^C"],
  ];

  function initShell() {
    const form = document.querySelector(".cmd");
    if (!form) return;
    const input = form.querySelector(".cmd-input");
    const output = form.querySelector(".cmd-output");
    const pathSpan = form.querySelector(".cmd-line .p-path");
    if (pathSpan) pathSpan.textContent = CWD;
    const scroller = form.closest(".term-body") || form.parentElement;

    const history = [];
    let hIndex = -1;

    function scrollBottom() {
      if (scroller) scroller.scrollTop = scroller.scrollHeight;
    }

    function print(text, cls) {
      const line = document.createElement("div");
      line.className = "line" + (cls ? " " + cls : "");
      if (text instanceof Node) line.appendChild(text);
      else line.textContent = text;
      output.appendChild(line);
      return line;
    }

    function printRows(rows) {
      rows.forEach(([title, sub]) => {
        print(title, "rtitle");
        print(sub, "rsub");
      });
    }

    function printLink(label, href) {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createTextNode(label.padEnd(14, " ")));
      const a = document.createElement("a");
      a.href = href;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = href;
      frag.appendChild(a);
      print(frag);
    }

    function echoCmd(raw) {
      const line = document.createElement("div");
      line.className = "line echo";
      line.innerHTML =
        '<span class="p-loc">sidharthify@nixos</span> ' +
        '<span class="p-path">' + CWD + '</span> ' +
        '<span class="p-sym">$</span> ';
      line.appendChild(document.createTextNode(raw));
      output.appendChild(line);
    }

    function resolvePath(arg) {
      if (!arg || arg === "~" || arg === "/") return "~";
      arg = arg.replace(/\/+$/, "");
      if (arg === ".") return CWD;
      if (arg === "..") {
        if (CWD === "~") return "~";
        return CWD.split("/").slice(0, -1).join("/") || "~";
      }
      if (arg.startsWith("~/")) return arg;
      return CWD === "~" ? "~/" + arg : CWD + "/" + arg;
    }

    let streaming = false;
    function stream(lines, delay) {
      streaming = true;
      let i = 0;
      const t = setInterval(() => {
        if (i >= lines.length) {
          clearInterval(t);
          streaming = false;
          return;
        }
        const [cls, txt] = lines[i++];
        print(txt, cls === "error" ? "err" : cls);
        scrollBottom();
      }, delay);
    }

    const HANDLERS = {
      help() {
        print("commands:", "accent");
        print("  ls · cd <dir> · cat <file> · open <name> · pwd · tree");
        print("  projects · skills · socials · neofetch · whoami · uptime");
        print("  uname · hostname · id · free · df · ps · lscpu · lsblk · env · which");
        print("  date · cal · history · cowsay <text> · fortune · ping <host>");
        print("  clear (ctrl+l)");
        print("... and plenty of real unix commands. poke around, break things.", "dim");
        print("tip: the bar up top navigates, and you can drag/close these windows.", "dim");
      },
      ls(arg) {
        const t = (arg || "").replace(/^~\//, "").replace(/\/$/, "");
        if (t === "projects") return HANDLERS.projects();
        if (t === "skills") return HANDLERS.skills();
        if (t === "socials") return HANDLERS.socials();
        const items = listing(CWD);
        if (!items.length) return print("");
        items.forEach((it) => {
          const frag = document.createDocumentFragment();
          const label = it.name + (it.type === "dir" ? "/" : "");
          if (it.go || it.run || it.music) {
            const a = document.createElement("a");
            a.href = "#";
            a.textContent = label;
            a.style.color = it.type === "dir" ? "var(--blue)" : "var(--lavender)";
            a.addEventListener("click", (e) => {
              e.preventDefault();
              if (it.music) { print("opening ~/music ...", "ok"); openMusic(); }
              else if (it.go) goRoute(it.go);
              else run(it.run);
            });
            frag.appendChild(a);
          } else {
            const span = document.createElement("span");
            span.textContent = label;
            span.style.color = it.type === "dir" ? "var(--blue)" : "var(--subtext)";
            frag.appendChild(span);
          }
          print(frag);
        });
      },
      cd(arg) {
        const t = (arg || "").replace(/^~\//, "").replace(/\/$/, "");
        if (t === "projects") return HANDLERS.projects();
        if (t === "skills") return HANDLERS.skills();
        if (t === "socials") return HANDLERS.socials();
        if (t === "music") { print("opening ~/music ...", "ok"); return openMusic(); }
        const target = resolvePath(arg);
        if (target === CWD) return;
        if (target === "~" || ROUTE.hasOwnProperty(target)) {
          print("cd " + target, "ok");
          goRoute(target);
        } else {
          print("cd: no such directory: " + arg, "err");
        }
      },
      cat(arg) {
        if (!arg) return print("cat: missing operand", "err");
        const f = arg.replace(/^~\//, "").toLowerCase();
        if (f === "about.md") {
          ABOUT.forEach((l) => print(l));
          const frag = document.createDocumentFragment();
          frag.appendChild(document.createTextNode("more: "));
          const a = document.createElement("a");
          a.href = "#";
          a.textContent = "cd about";
          a.addEventListener("click", (e) => { e.preventDefault(); goRoute("~/about"); });
          frag.appendChild(a);
          print(frag);
          return;
        }
        if (f === "readme.md" || f === "readme") {
          print("welcome. this is sidharthify's little corner of the web.", "accent");
          print("poke around with `ls`, `cd`, `projects`, `socials`.");
          print("there is no dark side to the moon, really. it's all dark.", "dim");
          return;
        }
        print("cat: " + arg + ": No such file", "err");
      },
      open(arg) {
        if (!arg) return print("open: missing operand", "err");
        if (arg === "about.md" || arg === "about") return goRoute("~/about");
        if (arg === "music" || arg === "music/") { print("opening ~/music ...", "ok"); return openMusic(); }
        const target = resolvePath(arg);
        if (ROUTE.hasOwnProperty(target)) return goRoute(target);
        print("open: cannot open '" + arg + "': No such file", "err");
      },
      "xdg-open"(arg) {
        if (!arg) return print("usage: xdg-open <file>", "dim");
        if (window.sidhOpen && window.sidhOpen(arg)) { print("opening " + arg + " ...", "ok"); return; }
        if (arg === "about.md") return goRoute("~/about");
        print("xdg-open: no application registered for '" + arg + "'", "err");
      },
      projects() { printRows(PROJECTS); },
      skills() { printRows(SKILLS); },
      socials() { SOCIALS.forEach(([l, h]) => printLink(l, h)); },
      pwd() { print("/home/sidharthify" + CWD.slice(1)); },
      whoami() { print("sidharthify"); },
      echo(arg) { print(arg || ""); },
      date() { print(new Date().toString()); },
      clear() { output.innerHTML = ""; },
      uname(arg) {
        if ((arg || "").includes("a")) print("Linux nixos 7.0.11-cachyos #1-cachyos SMP PREEMPT_DYNAMIC x86_64 GNU/Linux");
        else print("Linux");
      },
      hostname() { print("nixos"); },
      uptime() { print(" 01:32:07 up  3:14,  1 user,  load average: 0.42, 0.37, 0.29"); },
      id() { print("uid=1000(sidharthify) gid=100(users) groups=100(users),1(wheel),26(video),27(audio)"); },
      free() {
        print("               total        used        free      shared  buff/cache   available");
        print("Mem:        16219744     8931204     2143908      612044     5144632     6698532");
        print("Swap:        8388604      262144     8126460");
      },
      df() {
        print("Filesystem      Size  Used Avail Use% Mounted on");
        print("/dev/nvme0n1p2  916G  584G  332G  64% /");
        print("/dev/nvme0n1p1  512M   96M  416M  19% /boot");
        print("tmpfs           7.8G   84M  7.7G   2% /run");
      },
      ps() {
        print("  PID TTY          TIME CMD");
        print(" 1337 pts/0    00:00:00 zsh");
        print(" 2048 pts/0    00:00:03 Hyprland");
        print(" 4096 pts/0    00:00:00 alacritty");
        print(" 8080 pts/0    00:00:00 ps");
      },
      lscpu() {
        print("Architecture:            x86_64");
        print("CPU(s):                  12");
        print("Model name:              12th Gen Intel(R) Core(TM) i5-12400F");
        print("CPU max MHz:              4400.0000");
        print("Caches:                  L1 320 KiB, L2 7.5 MiB, L3 18 MiB");
      },
      lsblk() {
        print("NAME        SIZE TYPE MOUNTPOINTS");
        print("nvme0n1     931G disk");
        print("├─nvme0n1p1 512M part /boot");
        print("└─nvme0n1p2 931G part /");
      },
      ip() {
        print("1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536");
        print("    inet 127.0.0.1/8 scope host lo");
        print("2: enp5s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500");
        print("    inet 192.168.1.42/24 scope global dynamic enp5s0");
      },
      env() {
        print("SHELL=/run/current-system/sw/bin/zsh");
        print("USER=sidharthify");
        print("HOME=/home/sidharthify");
        print("EDITOR=nvim");
        print("WM=Hyprland");
        print("TERM=alacritty");
        print("PATH=/run/current-system/sw/bin:/home/sidharthify/.local/bin");
      },
      which(arg) {
        if (!arg) return print("usage: which <command>", "dim");
        const known = COMMANDS.concat(["zsh", "bash", "nix", "hyprland", "git", "adb"]);
        if (known.includes(arg)) print("/run/current-system/sw/bin/" + arg);
        else print("which: no " + arg + " in (/run/current-system/sw/bin)", "err");
      },
      history() {
        history.forEach((h, i) => print(String(i + 1).padStart(4) + "  " + h));
      },
      tree() {
        print(".");
        print("├── about.md");
        print("├── blog/");
        const bs = Object.keys(BLOGS);
        bs.forEach((s, i) => print("│   " + (i === bs.length - 1 ? "└──" : "├──") + " " + s + "/"));
        print("├── music/");
        print("├── projects/");
        print("├── skills/");
        print("└── README.md");
        print(bs.length + 3 + " directories, 2 files", "dim");
      },
      cal() {
        const now = new Date();
        const y = now.getFullYear(), m = now.getMonth();
        const names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const first = new Date(y, m, 1).getDay();
        const days = new Date(y, m + 1, 0).getDate();
        const title = names[m] + " " + y;
        print(" ".repeat(Math.max(0, Math.floor((20 - title.length) / 2))) + title);
        print("Su Mo Tu We Th Fr Sa");
        let row = "   ".repeat(first);
        for (let d = 1; d <= days; d++) {
          row += String(d).padStart(2) + " ";
          if ((first + d) % 7 === 0) { print(row.replace(/\s+$/, "")); row = ""; }
        }
        if (row.trim()) print(row.replace(/\s+$/, ""));
      },
      cowsay(arg) {
        const txt = arg || "moo";
        print(" " + "_".repeat(txt.length + 2));
        print("< " + txt + " >");
        print(" " + "-".repeat(txt.length + 2));
        print("        \\   ^__^");
        print("         \\  (oo)\\_______");
        print("            (__)\\       )\\/\\");
        print("                ||----w |");
        print("                ||     ||");
      },
      fortune() { print(FORTUNES[Math.floor(Math.random() * FORTUNES.length)]); },
      man(arg) { print("No manual entry for " + (arg || "that") + " — try 'help' instead.", "dim"); },
      su() { print("Password: ", "dim"); print("su: Authentication failure", "err"); },
      ping(arg) {
        if (streaming) return;
        const host = arg ? arg.split(/\s+/)[0] : "nixos.org";
        print("PING " + host + " (151.101.65.140) 56(84) bytes of data.");
        const lines = [];
        for (let i = 1; i <= 4; i++)
          lines.push(["", "64 bytes from " + host + ": icmp_seq=" + i + " ttl=55 time=" + (11 + Math.random() * 8).toFixed(1) + " ms"]);
        lines.push(["dim", "--- " + host + " ping statistics ---"]);
        lines.push(["dim", "4 packets transmitted, 4 received, 0% packet loss, time 3004ms"]);
        stream(lines, 380);
      },
      adb(arg) {
        const sub = (arg || "").trim();
        if (sub === "devices") {
          print("List of devices attached");
          print("R58N12ABCDEF       device");
          return;
        }
        if (sub === "logcat" || sub.indexOf("logcat") === 0) {
          if (streaming) return;
          stream(LOGCAT, 90);
          return;
        }
        if (!sub) {
          print("Android Debug Bridge version 1.0.41");
          print("usage: adb [devices|logcat|shell|install|...]", "dim");
          return;
        }
        print("adb: unknown command '" + sub + "'", "err");
      },
      shine() { print("shine on, you crazy diamond", "accent"); },
      neofetch() {
        print("NixOS 26.11 (Zokor) · sidharthify@nixos", "accent");
        print("shell: zsh · wm: hyprland · editor: neovim");
        const frag = document.createDocumentFragment();
        frag.appendChild(document.createTextNode("the full splash lives on "));
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = "~ (home)";
        a.addEventListener("click", (e) => { e.preventDefault(); goRoute("~"); });
        frag.appendChild(a);
        print(frag);
      },
    };
    HANDLERS.vim = HANDLERS.open;
    HANDLERS.hyfetch = HANDLERS.neofetch;
    HANDLERS.fastfetch = HANDLERS.neofetch;
    HANDLERS.ifconfig = HANDLERS.ip;

    const COMMANDS = [
      "help", "ls", "cd", "cat", "open", "projects", "skills", "socials",
      "pwd", "clear", "whoami", "echo", "date", "neofetch", "hyfetch", "fastfetch",
      "uname", "hostname", "uptime", "id", "free", "df", "ps", "lscpu", "lsblk",
      "ip", "env", "which", "history", "tree", "cal", "cowsay", "fortune", "man",
      "ping", "su", "adb", "xdg-open",
    ];

    function run(raw) {
      const trimmed = raw.trim();
      echoCmd(raw);
      if (trimmed) {
        const [cmd, ...rest] = trimmed.split(/\s+/);
        const name = cmd.toLowerCase();
        const arg = rest.join(" ");
        if (name === "sudo" && rest.length) {
          print("shine on, you crazy diamond", "accent");
          print("(nice try — there is no dark side of the moon, really)", "dim");
        } else if (HANDLERS[name]) HANDLERS[name](arg);
        else if (TEASE[name]) print(TEASE[name], "dim");
        else print("command not found: " + cmd + " — type 'help'", "err");
      }
      scrollBottom();
    }

    function complete() {
      const val = input.value;
      const parts = val.split(/\s+/);
      let pool, token, prefixLen;
      if (parts.length <= 1) {
        pool = COMMANDS;
        token = parts[0] || "";
        prefixLen = 0;
      } else {
        token = parts[parts.length - 1];
        pool = listing(CWD).map((i) => i.name).concat(["..", "~", "projects", "skills", "socials"]);
        prefixLen = val.length - token.length;
      }
      const matches = pool.filter((c) => c.startsWith(token));
      if (matches.length === 1) input.value = val.slice(0, prefixLen) + matches[0] + " ";
      else if (matches.length > 1) print(matches.join("   "), "dim");
    }

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const v = input.value;
        if (v.trim()) { history.push(v); hIndex = history.length; }
        input.value = "";
        run(v);
      } else if (e.key === "ArrowUp") {
        if (history.length) { hIndex = Math.max(0, hIndex - 1); input.value = history[hIndex] || ""; e.preventDefault(); }
      } else if (e.key === "ArrowDown") {
        if (history.length) { hIndex = Math.min(history.length, hIndex + 1); input.value = history[hIndex] || ""; e.preventDefault(); }
      } else if (e.key === "Tab") {
        e.preventDefault();
        complete();
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        output.innerHTML = "";
      }
    });

    form.addEventListener("click", (e) => {
      if (e.target.tagName !== "A") input.focus();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    startClock();
    initShell();
    try {
      console.log("%cshine on, you crazy diamond", "color:#cba6f7;font:700 14px monospace");
    } catch (_) {}
  });
})();
