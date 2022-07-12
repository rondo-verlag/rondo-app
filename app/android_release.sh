#!/usr/bin/env bash

ionic build --release android
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore keystore/android-release-key.keystore /Users/demian/projects/songbook-app/app/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk rondoapp
rm build/Rondo.apk
~/Library/Android/sdk/build-tools/26.0.2/zipalign -v 4 /Users/demian/projects/songbook-app/app/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk build/Rondo.apk
