# Install Spookyfin

Spookyfin has two parts:

- `theme.css`: the Jellyfin Custom CSS theme.
- `spookyfin-helper.js`: an optional web client helper for the header color switcher, home row ordering, and lazy-image repair.

## Install the CSS theme

1. Open Jellyfin in a browser.
2. Go to `Dashboard` -> `General`.
3. Find `Custom CSS code`.
4. Paste the full contents of [`../theme.css`](../theme.css).
5. Save.
6. Hard refresh the browser with `Ctrl+F5`.

CDN option:

```css
@import url("https://cdn.jsdelivr.net/gh/endoflineservice/spookyfin@main/theme.css");
```

Raw GitHub option:

```css
@import url("https://raw.githubusercontent.com/endoflineservice/spookyfin/main/theme.css");
```

## Install the optional helper script

The helper script cannot be pasted into Jellyfin's Custom CSS field. It must be loaded by Jellyfin Web.

For Docker installs, copy the helper into the web directory:

```powershell
docker cp .\spookyfin-helper.js jellyfin:/jellyfin/jellyfin-web/spookyfin-helper.js
```

Back up and edit Jellyfin Web's `index.html`:

```powershell
docker exec jellyfin sh -lc "cp /jellyfin/jellyfin-web/index.html /jellyfin/jellyfin-web/index.html.spookyfin-backup"
```

Add this before Jellyfin's main app scripts:

```html
<script defer="defer" src="spookyfin-helper.js?spookyfin=20260616"></script>
```

Restart Jellyfin:

```powershell
docker restart jellyfin
```

If you rebuild or update the Jellyfin container, reapply the helper script or bake it into your custom image.

## What the helper adds

- A top-right palette button.
- Blue, Purple, and Pink theme modes.
- Per-browser persistence with `localStorage`.
- Continue Watching and Next Up home row ordering.
- Rehydration for Jellyfin card images that go blank after scrolling.

## Use the library images

1. Download or clone this repository.
2. Open Jellyfin.
3. Go to the library you want to customize.
4. Use `Edit Images`.
5. Upload a matching file from [`../assets/library-images`](../assets/library-images).

Suggested mapping:

| Jellyfin library | File |
| --- | --- |
| Collections | `assets/library-images/collections.png` |
| 3D Movies | `assets/library-images/3d-movies.png` |
| Movies | `assets/library-images/movies.png` |
| Shows | `assets/library-images/tv-shows.png` |
| Music | `assets/library-images/music.png` |
| Anime | `assets/library-images/anime.png` |
| Cartoons | `assets/library-images/cartoons.png` |
| Audio Books | `assets/library-images/audio-books.png` |
| ASMR | `assets/library-images/asmr.png` |
| Kids | `assets/library-images/kids.png` |
| Photos | `assets/library-images/photos.png` |
| Music Videos | `assets/library-images/music-videos.png` |
| Playlists | `assets/library-images/playlists.png` |

## Troubleshooting

- If the theme does not appear, hard refresh with `Ctrl+F5`.
- If the helper button does not appear, confirm `index.html` references `spookyfin-helper.js`.
- If the web app still looks old, clear the browser cache for the Jellyfin site.
- If you use a reverse proxy or aggressive caching, purge that cache after changing CSS or scripts.
- If something looks wrong, remove the Custom CSS field, save, then re-add the theme.
