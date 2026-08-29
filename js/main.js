/* =========================================================================
   MAXTRON RACING CLUB — MAIN SITE SCRIPT (index.html)
   ========================================================================= */

(function () {
  const C = window.SITE_CONTENT;

  if (!C) {
    console.error("MAXTRON: SITE_CONTENT not found. Check js/content.js");
    return;
  }

  /* =========================================================================
     HELPERS
     ========================================================================= */

  const $ = (sel, ctx = document) => ctx.querySelector(sel);

  const $$ = (sel, ctx = document) =>
    Array.from(ctx.querySelectorAll(sel));


  /* =========================================================================
     DOM READY
     ========================================================================= */

  document.addEventListener("DOMContentLoaded", () => {
    initHeader();

    renderTimeline();

    renderDomains();

    renderTeam();

    initStatsCounter();

    init3DTilt();
  });


  /* =========================================================================
     HEADER / NAVIGATION
     ========================================================================= */

  function initHeader() {
    const header = $("#siteHeader");
    const navToggle = $("#navToggle");
    const mainNav = $("#mainNav");

    if (!header) return;


    /* -------------------------------------------------------------------------
       Header Scroll Effect
       ------------------------------------------------------------------------- */

    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }

      trackActiveNavSection();
    });


    /* -------------------------------------------------------------------------
       Mobile Navigation
       ------------------------------------------------------------------------- */

    if (navToggle && mainNav) {
      navToggle.addEventListener("click", () => {
        const isExpanded =
          navToggle.getAttribute("aria-expanded") === "true";

        navToggle.setAttribute(
          "aria-expanded",
          String(!isExpanded)
        );

        mainNav.classList.toggle("open");
      });
    }


    /* -------------------------------------------------------------------------
       Close Mobile Menu After Clicking Link
       ------------------------------------------------------------------------- */

    $$("#navLinks a").forEach((a) => {
      a.addEventListener("click", () => {
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
     ACTIVE NAV SECTION
     ========================================================================= */

  function trackActiveNavSection() {
    const scrollPos =
      window.scrollY + 100;

    const sections =
      $$("section[id]");

    const navLinks =
      $$("#navLinks a");

    let currentSectionId = "";


    sections.forEach((sec) => {
      const top =
        sec.offsetTop;

      const height =
        sec.offsetHeight;


      if (
        scrollPos >= top &&
        scrollPos < top + height
      ) {
        currentSectionId =
          sec.getAttribute("id");
      }
    });


    if (!currentSectionId) {
      return;
    }


    navLinks.forEach((a) => {
      a.classList.remove("active");

      if (
        a.getAttribute("href") ===
        `#${currentSectionId}`
      ) {
        a.classList.add("active");
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


    if (
      !Array.isArray(C.timeline)
    ) {
      console.error(
        "MAXTRON: timeline data missing."
      );

      return;
    }


    flow.innerHTML = "";


    C.timeline.forEach((node) => {
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


    if (
      !Array.isArray(C.domains)
    ) {
      console.error(
        "MAXTRON: domains data missing."
      );

      return;
    }


    grid.innerHTML = "";


    C.domains.forEach((d) => {
      const card =
        document.createElement("div");

      card.className =
        "domain-card glass-panel tilt-element";


      card.innerHTML = `
        <div class="domain-card-inner">

          <div class="domain-icon">
            ${d.icon}
          </div>

          <h3>
            ${d.title}
          </h3>

          <p>
            ${d.desc}
          </p>

        </div>
      `;


      grid.appendChild(card);
    });
  }


  /* =========================================================================
     TEAM
     ========================================================================= */

  function renderTeam() {
    const grid =
      $("#teamGrid");


    if (!grid) {
      console.error(
        "MAXTRON: #teamGrid not found."
      );

      return;
    }


    if (
      !Array.isArray(C.team)
    ) {
      console.error(
        "MAXTRON: team data missing."
      );

      return;
    }


    grid.innerHTML = "";


    /*
      ==============================================================
      FORCED TEAM ORDER

      1. Faculty In-charge
      2. Captain
      3. Vice Captain
      4. Chassis & Frame Lead
      5. Media and Marketing
      6. Powertrain & Suspension/Braking Lead
      7. Electronics Lead
      8. Sponsorship

      Sponsorship will ALWAYS stay last.
      ==============================================================
    */


    const roleOrder = {
      "Faculty In-charge": 1,

      "Captain": 2,

      "Vice Captain": 3,

      "Chassis & Frame Lead": 4,

      "Media and Marketing": 5,

      "Powertrain & Suspension/Braking Lead": 6,

      "Electronics Lead": 7,

      "Sponsorship": 8
    };


    /*
      Clone the array before sorting so
      original SITE_CONTENT is not modified.
    */

    const orderedTeam =
      [...C.team].sort((a, b) => {

        const orderA =
          roleOrder[a.role] ?? 999;

        const orderB =
          roleOrder[b.role] ?? 999;


        return orderA - orderB;
      });


    /*
      Debug output.

      Open:
      F12 → Console

      You should see:
      Faculty
      Captain
      Vice Captain
      Chassis
      Media
      Technical
      Electronics
      Sponsorship
    */

    console.log(
      "MAXTRON TEAM ORDER:"
    );


    orderedTeam.forEach(
      (member, index) => {

        console.log(
          `${index + 1}. ${member.name} — ${member.role}`
        );

      }
    );


    /*
      Create Team Cards
    */

    orderedTeam.forEach(
      (member) => {

        const card =
          document.createElement("div");


        card.className =
          "team-card glass-panel tilt-element";


        card.innerHTML = `

          <div class="team-image-area">

            <div class="team-avatar-placeholder">
              ${member.initials}
            </div>

          </div>


          <div class="team-info">

            <h3 class="team-name">
              ${member.name}
            </h3>

            <span class="team-role">
              ${member.role}
            </span>

          </div>

        `;


        grid.appendChild(card);
      }
    );
  }


  /* =========================================================================
     STATS COUNTER
     ========================================================================= */

  function initStatsCounter() {
    const stats =
      $$(".stat-num");


    if (
      stats.length === 0
    ) {
      return;
    }


    const observer =
      new IntersectionObserver(

        (entries) => {

          entries.forEach(
            (entry) => {

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


    stats.forEach(
      (s) =>
        observer.observe(s)
    );
  }


  /* =========================================================================
     COUNTER ANIMATION
     ========================================================================= */

  function animateCounter(
    el,
    finalVal,
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
          ease * finalVal
        );


      el.textContent =
        current +
        (
          isPlus &&
          current === finalVal
            ? "+"
            : ""
        );


      if (
        progress < 1
      ) {

        requestAnimationFrame(
          update
        );

      } else {

        el.textContent =
          finalVal +
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
      (e) => {

        const target =
          e.target.closest(
            ".tilt-element"
          );


        /*
          Reset cards when cursor
          isn't over a tilt element.
        */

        if (!target) {

          $$(".tilt-element").forEach(
            (el) => {

              el.style.transform =
                "rotateX(0deg) rotateY(0deg) translateZ(0px)";


              el.style.boxShadow =
                "";

            }
          );


          return;
        }


        const rect =
          target.getBoundingClientRect();


        const x =
          e.clientX -
          rect.left -
          rect.width / 2;


        const y =
          e.clientY -
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
          `perspective(1000px)
           rotateX(${tiltX.toFixed(2)}deg)
           rotateY(${tiltY.toFixed(2)}deg)
           translateZ(5px)`;


        const glowColor =
          target.classList.contains(
            "domain-card"
          )
            ? "rgba(0, 210, 255, 0.15)"
            : "rgba(15, 90, 204, 0.15)";


        target.style.boxShadow =
          `${-tiltY * 0.8}px
           ${tiltX * 0.8}px
           25px
           ${glowColor}`;

      }
    );


    /* -------------------------------------------------------------------------
       Reset Tilt
       ------------------------------------------------------------------------- */

    document.addEventListener(
      "mouseout",
      (e) => {

        const target =
          e.target.closest(
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
