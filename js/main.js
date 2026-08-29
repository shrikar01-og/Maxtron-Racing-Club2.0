/* =========================================================================
   MAXTRON RACING CLUB — MAIN SITE SCRIPT
   ========================================================================= */

(function () {

  const C = window.SITE_CONTENT;

  if (!C) {
    console.error("MAXTRON ERROR: SITE_CONTENT not loaded.");
    return;
  }

  /* =========================================================================
     HELPERS
     ========================================================================= */

  const $ = (selector, context = document) =>
    context.querySelector(selector);

  const $$ = (selector, context = document) =>
    Array.from(context.querySelectorAll(selector));


  /* =========================================================================
     DOM READY
     ========================================================================= */

  document.addEventListener("DOMContentLoaded", function () {

    console.log("MAXTRON MAIN.JS LOADED");

    initHeader();

    renderTimeline();

    renderDomains();

    /*
      IMPORTANT:
      TEAM IS NOT RENDERED BY JAVASCRIPT ANYMORE.

      Team cards are directly written inside index.html.
      This prevents any content.js / sorting / rendering issue.
    */

    initStatsCounter();

    init3DTilt();

  });


  /* =========================================================================
     HEADER
     ========================================================================= */

  function initHeader() {

    const header = $("#siteHeader");
    const navToggle = $("#navToggle");
    const mainNav = $("#mainNav");

    if (!header) {
      return;
    }


    /* Header scroll effect */

    window.addEventListener("scroll", function () {

      if (window.scrollY > 50) {

        header.classList.add("scrolled");

      } else {

        header.classList.remove("scrolled");

      }

      trackActiveNavSection();

    });


    /* Mobile navigation */

    if (navToggle && mainNav) {

      navToggle.addEventListener("click", function () {

        const isExpanded =
          navToggle.getAttribute("aria-expanded") === "true";

        navToggle.setAttribute(
          "aria-expanded",
          String(!isExpanded)
        );

        mainNav.classList.toggle("open");

      });

    }


    /* Close mobile menu after link click */

    $$("#navLinks a").forEach(function (link) {

      link.addEventListener("click", function () {

        if (navToggle) {

          navToggle.setAttribute(
            "aria-expanded",
            "false"
          );

        }

        if (mainNav) {

          mainNav.classList.remove("open");

        }

      });

    });

  }


  /* =========================================================================
     ACTIVE NAVIGATION SECTION
     ========================================================================= */

  function trackActiveNavSection() {

    const scrollPos =
      window.scrollY + 100;

    const sections =
      $$("section[id]");

    const navLinks =
      $$("#navLinks a");

    let currentSectionId = "";


    sections.forEach(function (section) {

      const top =
        section.offsetTop;

      const height =
        section.offsetHeight;

      if (
        scrollPos >= top &&
        scrollPos < top + height
      ) {

        currentSectionId =
          section.getAttribute("id");

      }

    });


    if (!currentSectionId) {
      return;
    }


    navLinks.forEach(function (link) {

      link.classList.remove("active");

      if (
        link.getAttribute("href") ===
        "#" + currentSectionId
      ) {

        link.classList.add("active");

      }

    });

  }


  /* =========================================================================
     TIMELINE
     ========================================================================= */

  function renderTimeline() {

    const flow =
      $("#timelineFlow");

    if (!flow) {
      return;
    }

    if (!Array.isArray(C.timeline)) {

      console.error(
        "MAXTRON ERROR: Timeline data missing"
      );

      return;

    }

    flow.innerHTML = "";


    C.timeline.forEach(function (node) {

      const div =
        document.createElement("div");

      div.className =
        "timeline-node";

      div.innerHTML = `

        <div class="timeline-year">
          ${node.year}
        </div>

        <h4 class="timeline-node-title">
          ${node.title}
        </h4>

        <p class="timeline-node-desc">
          ${node.desc}
        </p>

      `;

      flow.appendChild(div);

    });

  }


  /* =========================================================================
     DOMAINS
     ========================================================================= */

  function renderDomains() {

    const grid =
      $("#domainsGrid");

    if (!grid) {
      return;
    }

    if (!Array.isArray(C.domains)) {

      console.error(
        "MAXTRON ERROR: Domain data missing"
      );

      return;

    }

    grid.innerHTML = "";


    C.domains.forEach(function (domain) {

      const card =
        document.createElement("div");

      card.className =
        "domain-card glass-panel tilt-element";

      card.innerHTML = `

        <div class="domain-card-inner">

          <div class="domain-icon">
            ${domain.icon}
          </div>

          <h3>
            ${domain.title}
          </h3>

          <p>
            ${domain.desc}
          </p>

        </div>

      `;

      grid.appendChild(card);

    });

  }


  /* =========================================================================
     STATS COUNTER
     ========================================================================= */

  function initStatsCounter() {

    const stats =
      $$(".stat-num");

    if (stats.length === 0) {
      return;
    }


    const observer =
      new IntersectionObserver(

        function (entries) {

          entries.forEach(
            function (entry) {

              if (
                entry.isIntersecting
              ) {

                const target =
                  entry.target;

                const targetNumStr =
                  target.getAttribute(
                    "data-target"
                  );

                if (!targetNumStr) {
                  return;
                }

                const isPlus =
                  targetNumStr.includes("+");

                const finalVal =
                  parseInt(
                    targetNumStr,
                    10
                  );

                animateCounter(
                  target,
                  finalVal,
                  isPlus
                );

                observer.unobserve(
                  target
                );

              }

            }
          );

        },

        {
          threshold: 0.5
        }

      );


    stats.forEach(function (stat) {

      observer.observe(stat);

    });

  }


  /* =========================================================================
     COUNTER ANIMATION
     ========================================================================= */

  function animateCounter(
    element,
    finalValue,
    isPlus
  ) {

    const duration =
      1500;

    const startTime =
      performance.now();


    function update(now) {

      const elapsed =
        now - startTime;

      const progress =
        Math.min(
          elapsed / duration,
          1
        );

      const ease =
        progress *
        (2 - progress);

      const current =
        Math.floor(
          ease * finalValue
        );

      element.textContent =
        current +
        (
          isPlus &&
          current === finalValue
            ? "+"
            : ""
        );


      if (progress < 1) {

        requestAnimationFrame(
          update
        );

      } else {

        element.textContent =
          finalValue +
          (
            isPlus
              ? "+"
              : ""
          );

      }

    }

    requestAnimationFrame(
      update
    );

  }


  /* =========================================================================
     3D TILT EFFECT
     ========================================================================= */

  function init3DTilt() {

    document.addEventListener(
      "mousemove",
      function (event) {

        const target =
          event.target.closest(
            ".tilt-element"
          );


        if (!target) {

          $$(".tilt-element").forEach(
            function (element) {

              element.style.transform =
                "rotateX(0deg) rotateY(0deg) translateZ(0px)";

              element.style.boxShadow =
                "";

            }
          );

          return;

        }


        const rect =
          target.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left -
          rect.width / 2;

        const y =
          event.clientY -
          rect.top -
          rect.height / 2;

        const maxTilt =
          12;

        const tiltX =
          -(
            y /
            (rect.height / 2)
          ) *
          maxTilt;

        const tiltY =
          (
            x /
            (rect.width / 2)
          ) *
          maxTilt;


        target.style.transform =

          "perspective(1000px) " +

          "rotateX(" +
          tiltX.toFixed(2) +
          "deg) " +

          "rotateY(" +
          tiltY.toFixed(2) +
          "deg) " +

          "translateZ(5px)";


        const glowColor =
          target.classList.contains(
            "domain-card"
          )

            ? "rgba(0, 210, 255, 0.15)"

            : "rgba(15, 90, 204, 0.15)";


        target.style.boxShadow =

          (-tiltY * 0.8) +
          "px " +

          (tiltX * 0.8) +
          "px 25px " +

          glowColor;

      }
    );


    /* Reset tilt */

    document.addEventListener(
      "mouseout",
      function (event) {

        const target =
          event.target.closest(
            ".tilt-element"
          );

        if (target) {

          target.style.transform =
            "rotateX(0deg) rotateY(0deg) translateZ(0px)";

          target.style.boxShadow =
            "";

        }

      }
    );

  }


})();
