/* OM PARVATE — PORTFOLIO JAVASCRIPT */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // 1. MOBILE NAVIGATION
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    if (!menuBtn || !navLinks) return;

    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open navigation");
    menuBtn.textContent = "☰";
  }

  if (menuBtn && navLinks) {
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open navigation");

    menuBtn.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
      menuBtn.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuBtn.contains(event.target)
      ) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 600) closeMenu();
    });
  }

  // 2. SKILLS FILTERS
  const filterButtons = document.querySelectorAll(".filter-btn");
  const skillCards = document.querySelectorAll(".skill-card");

  filterButtons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.classList.contains("active"))
    );

    button.addEventListener("click", () => {
      const category = button.dataset.filter || "all";

      filterButtons.forEach((item) => {
        const active = item === button;

        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      skillCards.forEach((card) => {
        const visible =
          category === "all" ||
          card.dataset.category === category;

        card.classList.toggle("hidden", !visible);
        card.setAttribute("aria-hidden", String(!visible));
      });
    });
  });

  // 3. INTERACTIVE CARDS
  document.querySelectorAll(".interactive-card").forEach((card) => {
    const hasInteractiveChild = card.querySelector(
      "a, button, input, select, textarea"
    );

    // Only make standalone cards keyboard-toggleable.
    if (!hasInteractiveChild) {
      if (!card.hasAttribute("tabindex")) {
        card.setAttribute("tabindex", "0");
      }

      if (!card.hasAttribute("role")) {
        card.setAttribute("role", "button");
      }

      card.setAttribute(
        "aria-pressed",
        String(card.classList.contains("is-active"))
      );
    }

    function toggleCard() {
      const isActive = card.classList.toggle("is-active");

      if (!hasInteractiveChild) {
        card.setAttribute("aria-pressed", String(isActive));
      }
    }

    card.addEventListener("click", (event) => {
      if (
        event.target.closest(
          "a, button, input, select, textarea, label"
        )
      ) {
        return;
      }

      toggleCard();
    });

    card.addEventListener("keydown", (event) => {
      if (hasInteractiveChild || event.target !== card) return;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleCard();
      }
    });
  });

  // 4. TEMPORARY GOLDEN TAP GLOW
  const glowSelector =
    ".skill-card, .project-card, .profile-card";

  const glowTimers = new WeakMap();

  function showTapGlow(card) {
    const previousTimer = glowTimers.get(card);

    if (previousTimer) {
      window.clearTimeout(previousTimer);
    }

    card.classList.remove("tap-glow");
    void card.offsetWidth;
    card.classList.add("tap-glow");

    const timer = window.setTimeout(() => {
      card.classList.remove("tap-glow");
      glowTimers.delete(card);
    }, 1200);

    glowTimers.set(card, timer);
  }

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const card = target.closest(glowSelector);

    if (card) showTapGlow(card);
  });

  // 5. PROFILE CARD TILT — DESKTOP ONLY
  const profileCard = document.querySelector(".tilt-card");

  const canTilt =
    window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches && !reducedMotion;

  if (profileCard && canTilt) {
    profileCard.addEventListener("pointermove", (event) => {
      const rect = profileCard.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateX = (0.5 - y) * 6;
      const rotateY = (x - 0.5) * 6;

      profileCard.style.transform =
        `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    profileCard.addEventListener("pointerleave", () => {
      profileCard.style.transform = "";
    });
  }

  // 6. HERO TYPING ANIMATION
  const typingElement = document.getElementById("typing");

  if (typingElement) {
    const roles = [
      "Web Developer",
      "Web Designer",
      "BCA Student",
      "Technology Enthusiast"
    ];

    if (reducedMotion) {
      typingElement.textContent = roles[0];
    } else {
      let roleIndex = 0;
      let characterIndex = roles[0].length;
      let deleting = true;

      function typeNext() {
        if (!typingElement.isConnected) return;

        const currentRole = roles[roleIndex];

        if (deleting) {
          characterIndex--;

          typingElement.textContent =
            currentRole.substring(0, characterIndex);

          if (characterIndex <= 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;

            window.setTimeout(typeNext, 350);
            return;
          }

          window.setTimeout(typeNext, 45);
        } else {
          const nextRole = roles[roleIndex];
          characterIndex++;

          typingElement.textContent =
            nextRole.substring(0, characterIndex);

          if (characterIndex >= nextRole.length) {
            deleting = true;

            window.setTimeout(typeNext, 1500);
            return;
          }

          window.setTimeout(typeNext, 75);
        }
      }

      window.setTimeout(typeNext, 1800);
    }
  }

  // 7. SECTION HEADING ANIMATIONS
  // Animate headings without replacing their HTML or styled spans.
  // This avoids breaking heading colors, icons, and nested elements.

  const headingSelectors = [
    "#about .section-heading h2",
    "#skills .section-heading h2",
    "#projects .section-heading h2",
    "#education .section-heading h2",
    "#experience .section-heading h2",
    "#certifications .section-heading h2",
    "#achievements .section-heading h2",
    "#contact .contact-card h2"
  ];

  const headingElements = document.querySelectorAll(
    headingSelectors.join(",")
  );

  if (!reducedMotion && "IntersectionObserver" in window) {
    const headingObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const heading = entry.target;

          heading.classList.add("heading-visible");
          observer.unobserve(heading);
        });
      },
      {
        threshold: 0.25
      }
    );

    headingElements.forEach((heading) => {
      heading.classList.add("heading-animate");
      headingObserver.observe(heading);
    });
  } else {
    headingElements.forEach((heading) => {
      heading.classList.add("heading-visible");
    });
  }

  // 8. CURRENT YEAR IN FOOTER
  const yearElement = document.getElementById("year");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 9. SMOOTH INTERNAL NAVIGATION
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      let target;

      try {
        target = document.querySelector(targetId);
      } catch {
        return;
      }

      if (!target) return;

      if (reducedMotion) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      if (window.location.hash !== targetId) {
        window.history.pushState(null, "", targetId);
      }
    });
  });

});

/* ==========================================
   OM PARVATE — PREMIUM GOLDEN CLICK SOUND
   ========================================== */

(() => {
  let audioContext = null;
  let lastSoundTime = 0;

  function playPremiumClick() {
    try {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) return;

      if (!audioContext) {
        audioContext = new AudioContextClass();
      }

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      const nowMs = Date.now();
      if (nowMs - lastSoundTime < 90) return;
      lastSoundTime = nowMs;

      const now = audioContext.currentTime;

      // Two layered tones for a polished, glassy click
      function addTone(frequency, endFrequency, volume, duration) {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(frequency, now);
        oscillator.frequency.exponentialRampToValueAtTime(
          endFrequency,
          now + duration
        );

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(
          volume,
          now + 0.008
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + duration
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start(now);
        oscillator.stop(now + duration + 0.01);
      }

      // Main clear click
      addTone(1050, 680, 0.16, 0.10);

      // Soft high-pitched premium chime
      addTone(1650, 1250, 0.065, 0.16);

    } catch (error) {
      // Sound errors should never break the website.
    }
  }

  document.addEventListener("click", function (event) {
    const target = event.target.closest(
      "button, .btn, .filter-btn, .interactive-card, " +
      ".project-links a, .social-row a, .navbar a, " +
      ".menu-btn, footer a"
    );

    if (!target) return;

    if (
      target.matches(":disabled") ||
      target.getAttribute("aria-disabled") === "true"
    ) {
      return;
    }

    playPremiumClick();
  });
})();

ValueAtTime(
          endFrequency,
          now + duration
        );

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(
          volume,
          now + 0.008
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          now + duration
        );

        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        oscillator.start(now);
        oscillator.stop(now + duration + 0.01);
      }

      // Main clear click
      addTone(1050, 680, 0.16, 0.10);

      // Soft high-pitched premium chime
      addTone(1650, 1250, 0.065, 0.16);

    } catch (error) {
      // Sound errors should never break the website.
    }
  }

  document.addEventListener("click", function (event) {
    const target = event.target.closest(
      "button, .btn, .filter-btn, .interactive-card, " +
      ".project-links a, .social-row a, .navbar a, " +
      ".menu-btn, footer a"
    );

    if (!target) return;

    if (
      target.matches(":disabled") ||
      target.getAttribute("aria-disabled") === "true"
    ) {
      return;
    }

    playPremiumClick();
  });
})();

// =====================================
// PORTFOLIO LOADER CONTROLLER
// =====================================
(() => {
  const loader = document.getElementById("portfolio-loader");
  const progressBar = document.getElementById("loader-progress");
  const percentText = document.getElementById("loader-percent");
  const message = document.getElementById("loader-message");

  if (!loader || !progressBar || !percentText || !message) return;

  const minimumDisplayTime = 3000;
  const startTime = performance.now();

  let pageLoaded = document.readyState === "complete";
  let finished = false;

  window.addEventListener("load", () => {
    pageLoaded = true;
  }, { once: true });

  function updateLoader() {
    if (finished) return;

    const elapsed = performance.now() - startTime;
    const timeProgress = Math.min(elapsed / minimumDisplayTime, 1);

    // Progress remains below 100% until the page has loaded.
    const progress = pageLoaded
      ? Math.min(100, Math.round(85 + timeProgress * 15))
      : Math.min(85, Math.round(timeProgress * 85));

    progressBar.style.width = progress + "%";
    percentText.textContent = progress + "%";

    if (pageLoaded && elapsed >= minimumDisplayTime) {
      finished = true;
      progressBar.style.width = "100%";
      percentText.textContent = "100%";
      message.textContent = "Welcome to my portfolio";

      setTimeout(() => {
        loader.classList.add("loader-hidden");
        loader.setAttribute("aria-hidden", "true");
      }, 250);
      return;
    }

    requestAnimationFrame(updateLoader);
  }

  requestAnimationFrame(updateLoader);
})();
