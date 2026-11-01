// main.js — Bokréta Sarok Virágüzlet
// Handles:
// - Bilingual HU/EN switch persisted via localStorage
// - Smart live opening-hours badge (shows closing time or next opening time)
// - Mobile nav scroll-lock (`body.nav-open`) & auto-close on anchor click
// - Active section highlight in desktop navigation
// - Interactive bouquet quick-selector -> pre-fills custom order form
// - Accessible gallery lightbox with prev/next, keyboard & touch swipe
// - Contact & custom bouquet order form submission with inline validation

(function () {
  "use strict";

  const LANG_STORAGE_KEY = "bokretasarok:lang";
  const FOUNDED_YEAR = 2010;

  function getCurrentLang() {
    return document.documentElement.lang === "en" ? "en" : "hu";
  }

  function getDict(lang) {
    const target = lang || getCurrentLang();
    return (window.translations && window.translations[target]) || null;
  }

  /* ---------------- Language toggle ---------------- */

  function applyLanguage(lang) {
    const dict = getDict(lang);
    if (!dict) return;

    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const pairs = el.getAttribute("data-i18n-attr").split(";");
      pairs.forEach((pair) => {
        const [attr, key] = pair.trim().split(":");
        if (attr && key && dict[key] !== undefined) {
          el.setAttribute(attr, dict[key]);
        }
      });
    });

    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang-btn") === lang));
    });

    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch (e) {
      /* localStorage unavailable — fail silently */
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

  function formatHour(hour) {
    return `${hour}:00`;
  }

  function getShopStatusInfo(now) {
    const day = now.getDay();
    const todayHours = OPENING_HOURS[day];
    const minutesNow = now.getHours() * 60 + now.getMinutes();

    if (todayHours) {
      const openMin = todayHours.open * 60;
      const closeMin = todayHours.close * 60;

      if (minutesNow >= openMin && minutesNow < closeMin) {
        return {
          open: true,
          templateKey: "status_open_until",
          time: formatHour(todayHours.close),
        };
      }

      if (minutesNow < openMin) {
        return {
          open: false,
          templateKey: "status_opens_today",
          time: formatHour(todayHours.open),
        };
      }
    }

    // Closed for the rest of today — check tomorrow vs Monday
    const tomorrowDay = (day + 1) % 7;
    const tomorrowHours = OPENING_HOURS[tomorrowDay];
    if (tomorrowHours) {
      return {
        open: false,
        templateKey: "status_opens_tomorrow",
        time: formatHour(tomorrowHours.open),
      };
    }

    return {
      open: false,
      templateKey: "status_opens_monday",
      time: formatHour(OPENING_HOURS[1].open),
    };
  }

  function updateOpenStatusBadge() {
    const badges = document.querySelectorAll(".js-open-status");
    if (!badges.length) return;

    const dict = getDict();
    if (!dict) return;

    const status = getShopStatusInfo(new Date());
    const template = dict[status.templateKey] || (status.open ? dict.status_open : dict.status_closed);
    const label = template.replace("{time}", status.time);

    badges.forEach((badge) => {
      badge.textContent = label;
      badge.classList.toggle("status-badge--open", status.open);
      badge.classList.toggle("status-badge--closed", !status.open);
    });
  }

  function initOpenStatus() {
    updateOpenStatusBadge();
    setInterval(updateOpenStatusBadge, 60 * 1000);
  }

  /* ---------------- Mobile nav scroll-lock & auto-close ---------------- */

  function initMobileNav() {
    const mobileNav = document.getElementById("mobile-nav");
    const toggleBtn = document.getElementById("mobile-nav-toggle");
    if (!mobileNav) return;

    mobileNav.addEventListener("toggle", (event) => {
      const isOpen = event.newState === "open";
      document.body.classList.toggle("nav-open", isOpen);
    });

    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        // Fallback sync in case the browser processes popover toggle asynchronously
        requestAnimationFrame(() => {
          const isOpen = mobileNav.matches(":popover-open");
          document.body.classList.toggle("nav-open", isOpen);
        });
      });
    }

    mobileNav.querySelectorAll("a[href^='#']").forEach((link) => {
      link.addEventListener("click", () => {
        if (typeof mobileNav.hidePopover === "function") {
          try {
            mobileNav.hidePopover();
          } catch (e) {
            /* ignore if already closed */
          }
        }
        document.body.classList.remove("nav-open");
      });
    });
  }

  /* ---------------- Active navigation section highlight ---------------- */

  function initActiveNavHighlight() {
    const navLinks = document.querySelectorAll(".nav-desktop a[href^='#']");
    if (!navLinks.length || !("IntersectionObserver" in window)) return;

    const sectionMap = new Map();
    navLinks.forEach((link) => {
      const id = link.getAttribute("href").slice(1);
      const sec = document.getElementById(id);
      if (sec) sectionMap.set(sec, link);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((l) => l.removeAttribute("aria-current"));
            const activeLink = sectionMap.get(entry.target);
            if (activeLink) activeLink.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );

    sectionMap.forEach((_, sec) => observer.observe(sec));
  }

  /* ---------------- Scroll reveal ---------------- */

  function initScrollReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    const reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
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
      { threshold: 0.12 }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ---------------- Years-on-the-corner & stat counters ---------------- */

  function initYearsStat() {
    const el = document.querySelector("[data-stat-years]");
    if (!el) return;
    const years = Math.max(16, new Date().getFullYear() - FOUNDED_YEAR);
    el.setAttribute("data-count-to", String(years));
    el.textContent = String(years);
  }

  function animateCount(el) {
    const target = Number(el.getAttribute("data-count-to"));
    if (!Number.isFinite(target)) return;
    const suffix = el.getAttribute("data-count-suffix") || "";
    const duration = 1100;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
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
      { threshold: 0.5 }
    );

    items.forEach((el) => observer.observe(el));
  }

  /* ---------------- Footer year & date input min ---------------- */

  function initDates() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    const dateInput = document.getElementById("order-date");
    if (dateInput) {
      const todayIso = new Date().toISOString().split("T")[0];
      dateInput.setAttribute("min", todayIso);
    }
  }

  /* ---------------- Interactive Bouquet Quick-Selector ---------------- */

  function initBouquetQuickSelect() {
    const buttons = document.querySelectorAll(".js-select-bouquet");
    const orderForm = document.getElementById("order-form");
    const occasionSelect = document.getElementById("order-occasion");
    const prefillBanner = document.getElementById("order-prefill-banner");

    if (!buttons.length || !orderForm) return;

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const occasion = btn.getAttribute("data-occasion");
        const flowers = (btn.getAttribute("data-flowers") || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const budget = btn.getAttribute("data-budget");

        if (occasionSelect && occasion) {
          occasionSelect.value = occasion;
        }

        orderForm.querySelectorAll('input[name="flowers"]').forEach((checkbox) => {
          checkbox.checked = flowers.includes(checkbox.value);
        });

        if (budget) {
          const budgetRadio = orderForm.querySelector(`input[name="budget"][value="${budget}"]`);
          if (budgetRadio) budgetRadio.checked = true;
        }

        if (prefillBanner) {
          prefillBanner.hidden = false;
        }

        orderForm.scrollIntoView({ behavior: "smooth", block: "center" });
        orderForm.classList.add("is-highlighted");
        setTimeout(() => orderForm.classList.remove("is-highlighted"), 1800);
      });
    });
  }

  /* ---------------- Gallery Lightbox (Prev/Next + Keyboard + Swipe) ---------------- */

  function initLightbox() {
    const dialog = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const captionEl = document.getElementById("lightbox-caption");
    const counterEl = document.getElementById("lightbox-counter");
    const closeBtn = document.getElementById("lightbox-close");
    const prevBtn = document.getElementById("lightbox-prev");
    const nextBtn = document.getElementById("lightbox-next");
    const items = Array.from(document.querySelectorAll(".gallery-item"));

    if (!dialog || !lightboxImg || !items.length) return;

    let currentIndex = 0;
    let touchStartX = 0;

    function showSlide(index) {
      currentIndex = (index + items.length) % items.length;
      const btn = items[currentIndex];
      const full = btn.getAttribute("data-full");
      const thumbImg = btn.querySelector("img");
      const altText = thumbImg ? thumbImg.alt : "";

      lightboxImg.src = full || (thumbImg ? thumbImg.src : "");
      lightboxImg.alt = altText;
      if (captionEl) captionEl.textContent = altText;
      if (counterEl) counterEl.textContent = `${currentIndex + 1} / ${items.length}`;
    }

    items.forEach((btn, idx) => {
      btn.addEventListener("click", () => {
        showSlide(idx);
        if (typeof dialog.showModal === "function" && !dialog.open) {
          dialog.showModal();
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => dialog.close());
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => showSlide(currentIndex - 1));
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => showSlide(currentIndex + 1));
    }

    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) {
        dialog.close();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!dialog.open) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showSlide(currentIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showSlide(currentIndex + 1);
      }
    });

    dialog.addEventListener(
      "touchstart",
      (event) => {
        if (event.changedTouches && event.changedTouches.length) {
          touchStartX = event.changedTouches[0].screenX;
        }
      },
      { passive: true }
    );

    dialog.addEventListener(
      "touchend",
      (event) => {
        if (!event.changedTouches || !event.changedTouches.length) return;
        const deltaX = event.changedTouches[0].screenX - touchStartX;
        if (Math.abs(deltaX) > 45) {
          if (deltaX < 0) showSlide(currentIndex + 1);
          else showSlide(currentIndex - 1);
        }
      },
      { passive: true }
    );
  }

  /* ---------------- Contact form ---------------- */

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
  }

  function initContactForm() {
    const form = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    if (!form || !status) return;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const dict = getDict();

      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();

      const nameInput = form.querySelector('[name="name"]');
      const emailInput = form.querySelector('[name="email"]');
      const messageInput = form.querySelector('[name="message"]');

      if (nameInput) nameInput.setAttribute("aria-invalid", String(!name));
      if (emailInput) emailInput.setAttribute("aria-invalid", String(!isValidEmail(email)));
      if (messageInput) messageInput.setAttribute("aria-invalid", String(!message));

      if (!name || !isValidEmail(email) || !message) {
        status.textContent = dict.order_validation_error;
        status.setAttribute("data-state", "error");
        return;
      }

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      status.removeAttribute("data-state");
      status.textContent = dict.order_submitting || "...";

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
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
      const dict = getDict();

      const formData = new FormData(form);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const date = String(formData.get("date") || "").trim();
      const notes = String(formData.get("notes") || "").trim();

      const nameInput = document.getElementById("order-name");
      const emailInput = document.getElementById("order-email");
      if (nameInput) nameInput.setAttribute("aria-invalid", String(!name));
      if (emailInput) emailInput.setAttribute("aria-invalid", String(!isValidEmail(email)));

      if (!name || !isValidEmail(email)) {
        status.textContent = dict.order_validation_error;
        status.setAttribute("data-state", "error");
        return;
      }

      const occasionSelect = document.getElementById("order-occasion");
      const occasionText =
        occasionSelect && occasionSelect.selectedIndex > 0
          ? occasionSelect.options[occasionSelect.selectedIndex].textContent
          : "-";

      const flowerLabels = Array.from(
        form.querySelectorAll('input[name="flowers"]:checked')
      ).map((input) => input.closest(".checkbox-chip").querySelector("span").textContent);

      const budgetChecked = form.querySelector('input[name="budget"]:checked');
      const budgetText = budgetChecked
        ? budgetChecked.closest(".checkbox-chip").querySelector("span").textContent
        : "-";

      const deliveryChecked = form.querySelector('input[name="delivery"]:checked');
      const deliveryText = deliveryChecked
        ? deliveryChecked.closest(".checkbox-chip").querySelector("span").textContent
        : "-";

      const messageLines = [
        "[EGYEDI CSOKOR RENDELÉS]",
        `${dict.order_occasion_label} ${occasionText}`,
        `${dict.order_flowers_label} ${flowerLabels.length ? flowerLabels.join(", ") : "-"}`,
        `${dict.order_budget_label}: ${budgetText}`,
        `${dict.order_delivery_label}: ${deliveryText}`,
      ];
      if (phone) messageLines.push(`${dict.order_phone_label}: ${phone}`);
      if (date) messageLines.push(`${dict.order_date_label}: ${date}`);
      if (notes) messageLines.push(`${dict.order_notes_label}: ${notes}`);

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      status.removeAttribute("data-state");
      status.textContent = dict.order_submitting || "...";

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            message: messageLines.join("\n"),
          }),
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
    initDates();
    initMobileNav();
    initActiveNavHighlight();
    initBouquetQuickSelect();
    initLightbox();
    initContactForm();
    initOrderForm();
    initOpenStatus();
    initScrollReveal();
  });
})();
