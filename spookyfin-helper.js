(() => {
  "use strict";

  const CONTINUE_RE = /continue watching/i;
  const NEXT_UP_RE = /next up/i;
  const RECENT_RE = /recently added|latest/i;
  const THEME_KEY = "codex-jellyfin-theme-color";
  const MARVEL_COLLECTION_ID = "11a2559a067baa4ecce54c609664e070";
  const MARVEL_SECTION_ID = "codex-marvel-home-section";
  const WIZARDING_COLLECTION_ID = "f356014e0bd58bb53436e8a640032e82";
  const WIZARDING_SECTION_ID = "codex-wizarding-home-section";
  const CUSTOM_TAB_BASE_INDEX = 2;
  const THEMES = {
    blue: {
      label: "Blue",
      primary: "#00e5ff",
      primary2: "#a9f7ff",
      primary3: "#5af0ff",
      container: "#006b80",
      soft: "rgba(0, 229, 255, .28)",
      hover: "rgba(0, 229, 255, .14)",
      focus: "rgba(0, 229, 255, .24)",
      pressed: "rgba(0, 229, 255, .3)",
      selected: "rgba(0, 229, 255, .2)",
      outline: "rgba(0, 229, 255, .62)",
      m3Hover: "rgba(169, 247, 255, .075)",
      m3Focus: "rgba(169, 247, 255, .16)"
    },
    purple: {
      label: "Purple",
      primary: "#c78cff",
      primary2: "#efd8ff",
      primary3: "#dab4ff",
      container: "#6f3fa1",
      soft: "rgba(199, 140, 255, .26)",
      hover: "rgba(199, 140, 255, .14)",
      focus: "rgba(199, 140, 255, .24)",
      pressed: "rgba(199, 140, 255, .3)",
      selected: "rgba(199, 140, 255, .2)",
      outline: "rgba(199, 140, 255, .62)",
      m3Hover: "rgba(239, 216, 255, .075)",
      m3Focus: "rgba(239, 216, 255, .16)"
    },
    pink: {
      label: "Pink",
      primary: "#ff6fcf",
      primary2: "#ffd6ef",
      primary3: "#ff9dde",
      container: "#9c3d78",
      soft: "rgba(255, 111, 207, .25)",
      hover: "rgba(255, 111, 207, .14)",
      focus: "rgba(255, 111, 207, .24)",
      pressed: "rgba(255, 111, 207, .3)",
      selected: "rgba(255, 111, 207, .2)",
      outline: "rgba(255, 111, 207, .62)",
      m3Hover: "rgba(255, 214, 239, .075)",
      m3Focus: "rgba(255, 214, 239, .16)"
    }
  };

  const isHomePage = () => {
    const hash = window.location.hash || "";
    return hash.includes("/home") || hash === "" || document.querySelector(".homePage, .homeTabContent, [data-role='page'] .sectionTitle");
  };

  const isMarvelHomeTarget = () => {
    const hash = decodeURIComponent(window.location.hash || "").replace(/^#!/, "#");
    return /^#\/?(home|home\.html)([/?&]|$)/i.test(hash) || Boolean(document.querySelector(".homePage, .homeTabContent"));
  };

  const cleanText = (node) => (node?.textContent || "").replace(/\s+/g, " ").trim();

  let customTabsConfigPromise = null;

  const isCustomTabsHomeRoute = () => {
    const hash = window.location.hash || "";
    return hash === "" || /^#\/home(?:\.html)?(?:[?&/]|$)/i.test(hash);
  };

  const getCustomTabsConfig = () => {
    if (customTabsConfigPromise) return customTabsConfigPromise;
    if (!window.ApiClient?.fetch || !window.ApiClient?.getUrl) return Promise.resolve([]);

    customTabsConfigPromise = window.ApiClient.fetch({
      url: window.ApiClient.getUrl("CustomTabs/Config"),
      type: "GET",
      dataType: "json",
      headers: { accept: "application/json" }
    }).catch(() => []);

    return customTabsConfigPromise;
  };

  const normalizeCustomTabHtml = (tab) => {
    const title = String(tab?.Title || "");
    const html = String(tab?.ContentHtml || "").trim();

    if (/calendar/i.test(title) && /jellyfinenhanced\s+calendar/i.test(html)) {
      return '<div class="jellyfinenhanced calendar"></div>';
    }

    return html;
  };

  const ensureCustomTabStyles = () => {
    if (document.getElementById("codex-custom-tabs-repair-style")) return;

    const style = document.createElement("style");
    style.id = "codex-custom-tabs-repair-style";
    style.textContent = `
      .homePage .codex-custom-tabContent:not(.is-active) {
        display: none !important;
      }

      .homePage .codex-custom-tabContent.is-active {
        display: block !important;
        min-height: 12rem !important;
      }
    `;
    document.head.appendChild(style);
  };

  const ensureCustomTabPanes = async () => {
    if (!isCustomTabsHomeRoute()) return;

    const homePage = document.querySelector("#indexPage.homePage, .homePage#indexPage");
    const tabsSlider = document.querySelector(".headerTabs .emby-tabs-slider, .emby-tabs-slider");
    if (!homePage || !tabsSlider) return;

    const configs = await getCustomTabsConfig();
    if (!Array.isArray(configs) || !configs.length) return;

    ensureCustomTabStyles();

    configs.forEach((tab, offset) => {
      const index = CUSTOM_TAB_BASE_INDEX + offset;
      const paneId = `codexCustomTabContent_${offset}`;
      const html = normalizeCustomTabHtml(tab);
      if (!html) return;

      let pane = homePage.querySelector(`.tabContent[data-index="${index}"]`);
      if (!pane) {
        pane = document.createElement("div");
        pane.className = "tabContent pageTabContent libraryPage codex-custom-tabContent";
        pane.id = paneId;
        pane.setAttribute("data-index", String(index));
        homePage.appendChild(pane);
      } else {
        pane.classList.add("tabContent", "pageTabContent", "libraryPage", "codex-custom-tabContent");
        if (!pane.id) pane.id = paneId;
      }

      if (pane.getAttribute("data-codex-custom-tab-html") !== html) {
        pane.innerHTML = html;
        pane.setAttribute("data-codex-custom-tab-html", html);
      }
    });
  };

  const ensureCalendarColorStyles = () => {
    if (document.getElementById("codex-calendar-color-style")) return;

    const style = document.createElement("style");
    style.id = "codex-calendar-color-style";
    style.textContent = `
      .jellyfinenhanced.calendar,
      .je-calendar-page {
        background: var(--my-bg, #071014) !important;
        background-color: var(--my-bg, #071014) !important;
        color: var(--my-text, #effcff) !important;
      }

      .homePage .codex-custom-tabContent.is-active:has(.jellyfinenhanced.calendar) {
        padding-top: calc(var(--codex-header-wave-clearance, 2.4rem) + .25rem) !important;
      }

      .homePage .codex-custom-tabContent.is-active .jellyfinenhanced.calendar {
        padding-top: 0 !important;
      }

      .homePage .codex-custom-tabContent.is-active .jellyfinenhanced.calendar .je-calendar-page,
      .homePage .codex-custom-tabContent.is-active .jellyfinenhanced.calendar .content-primary.je-calendar-page {
        padding-top: 0 !important;
      }

      .homePage .codex-custom-tabContent.is-active .jellyfinenhanced.calendar .je-calendar-header {
        margin-top: 0 !important;
        padding-top: 0 !important;
      }

      .jellyfinenhanced.calendar .je-calendar-title,
      .jellyfinenhanced.calendar h1,
      .jellyfinenhanced.calendar h2,
      .jellyfinenhanced.calendar h3,
      .je-calendar-page .je-calendar-title,
      .je-calendar-page h1,
      .je-calendar-page h2,
      .je-calendar-page h3 {
        color: var(--my-primary-2, #a9f7ff) !important;
        font-weight: 850 !important;
      }

      .jellyfinenhanced.calendar .je-calendar-header,
      .jellyfinenhanced.calendar .je-calendar-actions,
      .jellyfinenhanced.calendar .je-calendar-legend,
      .jellyfinenhanced.calendar .je-calendar-filter-controls,
      .jellyfinenhanced.calendar .je-calendar-legend-item,
      .je-calendar-page .je-calendar-header,
      .je-calendar-page .je-calendar-actions,
      .je-calendar-page .je-calendar-legend,
      .je-calendar-page .je-calendar-filter-controls,
      .je-calendar-page .je-calendar-legend-item {
        color: var(--my-text, #effcff) !important;
      }

      .jellyfinenhanced.calendar .je-calendar-card,
      .jellyfinenhanced.calendar .je-calendar-agenda-row,
      .jellyfinenhanced.calendar .je-calendar-day,
      .jellyfinenhanced.calendar .je-calendar-empty,
      .je-calendar-page .je-calendar-card,
      .je-calendar-page .je-calendar-agenda-row,
      .je-calendar-page .je-calendar-day,
      .je-calendar-page .je-calendar-empty {
        background: color-mix(in srgb, var(--my-primary, #00e5ff) 7%, var(--my-bg-raised, #0b151a)) !important;
        background-color: color-mix(in srgb, var(--my-primary, #00e5ff) 7%, var(--my-bg-raised, #0b151a)) !important;
        border-color: color-mix(in srgb, var(--my-primary, #00e5ff) 12%, transparent) !important;
        color: var(--my-text, #effcff) !important;
      }

      .jellyfinenhanced.calendar .je-calendar-card-title,
      .jellyfinenhanced.calendar .je-calendar-card-title-text,
      .jellyfinenhanced.calendar .je-calendar-event-title,
      .jellyfinenhanced.calendar .je-calendar-agenda-event-title,
      .jellyfinenhanced.calendar .je-calendar-agenda-title-text,
      .je-calendar-page .je-calendar-card-title,
      .je-calendar-page .je-calendar-card-title-text,
      .je-calendar-page .je-calendar-event-title,
      .je-calendar-page .je-calendar-agenda-event-title,
      .je-calendar-page .je-calendar-agenda-title-text {
        color: var(--my-text, #effcff) !important;
        font-weight: 800 !important;
      }

      .jellyfinenhanced.calendar .je-calendar-card-subtitle,
      .jellyfinenhanced.calendar .je-calendar-card-meta,
      .jellyfinenhanced.calendar .je-calendar-event-subtitle,
      .jellyfinenhanced.calendar .je-calendar-event-type,
      .jellyfinenhanced.calendar .je-calendar-agenda-subtitle,
      .jellyfinenhanced.calendar .je-calendar-agenda-event-meta,
      .je-calendar-page .je-calendar-card-subtitle,
      .je-calendar-page .je-calendar-card-meta,
      .je-calendar-page .je-calendar-event-subtitle,
      .je-calendar-page .je-calendar-event-type,
      .je-calendar-page .je-calendar-agenda-subtitle,
      .je-calendar-page .je-calendar-agenda-event-meta {
        color: var(--my-muted, #b8ced4) !important;
      }

      .jellyfinenhanced.calendar .je-calendar-day-name,
      .jellyfinenhanced.calendar .je-calendar-day-number,
      .jellyfinenhanced.calendar .je-calendar-agenda-date,
      .je-calendar-page .je-calendar-day-name,
      .je-calendar-page .je-calendar-day-number,
      .je-calendar-page .je-calendar-agenda-date {
        color: var(--my-primary-2, #a9f7ff) !important;
      }

      .jellyfinenhanced.calendar button,
      .jellyfinenhanced.calendar .emby-button,
      .jellyfinenhanced.calendar .je-calendar-nav-btn,
      .jellyfinenhanced.calendar .je-calendar-view-btn,
      .jellyfinenhanced.calendar .je-calendar-mode-btn,
      .jellyfinenhanced.calendar .je-calendar-filter-btn,
      .je-calendar-page button,
      .je-calendar-page .emby-button,
      .je-calendar-page .je-calendar-nav-btn,
      .je-calendar-page .je-calendar-view-btn,
      .je-calendar-page .je-calendar-mode-btn,
      .je-calendar-page .je-calendar-filter-btn {
        background: color-mix(in srgb, var(--my-primary, #00e5ff) 10%, transparent) !important;
        background-color: color-mix(in srgb, var(--my-primary, #00e5ff) 10%, transparent) !important;
        border-color: color-mix(in srgb, var(--my-primary, #00e5ff) 16%, transparent) !important;
        box-shadow: none !important;
        color: var(--my-primary-2, #a9f7ff) !important;
      }

      .jellyfinenhanced.calendar button:hover,
      .jellyfinenhanced.calendar .emby-button:hover,
      .jellyfinenhanced.calendar .je-calendar-nav-btn:hover,
      .jellyfinenhanced.calendar .je-calendar-view-btn:hover,
      .jellyfinenhanced.calendar .je-calendar-mode-btn:hover,
      .jellyfinenhanced.calendar .je-calendar-filter-btn:hover,
      .je-calendar-page button:hover,
      .je-calendar-page .emby-button:hover,
      .je-calendar-page .je-calendar-nav-btn:hover,
      .je-calendar-page .je-calendar-view-btn:hover,
      .je-calendar-page .je-calendar-mode-btn:hover,
      .je-calendar-page .je-calendar-filter-btn:hover {
        background: var(--my-state-hover, rgba(0, 229, 255, .14)) !important;
        background-color: var(--my-state-hover, rgba(0, 229, 255, .14)) !important;
        color: var(--my-primary-2, #a9f7ff) !important;
      }

      .jellyfinenhanced.calendar .active,
      .jellyfinenhanced.calendar button.active,
      .jellyfinenhanced.calendar .je-calendar-view-btn.active,
      .jellyfinenhanced.calendar .je-calendar-mode-btn.active,
      .jellyfinenhanced.calendar .je-calendar-filter-btn.active,
      .je-calendar-page .active,
      .je-calendar-page button.active,
      .je-calendar-page .je-calendar-view-btn.active,
      .je-calendar-page .je-calendar-mode-btn.active,
      .je-calendar-page .je-calendar-filter-btn.active {
        background: var(--my-primary, #00e5ff) !important;
        background-color: var(--my-primary, #00e5ff) !important;
        border-color: var(--my-primary, #00e5ff) !important;
        color: var(--my-on-primary, #001f26) !important;
      }

      .jellyfinenhanced.calendar :is(button, .emby-button, [role="button"], .btn, .MuiButton-root, .MuiToggleButton-root, .je-calendar-nav-btn, .je-calendar-view-btn, .je-calendar-mode-btn, .je-calendar-filter-btn, .je-calendar-icon-btn),
      .je-calendar-page :is(button, .emby-button, [role="button"], .btn, .MuiButton-root, .MuiToggleButton-root, .je-calendar-nav-btn, .je-calendar-view-btn, .je-calendar-mode-btn, .je-calendar-filter-btn, .je-calendar-icon-btn) {
        align-items: center !important;
        background: color-mix(in srgb, var(--my-primary, #00e5ff) 11%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        background-color: color-mix(in srgb, var(--my-primary, #00e5ff) 11%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        border: 1px solid color-mix(in srgb, var(--my-primary, #00e5ff) 13%, transparent) !important;
        border-radius: 999px !important;
        box-shadow: none !important;
        color: var(--my-primary-2, #a9f7ff) !important;
        display: inline-flex !important;
        font-weight: 750 !important;
        gap: .35rem !important;
        justify-content: center !important;
        line-height: 1 !important;
        min-height: 2.15rem !important;
        min-width: 2.15rem !important;
        outline: 0 !important;
        padding: 0 .9rem !important;
        text-shadow: none !important;
        transition: background-color .16s ease, color .16s ease, transform .16s ease !important;
      }

      .jellyfinenhanced.calendar :is(.je-calendar-nav-btn, .je-calendar-mode-btn, .je-calendar-icon-btn, .MuiToggleButton-root),
      .je-calendar-page :is(.je-calendar-nav-btn, .je-calendar-mode-btn, .je-calendar-icon-btn, .MuiToggleButton-root) {
        padding-left: .65rem !important;
        padding-right: .65rem !important;
      }

      .jellyfinenhanced.calendar :is(button, .emby-button, [role="button"], .btn, .MuiButton-root, .MuiToggleButton-root, .je-calendar-nav-btn, .je-calendar-view-btn, .je-calendar-mode-btn, .je-calendar-filter-btn, .je-calendar-icon-btn):hover,
      .je-calendar-page :is(button, .emby-button, [role="button"], .btn, .MuiButton-root, .MuiToggleButton-root, .je-calendar-nav-btn, .je-calendar-view-btn, .je-calendar-mode-btn, .je-calendar-filter-btn, .je-calendar-icon-btn):hover {
        background: color-mix(in srgb, var(--my-primary, #00e5ff) 20%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        background-color: color-mix(in srgb, var(--my-primary, #00e5ff) 20%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        border-color: color-mix(in srgb, var(--my-primary, #00e5ff) 22%, transparent) !important;
        color: var(--my-primary-2, #a9f7ff) !important;
        transform: translateY(-1px) !important;
      }

      .jellyfinenhanced.calendar :is(button, .emby-button, [role="button"], .btn, .MuiButton-root, .MuiToggleButton-root, .je-calendar-view-btn, .je-calendar-mode-btn, .je-calendar-filter-btn, .je-calendar-icon-btn):is(.active, .is-active, .selected, .is-selected, .Mui-selected, [aria-selected="true"], [aria-pressed="true"], [data-active="true"]),
      .je-calendar-page :is(button, .emby-button, [role="button"], .btn, .MuiButton-root, .MuiToggleButton-root, .je-calendar-view-btn, .je-calendar-mode-btn, .je-calendar-filter-btn, .je-calendar-icon-btn):is(.active, .is-active, .selected, .is-selected, .Mui-selected, [aria-selected="true"], [aria-pressed="true"], [data-active="true"]) {
        background: var(--my-primary, #00e5ff) !important;
        background-color: var(--my-primary, #00e5ff) !important;
        border-color: var(--my-primary, #00e5ff) !important;
        color: var(--my-on-primary, #001f26) !important;
      }

      .jellyfinenhanced.calendar :is(button, .emby-button, [role="button"], .btn, .MuiButton-root, .MuiToggleButton-root, .je-calendar-view-btn, .je-calendar-mode-btn, .je-calendar-filter-btn, .je-calendar-icon-btn):is(.active, .is-active, .selected, .is-selected, .Mui-selected, [aria-selected="true"], [aria-pressed="true"], [data-active="true"]) :is(svg, path, .material-icons, .material-symbols-rounded),
      .je-calendar-page :is(button, .emby-button, [role="button"], .btn, .MuiButton-root, .MuiToggleButton-root, .je-calendar-view-btn, .je-calendar-mode-btn, .je-calendar-filter-btn, .je-calendar-icon-btn):is(.active, .is-active, .selected, .is-selected, .Mui-selected, [aria-selected="true"], [aria-pressed="true"], [data-active="true"]) :is(svg, path, .material-icons, .material-symbols-rounded) {
        color: var(--my-on-primary, #001f26) !important;
        fill: currentColor !important;
        stroke: currentColor !important;
      }

      .jellyfinenhanced.calendar :is(.je-calendar-legend, .je-calendar-filter-panel, .je-calendar-filters, [class*="calendar-legend"], [class*="CalendarLegend"], [class*="filter-panel"], [class*="FilterPanel"]),
      .je-calendar-page :is(.je-calendar-legend, .je-calendar-filter-panel, .je-calendar-filters, [class*="calendar-legend"], [class*="CalendarLegend"], [class*="filter-panel"], [class*="FilterPanel"]) {
        align-items: center !important;
        background: color-mix(in srgb, var(--my-primary, #00e5ff) 7%, var(--my-bg-raised, #0b151a)) !important;
        background-color: color-mix(in srgb, var(--my-primary, #00e5ff) 7%, var(--my-bg-raised, #0b151a)) !important;
        border: 1px solid color-mix(in srgb, var(--my-primary, #00e5ff) 10%, transparent) !important;
        border-radius: 14px !important;
        box-shadow: none !important;
        color: var(--my-text, #effcff) !important;
        display: flex !important;
        flex-wrap: wrap !important;
        gap: .8rem 1.35rem !important;
        justify-content: center !important;
        margin: .75rem auto 1.15rem !important;
        max-width: min(100%, 48rem) !important;
        padding: .95rem 1.15rem !important;
        width: max-content !important;
      }

      .jellyfinenhanced.calendar :is(.je-calendar-filter-controls, [class*="filter-controls"], [class*="FilterControls"]),
      .je-calendar-page :is(.je-calendar-filter-controls, [class*="filter-controls"], [class*="FilterControls"]) {
        align-items: center !important;
        background: color-mix(in srgb, var(--my-primary, #00e5ff) 6%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        background-color: color-mix(in srgb, var(--my-primary, #00e5ff) 6%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        border: 1px solid color-mix(in srgb, var(--my-primary, #00e5ff) 9%, transparent) !important;
        border-radius: 999px !important;
        box-shadow: none !important;
        display: flex !important;
        flex-wrap: wrap !important;
        gap: .35rem !important;
        justify-content: center !important;
        margin: .55rem auto .2rem !important;
        max-width: max-content !important;
        padding: .28rem !important;
        width: max-content !important;
      }

      .jellyfinenhanced.calendar :is(.je-calendar-legend-item, [class*="legend-item"], [class*="LegendItem"]),
      .je-calendar-page :is(.je-calendar-legend-item, [class*="legend-item"], [class*="LegendItem"]) {
        align-items: center !important;
        color: var(--my-text, #effcff) !important;
        display: inline-flex !important;
        font-weight: 650 !important;
        gap: .45rem !important;
        min-height: 1.55rem !important;
        opacity: .96 !important;
        white-space: nowrap !important;
      }

      .jellyfinenhanced.calendar :is(button, [role="button"], .MuiButtonBase-root, .MuiAccordionSummary-root, [class*="AccordionSummary"], [class*="filter-toggle"], [class*="FilterToggle"], [class*="dropdown"], [class*="Dropdown"])[aria-expanded],
      .je-calendar-page :is(button, [role="button"], .MuiButtonBase-root, .MuiAccordionSummary-root, [class*="AccordionSummary"], [class*="filter-toggle"], [class*="FilterToggle"], [class*="dropdown"], [class*="Dropdown"])[aria-expanded] {
        background: color-mix(in srgb, var(--my-primary, #00e5ff) 12%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        background-color: color-mix(in srgb, var(--my-primary, #00e5ff) 12%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        border: 1px solid color-mix(in srgb, var(--my-primary, #00e5ff) 15%, transparent) !important;
        border-radius: 999px !important;
        box-shadow: none !important;
        color: var(--my-primary-2, #a9f7ff) !important;
        display: inline-flex !important;
        font-size: 0 !important;
        gap: .35rem !important;
        height: 2.15rem !important;
        justify-content: center !important;
        margin: .65rem auto .35rem !important;
        max-width: 8.8rem !important;
        min-height: 2.15rem !important;
        min-width: 0 !important;
        padding: 0 .9rem !important;
        width: auto !important;
      }

      .jellyfinenhanced.calendar :is(button, [role="button"], .MuiButtonBase-root, .MuiAccordionSummary-root, [class*="AccordionSummary"], [class*="filter-toggle"], [class*="FilterToggle"], [class*="dropdown"], [class*="Dropdown"])[aria-expanded]::before,
      .je-calendar-page :is(button, [role="button"], .MuiButtonBase-root, .MuiAccordionSummary-root, [class*="AccordionSummary"], [class*="filter-toggle"], [class*="FilterToggle"], [class*="dropdown"], [class*="Dropdown"])[aria-expanded]::before {
        color: currentColor !important;
        content: "Filters" !important;
        font-size: .86rem !important;
        font-weight: 800 !important;
        line-height: 1 !important;
      }

      .jellyfinenhanced.calendar :is(button, [role="button"], .MuiButtonBase-root, .MuiAccordionSummary-root, [class*="AccordionSummary"], [class*="filter-toggle"], [class*="FilterToggle"], [class*="dropdown"], [class*="Dropdown"])[aria-expanded] :is(svg, path, .material-icons, .material-symbols-rounded),
      .je-calendar-page :is(button, [role="button"], .MuiButtonBase-root, .MuiAccordionSummary-root, [class*="AccordionSummary"], [class*="filter-toggle"], [class*="FilterToggle"], [class*="dropdown"], [class*="Dropdown"])[aria-expanded] :is(svg, path, .material-icons, .material-symbols-rounded) {
        color: currentColor !important;
        fill: currentColor !important;
        font-size: 1rem !important;
        height: 1rem !important;
        stroke: currentColor !important;
        width: 1rem !important;
      }
    `;
    document.head.appendChild(style);
  };

  const ensureDrawerColorStyles = () => {
    if (document.getElementById("codex-drawer-color-style")) return;

    const style = document.createElement("style");
    style.id = "codex-drawer-color-style";
    style.textContent = `
      .mainDrawer,
      .drawer-open .mainDrawer,
      .MuiDrawer-paper {
        color: var(--my-primary-2, #a9f7ff) !important;
      }

      .mainDrawer .navMenuSectionTitle,
      .mainDrawer .navSectionTitle,
      .mainDrawer .navMenuHeader,
      .mainDrawer .navHeader,
      .mainDrawer .drawerSectionTitle,
      .mainDrawer .sidebarSectionTitle,
      .mainDrawer .sectionHeader,
      .mainDrawer .listGroupHeader,
      .mainDrawer h2,
      .mainDrawer h3,
      .mainDrawer h4,
      .mainDrawer label {
        color: var(--my-primary-2, #a9f7ff) !important;
        font-weight: 750 !important;
        opacity: .92 !important;
      }

      .mainDrawer .navMenuOption,
      .mainDrawer .navMenuOptionText,
      .mainDrawer .navMenuOptionIcon,
      .mainDrawer .material-icons,
      .mainDrawer .material-symbols-rounded,
      .mainDrawer .emby-button {
        color: var(--my-primary-2, #a9f7ff) !important;
      }
    `;
    document.head.appendChild(style);
  };

  const ensureSpotlightActionStyles = () => {
    if (document.getElementById("codex-spotlight-action-style")) return;

    const style = document.createElement("style");
    style.id = "codex-spotlight-action-style";
    style.textContent = `
      #slides-container .button-container .detailButton.play-button.btnPlay,
      #slides-container .button-container .detailButton.play-button.btnPlay:hover,
      #slides-container .button-container .detailButton.play-button.btnPlay:focus-visible {
        border: 1px solid color-mix(in srgb, var(--my-primary, #00e5ff) 72%, transparent) !important;
        box-shadow: 0 10px 26px color-mix(in srgb, var(--my-primary, #00e5ff) 22%, transparent) !important;
        height: 2.76rem !important;
        min-height: 2.76rem !important;
        padding: 0 1.15rem !important;
      }

      #slides-container .button-container .detailButton.play-button.btnPlay:hover,
      #slides-container .button-container .detailButton.play-button.btnPlay:focus-visible {
        background: var(--my-primary-2, #a9f7ff) !important;
        background-color: var(--my-primary-2, #a9f7ff) !important;
        box-shadow: 0 12px 30px color-mix(in srgb, var(--my-primary, #00e5ff) 28%, transparent) !important;
      }

      #slides-container .button-container .detail-button,
      #slides-container .button-container .favorite-button {
        background: color-mix(in srgb, var(--my-primary, #00e5ff) 15%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        background-color: color-mix(in srgb, var(--my-primary, #00e5ff) 15%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        border: 1px solid color-mix(in srgb, var(--my-primary, #00e5ff) 14%, transparent) !important;
        color: var(--my-primary-2, #a9f7ff) !important;
        height: 2.76rem !important;
        min-height: 2.76rem !important;
        min-width: 2.76rem !important;
        width: 2.76rem !important;
      }

      #slides-container .button-container .detail-button:hover,
      #slides-container .button-container .favorite-button:hover,
      #slides-container .button-container .detail-button:focus-visible,
      #slides-container .button-container .favorite-button:focus-visible {
        background: color-mix(in srgb, var(--my-primary, #00e5ff) 24%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        background-color: color-mix(in srgb, var(--my-primary, #00e5ff) 24%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        border-color: color-mix(in srgb, var(--my-primary, #00e5ff) 26%, transparent) !important;
        color: var(--my-primary-2, #a9f7ff) !important;
        transform: translateY(-1px) !important;
      }

      #slides-container .button-container .favorite-button.favorited,
      #slides-container .button-container .favorite-button[aria-pressed="true"],
      #slides-container .button-container .favorite-button[aria-selected="true"],
      #slides-container .button-container .detail-button[aria-pressed="true"],
      #slides-container .button-container .detail-button[aria-selected="true"] {
        background: color-mix(in srgb, var(--my-primary, #00e5ff) 28%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        background-color: color-mix(in srgb, var(--my-primary, #00e5ff) 28%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        border-color: color-mix(in srgb, var(--my-primary, #00e5ff) 36%, transparent) !important;
        color: var(--my-primary, #00e5ff) !important;
      }

      #slides-container .button-container .detail-button::before,
      #slides-container .button-container .favorite-button::before,
      #slides-container .button-container .favorite-button.favorited::before {
        color: currentColor !important;
        font-size: 1.18rem !important;
        height: 1.18rem !important;
        max-height: 1.18rem !important;
        max-width: 1.18rem !important;
        width: 1.18rem !important;
      }

      #slides-container .button-container :is(.detailButton, .detail-button, .favorite-button) :is(svg, path, .material-icons, .material-symbols-rounded) {
        color: currentColor !important;
        fill: currentColor !important;
        stroke: currentColor !important;
      }

      #slides-container .button-container > *:not(.play-button):not(.btnPlay),
      #slides-container .button-container :is(.detail-button, .favorite-button, .watchlist-button, .bookmark-button, [class*="watchlist"], [class*="Watchlist"], [class*="bookmark"], [class*="Bookmark"]):not(.play-button):not(.btnPlay) {
        align-items: center !important;
        aspect-ratio: 1 / 1 !important;
        background: color-mix(in srgb, var(--my-primary, #00e5ff) 18%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        background-color: color-mix(in srgb, var(--my-primary, #00e5ff) 18%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        border: 1px solid color-mix(in srgb, var(--my-primary, #00e5ff) 18%, transparent) !important;
        border-radius: 999px !important;
        box-shadow: none !important;
        color: var(--my-primary-2, #a9f7ff) !important;
        display: inline-flex !important;
        height: 2.76rem !important;
        justify-content: center !important;
        min-height: 2.76rem !important;
        min-width: 2.76rem !important;
        padding: 0 !important;
        text-shadow: none !important;
        transform: none !important;
        width: 2.76rem !important;
      }

      #slides-container .button-container > *:not(.play-button):not(.btnPlay):hover,
      #slides-container .button-container > *:not(.play-button):not(.btnPlay):focus-visible,
      #slides-container .button-container :is(.detail-button, .favorite-button, .watchlist-button, .bookmark-button, [class*="watchlist"], [class*="Watchlist"], [class*="bookmark"], [class*="Bookmark"]):not(.play-button):not(.btnPlay):hover,
      #slides-container .button-container :is(.detail-button, .favorite-button, .watchlist-button, .bookmark-button, [class*="watchlist"], [class*="Watchlist"], [class*="bookmark"], [class*="Bookmark"]):not(.play-button):not(.btnPlay):focus-visible {
        background: color-mix(in srgb, var(--my-primary, #00e5ff) 28%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        background-color: color-mix(in srgb, var(--my-primary, #00e5ff) 28%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        border-color: color-mix(in srgb, var(--my-primary, #00e5ff) 32%, transparent) !important;
        color: var(--my-primary-2, #a9f7ff) !important;
        transform: translateY(-1px) !important;
      }

      #slides-container .button-container > *:not(.play-button):not(.btnPlay):is(.active, .is-active, .selected, .is-selected, [aria-pressed="true"], [aria-selected="true"]),
      #slides-container .button-container :is(.favorite-button, .watchlist-button, .bookmark-button, [class*="watchlist"], [class*="Watchlist"], [class*="bookmark"], [class*="Bookmark"]):is(.active, .is-active, .selected, .is-selected, .favorited, [aria-pressed="true"], [aria-selected="true"]) {
        background: color-mix(in srgb, var(--my-primary, #00e5ff) 32%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        background-color: color-mix(in srgb, var(--my-primary, #00e5ff) 32%, var(--my-surface-soft, rgba(21, 36, 42, .9))) !important;
        border-color: color-mix(in srgb, var(--my-primary, #00e5ff) 42%, transparent) !important;
        color: var(--my-primary, #00e5ff) !important;
      }

      #slides-container .button-container > *:not(.play-button):not(.btnPlay) :is(svg, path, .material-icons, .material-symbols-rounded),
      #slides-container .button-container :is(.detail-button, .favorite-button, .watchlist-button, .bookmark-button, [class*="watchlist"], [class*="Watchlist"], [class*="bookmark"], [class*="Bookmark"]):not(.play-button):not(.btnPlay) :is(svg, path, .material-icons, .material-symbols-rounded) {
        color: currentColor !important;
        fill: currentColor !important;
        stroke: currentColor !important;
      }
    `;
    document.head.appendChild(style);
  };

  const markRemoteMusicPlayerPage = () => {
    const pages = document.querySelectorAll(".page, .mainAnimatedPage, .libraryPage, .pageWithAbsoluteTabs, [data-role='page']");
    let found = false;

    pages.forEach((page) => {
      const text = cleanText(page);
      const hasRemoteSections = /(^| )Navigation( |$)/i.test(text)
        && /(^| )Send Message( |$)/i.test(text)
        && /(^| )Enter Text( |$)/i.test(text);
      const hasPlaybackControls = Boolean(
        page.querySelector(
          "input[type='range'], .sliderContainer, .emby-slider, .mdl-slider, .playbackProgress, .paper-icon-button-light, paper-icon-button-light, .btnCommand, .btnPlayPause"
        )
      );
      const shouldMark = hasRemoteSections && hasPlaybackControls;

      page.classList.toggle("codex-remote-player-page", shouldMark);

      page.querySelectorAll(".codex-remote-player-row").forEach((row) => {
        row.classList.remove("codex-remote-player-row");
      });

      if (!shouldMark) return;
      found = true;

      page.querySelectorAll("button, [role='button'], .sectionTitle, .sectionTitleContainer, .listItem, h2, h3").forEach((node) => {
        const label = cleanText(node);
        if (label.length > 80 || !/(^| )(Navigation|Send Message|Enter Text)( |$)/i.test(label)) return;

        const row = node.closest("button, [role='button'], .sectionTitleContainer, .listItem, .collapsible, .verticalSection, .formSection") || node;
        row.classList.add("codex-remote-player-row");
      });
    });

    document.body.classList.toggle("codex-remote-player-active", found);
  };

  const getThemeName = () => {
    const stored = window.localStorage?.getItem(THEME_KEY);
    return THEMES[stored] ? stored : "blue";
  };

  const setRootVar = (name, value) => {
    document.documentElement.style.setProperty(name, value);
  };

  const svgVarUrl = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

  const applyAccentAssets = (theme) => {
    setRootVar(
      "--codex-wave-line",
      svgVarUrl(
        `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="14" viewBox="0 0 48 14"><path d="M0 7 Q6 1 12 7 T24 7 T36 7 T48 7" fill="none" stroke="${theme.primary}" stroke-width="4.2" stroke-linecap="round"/></svg>`
      )
    );
    setRootVar(
      "--codex-wave-line-soft",
      svgVarUrl(
        `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="14" viewBox="0 0 48 14"><path d="M0 7 Q6 1 12 7 T24 7 T36 7 T48 7" fill="none" stroke="${theme.primary}" stroke-opacity=".22" stroke-width="4.2" stroke-linecap="round"/></svg>`
      )
    );
    setRootVar(
      "--codex-wave-ring",
      svgVarUrl(
        `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><path d="M48 10 C54 10 56 17 61 19 C66 21 73 17 77 21 C81 25 77 32 79 37 C81 42 88 44 88 50 C88 56 80 58 78 63 C76 68 80 75 76 79 C72 83 65 79 60 81 C55 83 53 90 47 90 C41 90 39 83 34 81 C29 79 22 83 18 79 C14 75 18 68 16 63 C14 58 8 56 8 50 C8 44 15 42 17 37 C19 32 15 25 19 21 C23 17 30 21 35 19 C40 17 42 10 48 10 Z" fill="none" stroke="${theme.primary}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M48 10 C54 10 56 17 61 19 C66 21 73 17 77 21" fill="none" stroke="${theme.primary2}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`
      )
    );
  };

  const applyTheme = (name) => {
    const key = THEMES[name] ? name : "blue";
    const theme = THEMES[key];

    setRootVar("--my-primary", theme.primary);
    setRootVar("--my-primary-2", theme.primary2);
    setRootVar("--my-primary-3", theme.primary3);
    setRootVar("--my-primary-container", theme.container);
    setRootVar("--my-primary-container-soft", theme.soft);
    setRootVar("--my-state-hover", theme.hover);
    setRootVar("--my-state-focus", theme.focus);
    setRootVar("--my-state-pressed", theme.pressed);
    setRootVar("--my-state-selected", theme.selected);
    setRootVar("--my-accent-soft", theme.soft);
    setRootVar("--my-accent-hover", theme.hover);
    setRootVar("--my-accent-focus", theme.focus);
    setRootVar("--my-accent-pressed", theme.pressed);
    setRootVar("--my-accent-selected", theme.selected);
    setRootVar("--my-accent-outline", theme.outline);
    setRootVar("--my-accent-shadow-soft", theme.hover);
    setRootVar("--my-accent-shadow-strong", theme.focus);
    setRootVar("--codex-m3-outline-soft", theme.m3Focus);
    setRootVar("--codex-m3-outline-focus", theme.outline);
    setRootVar("--codex-m3-state-hover", theme.m3Hover);
    setRootVar("--codex-m3-state-focus", theme.m3Focus);
    setRootVar("--theme-primary-color", theme.primary);
    setRootVar("--theme-accent-color", theme.primary);
    setRootVar("--mui-palette-primary-main", theme.primary);
    setRootVar("--mui-palette-primary-light", theme.primary2);
    setRootVar("--mui-palette-primary-dark", theme.container);
    setRootVar("--mui-palette-info-main", theme.primary);
    setRootVar("--mui-palette-action-selected", theme.soft);
    setRootVar("--md-sys-color-primary", theme.primary);
    setRootVar("--md-sys-color-primary-container", theme.container);
    applyAccentAssets(theme);

    document.documentElement.dataset.codexThemeColor = key;
    window.localStorage?.setItem(THEME_KEY, key);

    document.querySelectorAll(".codex-color-option").forEach((button) => {
      const selected = button.getAttribute("data-color") === key;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", String(selected));
    });

    const colorButton = document.querySelector(".codex-color-button");
    if (colorButton) {
      colorButton.setAttribute("aria-label", `Theme color: ${theme.label}`);
      colorButton.setAttribute("title", `Theme color: ${theme.label}`);
    }
  };

  const positionColorMenu = (button, menu) => {
    const rect = button.getBoundingClientRect();
    const width = Math.max(menu.offsetWidth || 176, 176);
    const left = Math.min(window.innerWidth - width - 12, Math.max(12, rect.right - width));
    menu.style.left = `${left}px`;
    menu.style.top = `${Math.min(window.innerHeight - 16, rect.bottom + 8)}px`;
  };

  const closeColorMenu = () => {
    document.querySelector(".codex-color-menu")?.classList.remove("is-open");
    document.querySelector(".codex-color-button")?.setAttribute("aria-expanded", "false");
  };

  const ensureColorSwitcher = () => {
    if (document.querySelector(".codex-color-button")) return;

    const anchor =
      document.querySelector(".skinHeader .headerUserButton, .skinHeader .btnUser, .skinHeader .userMenuButton") ||
      document.querySelector(".skinHeader button[title='Search'], .skinHeader button[aria-label='Search']") ||
      document.querySelector(".skinHeader .headerRight button:last-of-type, .skinHeader .headerTop button:last-of-type");

    const host =
      anchor?.parentElement ||
      document.querySelector(".skinHeader .headerRight") ||
      document.querySelector(".skinHeader .headerTop");

    if (!host) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "paper-icon-button-light headerButton codex-color-button";
    button.setAttribute("aria-haspopup", "menu");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML = '<span class="material-icons palette" aria-hidden="true"></span>';

    const menu = document.createElement("div");
    menu.className = "codex-color-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", "Theme color");

    for (const [key, theme] of Object.entries(THEMES)) {
      const option = document.createElement("button");
      option.type = "button";
      option.className = `codex-color-option codex-color-option-${key}`;
      option.setAttribute("role", "menuitemradio");
      option.setAttribute("data-color", key);
      option.innerHTML = `<span class="codex-color-swatch" aria-hidden="true"></span><span>${theme.label}</span>`;
      option.addEventListener("click", () => {
        applyTheme(key);
        closeColorMenu();
      });
      menu.appendChild(option);
    }

    if (anchor?.parentElement) {
      anchor.parentElement.insertBefore(button, anchor);
    } else {
      host.appendChild(button);
    }

    document.body.appendChild(menu);

    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const open = !menu.classList.contains("is-open");
      closeColorMenu();
      if (open) {
        menu.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
        positionColorMenu(button, menu);
      }
    });

    document.addEventListener("click", (event) => {
      if (!menu.contains(event.target) && !button.contains(event.target)) {
        closeColorMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeColorMenu();
    });

    window.addEventListener("resize", () => {
      if (menu.classList.contains("is-open")) positionColorMenu(button, menu);
    }, { passive: true });

    applyTheme(getThemeName());
  };

  const sectionForHeading = (heading) => {
    let node = heading;

    for (let depth = 0; node && depth < 8; depth += 1, node = node.parentElement) {
      if (
        node.matches?.(
          "section, .verticalSection, .homeSection, .latestItemsSection, .resumeSection, .nextUpSection, .section0, .section1, .section2, .section3, .section4, .section5, .section6, .section7, .section8, .section9"
        )
      ) {
        return node;
      }

      if (
        node !== heading &&
        node.querySelector?.(".itemsContainer, .cardBox, .cardScalable, .emby-scroller, .scrollSlider")
      ) {
        return node;
      }
    }

    return heading.closest?.(".verticalSection, section") || heading.parentElement?.parentElement || null;
  };

  const cssUrl = (src) => `url("${String(src).replace(/["\\]/g, "\\$&")}")`;

  let marvelItemsCache = null;
  let marvelLoadPromise = null;
  let wizardingItemsCache = null;
  let wizardingLoadPromise = null;

  const parseJson = (value) => {
    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  };

  const readClientValue = (client, names) => {
    if (!client) return null;

    for (const name of names) {
      try {
        const value = typeof client[name] === "function" ? client[name]() : client[name];
        if (value) return value;
      } catch {
        // Keep trying other Jellyfin client shapes.
      }
    }

    return null;
  };

  const collectCredentials = (value, results, depth = 0) => {
    if (!value || typeof value !== "object" || depth > 6) return;

    if (value.AccessToken && value.UserId) {
      results.push({
        token: value.AccessToken,
        userId: value.UserId,
        serverId: value.Id || value.ServerId || value.ServerInfo?.Id || ""
      });
    }

    if (Array.isArray(value)) {
      value.forEach((entry) => collectCredentials(entry, results, depth + 1));
      return;
    }

    Object.values(value).forEach((entry) => collectCredentials(entry, results, depth + 1));
  };

  const getStoredCredentials = () => {
    const results = [];

    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);
      const parsed = parseJson(window.localStorage.getItem(key));
      collectCredentials(parsed, results);
    }

    return results.find((entry) => entry.token && entry.userId) || null;
  };

  const getJellyfinApiInfo = () => {
    const client =
      window.ApiClient ||
      window.apiClient ||
      window.connectionManager?.getApiClient?.() ||
      window.ConnectionManager?.getApiClient?.();

    const serverInfo =
      readClientValue(client, ["serverInfo", "_serverInfo", "getServerInfo"]) ||
      client?._serverInfo ||
      client?.serverInfo;

    const token =
      readClientValue(client, ["accessToken", "getAccessToken", "_accessToken"]) ||
      serverInfo?.AccessToken;

    const userId =
      readClientValue(client, ["getCurrentUserId", "currentUserId", "_currentUserId"]) ||
      serverInfo?.UserId;

    if (token && userId) {
      return { token, userId };
    }

    return getStoredCredentials();
  };

  const fetchJson = async (url) => {
    const apiInfo = getJellyfinApiInfo();
    if (!apiInfo?.token || !apiInfo?.userId) return null;

    const response = await fetch(url, {
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
        "X-Emby-Token": apiInfo.token
      }
    });

    if (!response.ok) throw new Error(`Jellyfin request failed: ${response.status}`);
    return response.json();
  };

  const getMarvelImageUrl = (item) => {
    const hasPrimary = Boolean(item.ImageTags?.Primary);
    const type = hasPrimary ? "Primary" : item.BackdropImageTags?.length ? "Backdrop/0" : "Primary";
    const params = new URLSearchParams({
      fillHeight: "520",
      fillWidth: "350",
      quality: "92"
    });

    if (hasPrimary) {
      params.set("tag", item.ImageTags.Primary);
    } else if (item.BackdropImageTags?.[0]) {
      params.set("tag", item.BackdropImageTags[0]);
    }

    return `/Items/${item.Id}/Images/${type}?${params.toString()}`;
  };

  const getMarvelSubtitle = (item) => {
    if (item.Type === "Series" && item.ProductionYear) {
      return `${item.ProductionYear}${item.EndDate ? ` - ${new Date(item.EndDate).getFullYear()}` : " - Present"}`;
    }

    return item.ProductionYear ? String(item.ProductionYear) : item.Type || "";
  };

  const getMarvelReleaseSortValue = (item) => {
    if (item.PremiereDate) {
      const time = Date.parse(item.PremiereDate);
      if (Number.isFinite(time)) return time;
    }

    if (item.ProductionYear) {
      return Date.UTC(Number(item.ProductionYear), 0, 1);
    }

    return Number.MAX_SAFE_INTEGER;
  };

  const sortMarvelByReleaseDate = (items) => {
    return [...items].sort((a, b) => {
      const dateDiff = getMarvelReleaseSortValue(a) - getMarvelReleaseSortValue(b);
      if (dateDiff) return dateDiff;

      const yearDiff = (a.ProductionYear || 9999) - (b.ProductionYear || 9999);
      if (yearDiff) return yearDiff;

      return String(a.SortName || a.Name || "").localeCompare(String(b.SortName || b.Name || ""));
    });
  };

  const getMarvelItems = async () => {
    const apiInfo = getJellyfinApiInfo();
    if (!apiInfo?.userId) return null;

    const params = new URLSearchParams({
      ParentId: MARVEL_COLLECTION_ID,
      Fields: "BackdropImageTags,EndDate,ImageTags,PremiereDate,PrimaryImageAspectRatio,ProductionYear,SortName",
      SortBy: "PremiereDate,ProductionYear,SortName",
      SortOrder: "Ascending",
      ImageTypeLimit: "1",
      EnableImageTypes: "Primary,Backdrop",
      Limit: "100"
    });

    const data = await fetchJson(`/Users/${apiInfo.userId}/Items?${params.toString()}`);
    return sortMarvelByReleaseDate(data?.Items || []);
  };

  const getWizardingItems = async () => {
    const apiInfo = getJellyfinApiInfo();
    if (!apiInfo?.userId) return null;

    const params = new URLSearchParams({
      ParentId: WIZARDING_COLLECTION_ID,
      Fields: "BackdropImageTags,EndDate,ImageTags,PremiereDate,PrimaryImageAspectRatio,ProductionYear,SortName",
      SortBy: "PremiereDate,ProductionYear,SortName",
      SortOrder: "Ascending",
      ImageTypeLimit: "1",
      EnableImageTypes: "Primary,Backdrop",
      Limit: "100"
    });

    const data = await fetchJson(`/Users/${apiInfo.userId}/Items?${params.toString()}`);
    return sortMarvelByReleaseDate(data?.Items || []);
  };

  const ensureMarvelStyles = () => {
    if (document.getElementById("codex-marvel-home-styles")) return;

    const style = document.createElement("style");
    style.id = "codex-marvel-home-styles";
    style.textContent = `
      .codex-collection-home-section {
        margin: .85em 0 1.25em !important;
      }

      .codex-collection-home-section .sectionTitleContainer {
        margin-bottom: .35rem !important;
      }

      .codex-collection-home-section .sectionTitleButton,
      .codex-collection-home-section .sectionTitleButton:hover,
      .codex-collection-home-section .sectionTitleButton:focus-visible {
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        color: var(--my-primary-2, #a9f7ff) !important;
        min-height: 0 !important;
        padding: 0 !important;
        text-decoration: none !important;
      }

      .codex-collection-home-section .sectionTitle {
        color: var(--my-primary-2, #a9f7ff) !important;
        text-decoration: none !important;
      }

      .codex-collection-home-section .codex-marvel-scroller {
        overflow-x: auto !important;
        overflow-y: visible !important;
        position: static !important;
        scroll-behavior: smooth;
      }

      .codex-collection-home-section .codex-marvel-items {
        display: flex;
        gap: .95rem;
        min-height: 21.5rem;
        padding-bottom: 1.15rem;
        padding-top: .1rem;
      }

      .codex-collection-home-section .codex-marvel-card {
        flex: 0 0 auto;
        max-width: none !important;
        text-decoration: none !important;
        width: clamp(11.2rem, 14.5vw, 13.2rem);
      }

      .codex-collection-home-section .codex-marvel-card .cardText-first {
        color: var(--my-primary, #00e5ff) !important;
      }

      .codex-collection-home-section .codex-marvel-card .cardText-secondary {
        color: var(--my-text, #d5f3f7) !important;
      }

      .codex-collection-home-section .codex-marvel-card .cardBox,
      .codex-collection-home-section .codex-marvel-card .visualCardBox {
        margin: 0 !important;
        max-width: none !important;
        min-width: 100% !important;
        width: 100% !important;
      }

      .codex-collection-home-section .codex-marvel-card .cardScalable {
        aspect-ratio: 2 / 3 !important;
        display: block !important;
        height: auto !important;
        max-width: none !important;
        min-width: 100% !important;
        overflow: hidden !important;
        position: relative !important;
        width: 100% !important;
      }

      .codex-collection-home-section .codex-marvel-card .cardPadder {
        display: block !important;
        height: 0 !important;
        padding-bottom: 150% !important;
        width: 100% !important;
      }

      .codex-collection-home-section .codex-marvel-card .cardContent {
        bottom: 0 !important;
        height: 100% !important;
        left: 0 !important;
        margin: 0 !important;
        max-height: none !important;
        max-width: none !important;
        min-height: 100% !important;
        min-width: 100% !important;
        position: absolute !important;
        right: 0 !important;
        top: 0 !important;
        width: 100% !important;
      }

      .codex-collection-home-section .codex-marvel-card .cardImageContainer {
        background-position: 50% 50% !important;
        background-repeat: no-repeat !important;
        background-size: cover !important;
        border-radius: inherit !important;
        height: 100% !important;
        margin: 0 !important;
        max-height: none !important;
        max-width: none !important;
        min-height: 100% !important;
        min-width: 100% !important;
        width: 100% !important;
      }

      .codex-collection-home-section .codex-marvel-loading {
        color: var(--my-primary-2, #a9f7ff);
        font-weight: 800;
        padding: 1rem 0;
      }

      .codex-collection-home-section .codex-marvel-scroll-button {
        pointer-events: auto !important;
      }

      @media (max-width: 47.99em) {
        .codex-collection-home-section {
          margin-top: 1.7em !important;
        }

        .codex-collection-home-section .codex-marvel-card {
          width: clamp(10.6rem, 40vw, 11.8rem);
        }
      }
    `;
    document.head.appendChild(style);
  };

  const scrollMarvelRow = (section, direction) => {
    const scroller = section.querySelector(".codex-marvel-scroller");
    if (!scroller) return;

    const distance = Math.max(420, scroller.clientWidth * .84);
    scroller.scrollBy?.({ left: direction * distance, behavior: "smooth" });
    if (!scroller.scrollBy) {
      scroller.scrollLeft += direction * distance;
    }
  };

  const wireMarvelScroller = (section) => {
    if (section.getAttribute("data-codex-scroller-wired") === "true") return;
    section.setAttribute("data-codex-scroller-wired", "true");

    section.querySelector(".codex-marvel-prev")?.addEventListener("click", (event) => {
      event.preventDefault();
      scrollMarvelRow(section, -1);
    });

    section.querySelector(".codex-marvel-next")?.addEventListener("click", (event) => {
      event.preventDefault();
      scrollMarvelRow(section, 1);
    });
  };

  const createMarvelCard = (item) => {
    const card = document.createElement("a");
    card.className = "card overflowPortraitCard card-hoverable codex-marvel-card";
    card.href = `#/details?id=${item.Id}`;
    card.title = item.Name || "MARVEL item";
    card.setAttribute("data-id", item.Id);
    card.setAttribute("data-type", item.Type || "");

    const box = document.createElement("div");
    box.className = "cardBox visualCardBox";

    const scalable = document.createElement("div");
    scalable.className = "cardScalable";

    const padder = document.createElement("div");
    padder.className = "cardPadder cardPadder-overflowPortrait";

    const content = document.createElement("div");
    content.className = "cardContent";

    const image = document.createElement("div");
    image.className = "cardImageContainer coveredImage cardImageContainer-covered lazyloaded";
    image.setAttribute("data-codex-image-hydrated", "true");
    image.style.backgroundImage = cssUrl(getMarvelImageUrl(item));

    content.appendChild(image);
    scalable.append(padder, content);
    box.appendChild(scalable);

    const title = document.createElement("div");
    title.className = "cardText cardTextCentered cardText-first";
    title.textContent = item.Name || "Untitled";

    const subtitleText = getMarvelSubtitle(item);
    const subtitle = document.createElement("div");
    subtitle.className = "cardText cardTextCentered cardText-secondary";
    subtitle.textContent = subtitleText;

    card.append(box, title);
    if (subtitleText) card.appendChild(subtitle);
    return card;
  };

  const renderMarvelItems = (section, items) => {
    const container = section.querySelector(".codex-marvel-items");
    if (!container) return;

    const signature = items.map((item) => item.Id).join("|");
    if (container.getAttribute("data-codex-signature") === signature) return;

    container.replaceChildren(...items.map(createMarvelCard));
    container.setAttribute("data-codex-signature", signature);
  };

  const loadMarvelItems = (section) => {
    if (marvelItemsCache) {
      renderMarvelItems(section, marvelItemsCache);
      return;
    }

    if (!marvelLoadPromise) {
      marvelLoadPromise = getMarvelItems()
        .then((items) => {
          if (!items) return null;
          marvelItemsCache = items;
          return items;
        })
        .catch(() => null)
        .finally(() => {
          marvelLoadPromise = null;
        });
    }

    marvelLoadPromise.then((items) => {
      if (items && document.contains(section)) {
        renderMarvelItems(section, items);
      }
    });
  };

  const loadWizardingItems = (section) => {
    if (wizardingItemsCache) {
      renderMarvelItems(section, wizardingItemsCache);
      return;
    }

    if (!wizardingLoadPromise) {
      wizardingLoadPromise = getWizardingItems()
        .then((items) => {
          if (!items) return null;
          wizardingItemsCache = items;
          return items;
        })
        .catch(() => null)
        .finally(() => {
          wizardingLoadPromise = null;
        });
    }

    wizardingLoadPromise.then((items) => {
      if (items && document.contains(section)) {
        renderMarvelItems(section, items);
      }
    });
  };

  const createMarvelHomeSection = () => {
    ensureMarvelStyles();

    const section = document.createElement("section");
    section.id = MARVEL_SECTION_ID;
    section.className = "verticalSection codex-collection-home-section codex-marvel-home-section";
    section.setAttribute("data-codex-managed", "true");

    section.innerHTML = `
      <div class="sectionTitleContainer sectionTitleContainer-cards padded-left">
        <a class="sectionTitleButton sectionTitleTextButton" href="#/details?id=${MARVEL_COLLECTION_ID}">
          <h2 class="sectionTitle sectionTitle-cards">MARVEL</h2>
        </a>
      </div>
      <div class="emby-scroller scrollX hiddenScrollX codex-marvel-scroller">
        <div class="scrollSlider">
          <div class="itemsContainer scrollSliderItems codex-marvel-items">
            <div class="codex-marvel-loading">Loading MARVEL...</div>
          </div>
        </div>
        <div class="emby-scrollbuttons">
          <button type="button" class="paper-icon-button-light btnPreviousPage emby-scrollbuttons-button codex-marvel-scroll-button codex-marvel-prev" title="Previous">
            <span class="material-icons chevron_left" aria-hidden="true"></span>
          </button>
          <button type="button" class="paper-icon-button-light btnNextPage emby-scrollbuttons-button codex-marvel-scroll-button codex-marvel-next" title="Next">
            <span class="material-icons chevron_right" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    `;

    wireMarvelScroller(section);
    loadMarvelItems(section);
    return section;
  };

  const createWizardingHomeSection = () => {
    ensureMarvelStyles();

    const section = document.createElement("section");
    section.id = WIZARDING_SECTION_ID;
    section.className = "verticalSection codex-collection-home-section codex-wizarding-home-section";
    section.setAttribute("data-codex-managed", "true");

    section.innerHTML = `
      <div class="sectionTitleContainer sectionTitleContainer-cards padded-left">
        <a class="sectionTitleButton sectionTitleTextButton" href="#/details?id=${WIZARDING_COLLECTION_ID}">
          <h2 class="sectionTitle sectionTitle-cards">WIZARDING WORLD</h2>
        </a>
      </div>
      <div class="emby-scroller scrollX hiddenScrollX codex-marvel-scroller">
        <div class="scrollSlider">
          <div class="itemsContainer scrollSliderItems codex-marvel-items">
            <div class="codex-marvel-loading">Loading Wizarding World...</div>
          </div>
        </div>
        <div class="emby-scrollbuttons">
          <button type="button" class="paper-icon-button-light btnPreviousPage emby-scrollbuttons-button codex-marvel-scroll-button codex-marvel-prev" title="Previous">
            <span class="material-icons chevron_left" aria-hidden="true"></span>
          </button>
          <button type="button" class="paper-icon-button-light btnNextPage emby-scrollbuttons-button codex-marvel-scroll-button codex-marvel-next" title="Next">
            <span class="material-icons chevron_right" aria-hidden="true"></span>
          </button>
        </div>
      </div>
    `;

    wireMarvelScroller(section);
    loadWizardingItems(section);
    return section;
  };

  const getHomeSectionHost = (sections) => {
    for (const entry of sections.values()) {
      if (entry.parent) return entry.parent;
    }

    return (
      document.querySelector(".homePage .sections") ||
      document.querySelector(".homePage .verticalSections") ||
      document.querySelector(".homePage") ||
      document.querySelector(".page.homePage") ||
      document.querySelector("[data-role='page']")
    );
  };

  const ensureMarvelHomeSection = (sections = findSections()) => {
    if (!isMarvelHomeTarget()) {
      document.getElementById(MARVEL_SECTION_ID)?.remove();
      document.getElementById(WIZARDING_SECTION_ID)?.remove();
      return;
    }

    const host = getHomeSectionHost(sections);
    if (!host) return;

    const marvelSection = document.getElementById(MARVEL_SECTION_ID) || createMarvelHomeSection();
    const wizardingSection = document.getElementById(WIZARDING_SECTION_ID) || createWizardingHomeSection();

    if (marvelSection.parentElement !== host || wizardingSection.parentElement !== host || host.lastElementChild !== wizardingSection) {
      host.append(marvelSection, wizardingSection);
    } else if (wizardingSection.previousElementSibling !== marvelSection) {
      host.insertBefore(wizardingSection, marvelSection.nextSibling);
    }

    wireMarvelScroller(marvelSection);
    wireMarvelScroller(wizardingSection);
    loadMarvelItems(marvelSection);
    loadWizardingItems(wizardingSection);
  };

  const hydrateLazyImage = (node) => {
    const src = node?.getAttribute?.("data-src");
    if (!src) return false;

    const tag = node.tagName?.toLowerCase();

    if (tag === "img" || tag === "source") {
      if (node.getAttribute("src") !== src) {
        node.setAttribute("src", src);
      }
    } else {
      const wanted = cssUrl(src);
      if (node.style.backgroundImage !== wanted) {
        node.style.backgroundImage = wanted;
      }

      node.style.backgroundPosition = node.style.backgroundPosition || "50% 50%";
      node.style.backgroundRepeat = node.style.backgroundRepeat || "no-repeat";
      node.style.backgroundSize = node.style.backgroundSize || "cover";
    }

    node.classList?.remove("lazy");
    node.classList?.add("lazyloaded");
    node.setAttribute("data-codex-image-hydrated", "true");
    return true;
  };

  const hydrateHomeImages = () => {
    if (!isHomePage()) return;

    const nodes = document.querySelectorAll(
      ".homePage .cardImageContainer[data-src], .homePage .cardContent[data-src], .homePage .cardImage[data-src], .homePage img[data-src], .homePage source[data-src]"
    );

    for (const node of nodes) {
      hydrateLazyImage(node);
    }
  };

  const getSectionIconKind = (text) => {
    if (/^marvel$/i.test(text)) return "marvel";
    if (/wizarding world/i.test(text)) return "movie";
    if (/my media|libraries/i.test(text)) return "media";
    if (CONTINUE_RE.test(text)) return "continue";
    if (NEXT_UP_RE.test(text)) return "nextup";
    if (RECENT_RE.test(text)) return "recent";
    if (/favorite/i.test(text)) return "favorite";
    if (/movie/i.test(text)) return "movie";
    if (/show|episode|series/i.test(text)) return "show";
    if (/music|album|song/i.test(text)) return "music";
    return "default";
  };

  const decorateHomeSectionIcons = () => {
    if (!isHomePage()) return;

    const headings = [
      ...document.querySelectorAll(
        ".homePage .sectionTitle, .homePage .sectionTitleButton, .homePage h2, .homePage h3, .homeTabContent .sectionTitle, .homeTabContent .sectionTitleButton, .homeTabContent h2, .homeTabContent h3"
      )
    ];

    for (const heading of headings) {
      const text = cleanText(heading);
      if (!text) continue;

      const kind = getSectionIconKind(text);
      const title = heading.matches?.(".sectionTitle, h2, h3")
        ? heading
        : heading.querySelector?.(".sectionTitle, h2, h3") || heading;

      title.setAttribute("data-codex-section-kind", kind);

      const section = sectionForHeading(heading);
      if (section) {
        section.setAttribute("data-codex-section-kind", kind);
      }
    }
  };

  const findSections = () => {
    const candidates = [
      ...document.querySelectorAll(
        ".sectionTitle, .sectionTitleButton, h2, h3, [class*='sectionTitle'], [class*='SectionTitle']"
      )
    ];

    const sections = new Map();

    for (const heading of candidates) {
      const text = cleanText(heading);
      if (!text) continue;

      let type = null;
      if (NEXT_UP_RE.test(text)) type = "nextup";
      else if (CONTINUE_RE.test(text)) type = "continue";
      else if (RECENT_RE.test(text)) type = "recent";

      if (!type) continue;

      const section = sectionForHeading(heading);
      if (!section?.parentElement) continue;
      section.setAttribute("data-codex-section-kind", type);
      heading.setAttribute("data-codex-section-kind", type);
      sections.set(type, { section, parent: section.parentElement, text });
    }

    return sections;
  };

  let applyingOrder = false;

  const reorderHome = () => {
    if (!isHomePage()) return;
    if (applyingOrder) return;

    const sections = findSections();
    const recent = sections.get("recent");
    const watching = sections.get("continue");
    const nextUp = sections.get("nextup");
    decorateHomeSectionIcons();

    applyingOrder = true;
    try {
      if (recent?.parent) {
        if (watching?.parent === recent.parent && watching.section !== recent.section) {
          recent.parent.insertBefore(watching.section, recent.section);
        }

        if (nextUp?.parent === recent.parent && nextUp.section !== recent.section) {
          recent.parent.insertBefore(nextUp.section, recent.section);
        }
      }

      ensureMarvelHomeSection(sections);
    } finally {
      applyingOrder = false;
    }

    ensureCalendarColorStyles();
    ensureDrawerColorStyles();
    ensureSpotlightActionStyles();
    ensureCustomTabPanes();
    hydrateHomeImages();
  };

  let queued = false;
  const queueReorder = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      ensureCalendarColorStyles();
      ensureDrawerColorStyles();
      ensureSpotlightActionStyles();
      markRemoteMusicPlayerPage();
      reorderHome();
      ensureCustomTabPanes();
      hydrateHomeImages();
    });
  };

  let hydrateQueued = false;
  const queueHydrate = () => {
    if (hydrateQueued) return;
    hydrateQueued = true;
    window.requestAnimationFrame(() => {
      hydrateQueued = false;
      hydrateHomeImages();
    });
  };

  const observer = new MutationObserver(queueReorder);

  const start = () => {
    applyTheme(getThemeName());
    ensureColorSwitcher();
    ensureCalendarColorStyles();
    ensureDrawerColorStyles();
    ensureSpotlightActionStyles();
    markRemoteMusicPlayerPage();
    ensureCustomTabPanes();
    queueReorder();
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("hashchange", queueReorder, { passive: true });
    window.addEventListener("pageshow", queueReorder, { passive: true });
    window.addEventListener("focus", queueHydrate, { passive: true });
    document.addEventListener("scroll", queueHydrate, { capture: true, passive: true });
    document.addEventListener("visibilitychange", queueHydrate, { passive: true });
    window.setInterval(ensureColorSwitcher, 1500);
    window.setInterval(queueHydrate, 2500);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
