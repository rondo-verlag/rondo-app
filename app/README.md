songbook-app
============

## Workspace setup

Requirements: Node.JS with NPM, iOS SDK and Android SDK.

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

Update Ionic:

    sudo npm install -g ionic
    ionic lib update
    
    sudo npm update -g ionic
    sudo npm update -g cordova

updates a project to use the latest version of cordova (3.4.0 to 3.4.1):

    cordova platform update [platform] 

Upload App to Ionic View:

    ionic upload

Building App TypeScript

    npm run build-js

Building App SCSS:

    sass --no-cache --update www/css/style.scss:www/css/style.css

Building Ionic SCSS (e.g. apply dark theme):

    scss --no-cache --update www/lib/ionic/scss/ionic.scss:www/lib/ionic/css/ionic.css

Building Android APK:

    ionic cordova build android

Generate Android Release Version:

    npm run android-release

Compile iOS App for Test Flight:

    ionic cordova build ios
    Then open Project in XCode (/platforms/ios/Rondo.xcodeproj)
    XCode > Product > Archive and then upload the App
    Manage Apps on https://itunesconnect.apple.com
