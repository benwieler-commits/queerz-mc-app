# QUEERZ! MC Companion - Progressive Web App (PWA)

## 🎉 Mobile App Features

This app is now a **Progressive Web App (PWA)**, which means you can install it on your mobile device and use it like a native app!

### What's New?

✅ **Install to Home Screen** - Add the app to your phone/tablet's home screen
✅ **Offline Support** - Access campaign data even without internet
✅ **Fast Loading** - Cached resources for instant startup
✅ **Mobile & Tablet Optimized** - Responsive design for all screen sizes
✅ **App-Like Experience** - Full-screen mode, no browser UI
✅ **Background Sync** - Campaign changes sync when you're back online

---

## 📱 How to Install on Mobile

### iOS (iPhone/iPad)

1. Open Safari and navigate to your app URL
2. Tap the **Share** button (square with arrow pointing up)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"** in the top right corner
5. The app icon will appear on your home screen!

**Perfect for iPad MCs!** The MC app works great on tablets in landscape mode.

### Android (Chrome/Tablet)

1. Open Chrome and navigate to your app URL
2. Tap the **Menu** (three dots) in the top right
3. Select **"Add to Home Screen"** or **"Install App"**
4. Tap **"Add"** or **"Install"**
5. The app icon will appear on your home screen!

---

## 🔧 Technical Details

### PWA Components

- **`manifest.json`** - App metadata, icons, and configuration
- **`service-worker.js`** - Handles caching and offline functionality
- **`icons/`** - App icons in multiple sizes (72x72 to 512x512)

### Caching Strategy

The app uses a **Cache-First** strategy:
- Core app files (HTML, CSS, JS) are cached on first visit
- Campaign manager and scripts cached locally
- Firebase connections always use network
- Media files (music, images) stream from network (not cached due to size)

### Offline Capabilities

**Works Offline:**
- View campaign progress and checkpoints
- Access MC moves reference
- View player tags and statuses
- Use encounter counters
- Access cached campaign scripts

**Requires Online:**
- Firebase sync with players
- Broadcasting to players
- Streaming music and images
- Loading new campaign data from GitHub

---

## 🎨 Customizing Icons

The app comes with placeholder icons. To create custom icons:

### Option 1: Use the SVG Template
1. Open `icons/icon-template.svg` in a vector editor (Illustrator, Figma, Inkscape)
2. Customize the design (current template uses 🎲 emoji)
3. Export as PNG in sizes: 72, 96, 128, 144, 152, 192, 384, 512 pixels
4. Replace the generated icons

### Option 2: Run the Icon Generator (with Pillow)
```bash
cd icons
pip install Pillow
python3 generate_icons.py
```

### Option 3: Use Online Tools
- [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- [Favicon.io](https://favicon.io/)
- Upload your custom icon and download all sizes

---

## 🧪 Testing PWA Features

### Test Installation
1. Deploy the app to a web server (HTTPS required!)
2. Open Chrome DevTools → Application → Manifest
3. Check for errors
4. Use "Add to Home Screen" to test installation

### Test Service Worker
1. Open Chrome DevTools → Application → Service Workers
2. Check that the worker is registered and running
3. Enable "Offline" mode to test offline functionality

### Test Caching
1. Load the app once
2. Disconnect from internet
3. Reload the page - core functionality should still work!
4. Campaign data should be accessible

### Lighthouse Audit
1. Open Chrome DevTools → Lighthouse
2. Run a PWA audit
3. Aim for 100% PWA score!

---

## 🚀 Deployment Tips

### Requirements for PWA
- ✅ **HTTPS** - PWAs require secure connections (except localhost)
- ✅ **Valid manifest.json** - Must be linked in HTML
- ✅ **Service worker** - Must be registered
- ✅ **Icons** - At least 192x192 and 512x512 sizes

### Recommended Hosting
- **GitHub Pages** - Free HTTPS hosting (current setup)
- **Netlify** - Auto-deploy from Git
- **Vercel** - Fast edge network
- **Firebase Hosting** - Integrated with Firebase services

### Deployment Checklist
- [ ] Update `start_url` in manifest.json if needed
- [ ] Ensure all icon paths are correct
- [ ] Test on real mobile/tablet devices
- [ ] Verify HTTPS is working
- [ ] Check service worker registration
- [ ] Test with actual campaigns loaded

---

## 📊 Browser Support

| Browser | Installation | Offline | Push Notifications |
|---------|-------------|---------|-------------------|
| Chrome (Android) | ✅ | ✅ | ✅ |
| Safari (iOS 16.4+) | ✅ | ✅ | ⚠️ Limited |
| Samsung Internet | ✅ | ✅ | ✅ |
| Firefox (Android) | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |

**Best Experience:** Chrome on Android tablets or Safari on iPad

---

## 🎭 MC-Specific Features

### Shortcuts
The PWA includes app shortcuts for quick access:
- **Broadcast Panel** - Jump straight to player broadcasting
- **Campaign Manager** - Access campaign settings quickly

### Orientation Support
- **Portrait & Landscape** - Works in any orientation
- **Tablet Optimized** - Large screen layout for easier MC controls

### Future MC Features
- [ ] Push notifications when players roll dice
- [ ] Background sync for campaign autosave
- [ ] Web Share API to share session notes
- [ ] Multi-window support for reference panels

---

## 🐛 Troubleshooting

### "Add to Home Screen" not appearing?
- Ensure you're using HTTPS (or localhost)
- Check manifest.json is valid
- Verify service worker is registered
- Try on a different browser

### App not working offline?
- Check service worker in DevTools
- Clear cache and reload
- Verify caching strategy in service-worker.js
- Campaign scripts require initial online load

### Icons not showing?
- Run the icon generation script
- Check file paths in manifest.json
- Clear browser cache

### Broadcasting not working?
- Firebase requires internet connection
- Check Firebase configuration
- Service worker doesn't cache Firebase requests
- Verify players are connected

### Music not playing offline?
- Music files are streamed, not cached
- Requires active internet connection
- Caching music would require too much storage

---

## 🔄 Future Enhancements

Potential PWA features to add:
- [ ] Push notifications for player actions
- [ ] Background sync for campaign autosave
- [ ] Web Share API for sharing campaign exports
- [ ] File System API for local campaign storage
- [ ] Media Session API for music controls
- [ ] Screen Wake Lock for long sessions

---

## 📚 Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Workbox (Service Worker Library)](https://developers.google.com/web/tools/workbox)

---

## 💡 Pro Tips for MCs

1. **Install on a Tablet** - iPads and Android tablets provide the best MC experience
2. **Keep Online During Sessions** - Broadcasting and music require internet
3. **Cache Campaigns Before Sessions** - Load your campaign once while online
4. **Use Landscape Mode** - Better layout for campaign management
5. **Bookmark in Browser** - Alternative to installation for quick access

---

**Enjoy running your QUEERZ! campaigns as a mobile MC! 🎲✨**
