songbook-app
============

## Workspace setup
1. Install iOS SDK, Android SDK and [Ionic](http://ionicframework.com/getting-started/)
2. Initialize project platforms and plugins

```bash
$ mkdir plugins
$ ionic platform android
$ ionic platform ios
$ ionic plugin add com.ionic.keyboard
$ ionic plugin add cordova-plugin-console
$ ionic plugin add org.apache.cordova.file
$ cordova plugin add cordova-plugin-device
$ ionic add ionic-platform-web-client
$ cordova plugin add https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin.
$ cordova prepare
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

Building Android APK:

    ionic build android

Building App SCSS:

    sass --no-cache --update www/css/style.scss:www/css/style.css

Building Ionic SCSS (e.g. apply dark theme):

    scss --no-cache --update www/lib/ionic/scss/ionic.scss:www/lib/ionic/css/ionic.css

Compile iOS App for Test Flight:

    XCode > Product > Archive and then upload the App
    Manage Apps on https://itunesconnect.apple.com
