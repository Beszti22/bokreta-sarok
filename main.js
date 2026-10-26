// main.js — Bokréta Sarok Virágüzlet
// Handles: language toggle (persisted via localStorage), the "years on the
// corner" stat, lightbox image swapping, and the contact form submission.
// Opening/closing the mobile nav and the lightbox dialog is handled
// declaratively in HTML via command/commandfor — no JS needed for that part.

(function () {
  "use strict";

  const LANG_STORAGE_KEY = "bokretasarok:lang";
  const FOUNDED_YEAR = 2010;

  /* ---------------- Language toggle ---------------- */

  function applyLanguage(lang) {
    const dict = window.translations && window.translations[lang];
    if (!dict) return;

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      // Format: "attr:key" e.g. "content:meta_description"
      const [attr, key] = el.getAttribute("data-i18n-attr").split(":");
      if (attr && dict[key] !== undefined) {
        el.setAttribute(attr, dict[key]);
      }
    });

    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang-btn") === lang));
    });

    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      /* localStorage unavailable (private mode, etc.) — fail silently */
    }
  }

  function initLanguage() {
    let lang = "hu";
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === "hu" || stored === "en") lang = stored;
    } catch (e) {
      /* ignore */
    }

    applyLanguage(lang);

    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.addEventListener("click", () => applyLanguage(btn.getAttribute("data-lang-btn")));
    });
  }

  /* ---------------- Years-on-the-corner stat ---------------- */

  function initYearsStat() {
    const el = document.querySelector("[data-stat-years]");
    if (!el) return;
    const years = new Date().getFullYear() - FOUNDED_YEAR;
    el.textContent = String(years);
  }

  /* ---------------- Footer year ---------------- */

  function initFooterYear() {
    const el = document.getElementById("year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------------- Gallery lightbox ---------------- */
  // The <dialog> itself opens/closes declaratively (command="show-modal" /
  // "close"). We only need JS to swap the image src to the clicked thumb's
  // full-size version before the dialog opens.

  function initLightbox() {
    const lightboxImg = document.getElementById("lightbox-img");
    if (!lightboxImg) return;

    document.querySelectorAll(".gallery-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const full = btn.getAttribute("data-full");
        const thumbImg = btn.querySelector("img");
        lightboxImg.src = full || (thumbImg ? thumbImg.src : "");
        lightboxImg.alt = thumbImg ? thumbImg.alt : "";
      });
    });
  }

  /* ---------------- Contact form ---------------- */

  function initContactForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    if (!form || !status) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const lang = document.documentElement.lang === "en" ? "en" : "hu";
      const dict = window.translations[lang];

      const formData = new FormData(form);
      const payload = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      };

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      status.removeAttribute("data-state");
      status.textContent = "";

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Request failed");

        status.textContent = dict.contact_form_success;
        status.setAttribute("data-state", "success");
        form.reset();
      } catch (err) {
        status.textContent = dict.contact_form_error;
        status.setAttribute("data-state", "error");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    initYearsStat();
    initFooterYear();
    initLightbox();
    initContactForm();
  });
})();
