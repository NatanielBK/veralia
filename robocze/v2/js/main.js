// Veralia — wersja robocza 2. Czysty JS, bez zależności, bez wysyłki danych.

document.addEventListener("DOMContentLoaded", function () {
  /* ---------- Baner cookies ---------- */
  var banner = document.getElementById("cookie-banner");
  if (banner) {
    var cookieKey = "veralia_v2_cookie_choice";
    if (!localStorage.getItem(cookieKey)) {
      banner.hidden = false;
    }
    banner.querySelectorAll("[data-cookie]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        localStorage.setItem(cookieKey, btn.getAttribute("data-cookie"));
        banner.hidden = true;
      });
    });
  }

  /* ---------- Karuzela opinii (strzałki) ---------- */
  var track = document.getElementById("reviews-track");
  var prevBtn = document.getElementById("reviews-prev");
  var nextBtn = document.getElementById("reviews-next");
  if (track && prevBtn && nextBtn) {
    var scrollByCard = function (dir) {
      var card = track.querySelector(".review-card");
      var gap = 18;
      var distance = card ? card.offsetWidth + gap : 300;
      track.scrollBy({ left: dir * distance, behavior: "smooth" });
    };
    prevBtn.addEventListener("click", function () {
      scrollByCard(-1);
    });
    nextBtn.addEventListener("click", function () {
      scrollByCard(1);
    });
  }

  /* ---------- Walidacja telefonu i formularz ---------- */
  var form = document.getElementById("contact-form");
  if (!form) return;

  var phoneInput = document.getElementById("telefon");
  var phoneField = phoneInput.closest(".field");
  var phoneError = document.getElementById("telefon-error");

  var nameInput = document.getElementById("imie");
  var nameField = nameInput.closest(".field");
  var nameError = document.getElementById("imie-error");

  var zgodaInput = document.getElementById("zgoda");

  function validatePhone() {
    var raw = phoneInput.value.trim();
    var compact = raw.replace(/\s+/g, "");
    var valid = /^(\+48)?\d{9}$/.test(compact);
    if (!valid) {
      phoneField.classList.add("has-error");
      phoneError.textContent = "Podaj poprawny polski numer, 9 cyfr, opcjonalnie z +48.";
    } else {
      phoneField.classList.remove("has-error");
      phoneError.textContent = "";
    }
    return valid;
  }

  function validateName() {
    var valid = nameInput.value.trim().length > 1;
    if (!valid) {
      nameField.classList.add("has-error");
      nameError.textContent = "Podaj imię i nazwisko.";
    } else {
      nameField.classList.remove("has-error");
      nameError.textContent = "";
    }
    return valid;
  }

  phoneInput.addEventListener("blur", validatePhone);
  nameInput.addEventListener("blur", validateName);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var okPhone = validatePhone();
    var okName = validateName();
    var result = document.getElementById("form-result");

    if (!okPhone || !okName || !zgodaInput.checked) {
      if (!zgodaInput.checked) {
        zgodaInput.focus();
      }
      return;
    }

    result.textContent = "To wersja robocza, formularz zadziała po wdrożeniu.";
    result.classList.add("show", "form-result--ok");
  });
});
