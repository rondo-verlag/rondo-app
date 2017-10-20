import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {SonglistPage} from '../pages/songlist/songlist';
import {PurchaseProvider} from "../providers/purchase/purchase";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = SonglistPage;

    constructor(platform: Platform,
                statusBar: StatusBar,
                splashScreen: SplashScreen,
                purchaseProvider: PurchaseProvider
) {
        platform.ready().then(() => {
            // TODO: init app version

            if (platform.is('cordova')) {
                statusBar.styleDefault();
                splashScreen.hide();

                // restore purchases
                purchaseProvider.hasBought();
            }
        });
    }
}

