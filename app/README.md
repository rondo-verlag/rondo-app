songbook-app
============

## Workspace setup
Install Node.JS with NPM, iOS SDK and Android SDK.

Install Ionic and Cordova globally:
```bash
npm install -g ionic
npm install -g cordova
```

Install JavaScript Libraries:
```bash
npm install
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

Building App SCSS:

    sass --no-cache --update www/css/style.scss:www/css/style.css

Building Ionic SCSS (e.g. apply dark theme):

    scss --no-cache --update www/lib/ionic/scss/ionic.scss:www/lib/ionic/css/ionic.css


Building Android APK:

    ionic cordova build android

Release Android Version:

    cordova build --release android
    jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keystore/android-release-key.keystore /Users/demian/projects/demianh/songbook-app/app/platforms/android/build/outputs/apk/android-release-unsigned.apk rondoapp
    rm build/Rondo.apk && ~/Library/Android/sdk/build-tools/23.0.2/zipalign -v 4 /Users/demian/projects/demianh/songbook-app/app/platforms/android/build/outputs/apk/android-release-unsigned.apk build/Rondo.apk
    

Compile iOS App for Test Flight:

    ionic cordova build ios
    Then open Project in XCode (/platforms/ios/Rondo.xcodeproj)
    XCode > Product > Archive and then upload the App
    Manage Apps on https://itunesconnect.apple.com
