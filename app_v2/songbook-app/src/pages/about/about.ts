import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {AppVersionProvider} from "../../providers/app-version/app-version";
import {PurchaseProvider} from "../../providers/purchase/purchase";
import {AppStateProvider} from "../../providers/app-state/app-state";


/**
 * Generated class for the AboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-about',
    templateUrl: 'about.html',
})
export class AboutPage {

    private hasBought: boolean = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public appVersionProvider: AppVersionProvider,
                public purchaseProvider: PurchaseProvider,
                public loadingCtrl: LoadingController,
                public appState: AppStateProvider
    ) {
        this.hasBought = this.appState.getHasBought();
        this.appState.hasBought.subscribe((val) => {
            this.hasBought = val;
        })
    }

    get app_version() {
        return this.appVersionProvider.getAppVersion();
    }

    public buyFullversion() {
        const loading = this.loadingCtrl.create({
            content: 'Vollversion kaufen'
        });
        loading.present();

        this.purchaseProvider.buy()
            .then(() => {
                loading.dismiss();
                console.log('product was bought');
            })
            .catch((err) => {
                loading.dismiss();
                console.log(err);
            });

    }

    public toggleHasBought() {
        this.appState.setHasBought(!this.hasBought);
    }

}
