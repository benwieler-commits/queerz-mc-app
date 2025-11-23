const fs = require('fs');
const path = require('path');

// Create www directory
const wwwDir = path.join(__dirname, 'www');
if (!fs.existsSync(wwwDir)) {
  fs.mkdirSync(wwwDir);
}

// Helper function to copy file
function copyFile(src, dest) {
  try {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${src}`);
  } catch (err) {
    console.error(`✗ Failed to copy ${src}:`, err.message);
  }
}

// Helper function to copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`⚠ Directory not found: ${src} (skipping)`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

console.log('Building QUEERZ! MC App for Capacitor...\n');

// Copy essential files
console.log('Copying core files...');
copyFile('index.html', path.join(wwwDir, 'index.html'));
copyFile('app.js', path.join(wwwDir, 'app.js'));
copyFile('styles.css', path.join(wwwDir, 'styles.css'));
copyFile('manifest.json', path.join(wwwDir, 'manifest.json'));
copyFile('service-worker.js', path.join(wwwDir, 'service-worker.js'));
copyFile('firebase-config.js', path.join(wwwDir, 'firebase-config.js'));
copyFile('firebase-broadcast.js', path.join(wwwDir, 'firebase-broadcast.js'));
copyFile('campaign-manager-mc.js', path.join(wwwDir, 'campaign-manager-mc.js'));

console.log('\nCopying directories...');
// Copy directories
copyDir('icons', path.join(wwwDir, 'icons'));
copyDir('campaigns', path.join(wwwDir, 'campaigns'));
copyDir('images', path.join(wwwDir, 'images'));
copyDir('music', path.join(wwwDir, 'music'));

console.log('\n✅ Build complete! Files copied to www/');
