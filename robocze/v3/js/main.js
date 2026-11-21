(function () {
  "use strict";

  // ===== Animacje wejścia (pomijane przy prefers-reduced-motion) =====
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (!reduceMotion && "IntersectionObserver" in window) {
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
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  // ===== Walidacja telefonu (PL) =====
  // Dopuszcza spacje, opcjonalny prefiks +48, dokładnie 9 cyfr. Litery odrzucane.
  function sprawdzTelefon(wartosc) {
    var oczyszczony = wartosc.replace(/\s+/g, "");
    return /^(\+48)?\d{9}$/.test(oczyszczony);
  }

  var form = document.getElementById("formularz-kontakt");
  var telefonInput = document.getElementById("f-telefon");
  var telefonRow = document.getElementById("f-telefon-row");
  var feedback = document.getElementById("form-feedback");

  if (form) {
    telefonInput.addEventListener("input", function () {
      if (telefonRow.classList.contains("has-error") && sprawdzTelefon(telefonInput.value)) {
        telefonRow.classList.remove("has-error");
      }
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var telefonOk = sprawdzTelefon(telefonInput.value);

      if (!telefonOk) {
        telefonRow.classList.add("has-error");
        telefonInput.focus();
        return;
      }

      telefonRow.classList.remove("has-error");
      feedback.textContent = "To jest wersja robocza, formularz zadziała po wdrożeniu.";
      feedback.classList.add("is-visible");
    });
  }

  // ===== Baner cookies (tylko wygląd, bez śledzenia) =====
  var banner = document.getElementById("cookie-banner");
  if (banner) {
    var zgodaKluczem = "veralia_v3_cookie_wyglad";

    function ukryjBaner() {
      banner.setAttribute("hidden", "hidden");
    }

    if (localStorage.getItem(zgodaKluczem)) {
      ukryjBaner();
    }

    ["cookie-accept", "cookie-reject", "cookie-settings"].forEach(function (id) {
      var btn = document.getElementById(id);
      if (btn) {
        btn.addEventListener("click", function () {
          try {
            localStorage.setItem(zgodaKluczem, "1");
          } catch (e) {
            /* wersja robocza: brak localStorage nie blokuje działania */
          }
          ukryjBaner();
        });
      }
    });
  }
})();
