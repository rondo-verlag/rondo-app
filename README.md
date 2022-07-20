# Rondo App

The sourcecode for the Rondo app, created with Ionic and Vue.

## Workspace setup

Requirements: 

 * Node.JS (v12+) with NPM
 * iOS SDK
 * Android SDK
 * Songdata Files (not available on github)

Change to app source folder:
```bash
cd app
```

Install Ionic globally:
```bash
npm install -g @ionic/cli
```

Install JavaScript Libraries:
```bash
npm install
```

Now you can run the app in your browser:
```bash
ionic serve
```

For iOS we need to install cocoapods and its dependencies:
```bash
ionic cap sync
```

For Android we need to install Android Studio and the Java JDK.


## Useful commands

Run in iOS Simulator:

    ionic capacitor run ios

XCode must be installed and started once for this to work.

## Release

Change Version:

 - app/package.json:3
 - app/android/app/build.gradle:9
 - app/ios/App/App.xcodeproj/project.pbxproj:349 (4 places to change)

### Build

Building Android APK:

    ionic capacitor build android
    Android Studio opens. Build > Generate Signed Bundle / APK
    Find the .aab here: app/android/app/release/app-release.aab
    Upload to https://play.google.com/console

Compile iOS App for Test Flight:

    ionic capacitor build ios
    Then open Project in XCode (/platforms/ios/Rondo.xcodeproj)
    XCode > Product > Archive and then upload the App
    Manage Apps on https://appstoreconnect.apple.com/
