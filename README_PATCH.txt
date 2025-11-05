
This package preserves your original MC App layout and JS.
Added surgically:
- Broadcast button next to "+ Add Player"
- Firebase config in firebase-config.js
- firebase-broadcast.js (ES module) for connection + broadcast without changing your app.js
- Minimal CSS for status indicator + test button appended in styles.css

Integration:
- index.html includes firebase-config.js and firebase-broadcast.js as modules (keeps your existing <script src="app.js">)
- Broadcast reads current selection and currently displayed image and audio
- Relative paths are converted to raw GitHub URLs under benwieler-commits/queerz-mc-app/main
