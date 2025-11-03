# QUEERZ! MC Companion — Deployment Package

This package is prepared for static hosting (GitHub Pages / Netlify / Cloudflare Pages).  
It replaces Google Drive links with local relative paths (placeholders). You should add your real media files into the `images/` and `music/` folders before deploying.

## Included structure
```
queerz_deploy_package/
├─ index.html
├─ scripts/
│  └─ app.js
├─ styles.css (if present)
├─ images/
│  ├─ characters/
│  │  └─ <character>.png   (place your character images here)
│  └─ locations/
│     └─ <location>.jpg
└─ music/
   ├─ locations/
   ├─ boss-battles/
   └─ emotional-themes/
```

## What I changed
- Replaced Google Drive image/audio links inside `app.js` and `index.html` with **relative paths**:
  - Character images → `images/characters/<key>.png`
  - Location images → `images/locations/<key>.jpg`
  - Music tracks → `music/<folder>/<sanitized-option-text>.mp3`
- The JS file was moved to `scripts/app.js` in this package. `index.html` references should already match the relative paths; verify script src if needed.

## Before deployment: add your real media files
1. Put all character portraits into `images/characters/` (filenames must match the keys used, e.g. `mama-jay.png`).
2. Put location images into `images/locations/` (e.g. `cafe-greenwich.jpg`).
3. Place your `.mp3` files into the corresponding `music/` subfolders. Use the option text as a filename (sanitized) or update `index.html` accordingly.

## Step-by-step: Deploy to GitHub Pages (beginner-friendly)
1. Create a free GitHub account (https://github.com) if you don't have one.
2. Create a new repository (e.g., `queerz-mc-app`).
3. Upload the contents of this package to the repository root:
   - You can either:
     - Use Git + command line (recommended long-term), or
     - Click "Add file" → "Upload files" in the GitHub web UI and upload the package files and folders.
4. In repo **Settings → Pages**:
   - Under "Build and deployment", choose "Deploy from a branch".
   - Select the branch `main` and the folder `/ (root)`.
   - Save. GitHub will build and publish your site under:
     `https://yourusername.github.io/queerz-mc-app/`
5. Test the site URL and verify images/audio stream. Update asset filenames as needed.

## Alternative: Netlify (fast drag-and-drop)
1. Go to https://app.netlify.com/drop
2. Drag the entire deploy package folder onto the page.
3. Netlify will publish a temporary domain like `https://random-name.netlify.app`.
4. Use this URL to test in Discord and share.

## Alternative: Cloudflare Pages (production-grade)
1. Push this folder into a GitHub repo.
2. Connect the repo to Cloudflare Pages.
3. Cloudflare will build and publish with auto-deploy on each push.

## Using jsDelivr CDN for audio hosting (optional)
If you want to serve large audio files via CDN:
1. Host audio files in a GitHub repo (in `music/`).
2. Use jsDelivr URLs:
   `https://cdn.jsdelivr.net/gh/<username>/<repo>@main/music/locations/<file>.mp3`
3. Replace the option `value` in `index.html` with the jsDelivr URL for improved global caching.

## Local testing via simple HTTP server
Instead of opening `index.html` via `file://`, run a local server:
- Python 3:
  ```
  python -m http.server 5500
  ```
  Visit `http://localhost:5500/index.html`
- Or from VS Code, install the Live Server extension and press "Go Live".

## Notes on Discord embedding
- Discord’s browser view will fetch the page over HTTPS. Ensure the hosting URL is HTTPS (GitHub Pages, Netlify, Cloudflare Pages are HTTPS by default).
- CORS: because assets are served from the same origin, CORS will not block images/audio.

If you'd like, I can add small placeholder PNG/MP3 files so the app displays media out-of-the-box. Tell me which you prefer.
