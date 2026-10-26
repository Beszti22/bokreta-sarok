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

    updateOpenStatusBadge();
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

  /* ---------------- Dynamic open/closed status ---------------- */
  // Mon–Fri 9:00–19:00, Sat 8:00–16:00, Sun closed (Date#getDay(): 0 = Sunday).
  const OPENING_HOURS = {
    0: null,
    1: { open: 9, close: 19 },
    2: { open: 9, close: 19 },
    3: { open: 9, close: 19 },
    4: { open: 9, close: 19 },
    5: { open: 9, close: 19 },
    6: { open: 8, close: 16 },
  };

  function isShopOpenNow(now) {
    const todayHours = OPENING_HOURS[now.getDay()];
    if (!todayHours) return false;
    const minutesNow = now.getHours() * 60 + now.getMinutes();
    return minutesNow >= todayHours.open * 60 && minutesNow < todayHours.close * 60;
  }

  function updateOpenStatusBadge() {
    const badges = document.querySelectorAll(".js-open-status");
    if (!badges.length) return;

    const lang = document.documentElement.lang === "en" ? "en" : "hu";
    const dict = window.translations && window.translations[lang];
    if (!dict) return;

    const open = isShopOpenNow(new Date());
    badges.forEach((badge) => {
      badge.textContent = open ? dict.status_open : dict.status_closed;
      badge.classList.toggle("status-badge--open", open);
      badge.classList.toggle("status-badge--closed", !open);
    });
  }

  function initOpenStatus() {
    updateOpenStatusBadge();
    // Keep it accurate across a long-open tab without needing a reload.
    setInterval(updateOpenStatusBadge, 60 * 1000);
  }

  /* ---------------- Scroll reveal (fallback for non-supporting browsers) ---------------- */

  function initScrollReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    // Browsers with native scroll-driven animation support (see styles.css
    // `@supports` block) handle this purely in CSS — nothing to do here.
    if (window.CSS && CSS.supports("(animation-timeline: view()) and (animation-range: entry)")) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ---------------- Years-on-the-corner stat ---------------- */

  function initYearsStat() {
    const el = document.querySelector("[data-stat-years]");
    if (!el) return;
    const years = new Date().getFullYear() - FOUNDED_YEAR;
    el.setAttribute("data-count-to", String(years));
  }

  /* ---------------- Stat counters (count up on scroll into view) ---------------- */

  function animateCount(el) {
    const target = Number(el.getAttribute("data-count-to"));
    if (!Number.isFinite(target)) return;
    const suffix = el.getAttribute("data-count-suffix") || "";
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic — fast start, gentle settle.
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = `${value}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    }

    requestAnimationFrame(tick);
  }

  function initStatCounters() {
    const items = document.querySelectorAll("[data-count-to]");
    if (!items.length) return;

    const reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => {
        const target = el.getAttribute("data-count-to");
        const suffix = el.getAttribute("data-count-suffix") || "";
        el.textContent = `${target}${suffix}`;
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    items.forEach((el) => observer.observe(el));
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

  /* ---------------- Flower order form ---------------- */

  function initOrderForm() {
    const form = document.getElementById("order-form");
    const status = document.getElementById("order-form-status");
    if (!form || !status) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const lang = document.documentElement.lang === "en" ? "en" : "hu";
      const dict = window.translations[lang];

      const formData = new FormData(form);
      const name = formData.get("name");
      const email = formData.get("email");
      const phone = formData.get("phone");
      const date = formData.get("date");
      const notes = formData.get("notes");

      const occasionSelect = document.getElementById("order-occasion");
      const occasionText =
        occasionSelect.selectedIndex >= 0
          ? occasionSelect.options[occasionSelect.selectedIndex].textContent
          : "";

      const flowerLabels = Array.from(
        form.querySelectorAll('input[name="flowers"]:checked')
      ).map((input) => input.closest(".checkbox-chip").querySelector("span").textContent);

      const messageLines = [
        `${dict.order_occasion_label} ${occasionText}`,
        `${dict.order_flowers_label} ${flowerLabels.length ? flowerLabels.join(", ") : "-"}`,
      ];
      if (phone) messageLines.push(`${dict.order_phone_label} ${phone}`);
      if (date) messageLines.push(`${dict.order_date_label} ${date}`);
      if (notes) messageLines.push(`${dict.order_notes_label} ${notes}`);

      const payload = {
        name,
        email,
        message: messageLines.join("\n"),
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

        status.textContent = dict.order_success;
        status.setAttribute("data-state", "success");
        form.reset();
      } catch (err) {
        status.textContent = dict.order_error;
        status.setAttribute("data-state", "error");
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLanguage();
    initYearsStat();
    initStatCounters();
    initFooterYear();
    initLightbox();
    initContactForm();
    initOrderForm();
    initOpenStatus();
    initScrollReveal();
  });
})();
