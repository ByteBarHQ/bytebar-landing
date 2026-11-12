/* ============================================================
   ByteBar Library — app engine.
   - Catalog from data.js (window.BB_BOOKS, generated from the deployed
     playlist snapshot — real TOCs).
   - Accounts: the simulator's Supabase project (config.js), magic-link
     sign-in, same PKCE code-exchange pattern as the sim's backend.js.
   - Progress: per-user, per-chapter {pos, done}. Source of truth when
     signed in = public.library_progress (SQL in PROGRESS-SCHEMA.sql,
     delivered for review — NOT yet applied, so until it is, the remote
     calls fail soft and localStorage carries progress alone).
   - Video URLs: streams.js static map today; when Bunny lands, an Edge
     Function ("library-sign-url") mints short-lived signed URLs after an
     entitlement check — see resolveStream(). The signing key never
     touches the browser (SPEC §4.2).
   ============================================================ */
window.BB = (function () {
  "use strict";
  var CFG = window.BB_LIBRARY_CONFIG || {};
  var LS_KEY = "bblib.progress.v1";

  /* ---------------- catalog ---------------- */
  var BOOKS = window.BB_BOOKS || [];
  function book(slug) {
    for (var i = 0; i < BOOKS.length; i++) if (BOOKS[i].slug === slug) return BOOKS[i];
    return null;
  }
  function chaptersOf(b) { return b && b.chapters ? b.chapters : null; }
  function streamOf(b, n) {
    var m = (window.BB_STREAMS || {})[b.slug];
    return m ? (m[n] || null) : null;
  }
  /* Display title: Start Here rows and chapter rows drop the YouTube-era
     "Free … Course —" wrapper and per-video exam-code prefixes (the course
     page already carries the code in its eyebrow). */
  function displayTitle(b, ch) {
    var t = ch.title || "";
    if (ch.n === 0) return "Start Here";
    t = t.replace(/^Free .*?Course\s*[—-]\s*/, "");
    t = t.replace(/^[A-Za-z+]+ [A-Z0-9-]{4,}:\s*/, "");        // "Security+ SY0-701: …"
    t = t.replace(/^(SY0-701|N10-009|XK0-006|200-301|SAA-C03|AIF-C01|AZ-104|CS0-004|PT0-003|CLF-C02):\s*/, "");
    return t;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtDur(sec) {
    if (!sec && sec !== 0) return "";
    sec = Math.round(sec);
    if (sec < 90) return Math.max(1, Math.round(sec / 60)) + " min";
    var h = Math.floor(sec / 3600), m = Math.round((sec % 3600) / 60);
    return h ? (h + " h " + String(m).padStart(2, "0") + " m") : (m + " min");
  }
  function qp(name) { return new URLSearchParams(location.search).get(name); }

  /* ---------------- progress store ---------------- */
  var progress = loadLocal();
  var remoteState = "off"; // off | ok | missing (table not applied yet)
  function loadLocal() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}") || {}; }
    catch (e) { return {}; }
  }
  function saveLocal() {
    try { localStorage.setItem(LS_KEY, JSON.stringify(progress)); } catch (e) {}
  }
  function entry(b, n) {
    return (progress[b.slug] || {})[n] || null;
  }
  function setEntry(b, n, patch) {
    if (!progress[b.slug]) progress[b.slug] = {};
    var cur = progress[b.slug][n] || { pos: 0, done: false, upd: 0 };
    for (var k in patch) cur[k] = patch[k];
    cur.upd = Date.now();
    progress[b.slug][n] = cur;
    saveLocal();
    pushRemote(b, n, cur);
    return cur;
  }
  function bookProgress(b) {
    var chs = chaptersOf(b);
    var total = chs ? chs.length : (b.lessons || 0);
    var done = 0, started = false, lastUpd = 0;
    if (chs) {
      chs.forEach(function (ch) {
        var e = entry(b, ch.n);
        if (e) {
          started = true;
          if (e.upd > lastUpd) lastUpd = e.upd;
          if (e.done) done++;
        }
      });
    }
    var next = null;
    if (chs) {
      for (var i = 0; i < chs.length; i++) {
        var e2 = entry(b, chs[i].n);
        if (!e2 || !e2.done) { next = chs[i]; break; }
      }
    }
    return {
      total: total, done: done, started: started, lastUpd: lastUpd,
      pct: total ? Math.round((done / total) * 100) : 0,
      complete: total > 0 && done >= total, next: next
    };
  }

  /* ---------------- supabase ---------------- */
  var supa = null, user = null, supaReady = null;
  function loadSupa() {
    if (supaReady) return supaReady;
    supaReady = new Promise(function (resolve) {
      if (!CFG.supabaseUrl || !CFG.supabaseAnonKey) return resolve(null);
      if (window.supabase && window.supabase.createClient) return resolve(window.supabase);
      var s = document.createElement("script");
      s.src = CFG.supabaseJs; s.async = true;
      var done = false;
      var finish = function (ok) { if (!done) { done = true; resolve(ok ? window.supabase : null); } };
      s.onload = function () { finish(true); };
      s.onerror = function () { finish(false); };
      document.head.appendChild(s);
      setTimeout(function () { finish(!!(window.supabase && window.supabase.createClient)); }, 8000);
    });
    return supaReady;
  }
  async function initAuth() {
    var lib = await loadSupa();
    if (!lib) { renderAuthArea(); return; }
    supa = lib.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey);
    // PKCE magic-link return: ?code=… → session (same as the simulator).
    try {
      var code = qp("code");
      if (code) {
        await supa.auth.exchangeCodeForSession(code);
        var u = new URL(location.href); u.searchParams.delete("code");
        history.replaceState(null, "", u.pathname + u.search + u.hash);
      }
    } catch (e) {}
    try {
      var gs = await supa.auth.getSession();
      user = gs && gs.data ? gs.data.session && gs.data.session.user : null;
    } catch (e) {}
    supa.auth.onAuthStateChange(function (_ev, session) {
      user = session ? session.user : null;
      renderAuthArea();
      if (user) { pullRemote().then(refreshProgressUI); } else { refreshProgressUI(); }
    });
    renderAuthArea();
    if (user) await pullRemote();
  }
  async function pullRemote() {
    if (!supa || !user) return;
    try {
      var res = await supa.from(CFG.progressTable)
        .select("book_slug, chapter_n, position_s, completed, updated_at")
        .eq("user_id", user.id);
      if (res.error) throw res.error;
      remoteState = "ok";
      (res.data || []).forEach(function (r) {
        if (!progress[r.book_slug]) progress[r.book_slug] = {};
        var cur = progress[r.book_slug][r.chapter_n];
        var upd = Date.parse(r.updated_at) || 0;
        if (!cur || upd > cur.upd) {
          progress[r.book_slug][r.chapter_n] = {
            pos: r.position_s || 0, done: !!r.completed, upd: upd
          };
        }
      });
      saveLocal();
    } catch (e) {
      remoteState = "missing"; // schema not applied yet — local carries on
    }
  }
  var pushTimers = {};
  function pushRemote(b, n, cur) {
    if (!supa || !user || remoteState === "missing") return;
    var key = b.slug + ":" + n;
    clearTimeout(pushTimers[key]);
    pushTimers[key] = setTimeout(async function () {
      try {
        var res = await supa.from(CFG.progressTable).upsert({
          user_id: user.id, book_slug: b.slug, chapter_n: n,
          position_s: Math.round(cur.pos || 0), completed: !!cur.done,
          updated_at: new Date(cur.upd).toISOString()
        }, { onConflict: "user_id,book_slug,chapter_n" });
        if (res.error) throw res.error;
        remoteState = "ok";
      } catch (e) { remoteState = "missing"; }
    }, 800);
  }
  async function signIn(email) {
    if (!supa) await initAuth();
    if (!supa) throw new Error("Sign-in is unavailable right now.");
    var redirect = location.href.split("?")[0];
    var res = await supa.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: redirect }
    });
    if (res.error) throw res.error;
  }
  async function signOut() {
    if (supa) { try { await supa.auth.signOut(); } catch (e) {} }
    user = null; renderAuthArea(); refreshProgressUI();
  }

  /* ---------------- signed stream URLs (stub) ---------------- */
  /* SPEC §4.2: an Edge Function checks entitlement, then mints a short-lived
     signed Bunny URL so the token key never reaches the browser. Until the
     function + Bunny account exist, this falls back to the static map. */
  async function resolveStream(b, n) {
    var st = streamOf(b, n);
    if (!st) return null;
    if (st.type === "file") return { src: st.src, poster: st.poster || null };
    if (st.type === "bunny") {
      if (supa && CFG.signFunction) {
        try {
          var res = await supa.functions.invoke(CFG.signFunction, {
            body: { book: b.slug, chapter: n, videoId: st.videoId }
          });
          if (!res.error && res.data && res.data.url) return { src: res.data.url, poster: st.poster || null };
        } catch (e) { /* fall through — not deployed yet */ }
      }
      return null; // Bunny configured in the map but signing not live yet
    }
    return null;
  }

  /* ---------------- shared UI: header auth ---------------- */
  function renderAuthArea() {
    var el = document.getElementById("authArea");
    if (!el) return;
    if (user) {
      el.innerHTML = '<span class="who">' + esc(user.email || "") + '</span>' +
        '<button class="dim" id="signOutBtn" type="button">Sign out</button>';
      document.getElementById("signOutBtn").addEventListener("click", signOut);
    } else {
      el.innerHTML = '<button class="dim" id="signInBtn" type="button">Sign in</button>';
      document.getElementById("signInBtn").addEventListener("click", openAuth);
    }
  }
  function openAuth() {
    var d = document.getElementById("authDlg");
    if (d && d.showModal) d.showModal();
  }
  function wireAuthDialog() {
    var d = document.getElementById("authDlg");
    if (!d) return;
    var form = d.querySelector("form");
    var msg = d.querySelector(".msg");
    form.addEventListener("submit", async function (ev) {
      ev.preventDefault();
      var email = form.querySelector("input[type=email]").value.trim();
      msg.className = "msg"; msg.textContent = "Sending…";
      try {
        await signIn(email);
        msg.className = "msg ok";
        msg.textContent = "Check your email — your sign-in link is on its way. It signs you into the Library and the Simulator with the same account.";
      } catch (e) {
        msg.className = "msg err";
        msg.textContent = (e && e.message) || "Something went wrong — try again.";
      }
    });
    var close = d.querySelector("[data-close]");
    if (close) close.addEventListener("click", function () { d.close(); });
  }
  var pageRefreshers = [];
  function refreshProgressUI() { pageRefreshers.forEach(function (f) { try { f(); } catch (e) {} }); }

  /* ---------------- shared fragments ---------------- */
  function ringSVG(pct, acc, warm) {
    var off = (157.1 * (1 - Math.min(100, Math.max(0, pct)) / 100)).toFixed(1);
    var track = warm ? "rgba(242,197,114,.16)" : "rgba(148,178,255,.13)";
    return '<svg width="60" height="60" viewBox="0 0 60 60">' +
      '<circle cx="30" cy="30" r="25" fill="none" stroke="' + track + '" stroke-width="5"/>' +
      '<circle cx="30" cy="30" r="25" fill="none" stroke="' + acc + '" stroke-width="5" stroke-linecap="round" stroke-dasharray="157.1" stroke-dashoffset="' + off + '" transform="rotate(-90 30 30)"/></svg>' +
      '<div class="pct">' + pct + '%</div>';
  }
  var TRACES = '<svg class="cv-traces" width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 200 120"><g stroke="#FFFFFF" stroke-width="1.4" fill="none"><path d="M-6 26 H70 L92 48 H206"/><path d="M-6 96 H54 L76 74 H150"/></g></svg>';
  function cardHTML(b) {
    var p = bookProgress(b);
    var foot;
    if (p.complete) {
      foot = '<div class="tags"><span class="lvl">' + esc(b.level) + '</span><span class="state done">Complete ✓</span></div><div class="bar"><i style="width:100%"></i></div>';
    } else if (p.started) {
      foot = '<div class="tags"><span class="lvl">' + esc(b.level) + '</span><span class="state doing">' + p.pct + '%</span></div><div class="bar"><i style="width:' + p.pct + '%"></i></div>';
    } else {
      foot = '<div class="tags"><span class="lvl">' + esc(b.level) + '</span><span class="state">Not started</span></div>';
    }
    return '<a class="card' + (b.shelf === "nursing" ? " t-card" : "") + '" style="--acc:' + b.accent + '" ' +
      'data-cat="' + b.cat + '" data-search="' + esc(b.search) + '" href="course.html?book=' + b.slug + '">' +
      '<div class="cover">' + TRACES + '<div class="cv-code">' + esc(b.code) + '</div><div class="cv-vendor">' + esc(b.vendor) + '</div></div>' +
      '<div class="cbody"><h3>' + esc(b.name) + '</h3><div class="meta">' + esc(b.meta) + '</div>' +
      '<div class="foot">' + foot + '</div></div></a>';
  }

  /* ---------------- HOME ---------------- */
  function initHome() {
    var itGrid = document.getElementById("itGrid");
    var teaGrid = document.getElementById("tealightGrid");
    function renderGrids() {
      itGrid.innerHTML = BOOKS.filter(function (b) { return b.shelf === "it"; }).map(cardHTML).join("");
      teaGrid.innerHTML = BOOKS.filter(function (b) { return b.shelf === "nursing"; }).map(cardHTML).join("");
      applyFilter();
    }
    function renderRail() {
      var rail = document.getElementById("continueRail");
      var sec = document.getElementById("continueSection");
      var started = BOOKS.map(function (b) { return { b: b, p: bookProgress(b) }; })
        .filter(function (x) { return x.p.started && !x.p.complete; })
        .sort(function (a, c) { return c.p.lastUpd - a.p.lastUpd; })
        .slice(0, 3);
      if (!started.length) { sec.classList.add("hidden"); return; }
      sec.classList.remove("hidden");
      document.getElementById("continueCount").textContent =
        started.length + (started.length === 1 ? " in progress" : " in progress");
      rail.innerHTML = started.map(function (x) {
        var b = x.b, p = x.p, nxt = p.next;
        var chapters = (b.lessons || p.total) - 1; // excluding Start Here
        var where = nxt ? (nxt.n === 0 ? "Start Here · " + b.vendor + " " + b.code
                                       : "Chapter " + nxt.n + " of " + chapters + " · " + b.vendor + " " + b.code)
                        : b.vendor + " " + b.code;
        var e = nxt ? entry(b, nxt.n) : null;
        var st = nxt ? streamOf(b, nxt.n) : null;
        var left;
        if (e && st && st.dur && e.pos > 0) left = Math.max(1, Math.round((st.dur - e.pos) / 60)) + " min left in this chapter";
        else if (nxt && nxt.n === 0) left = "The map of the whole book — start here";
        else left = p.done + " of " + p.total + " lessons done";
        var nextLine = nxt ? ("Resume — " + (nxt.n === 0 ? "Start Here" : "Ch " + nxt.n + ": " + displayTitle(b, nxt))) : "";
        if (nextLine.length > 64) nextLine = nextLine.slice(0, 61) + "…";
        var href = nxt ? ("watch.html?book=" + b.slug + "&ch=" + nxt.n) : ("course.html?book=" + b.slug);
        return '<a class="ccard' + (b.shelf === "nursing" ? " warm" : "") + '" style="--acc:' + b.accent + '" href="' + href + '">' +
          '<div class="c-top"><div class="mini-cover"><div class="mc-code">' + esc(b.code) + '</div><div class="mc-name">' + esc(b.name) + '</div></div>' +
          '<div class="ring-wrap">' + ringSVG(p.pct, b.accent, b.shelf === "nursing") + '</div></div>' +
          '<div class="c-book">' + esc(b.name) + '</div><div class="c-where">' + esc(where) + '</div>' +
          '<div class="c-next"><span class="play-ic">▶</span>' + esc(nextLine) + '</div>' +
          '<div class="c-left">' + esc(left) + '</div></a>';
      }).join("");
    }
    var currentFilter = "all";
    var searchInput = document.getElementById("searchInput");
    function applyFilter() {
      var q = (searchInput.value || "").trim().toLowerCase();
      var itVisible = 0, teaVisible = 0;
      function scan(gridEl, shelf) {
        var n = 0;
        Array.prototype.forEach.call(gridEl.querySelectorAll(".card"), function (c) {
          var show = (currentFilter === "all" || currentFilter === c.getAttribute("data-cat")) &&
                     (!q || (c.getAttribute("data-search") || "").indexOf(q) !== -1);
          c.classList.toggle("hidden", !show);
          if (show) n++;
        });
        return n;
      }
      itVisible = scan(itGrid, "it");
      teaVisible = scan(teaGrid, "nursing");
      document.getElementById("itSection").classList.toggle("hidden", currentFilter === "nursing");
      var teaSec = document.getElementById("tealightSection");
      teaSec.classList.toggle("hidden", !(currentFilter === "all" || currentFilter === "nursing"));
      document.getElementById("itNoResults").style.display =
        (itVisible === 0 && currentFilter !== "nursing") ? "block" : "none";
      document.getElementById("tealightNoResults").style.display =
        (teaVisible === 0 && (currentFilter === "all" || currentFilter === "nursing")) ? "block" : "none";
    }
    document.querySelectorAll("#chips .chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        document.querySelectorAll("#chips .chip").forEach(function (c) { c.classList.remove("on"); });
        chip.classList.add("on");
        currentFilter = chip.getAttribute("data-filter");
        applyFilter();
        if (currentFilter === "nursing") {
          document.getElementById("tealightSection").scrollIntoView({ behavior: "smooth" });
        }
      });
    });
    searchInput.addEventListener("input", applyFilter);

    var recos = {
      firstjob: { text: '<b>First IT job?</b> Start with <b>A+</b> or <b>Network+</b> — their <span class="free">Start Here chapters are free</span>, and both books build from zero.', cta: "Watch A+ Start Here — free", book: "aplus" },
      security: { text: '<b>Most people start with Security+.</b> Its <span class="free">Start Here chapter is free</span> — 4 minutes, and you\'ll know exactly how the book teaches.', cta: "Watch Security+ Start Here — free", book: "secplus" },
      cloud:    { text: '<b>Cloud route:</b> begin with <b>Cloud Practitioner (CLF-C02)</b> — the shortest book in the library — or go straight at <b>AZ-104</b>. <span class="free">Start Here is free</span> either way.', cta: "Watch Cloud Practitioner Start Here — free", book: "clf" },
      nursing:  { text: '<b>Nursing exams live on the Tealight shelf.</b> <b>TEAS 7</b> and <b>NCLEX-RN</b> both open with a <span class="free">free Start Here chapter</span>.', cta: "Watch TEAS 7 Start Here — free", book: "teas7" }
    };
    var recoLine = document.getElementById("recoLine");
    var recoCta = document.getElementById("recoCta");
    document.querySelectorAll(".goal").forEach(function (g) {
      g.addEventListener("click", function () {
        document.querySelectorAll(".goal").forEach(function (x) { x.classList.remove("on"); });
        g.classList.add("on");
        var r = recos[g.getAttribute("data-goal")];
        if (r) {
          recoLine.innerHTML = r.text;
          recoCta.textContent = r.cta;
          recoCta.href = "watch.html?book=" + r.book + "&ch=0";
        }
      });
    });

    renderGrids(); renderRail();
    pageRefreshers.push(function () { renderGrids(); renderRail(); });
  }

  /* ---------------- COURSE ---------------- */
  function progressHeadHTML(b, p) {
    var label;
    if (p.complete) label = "Book complete";
    else if (!p.started) label = "Not started";
    else if (p.next) label = p.next.n === 0 ? "Start Here is next" : "Chapter " + p.next.n + " of " + (p.total - 1);
    else label = p.done + " lessons done";
    return '<div class="progress-head"><div class="ph-big">' + esc(label) + '</div>' +
      '<div class="ph-pct">' + p.pct + '% complete</div></div>' +
      '<div class="bar"><i style="width:' + p.pct + '%"></i></div>';
  }
  function rowHTML(b, ch, p) {
    var e = entry(b, ch.n);
    var st = streamOf(b, ch.n);
    var done = !!(e && e.done);
    var isNext = p.next && p.next.n === ch.n;
    var cls = "row", state, right = "";
    var durTxt = st && st.dur ? fmtDur(st.dur) : "";
    if (done) {
      cls += " watched"; state = "Watched";
      right = '<div class="check">✓</div>';
    } else if (st && isNext) {
      cls += " current"; state = "Up next for you";
      right = '<div class="playtri"></div>';
    } else if (st) {
      state = "Up next";
    } else {
      cls += " building"; state = isNext ? "Up next · in production" : "In production";
    }
    var title = esc(displayTitle(b, ch));
    if (st && isNext && !done) title += '<span class="nowtag">NOW</span>';
    var num = ch.n === 0 ? '<div class="num start">START</div>' : '<div class="num">' + ch.n + '</div>';
    var inner = num + '<div class="r-main"><div class="r-title">' + title + '</div>' +
      '<div class="r-state">' + state + '</div></div>' + right +
      (durTxt ? '<div class="dur">' + durTxt + '</div>' : "");
    if (st) return '<a class="' + cls + '" href="watch.html?book=' + b.slug + '&ch=' + ch.n + '">' + inner + '</a>';
    return '<div class="' + cls + '">' + inner + '</div>';
  }
  function capstoneHTML(b) {
    return '<div class="capstone"><div class="c-eyebrow">Final Exam</div>' +
      '<h3>Final Exam — Practice Exam Simulator</h3>' +
      '<p>Timed, scored, with a domain-by-domain breakdown of exactly what to study next. The book ends here — test day starts here.</p>' +
      '<a class="open" href="' + esc(CFG.simulatorUrl || "https://sim.bytebarhq.com") + '" target="_blank" rel="noopener">Open the simulator →</a></div>';
  }
  function renderCourse() {
    var root = document.getElementById("courseRoot");
    var b = book(qp("book") || "secplus");
    if (!b) {
      root.innerHTML = '<div class="wrap"><p class="building-note">That book isn\'t in the library yet. <a href="index.html" style="color:var(--cyan)">Back to the library →</a></p></div>';
      return;
    }
    document.title = b.name + " (" + b.code + ") — ByteBar Library";
    var p = bookProgress(b);
    var chs = chaptersOf(b);
    var html = '<div class="wrap">' +
      '<a class="backlink" href="index.html">← &nbsp;Library</a>' +
      '<div class="course-head"><div class="eyebrow">' + esc(b.code) + " · " + esc(b.vendor) + '</div>' +
      '<h1>' + esc(b.name) + (b.shelf === "it" ? " — The Complete Book" : "") + '</h1>' +
      '<div class="course-meta">' + esc(b.meta) +
      (b.shelf === "it" ? " · Blueprint order, foundations first" : " · In order, in plain English") + '</div></div>' +
      '<div id="courseProgress">' + progressHeadHTML(b, p) + '</div>';
    if (b.slug === "secplus") {
      html += '<div class="pip"><svg width="30" height="30" viewBox="0 0 40 40" aria-hidden="true">' +
        '<path d="M20 3c8 0 14 6.6 14 15 0 9.4-6.3 15-14 15S6 27.4 6 18C6 9.6 12 3 20 3Z" fill="#2E9BC6"/>' +
        '<circle cx="14.5" cy="17" r="2.1" fill="#06222B"/><circle cx="25.5" cy="17" r="2.1" fill="#06222B"/>' +
        '<path d="M15.5 24.5c1.4 1.6 2.9 2.3 4.5 2.3s3.1-.7 4.5-2.3" stroke="#06222B" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>' +
        '<div><div class="pip-name">PIP</div>' +
        '<div class="pip-line">Thirty chapters, five domains, one exam at the end. Start at Start Here — the map takes four minutes, and the book does the rest.</div></div></div>';
    }
    if (chs) {
      html += '<div class="chapters">' + chs.map(function (ch) { return rowHTML(b, ch, p); }).join("") + '</div>';
    } else {
      html += '<div class="building-note"><b>This book is in production.</b> Its ' + b.lessons +
        ' lessons are being built to the Library Edition standard — chapters will appear here in order as they bank. Your account will remember your place the moment the first chapter lands.</div>';
    }
    html += capstoneHTML(b);
    html += '<div class="course-foot">bytebarhq.com · ' + esc(b.name) +
      (b.code !== b.name ? " (" + esc(b.code) + ")" : "") +
      " — free with your account. The same account works in the Simulator.</div></div>";
    root.innerHTML = html;
  }
  function initCourse() {
    renderCourse();
    pageRefreshers.push(renderCourse);
  }

  /* ---------------- PLAYER ---------------- */
  function initPlayer() {
    var root = document.getElementById("playerRoot");
    var b = book(qp("book") || "secplus");
    var n = parseInt(qp("ch") || "0", 10);
    if (!b || !chaptersOf(b)) {
      root.innerHTML = '<div class="wrap"><p class="building-note">That chapter isn\'t available yet. <a href="index.html" style="color:var(--cyan)">Back to the library →</a></p></div>';
      return;
    }
    var chs = chaptersOf(b);
    var ch = null;
    chs.forEach(function (c) { if (c.n === n) ch = c; });
    if (!ch) ch = chs[0];
    document.title = displayTitle(b, ch) + " — " + b.name + " · ByteBar Library";

    function render() {
      var p = bookProgress(b);
      var e = entry(b, ch.n) || { pos: 0, done: false };
      var html = '<div class="wrap">' +
        '<a class="backlink" href="course.html?book=' + b.slug + '">← &nbsp;' + esc(b.name) + '</a>' +
        '<div class="course-head"><div class="eyebrow">' + esc(b.code) + " · " + esc(b.vendor) + '</div>' +
        '<h1>' + esc(displayTitle(b, ch)) + '</h1>' +
        '<div class="course-meta">' + (ch.n === 0 ? "Start Here" : "Chapter " + ch.n + " of " + (chs.length - 1)) +
        " · " + esc(b.name) + '</div></div>' +
        progressHeadHTML(b, p) +
        '<div class="player-shell" id="playerShell"></div>' +
        '<div class="player-under"><span class="cta-note" id="playerState"></span>' +
        '<span style="flex:1"></span>' +
        '<button class="btn" id="markBtn" type="button"></button></div>' +
        '<div class="pnav">' +
        (ch.n > 0
          ? '<a class="btn" href="watch.html?book=' + b.slug + '&ch=' + (ch.n - 1) + '">← Previous chapter</a>'
          : '<span class="btn" style="opacity:.45">← Previous chapter</span>') +
        (ch.n < chs.length - 1
          ? '<a class="btn nextb" href="watch.html?book=' + b.slug + '&ch=' + (ch.n + 1) + '">Next chapter →</a>'
          : '<a class="btn nextb" href="' + esc(CFG.simulatorUrl || "https://sim.bytebarhq.com") + '" target="_blank" rel="noopener">Final Exam — open the Simulator →</a>') +
        '</div>' +
        '<div class="player-chapters"><h3>In this book</h3><div class="chapters">' +
        chs.map(function (c) {
          var pp = bookProgress(b);
          var h = rowHTML(b, c, pp);
          if (c.n === ch.n && streamOf(b, c.n)) {
            h = h.replace('class="row', 'class="row current');
          }
          return h;
        }).join("") + '</div></div>' +
        capstoneHTML(b) +
        '<div class="course-foot">bytebarhq.com · ' + esc(b.name) +
        (b.code !== b.name ? " (" + esc(b.code) + ")" : "") + " — your place is saved as you watch.</div></div>";
      root.innerHTML = html;
      wirePlayer(b, ch);
    }

    async function wirePlayer(b, ch) {
      var shell = document.getElementById("playerShell");
      var stateEl = document.getElementById("playerState");
      var markBtn = document.getElementById("markBtn");
      var e = entry(b, ch.n) || { pos: 0, done: false };
      var resolved = await resolveStream(b, ch.n);
      if (resolved && resolved.src) {
        shell.innerHTML = '<video id="vid" controls playsinline preload="metadata"' +
          (resolved.poster ? ' poster="' + esc(resolved.poster) + '"' : "") +
          ' src="' + esc(resolved.src) + '"></video>';
        var vid = document.getElementById("vid");
        var lastSave = 0;
        vid.addEventListener("loadedmetadata", function () {
          if (e.pos > 5 && vid.duration && e.pos < vid.duration - 10) {
            try { vid.currentTime = e.pos; } catch (err) {}
          }
          updateState();
        });
        vid.addEventListener("timeupdate", function () {
          var now = Date.now();
          if (now - lastSave > 5000) {
            lastSave = now;
            setEntry(b, ch.n, { pos: vid.currentTime, done: !!entry(b, ch.n) && !!entry(b, ch.n).done });
            updateState();
          }
        });
        vid.addEventListener("ended", function () {
          setEntry(b, ch.n, { pos: 0, done: true });
          render();
        });
        markBtn.textContent = e.done ? "Watched ✓ — tap to undo" : "Mark as watched";
        markBtn.addEventListener("click", function () {
          var cur = entry(b, ch.n);
          setEntry(b, ch.n, { done: !(cur && cur.done) });
          render();
        });
        function updateState() {
          var cur = entry(b, ch.n) || { pos: 0, done: false };
          stateEl.textContent = cur.done
            ? "Watched ✓"
            : (cur.pos > 5 ? "Resume saved at " + fmtDur(cur.pos) + " — pick up right where you stopped" : "Your place saves as you watch");
          markBtn.textContent = cur.done ? "Watched ✓ — tap to undo" : "Mark as watched";
        }
        updateState();
      } else {
        shell.innerHTML = '<div class="player-poster"><div class="pp-in">' +
          '<div class="pp-tag">Library Edition</div>' +
          '<h2>This chapter is being built.</h2>' +
          '<p>The ' + esc(b.name) + ' book is being rebuilt chapter by chapter in the new Library Edition standard. ' +
          'Finished chapters land here the moment they pass the full quality gates — and your place in the book is saved either way.</p>' +
          '</div></div>';
        stateEl.textContent = "In production — not yet released";
        markBtn.classList.add("hidden");
      }
    }
    render();
    pageRefreshers.push(render);
  }

  /* ---------------- boot ---------------- */
  function boot() {
    wireAuthDialog();
    renderAuthArea();
    if (document.getElementById("itGrid")) initHome();
    if (document.getElementById("courseRoot")) initCourse();
    if (document.getElementById("playerRoot")) initPlayer();
    initAuth();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  return {
    book: book, bookProgress: bookProgress, entry: entry, setEntry: setEntry,
    resolveStream: resolveStream,
    debug: function () { return { remoteState: remoteState, signedIn: !!user }; }
  };
})();
