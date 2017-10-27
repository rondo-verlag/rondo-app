import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {SonglistPage} from '../pages/songlist/songlist';
import {AppStateProvider} from "../providers/app-state/app-state";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = SonglistPage;

    constructor(platform: Platform,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                appState: AppStateProvider
) {
        platform.ready().then(() => {
            // TODO: init app version

            if (platform.is('cordova')) {
                statusBar.styleDefault();
                splashScreen.hide();

                // load settings from storage
                appState.initState();
            }
        });
    }
}

