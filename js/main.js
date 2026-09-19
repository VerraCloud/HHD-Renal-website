(function () {
  "use strict";

  function initMobileNav() {
    var toggle = document.getElementById("nav-toggle");
    var menu = document.getElementById("mobile-nav");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
      var open = menu.classList.contains("flex");
      menu.classList.toggle("flex", !open);
      menu.classList.toggle("hidden", open);
      toggle.setAttribute("aria-expanded", String(!open));
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.add("hidden");
        menu.classList.remove("flex");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  function initContactForm() {
    var form = document.getElementById("contact-form");
    var success = document.getElementById("contact-success");
    if (!form || !success) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.classList.add("hidden");
      success.classList.remove("hidden");
      success.setAttribute("tabindex", "-1");
      success.focus();
    });

    var again = document.getElementById("contact-again");
    if (again) {
      again.addEventListener("click", function () {
        success.classList.add("hidden");
        form.classList.remove("hidden");
        form.reset();
      });
    }
  }

  function initBlogFilters() {
    var root = document.getElementById("blog-root");
    if (!root) return;

    var buttons = Array.prototype.slice.call(root.querySelectorAll("[data-category]"));
    var cards = Array.prototype.slice.call(root.querySelectorAll("[data-post-category]"));
    var loadMoreBtn = document.getElementById("blog-load-more");
    var countLabel = document.getElementById("blog-count");
    var pageSize = 3;
    var shown = pageSize;
    var active = "All";

    function apply() {
      var filtered = cards.filter(function (card) {
        return active === "All" || card.getAttribute("data-post-category") === active;
      });

      filtered.forEach(function (card, i) {
        card.classList.toggle("hidden", i >= shown);
      });
      cards
        .filter(function (card) { return active !== "All" && card.getAttribute("data-post-category") !== active; })
        .forEach(function (card) { card.classList.add("hidden"); });

      var visibleCount = Math.min(shown, filtered.length);
      if (countLabel) {
        countLabel.textContent = "Showing " + visibleCount + " of " + filtered.length + " articles";
      }
      if (loadMoreBtn) {
        loadMoreBtn.classList.toggle("hidden", shown >= filtered.length);
      }

      buttons.forEach(function (btn) {
        var isActive = btn.getAttribute("data-category") === active;
        btn.setAttribute("aria-pressed", String(isActive));
        btn.classList.toggle("bg-brand-teal", isActive);
        btn.classList.toggle("text-white", isActive);
        btn.classList.toggle("border-brand-teal", isActive);
        btn.classList.toggle("bg-white", !isActive);
        btn.classList.toggle("text-[#48626D]", !isActive);
        btn.classList.toggle("border-[#C7D2D7]", !isActive);
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        active = btn.getAttribute("data-category");
        shown = pageSize;
        apply();
      });
    });

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", function () {
        shown += pageSize;
        apply();
      });
    }

    apply();
  }

  function initScrollReveal() {
    if (!("IntersectionObserver" in window)) return;
    var targets = Array.prototype.slice.call(
      document.querySelectorAll(".card, .logo-badge, .logo-slot-filled")
    );
    if (!targets.length) return;

    var io = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initMobileNav();
    initContactForm();
    initBlogFilters();
    initScrollReveal();
  });
})();
