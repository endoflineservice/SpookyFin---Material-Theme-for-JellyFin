(() => {
  "use strict";

  const CONTINUE_RE = /continue watching/i;
  const NEXT_UP_RE = /next up/i;
  const RECENT_RE = /recently added|latest/i;
  const THEME_KEY = "codex-jellyfin-theme-color";
  const MARVEL_COLLECTION_ID = "f7855f569b4a8751e9329d441ecfbabc";
  const MARVEL_SECTION_ID = "codex-marvel-home-section";
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

  const ensureMarvelStyles = () => {
    if (document.getElementById("codex-marvel-home-styles")) return;

    const style = document.createElement("style");
    style.id = "codex-marvel-home-styles";
    style.textContent = `
      #${MARVEL_SECTION_ID} {
        margin: .85em 0 1.25em !important;
      }

      #${MARVEL_SECTION_ID} .sectionTitleContainer {
        margin-bottom: .35rem !important;
      }

      #${MARVEL_SECTION_ID} .sectionTitleButton,
      #${MARVEL_SECTION_ID} .sectionTitleButton:hover,
      #${MARVEL_SECTION_ID} .sectionTitleButton:focus-visible {
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        color: var(--my-primary-2, #a9f7ff) !important;
        min-height: 0 !important;
        padding: 0 !important;
        text-decoration: none !important;
      }

      #${MARVEL_SECTION_ID} .sectionTitle {
        color: var(--my-primary-2, #a9f7ff) !important;
        text-decoration: none !important;
      }

      #${MARVEL_SECTION_ID} .codex-marvel-scroller {
        overflow-x: auto !important;
        overflow-y: visible !important;
        position: static !important;
        scroll-behavior: smooth;
      }

      #${MARVEL_SECTION_ID} .codex-marvel-items {
        display: flex;
        gap: .95rem;
        min-height: 21.5rem;
        padding-bottom: 1.15rem;
        padding-top: .1rem;
      }

      #${MARVEL_SECTION_ID} .codex-marvel-card {
        flex: 0 0 auto;
        max-width: none !important;
        text-decoration: none !important;
        width: clamp(11.2rem, 14.5vw, 13.2rem);
      }

      #${MARVEL_SECTION_ID} .codex-marvel-card .cardText-first {
        color: var(--my-primary, #00e5ff) !important;
      }

      #${MARVEL_SECTION_ID} .codex-marvel-card .cardText-secondary {
        color: var(--my-text, #d5f3f7) !important;
      }

      #${MARVEL_SECTION_ID} .codex-marvel-card .cardBox,
      #${MARVEL_SECTION_ID} .codex-marvel-card .visualCardBox {
        margin: 0 !important;
        max-width: none !important;
        min-width: 100% !important;
        width: 100% !important;
      }

      #${MARVEL_SECTION_ID} .codex-marvel-card .cardScalable {
        aspect-ratio: 2 / 3 !important;
        display: block !important;
        height: auto !important;
        max-width: none !important;
        min-width: 100% !important;
        overflow: hidden !important;
        position: relative !important;
        width: 100% !important;
      }

      #${MARVEL_SECTION_ID} .codex-marvel-card .cardPadder {
        display: block !important;
        height: 0 !important;
        padding-bottom: 150% !important;
        width: 100% !important;
      }

      #${MARVEL_SECTION_ID} .codex-marvel-card .cardContent {
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

      #${MARVEL_SECTION_ID} .codex-marvel-card .cardImageContainer {
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

      #${MARVEL_SECTION_ID} .codex-marvel-loading {
        color: var(--my-primary-2, #a9f7ff);
        font-weight: 800;
        padding: 1rem 0;
      }

      #${MARVEL_SECTION_ID} .codex-marvel-scroll-button {
        pointer-events: auto !important;
      }

      @media (max-width: 47.99em) {
        #${MARVEL_SECTION_ID} {
          margin-top: 1.7em !important;
        }

        #${MARVEL_SECTION_ID} .codex-marvel-card {
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

  const createMarvelHomeSection = () => {
    ensureMarvelStyles();

    const section = document.createElement("section");
    section.id = MARVEL_SECTION_ID;
    section.className = "verticalSection codex-marvel-home-section";
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
      return;
    }

    const host = getHomeSectionHost(sections);
    if (!host) return;

    const section = document.getElementById(MARVEL_SECTION_ID) || createMarvelHomeSection();
    if (section.parentElement !== host || host.lastElementChild !== section) {
      host.appendChild(section);
    }

    wireMarvelScroller(section);
    loadMarvelItems(section);
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
