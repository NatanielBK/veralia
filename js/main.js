// =========================================================
// Veralia — menu mobilne, animacje wejścia, pasek sticky
// =========================================================
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nagłówek: tło po przewinięciu ---------- */
  var header = document.getElementById("siteHeader");
  if (header) {
    var toggleHeaderBg = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    };
    toggleHeaderBg();
    window.addEventListener("scroll", toggleHeaderBg, { passive: true });
  }

  /* ---------- Mega-menu „Przedmioty" (desktop) ---------- */
  var megaTrigger = document.getElementById("megaTrigger");
  var megaMenu = document.getElementById("megaMenu");
  if (megaTrigger && megaMenu) {
    megaTrigger.addEventListener("click", function () {
      var isOpen = megaMenu.classList.toggle("is-open");
      megaTrigger.setAttribute("aria-expanded", String(isOpen));
    });
    document.addEventListener("click", function (e) {
      if (!megaTrigger.contains(e.target) && !megaMenu.contains(e.target)) {
        megaMenu.classList.remove("is-open");
        megaTrigger.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        megaMenu.classList.remove("is-open");
        megaTrigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Lista przedmiotów w menu mobilnym (rozwijana) ---------- */
  var subjectsToggle = document.getElementById("subjectsToggle");
  var subjectsList = document.getElementById("subjectsList");
  if (subjectsToggle && subjectsList) {
    subjectsToggle.addEventListener("click", function () {
      var isOpen = subjectsList.classList.toggle("is-open");
      subjectsToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  /* ---------- Menu mobilne (pełnoekranowe) ---------- */
  var hamburgerBtn = document.getElementById("hamburgerBtn");
  var closeBtn = document.getElementById("mobileMenuClose");
  var menu = document.getElementById("mobileMenu");
  var menuLinks = menu ? menu.querySelectorAll("a") : [];
  var lastFocused = null;

  function getFocusable() {
    return menu.querySelectorAll('a[href], button:not([disabled])');
  }

  var savedScrollY = 0;

  function openMenu() {
    lastFocused = document.activeElement;
    savedScrollY = window.scrollY;
    menu.classList.add("is-open");
    document.body.classList.add("menu-open");
    document.body.style.position = "fixed";
    document.body.style.top = (-savedScrollY) + "px";
    document.body.style.width = "100%";
    hamburgerBtn.setAttribute("aria-expanded", "true");
    hamburgerBtn.setAttribute("aria-label", "Zamknij menu");
    closeBtn.focus();
    document.addEventListener("keydown", onKeydown);
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo({ top: savedScrollY, behavior: "auto" });
    hamburgerBtn.setAttribute("aria-expanded", "false");
    hamburgerBtn.setAttribute("aria-label", "Otwórz menu");
    document.removeEventListener("keydown", onKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onKeydown(e) {
    if (e.key === "Escape") {
      closeMenu();
      return;
    }
    // focus trap
    if (e.key === "Tab") {
      var focusable = getFocusable();
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  if (hamburgerBtn && menu && closeBtn) {
    hamburgerBtn.addEventListener("click", function () {
      if (menu.classList.contains("is-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    closeBtn.addEventListener("click", closeMenu);
    menuLinks.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var href = link.getAttribute("href") || "";
        // Kotwice na tej samej stronie: najpierw zamknij menu i zdejmij blokadę
        // scrolla, dopiero potem przewiń — inaczej cel ląduje poza widokiem.
        if (href.charAt(0) === "#" && href.length > 1) {
          e.preventDefault();
          var target = document.getElementById(href.slice(1));
          closeMenu();
          window.setTimeout(function () {
            if (target) target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
          }, 50);
        } else {
          closeMenu();
        }
      });
    });
  }

  /* ---------- Animacje wejścia (IntersectionObserver) ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Dolny pasek mobilny "Zapisz się" ---------- */
  var stickyBar = document.getElementById("mobileStickyBar");
  var hero = document.querySelector(".hero, .subject-hero-actions, .page-hero-v4");
  var formSection = document.getElementById("formularz");
  var footerSection = document.getElementById("kontakt");

  if (stickyBar && "IntersectionObserver" in window) {
    var heroVisible = !!hero; // dopóki CTA hero nie zostało przewinięte w górę, pasek jest schowany (brak hero = pasek od razu)
    var formVisible = false;
    var footerVisible = false;

    function updateBar() {
      if (!heroVisible && !formVisible && !footerVisible) {
        stickyBar.classList.remove("is-hidden");
      } else {
        stickyBar.classList.add("is-hidden");
      }
    }

    if (hero) {
      new IntersectionObserver(function (entries) {
        var e = entries[0];
        // pasek dopiero PO minięciu CTA (CTA nad ekranem), nie gdy CTA jest jeszcze pod krawędzią niskiego telefonu
        heroVisible = e.isIntersecting || e.boundingClientRect.top > 0;
        updateBar();
      }, { threshold: 0.1 }).observe(hero);
    }
    if (formSection) {
      new IntersectionObserver(function (entries) {
        formVisible = entries[0].isIntersecting;
        updateBar();
      }, { threshold: 0.1 }).observe(formSection);
    }
    if (footerSection) {
      new IntersectionObserver(function (entries) {
        footerVisible = entries[0].isIntersecting;
        updateBar();
      }, { threshold: 0.01 }).observe(footerSection);
    }
  }

  /* ---------- Formularz "Zapisz się" — preselekcja przedmiotu z URL ---------- */
  var subjectSelect = document.getElementById("f-subject");
  if (subjectSelect) {
    var params = new URLSearchParams(window.location.search);
    var presel = params.get("przedmiot");
    if (presel && subjectSelect.querySelector('option[value="' + presel + '"]')) {
      subjectSelect.value = presel;
    }
  }

  /* ---------- Formularz "Zapisz się" — walidacja i pokazowa wysyłka ---------- */
  var form = document.getElementById("signupForm");
  if (form) {
    var successBox = document.getElementById("formSuccess");
    var submitBtn = document.getElementById("formSubmitBtn");

    var validators = {
      name: function (field) {
        return field.value.trim().length >= 3 ? "" : "Podaj imię i nazwisko – tak się do Ciebie zwrócimy.";
      },
      email: function (field) {
        if (!field.value.trim()) return "Ten adres e-mail wygląda niepoprawnie – sprawdź, czy nie ma literówki.";
        return field.checkValidity() ? "" : "Ten adres e-mail wygląda niepoprawnie – sprawdź, czy nie ma literówki.";
      },
      phone: function (field) {
        var digits = field.value.replace(/[^0-9]/g, "");
        return digits.length >= 9 ? "" : "Sprawdź numer telefonu – brakuje cyfr albo jest ich za dużo.";
      },
      subject: function (field) {
        return field.value ? "" : "Wybierz przedmiot, żebyśmy mogli dobrać korepetytora.";
      },
      info: function () { return ""; }
    };

    function errorBoxFor(field) {
      var id = field.getAttribute("aria-describedby");
      return id ? document.getElementById(id) : null;
    }

    function showFieldError(field, message) {
      var wrap = field.closest(".form-field");
      var box = errorBoxFor(field);
      if (box) box.textContent = message;
      if (wrap) wrap.classList.toggle("has-error", !!message);
      field.setAttribute("aria-invalid", message ? "true" : "false");
    }

    function validateField(field) {
      var fn = validators[field.name];
      if (!fn) return "";
      var message = fn(field);
      showFieldError(field, message);
      return message;
    }

    ["name", "email", "phone", "subject"].forEach(function (name) {
      var field = form.elements[name];
      if (field) {
        field.addEventListener("blur", function () { validateField(field); });
      }
    });

    function validateLevel() {
      var checked = form.querySelector('input[name="level"]:checked');
      var message = checked ? "" : "Wybierz poziom nauczania.";
      var box = document.getElementById("f-level-err");
      var fieldset = form.querySelector('fieldset.form-field');
      if (box) box.textContent = message;
      if (fieldset) fieldset.classList.toggle("has-error", !!message);
      return message;
    }
    form.querySelectorAll('input[name="level"]').forEach(function (radio) {
      radio.addEventListener("change", validateLevel);
    });

    function validateRodo() {
      var rodo = form.elements["rodo"];
      if (!rodo) return "";
      var message = rodo.checked ? "" : "Zaznacz zgodę, żebyśmy mogli odpowiedzieć na zgłoszenie.";
      var box = document.getElementById("f-rodo-err");
      if (box) box.textContent = message;
      return message;
    }
    var rodoField = form.elements["rodo"];
    if (rodoField) rodoField.addEventListener("change", validateRodo);

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var messages = [];
      ["name", "email", "phone", "subject"].forEach(function (name) {
        var field = form.elements[name];
        var msg = validateField(field);
        if (msg) messages.push(field);
      });
      if (validateLevel()) messages.push(form.querySelector('input[name="level"]'));
      if (validateRodo()) messages.push(form.elements["rodo"]);

      if (messages.length) {
        messages[0].focus();
        return;
      }

      // Pokazówka: brak backendu — patrz komentarz w index.html nad <form> o podpięciu Formspree.
      if (submitBtn) {
        submitBtn.classList.add("is-loading");
        submitBtn.disabled = true;
      }
      window.setTimeout(function () {
        form.hidden = true;
        if (submitBtn) {
          submitBtn.classList.remove("is-loading");
          submitBtn.disabled = false;
        }
        if (successBox) {
          successBox.hidden = false;
          successBox.focus();
        }
      }, 900);
    });
  }

  /* ---------- O nas: rozwijane bio ---------- */
  var bioToggle = document.querySelector(".bio-toggle");
  if (bioToggle) {
    bioToggle.addEventListener("click", function () {
      var bio = document.getElementById(bioToggle.getAttribute("aria-controls"));
      var isOpen = bio.classList.toggle("is-open");
      bioToggle.setAttribute("aria-expanded", String(isOpen));
      bioToggle.textContent = isOpen ? "Zwiń" : "Czytaj więcej";
    });
  }

  /* ---------- Karuzele (Dla kogo, Opinie): kropki zawsze pokazują kartę, którą widać ---------- */
  function initCarousel(track, dotsWrap, cardSel, align, prevBtn, nextBtn) {
    if (!track || !dotsWrap) return;
    var dotEls = dotsWrap.querySelectorAll("span");
    var cardEls = track.querySelectorAll(cardSel);
    if (!cardEls.length) return;
    var current = -1;
    function maxScroll() { return track.scrollWidth - track.clientWidth; }
    function padLeft() { return parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0; }
    // o ile trzeba przewinąć, żeby karta stanęła na swoim miejscu
    function delta(card) {
      var t = track.getBoundingClientRect(), c = card.getBoundingClientRect();
      if (align === "center") return (c.left + c.width / 2) - (t.left + t.width / 2);
      return c.left - t.left - padLeft();
    }
    function setActive(idx) {
      if (idx === current) return;
      current = idx;
      dotEls.forEach(function (dot, i) { dot.classList.toggle("is-active", i === idx); });
    }
    function update() {
      var max = maxScroll();
      // wszystko się mieści: kropki niepotrzebne
      dotsWrap.style.visibility = max > 2 ? "" : "hidden";
      if (max <= 2 || track.scrollLeft <= 2) { setActive(0); return; }
      if (track.scrollLeft >= max - 2) { setActive(cardEls.length - 1); return; }
      var best = 0, bestDist = Infinity;
      cardEls.forEach(function (card, i) {
        var d = Math.abs(delta(card));
        if (d < bestDist) { bestDist = d; best = i; }
      });
      setActive(best);
    }
    function goTo(i) {
      i = Math.min(Math.max(i, 0), cardEls.length - 1);
      var left = Math.min(Math.max(track.scrollLeft + delta(cardEls[i]), 0), maxScroll());
      track.scrollTo({ left: left, behavior: prefersReduced ? "auto" : "smooth" });
    }
    var tick = false;
    function onScroll() {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () { tick = false; update(); });
    }
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("load", update);
    dotEls.forEach(function (dot, i) {
      dot.addEventListener("click", function () { goTo(i); });
    });
    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(Math.max(current, 0) - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(Math.max(current, 0) + 1); });
    update();
  }

  initCarousel(
    document.querySelector(".levels-track"),
    document.querySelector(".levels-dots"),
    ".level-card", "start"
  );
  initCarousel(
    document.getElementById("reviewsTrack"),
    document.getElementById("reviewsDots"),
    ".review-card", "center",
    document.getElementById("reviewPrev"),
    document.getElementById("reviewNext")
  );

  /* ---------- FAQ: filtr kategorii ---------- */
  var faqFilters = document.querySelector(".faq-filters");
  if (faqFilters) {
    var filterButtons = faqFilters.querySelectorAll("button");
    var faqGroups = document.querySelectorAll(".faq-group");
    faqFilters.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      var filter = btn.getAttribute("data-filter");
      filterButtons.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      faqGroups.forEach(function (group) {
        var show = filter === "all" || group.getAttribute("data-cat") === filter;
        group.hidden = !show;
      });
    });
  }

  /* ---------- Zakładki "Z czym pomagamy" (podstrony przedmiotów) ---------- */
  document.querySelectorAll("[data-tabs]").forEach(function (wrap) {
    var tabs = wrap.querySelectorAll(".tab-btn");
    var panels = wrap.querySelectorAll(".tab-panel");
    panels.forEach(function (p, i) { if (i !== 0) p.hidden = true; });

    function activate(i, focus) {
      tabs.forEach(function (t, j) {
        t.setAttribute("aria-selected", String(j === i));
        t.setAttribute("tabindex", j === i ? "0" : "-1");
      });
      panels.forEach(function (p, j) { p.hidden = j !== i; });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (tab, i) {
      tab.setAttribute("tabindex", i === 0 ? "0" : "-1");
      tab.addEventListener("click", function () { activate(i, false); });
      tab.addEventListener("keydown", function (e) {
        var count = tabs.length;
        if (e.key === "ArrowRight") {
          e.preventDefault();
          activate((i + 1) % count, true);
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          activate((i - 1 + count) % count, true);
        } else if (e.key === "Home") {
          e.preventDefault();
          activate(0, true);
        } else if (e.key === "End") {
          e.preventDefault();
          activate(count - 1, true);
        }
      });
    });
  });
})();
