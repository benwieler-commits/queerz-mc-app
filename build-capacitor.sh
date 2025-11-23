#!/bin/bash

# Create www directory if it doesn't exist
mkdir -p www

# Copy all necessary files
cp index.html www/
cp app.js www/
cp styles.css www/
cp manifest.json www/
cp service-worker.js www/
cp -r icons www/
cp firebase-config.js www/
cp firebase-broadcast.js www/
cp campaign-manager-mc.js www/

# Copy campaigns folder if it exists
if [ -d "campaigns" ]; then
  cp -r campaigns www/
fi

# Copy images folder if it exists
if [ -d "images" ]; then
  cp -r images www/
fi

# Copy music folder if it exists
if [ -d "music" ]; then
  cp -r music www/
fi

echo "Build complete! Files copied to www/"
