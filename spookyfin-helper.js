(() => {
  "use strict";

  const CONTINUE_RE = /continue watching/i;
  const NEXT_UP_RE = /next up/i;
  const RECENT_RE = /recently added|latest/i;
  const THEME_KEY = "codex-jellyfin-theme-color";
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

  const cleanText = (node) => (node?.textContent || "").replace(/\s+/g, " ").trim();

  const getThemeName = () => {
    const stored = window.localStorage?.getItem(THEME_KEY);
    return THEMES[stored] ? stored : "blue";
  };

  const setRootVar = (name, value) => {
    document.documentElement.style.setProperty(name, value);
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
    } finally {
      applyingOrder = false;
    }

    hydrateHomeImages();
  };

  let queued = false;
  const queueReorder = () => {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(() => {
      queued = false;
      reorderHome();
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
