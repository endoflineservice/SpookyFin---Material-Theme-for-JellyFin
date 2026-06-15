# Spookyfin

[![Jellyfin custom CSS](https://img.shields.io/badge/Jellyfin-custom%20CSS-00e5ff?style=for-the-badge)](https://jellyfin.org/)
[![Android inspired](https://img.shields.io/badge/Android-inspired-101b20?style=for-the-badge)](https://m3.material.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-a9f7ff?style=for-the-badge)](LICENSE)

![Spookyfin home preview](docs/screenshots/home-preview.png)

Spookyfin is a rounded Android/Material You inspired theme for Jellyfin Web. It keeps Jellyfin fast and readable while adding softer surfaces, pill controls, floating progress bars, Material-style dialogs, and an optional header color switcher.

It is built for people searching for:

`jellyfin theme`, `jellyfin custom css`, `material you jellyfin`, `android jellyfin theme`, `jellyfin dark theme`, `jellyfin library images`, `spooky jellyfin theme`, `media server theme`

## Highlights

- Android-style dark surfaces with cyan as the default accent.
- Optional header palette button with Blue, Purple, and Pink color modes.
- Material-style card hover/focus state layers.
- Floating rounded Continue Watching progress bars.
- Centered card hover play buttons and Material FAB-style play actions.
- Softer rounded dialogs, menus, action sheets, and form surfaces.
- Home page image blanking repair for lazy-loaded Jellyfin card art.
- Included spooky-cute library artwork for common media libraries.

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
<script defer="defer" src="spookyfin-helper.js?spookyfin=20260615"></script>
```

More details are in [docs/INSTALL.md](docs/INSTALL.md).

## Screenshots

![Home preview](docs/screenshots/home-preview.png)

![Library art preview](docs/screenshots/library-art-preview.png)

## Included Library Images

The full-size PNGs are in [`assets/library-images`](assets/library-images).

| Library | Image |
| --- | --- |
| Collections | <img src="assets/library-images/collections.png" alt="Collections library art" width="220"> |
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
