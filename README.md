# Rondo App

The sourcecode for the Rondo app, created with Ionic and Angular.

## Workspace setup

Requirements: Node.JS with NPM, iOS SDK and Android SDK.

Change to app source folder:
```bash
cd app
```

Install Ionic and Cordova globally:
```bash
npm install -g ionic
npm install -g cordova
```

Install JavaScript Libraries:
```bash
npm install
```

Now you can run the app in your browser:
```bash
ionic serve
```


## Useful commands

Run in iOS Simulator:

    ionic cordova emulate ios

Run in iOS Simulator (specific device):

    ionic cordova emulate ios --target="iPhone-6"

List available devices

    ionic cordova emulate ios --list

Update Ionic:

    npm install ionic-angular@latest --save

updates a project to use the latest version of cordova (3.4.0 to 3.4.1):

    cordova platform update [platform] 

Upload App to Ionic View:

    ionic upload

Building Android APK:

    ionic cordova build android

Generate Android Release Version:

    npm run android-release

Compile iOS App for Test Flight:

    ionic cordova build ios
    Then open Project in XCode (/platforms/ios/Rondo.xcodeproj)
    XCode > Product > Archive and then upload the App
    Manage Apps on https://itunesconnect.apple.com
