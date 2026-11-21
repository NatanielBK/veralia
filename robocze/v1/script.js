(function () {
  "use strict";

  /* ============ Chipsy przedmiot/poziom (wersja robocza: tylko wizualny wybór) ============ */
  document.querySelectorAll(".chip-row").forEach(function (row) {
    row.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      row.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-active"); });
      btn.classList.add("is-active");
    });
  });

  /* ============ Walidacja telefonu ============ */
  var phoneInput = document.getElementById("f-phone");
  var phoneErr = document.getElementById("f-phone-err");

  function normalizePhone(value) {
    return value.replace(/\s+/g, "");
  }

  function isValidPhone(raw) {
    var value = normalizePhone(raw);
    // opcjonalny +48 na początku, potem dokładnie 9 cyfr
    return /^(\+48)?\d{9}$/.test(value);
  }

  function validatePhoneField() {
    if (!phoneInput) return true;
    var raw = phoneInput.value.trim();
    if (raw === "") {
      phoneErr.textContent = "Podaj numer telefonu.";
      phoneInput.classList.add("is-invalid");
      return false;
    }
    if (!isValidPhone(raw)) {
      phoneErr.textContent = "Podaj poprawny polski numer telefonu (9 cyfr, opcjonalnie +48).";
      phoneInput.classList.add("is-invalid");
      return false;
    }
    phoneErr.textContent = "";
    phoneInput.classList.remove("is-invalid");
    return true;
  }

  if (phoneInput) {
    phoneInput.addEventListener("blur", validatePhoneField);
    phoneInput.addEventListener("input", function () {
      if (phoneInput.classList.contains("is-invalid")) validatePhoneField();
    });
  }

  /* ============ Formularz (wersja robocza: bez wysyłki) ============ */
  var form = document.getElementById("signupForm");
  var formNote = document.getElementById("formNote");
  var formSendErr = document.getElementById("formSendErr");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var phoneOk = validatePhoneField();
      var formOk = form.checkValidity() && phoneOk;

      if (!formOk) {
        form.reportValidity();
        formSendErr.hidden = false;
        formSendErr.textContent = "Sprawdź, czy wszystkie pola są wypełnione poprawnie.";
        return;
      }

      formSendErr.hidden = true;
      formNote.hidden = false;
      formNote.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  /* ============ Baner cookies (tylko wygląd, bez skryptów śledzących) ============ */
  var banner = document.getElementById("cookieBanner");
  var panel = document.getElementById("cookiePanel");
  var btnAccept = document.getElementById("cookieAccept");
  var btnReject = document.getElementById("cookieReject");
  var btnSettings = document.getElementById("cookieSettings");
  var btnSave = document.getElementById("cookieSave");

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  if (btnAccept) btnAccept.addEventListener("click", hideBanner);
  if (btnReject) btnReject.addEventListener("click", hideBanner);
  if (btnSettings) {
    btnSettings.addEventListener("click", function () {
      if (panel) panel.hidden = false;
    });
  }
  if (btnSave) {
    btnSave.addEventListener("click", function () {
      if (panel) panel.hidden = true;
      hideBanner();
    });
  }
})();
