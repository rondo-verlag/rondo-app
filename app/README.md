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
$ ionic plugin add org.apache.cordova.console
$ ionic plugin add org.apache.cordova.device
$ ionic plugin add org.apache.cordova.file
$ ionic add ionic-platform-web-client
$ cordova plugin add https://github.com/EddyVerbruggen/Insomnia-PhoneGap-Plugin.
$ cordova prepare
```

## Useful commands

Update Ionic:

    npm install -g ionic
    ionic lib update

Upload App to Ionic View:

    ionic upload

Building Android APK:

    ionic build android

Building App SCSS:

    sass --no-cache --update www/css/style.scss:www/css/style.css

Building Ionic SCSS (e.g. apply dark theme):

    scss --no-cache --update www/lib/ionic/scss/ionic.scss:www/lib/ionic/css/ionic.css


## Known Bugs
 * Search Bar weg wenn man zurück kommt vom Lied im Fullscreen Mode
 * Autoscroll funktioniert nicht
 * Statusbar ist auf iOS transparent

## TODO
 * Settings Screen?
 * Icons
 * App Icon
 * Splash Screen
 * Navigation Konzept
 * Verhalten Menü beim Scrollen
 * Geschwindigkeit einstellen (pro Song?)
 * Text Zoom
 * Songs:
    * Songs mit Textteilen ohne Akkorde
    * Rondo Seitenzahl
    * Bilder
    * Alle möglichen Akkorde auflisten
 * MIDI abspielen
 * Bezahlfunktion
 
 
