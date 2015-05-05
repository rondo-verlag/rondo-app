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
```

# Update
Update Ionic if needed:
```bash
npm install -g ionic
```

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
 
 
