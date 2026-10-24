/* MŌnah Studio — editorial case study interactions (vanilla JS, no dependencies) */
(function () {
  "use strict";

  var root = document.documentElement;
  var LANG_KEY = "monah-lang";
  var TITLES = {
    en: "MŌnah Studio — Designing a Startup with a Strong Legal Foundation",
    vi: "MŌnah Studio — Kiến tạo Startup trên Nền tảng Pháp lý Vững chắc"
  };

  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } }
  };

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function pageTop(el) { return el.getBoundingClientRect().top + window.scrollY; }
  function lang() { return root.getAttribute("data-lang") || "en"; }
  function both(en, vi) { return '<span data-l="en">' + en + '</span><span data-l="vi" lang="vi">' + vi + "</span>"; }

  /* ------------------------------------------------------------------
     Original report: fill slots from js/report-content.js, or show a
     labelled placeholder. Nothing is invented here.
     ------------------------------------------------------------------ */
  var SECTION_LABELS = {
    introduction:   ["01 · Introduction and chosen scenario", "01 · Giới thiệu và tình huống lựa chọn"],
    structure:      ["02 · Business structure: Pty Ltd versus sole trader", "02 · Cơ cấu doanh nghiệp: Pty Ltd và sole trader"],
    registration:   ["03 · Business registration and manufacturing contracts", "03 · Đăng ký kinh doanh và hợp đồng sản xuất"],
    risks:          ["04 · Legal risks involving misleading product information", "04 · Rủi ro pháp lý liên quan đến thông tin sản phẩm gây hiểu lầm"],
    riskManagement: ["05 · Risk management recommendations", "05 · Khuyến nghị quản trị rủi ro"],
    conclusion:     ["06 · Conclusion", "06 · Kết luận"]
  };

  function renderReport() {
    var data = window.MONAH_REPORT || { sections: {}, references: [] };
    var filled = 0;

    $$("[data-report-slot]").forEach(function (slot) {
      var key = slot.getAttribute("data-report-slot");
      var s = (data.sections || {})[key] || {};
      var label = SECTION_LABELS[key] || [key, key];
      if (s.en && s.en.trim()) {
        filled++;
        slot.classList.add("is-filled");
        var vi = s.vi && s.vi.trim()
          ? s.vi
          : '<p class="cite"><em>Bản dịch tiếng Việt của phần này đang được chuẩn bị. Nội dung gốc tiếng Anh được hiển thị bên dưới.</em></p>' + s.en;
        slot.innerHTML = '<div class="prose" data-l="en">' + s.en + '</div><div class="prose" data-l="vi" lang="vi">' + vi + "</div>";
      } else {
        slot.innerHTML =
          '<span class="source-slot__status">' + both("Awaiting original report text", "Đang chờ nội dung báo cáo gốc") + "</span>" +
          "<h3>" + both(label[0], label[1]) + "</h3>" +
          "<p>" + both(
            "This space is reserved for the full original text of this section, with its in-text citations, reproduced without summarising or rewriting.",
            "Không gian này dành cho toàn văn nội dung gốc của phần này, kèm các trích dẫn trong bài, được giữ nguyên mà không tóm tắt hay viết lại."
          ) + "</p>" +
          "<p>" + both(
            "To complete it, paste the report text into <code>js/report-content.js</code> under <code>" + key + "</code>.",
            "Để hoàn thiện, hãy dán nội dung báo cáo vào <code>js/report-content.js</code> tại mục <code>" + key + "</code>."
          ) + "</p>";
      }
    });

    var list = $("[data-report-refs]");
    if (list) {
      var refs = data.references || [];
      var html = "";
      if (refs.length) {
        refs.forEach(function (r, i) {
          var en = typeof r === "string" ? r : r.en;
          var vi = typeof r === "string" ? r : (r.vi || r.en);
          html += '<li id="ref-' + (i + 1) + '"><span>' + both(en, vi) + "</span></li>";
        });
      } else {
        for (var i = 1; i <= 9; i++) {
          html += '<li><span class="pending">' + both(
            "Original reference " + i + " — awaiting the source document.",
            "Tài liệu tham khảo gốc " + i + " — đang chờ tài liệu nguồn."
          ) + "</span></li>";
        }
      }
      list.innerHTML = html;
    }

    var notice = $("#source-notice");
    if (notice && filled === Object.keys(SECTION_LABELS).length && (data.references || []).length) {
      notice.hidden = true;
    }
  }

  /* ------------------------------------------------------------------
     Language switching (instant, keeps reading position)
     ------------------------------------------------------------------ */
  var tracked = [];

  function readingAnchor() {
    var y = window.scrollY + (parseInt(getComputedStyle(root).getPropertyValue("--nav-h"), 10) || 76);
    // Finest block that contains both languages: reveal blocks, then sections.
    var current = null;
    $$("[data-track][id], .reveal").forEach(function (el) {
      if (el.offsetParent !== null && pageTop(el) <= y) current = el;
    });
    if (!current) return null;
    var h = current.offsetHeight || 1;
    return { el: current, ratio: Math.min(1, Math.max(0, (y - pageTop(current)) / h)), y: y - window.scrollY };
  }

  function applyLangAttributes(l) {
    $$("[data-aria-en]").forEach(function (el) { el.setAttribute("aria-label", el.getAttribute("data-aria-" + l)); });
    $$("img[data-alt-en]").forEach(function (el) { el.setAttribute("alt", el.getAttribute("data-alt-" + l)); });
    $$("td[data-col-en]").forEach(function (el) { el.setAttribute("data-col", el.getAttribute("data-col-" + l)); });
    $$("[data-set-lang]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-set-lang") === l)); });
    document.title = TITLES[l];
    var menu = $(".menu-btn");
    if (menu) {
      var open = document.body.classList.contains("menu-open");
      menu.setAttribute("aria-label", open ? (l === "vi" ? "Đóng menu" : "Close menu") : menu.getAttribute("data-aria-" + l));
    }
  }

  function setLang(l, opts) {
    opts = opts || {};
    if (l !== "en" && l !== "vi") l = "en";
    var anchor = opts.preserve ? readingAnchor() : null;

    root.setAttribute("data-lang", l);
    root.setAttribute("lang", l);
    applyLangAttributes(l);
    store.set(LANG_KEY, l);

    if (anchor) {
      var prev = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, pageTop(anchor.el) + anchor.ratio * anchor.el.offsetHeight - anchor.y);
      root.style.scrollBehavior = prev;
    }
    if (opts.toast) toast(l === "vi" ? "Tiếng Việt" : "English");
    onScroll();
  }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("is-on"); }, 1400);
  }

  /* ------------------------------------------------------------------
     Navigation, progress and active section
     ------------------------------------------------------------------ */
  var nav, bar, rail, navLinks, railLinks;
  var NAV_GROUP = { privacy: "additional", "online-terms": "additional", "abn-gst": "additional" };

  /* Scroll-expansion hero: map scroll through the section to --p / --e */
  var hero, reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function heroProgress() {
    if (!hero) return 1;
    if (reducedMotion) return 1;
    var span = hero.offsetHeight - window.innerHeight;
    return span > 0 ? Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / span)) : 1;
  }

  function updateHero() {
    if (!hero) return;
    var p = heroProgress();
    var e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    hero.style.setProperty("--p", p.toFixed(4));
    hero.style.setProperty("--e", e.toFixed(4));
    hero.classList.toggle("is-ready", p > .9);
  }

  function initHero() {
    hero = $(".xhero");
    if (!hero) return;
    // Tabbing into the hero links before the photo has expanded: jump to the expanded state.
    $(".xhero__content", hero).addEventListener("focusin", function () {
      if (heroProgress() < .95) {
        var prev = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollTo(0, window.scrollY + hero.getBoundingClientRect().top + hero.offsetHeight - window.innerHeight);
        root.style.scrollBehavior = prev;
        updateHero();
      }
    });
    updateHero();
  }

  function onScroll() {
    updateHero();
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    if (nav) nav.classList.toggle("is-solid", y > 24);

    var probe = y + window.innerHeight * 0.35;
    var current = null;
    tracked.forEach(function (el) { if (pageTop(el) <= probe) current = el; });
    var id = current ? current.id : "home";
    if (y + window.innerHeight >= document.documentElement.scrollHeight - 4) id = "references";

    var navId = NAV_GROUP[id] || id;
    navLinks.forEach(function (a) {
      var on = a.getAttribute("href") === "#" + navId;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
    });

    var reached = true;
    railLinks.forEach(function (a) {
      var target = a.getAttribute("href").slice(1);
      var on = target === id;
      a.classList.toggle("is-active", on);
      if (on) reached = false;
      a.classList.toggle("is-done", reached && !on && id !== "home" && id !== "additional" ? true : false);
    });
    if (rail) rail.classList.toggle("is-visible", id !== "home");
  }

  function initNav() {
    nav = $("#nav");
    bar = $(".progress span");
    rail = $("#rail");
    navLinks = $$(".nav__links a");
    railLinks = $$("#rail a");
    tracked = $$("[data-track][id]");

    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { onScroll(); ticking = false; });
    }, { passive: true });
    window.addEventListener("resize", onScroll);

    var menuBtn = $(".menu-btn");
    function closeMenu() {
      document.body.classList.remove("menu-open");
      menuBtn.setAttribute("aria-expanded", "false");
      applyLangAttributes(lang());
    }
    menuBtn.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", String(open));
      applyLangAttributes(lang());
    });
    navLinks.forEach(function (a) { a.addEventListener("click", closeMenu); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) { closeMenu(); menuBtn.focus(); }
    });

    $$("[data-set-lang]").forEach(function (b) {
      b.addEventListener("click", function () {
        var l = b.getAttribute("data-set-lang");
        if (l !== lang()) setLang(l, { preserve: true, toast: true });
      });
    });
  }

  /* ------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------ */
  function initReveal() {
    var items = $$(".reveal, .frame");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ------------------------------------------------------------------
     Images: optional photography with illustrated fallback
     ------------------------------------------------------------------ */
  function initImages() {
    $$("img[data-fallback]").forEach(function (img) {
      function useFallback() {
        var fb = img.getAttribute("data-fallback");
        if (fb && img.getAttribute("src") !== fb) img.src = fb;
      }
      if (img.complete && img.naturalWidth === 0) useFallback();
      else img.addEventListener("error", useFallback, { once: true });
    });

    var map = window.MONAH_IMAGES || {};
    $$("[data-img]").forEach(function (fig) {
      var src = map[fig.getAttribute("data-img")];
      var img = $("img", fig);
      if (!src || !img) return;
      var probe = new Image();
      probe.onload = function () { img.src = src; };
      probe.src = src;
    });
  }

  /* ------------------------------------------------------------------
     Risk-analysis cards
     ------------------------------------------------------------------ */
  function initRisks() {
    var cards = $$(".risk");
    cards.forEach(function (card) {
      var btn = $(".risk__toggle", card);
      btn.addEventListener("click", function () {
        var open = card.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
      });
    });
    var chips = $$("[data-filter]");
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.getAttribute("data-filter");
        chips.forEach(function (c) { c.setAttribute("aria-pressed", String(c === chip)); });
        cards.forEach(function (card) { card.hidden = f !== "all" && card.getAttribute("data-cat") !== f; });
      });
    });
  }

  /* ------------------------------------------------------------------
     Checklists (supplier contract, pre-checkout)
     ------------------------------------------------------------------ */
  var STATUS = {
    supplier: [
      [0, "Start with the parties and specifications.", "Hãy bắt đầu với các bên và thông số kỹ thuật."],
      [0.01, "Underway — keep working through the terms.", "Đang tiến hành — tiếp tục rà soát các điều khoản."],
      [0.5, "Past halfway — the core terms are in place.", "Đã quá nửa — các điều khoản cốt lõi đã có."],
      [0.75, "Almost there — a few terms still to confirm.", "Sắp hoàn tất — còn vài điều khoản cần xác nhận."],
      [1, "Every term on this list is covered.", "Mọi điều khoản trong danh mục đã được đề cập."]
    ],
    checkout: [
      [0, "Begin with what the customer sees first.", "Hãy bắt đầu từ những gì khách hàng thấy đầu tiên."],
      [0.01, "Underway — the essentials are taking shape.", "Đang tiến hành — các thông tin cốt lõi đang dần đầy đủ."],
      [0.5, "Past halfway — keep going.", "Đã quá nửa — hãy tiếp tục."],
      [0.75, "Nearly transparent — check the remaining items.", "Gần như minh bạch — hãy kiểm tra các mục còn lại."],
      [1, "Every item is visible before payment.", "Mọi mục đều hiển thị trước khi thanh toán."]
    ]
  };
  var CIRC = 2 * Math.PI * 52;

  function initChecklists() {
    $$("[data-checklist]").forEach(function (box) {
      var name = box.getAttribute("data-checklist");
      var key = "monah-checklist-" + name;
      var inputs = $$('input[type="checkbox"]', box);
      var ring = $(".meter .value", box);
      var count = $("[data-count]", box);
      var total = $("[data-total]", box);
      var status = $("[data-status]", box);
      var saved = [];
      try { saved = JSON.parse(store.get(key) || "[]"); } catch (e) { saved = []; }

      inputs.forEach(function (i) { i.checked = saved.indexOf(i.value) !== -1; });
      ring.style.strokeDasharray = CIRC.toFixed(2);
      total.textContent = inputs.length;

      function update() {
        var done = inputs.filter(function (i) { return i.checked; });
        var ratio = inputs.length ? done.length / inputs.length : 0;
        count.textContent = done.length;
        ring.style.strokeDashoffset = (CIRC * (1 - ratio)).toFixed(2);
        var msg = STATUS[name][0];
        STATUS[name].forEach(function (s) { if (ratio >= s[0]) msg = s; });
        status.innerHTML = both(msg[1], msg[2]);
        store.set(key, JSON.stringify(done.map(function (i) { return i.value; })));
      }
      inputs.forEach(function (i) { i.addEventListener("change", update); });
      $("[data-reset]", box).addEventListener("click", function () {
        inputs.forEach(function (i) { i.checked = false; });
        update();
      });
      update();
    });
  }

  /* ------------------------------------------------------------------
     Footer policy outlines (illustrative dialog)
     ------------------------------------------------------------------ */
  function initPolicies() {
    var dialog = $("#policy-dialog");
    var body = $("#policy-body");
    var lastTrigger = null;

    function close() {
      if (typeof dialog.close === "function") dialog.close(); else dialog.removeAttribute("open");
      if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    }

    $$("[data-policy]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var src = $('[data-policy-src="' + a.getAttribute("data-policy") + '"]');
        if (!src) return;
        lastTrigger = a;
        body.innerHTML = src.innerHTML;
        var title = $(".policy-title [data-l='" + lang() + "']", body);
        dialog.setAttribute("aria-label", title ? title.textContent : "");
        if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
      });
    });

    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) { close(); return; }
      var closer = e.target.closest("[data-close]");
      if (!closer) return;
      if (closer.tagName === "A") {
        e.preventDefault();
        var target = $(closer.getAttribute("href"));
        lastTrigger = null;
        close();
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        close();
      }
    });
  }

  /* ------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", function () {
    renderReport();
    initHero();
    initNav();
    initReveal();
    initImages();
    initRisks();
    initChecklists();
    initPolicies();

    var params = new URLSearchParams(window.location.search);
    setLang(params.get("lang") || store.get(LANG_KEY) || "en", { preserve: false });
  });
})();
