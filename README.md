# Spookyfin

[![Jellyfin custom CSS](https://img.shields.io/badge/Jellyfin-custom%20CSS-00e5ff?style=for-the-badge)](https://jellyfin.org/)
[![Android inspired](https://img.shields.io/badge/Android-inspired-101b20?style=for-the-badge)](https://m3.material.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-a9f7ff?style=for-the-badge)](LICENSE)

![Spookyfin home spotlight preview](docs/screenshots/home-spotlight-preview.png)

Spookyfin is a rounded Android/Material You inspired theme for Jellyfin Web. It keeps Jellyfin fast and readable while adding softer surfaces, pill controls, floating progress bars, a scalloped header, Material-style dialogs, and an optional header color switcher.

It is built for people searching for:

`jellyfin theme`, `jellyfin custom css`, `material you jellyfin`, `android jellyfin theme`, `jellyfin dark theme`, `jellyfin library images`, `spooky jellyfin theme`, `media server theme`

## Highlights

- Android-style dark surfaces with cyan as the default accent.
- Optional header palette button with Blue, Purple, and Pink color modes.
- Accent-linked card hover footers, row arrows, badges, and progress bars.
- Floating rounded Continue Watching progress bars.
- Centered card hover play buttons and Material FAB-style play actions.
- Softer rounded dialogs, menus, action sheets, settings lists, and form surfaces.
- Static scalloped top bar that follows the selected accent background.
- Home page image blanking repair for lazy-loaded Jellyfin card art.
- Included spooky-cute library artwork for common media libraries, including 3D Movies.
- Jellyfin Enhanced-friendly styling for custom tabs, calendar views, watchlist pages, and the remote/music player.
- Ambient now-playing mini-player for music sessions, with album art, progress, and play/pause.
- Matching polish for TV season/episode cards, calendar release dashboards, and detail page heroes.
- Subtle page transitions for a smoother Android-style feel.

## Quick Setup Walkthrough

1. Install the CSS from [`theme.css`](theme.css) in Jellyfin's `Dashboard` -> `General` -> `Custom CSS code`.
2. Hard refresh Jellyfin with `Ctrl+F5`.
3. Add [`spookyfin-helper.js`](spookyfin-helper.js) to Jellyfin Web if you want the accent button, custom home rows, image repair, and custom tab cleanup.
4. Upload the matching images from [`assets/library-images`](assets/library-images) to your Jellyfin libraries.
5. Optional: install [Jellyfin Enhanced](https://github.com/n00bcodr/Jellyfin-Enhanced), then enable only the tabs and pages you use.
6. Restart Jellyfin after plugin or helper changes, then hard refresh again.

More detailed steps are in [docs/INSTALL.md](docs/INSTALL.md).

## Install

### CSS theme

1. Open Jellyfin.
2. Go to `Dashboard` -> `General`.
3. Find `Custom CSS code`.
4. Paste the contents of [`theme.css`](theme.css).
5. Save, then hard refresh your browser with `Ctrl+F5`.

Optional CDN install:

```css
@import url("https://cdn.jsdelivr.net/gh/endoflineservice/spookyfin@main/theme.css");
```

### Optional helper script

[`spookyfin-helper.js`](spookyfin-helper.js) powers the header color button, home row ordering, and image rehydration behavior. Jellyfin's Custom CSS box cannot run JavaScript, so the helper must be loaded as a web client script.

The usual Docker/custom-image approach is:

```powershell
docker cp .\spookyfin-helper.js jellyfin:/jellyfin/jellyfin-web/spookyfin-helper.js
```

Then add this before Jellyfin's app bundle scripts in `/jellyfin/jellyfin-web/index.html`:

```html
<script defer="defer" src="spookyfin-helper.js?spookyfin=20260616"></script>
```

More details are in [docs/INSTALL.md](docs/INSTALL.md).

## Screenshots

![Home spotlight preview](docs/screenshots/home-spotlight-preview.png)

![Home row preview](docs/screenshots/home-preview.png)

![Library art preview](docs/screenshots/library-art-preview.png)

![Jellyfin Enhanced preview](docs/screenshots/enhanced-plugin-preview.png)

![Music player preview](docs/screenshots/music-player-preview.png)

## Jellyfin Enhanced Recommendations

Spookyfin works well with [Jellyfin Enhanced](https://github.com/n00bcodr/Jellyfin-Enhanced), but keep the plugin setup focused so the UI stays clean.

Recommended companion plugins from the Jellyfin Enhanced project:

- `File Transformation`: recommended for safer web-file modifications.
- `Custom Tabs`: use this for top navigation entries such as `Watchlist` and `Calendar`.
- `Plugin Pages`: useful when Enhanced pages need to appear as real Jellyfin pages.
- `Kefin Tweaks`: optional, mostly useful if you want the extra watchlist tooling.

Suggested Enhanced settings:

- Enable `Bookmarks`, `Custom Pause Screen`, and `Tab-switch actions`.
- Add `Watchlist` and `Calendar` as custom tabs if you use them.
- Connect Radarr/Sonarr in the `*arr` section before expecting the calendar to show useful release data.
- Leave extra theme/CSS features off unless you specifically need them; Spookyfin should own the global colors and surfaces.
- Use media tags and badges lightly. Spookyfin styles them, but too many badges can crowd rows.

See [docs/enhanced-plugin.md](docs/enhanced-plugin.md) for the setup notes.

## Included Library Images

The full-size PNGs are in [`assets/library-images`](assets/library-images).

| Library | Image |
| --- | --- |
| Collections | <img src="assets/library-images/collections.png" alt="Collections library art" width="220"> |
| 3D Movies | <img src="assets/library-images/3d-movies.png" alt="3D Movies library art" width="220"> |
| Movies | <img src="assets/library-images/movies.png" alt="Movies library art" width="220"> |
| TV Shows | <img src="assets/library-images/tv-shows.png" alt="TV Shows library art" width="220"> |
| Music | <img src="assets/library-images/music.png" alt="Music library art" width="220"> |
| Anime | <img src="assets/library-images/anime.png" alt="Anime library art" width="220"> |
| Cartoons | <img src="assets/library-images/cartoons.png" alt="Cartoons library art" width="220"> |
| Audio Books | <img src="assets/library-images/audio-books.png" alt="Audio Books library art" width="220"> |
| ASMR | <img src="assets/library-images/asmr.png" alt="ASMR library art" width="220"> |
| Kids | <img src="assets/library-images/kids.png" alt="Kids library art" width="220"> |
| Photos | <img src="assets/library-images/photos.png" alt="Photos library art" width="220"> |
| Music Videos | <img src="assets/library-images/music-videos.png" alt="Music Videos library art" width="220"> |
| Playlists | <img src="assets/library-images/playlists.png" alt="Playlists library art" width="220"> |
| X Library | <img src="assets/library-images/x-library.png" alt="Extra X library art" width="220"> |

## Customize

Blue is the default accent. If you use the helper script, the header palette button can switch between Blue, Purple, and Pink per browser.

For CSS-only installs, recolor the first `:root` block in [`theme.css`](theme.css):

```css
:root {
  --my-primary: #00e5ff;
  --my-primary-2: #a9f7ff;
  --my-primary-container: #006b80;
}
```

## Notes

- The core theme is Jellyfin custom CSS, not a server plugin.
- The color switcher and image rehydration behavior require the optional helper script.
- Tested against Jellyfin 10.11.x Web UI.
- Always keep a copy of your old custom CSS before replacing it.
- If the UI looks stale after installing, hard refresh with `Ctrl+F5` or clear Jellyfin web cache.

## License

MIT for the CSS, helper script, docs, and bundled artwork in this repository. See [LICENSE](LICENSE).
