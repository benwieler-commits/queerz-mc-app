# QUEERZ! MC App - Android APK Setup

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Android Studio** with Android SDK
3. **Java Development Kit (JDK)** 11 or higher

## Setup Steps

### 1. Install Dependencies

In the project directory, run:

```bash
npm install
```

This will install Capacitor and required dependencies.

### 2. Build the Web App

```bash
npm run build
```

This copies all necessary files to the `www/` directory.

### 3. Add Android Platform

```bash
npx cap add android
```

This creates the Android project in the `android/` directory.

### 4. Sync Files

Whenever you make changes to your web files, run:

```bash
npm run sync
```

This rebuilds and syncs changes to the Android project.

### 5. Open in Android Studio

```bash
npm run android
```

Or manually:

```bash
npx cap open android
```

### 6. Build APK in Android Studio

1. Android Studio will open
2. Wait for Gradle sync to complete
3. Go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
4. The APK will be in `android/app/build/outputs/apk/debug/`

## Quick Commands

- **Build web files:** `npm run build`
- **Sync to Android:** `npm run sync`
- **Open Android Studio:** `npm run android`

## Troubleshooting

### "webDir" Error

If you see an error about webDir, make sure you run `npm run build` first to create the `www/` directory.

### Missing Gradle or SDK

Make sure Android Studio is installed with:
- Android SDK
- Android SDK Platform
- Android Virtual Device (for testing)

Set the `ANDROID_HOME` environment variable to your Android SDK path.

### Port Already in Use

If you get a port conflict, change the port in `capacitor.config.json`:

```json
"server": {
  "androidScheme": "https",
  "url": "http://localhost:8100"
}
```

## Firebase Configuration

Before building, make sure your `firebase-config.js` has valid credentials for production use.

## Testing

1. Use Android Studio emulator, or
2. Connect a physical Android device via USB
3. Enable USB debugging on the device
4. Run the app from Android Studio

## Distribution

To create a signed APK for distribution:

1. In Android Studio: **Build** → **Generate Signed Bundle / APK**
2. Follow the wizard to create or use a keystore
3. Select **Release** build type
4. The signed APK will be ready for distribution
