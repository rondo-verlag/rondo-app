import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {InAppPurchase} from "@ionic-native/in-app-purchase";
import {AppStateProvider} from "../app-state/app-state";

@Injectable()
export class PurchaseProvider {

    //readonly productId = 'android.test.purchased';
    readonly productId = 'ch.rondo.songbookapp.fullversion';

    constructor(
        private inAppPurchase: InAppPurchase,
        public appState: AppStateProvider
    ) {}

    public buy() {
        return new Promise((resolve, reject) => {
            this.inAppPurchase
                .getProducts([this.productId])
                .then((products) => {
                    console.log('RONDO PRODUCTS:', products);
                    this.inAppPurchase
                        .buy(this.productId)
                        /*.then((data) => {
                            // ...then mark it as consumed:
                            //return this.inAppPurchase.consume(data.productType, data.receipt, data.signature).;
                        })*/
                        .then(() => {
                            console.log('RONDO product was successfully purchased!');
                            this.appState.setHasBought(true);
                            resolve();
                        })
                        .catch((err) => {
                            console.log(JSON.stringify(err));
                            reject(err);
                        });
                }).catch((err) => {
                    console.log(JSON.stringify(err));
                    reject(err);
                })
        })
    }

    public hasBought(): Promise<boolean> {
        return new Promise((resolve) => {
            this.inAppPurchase
            .restorePurchases()
            .then((data) => {
                console.log('RONDO restore purchases:', data);
                // check if there are any purchases with state == 0
                if (data.length > 0 && data.some((val) => { return val.state == 0})) {
                    this.appState.setHasBought(true);
                } else {
                    this.appState.setHasBought(false);
                }
                resolve();
            })
            .catch((err) => {
                console.log(JSON.stringify(err));
                //this.appState.setHasBought(false);
                resolve();
            });
        });
    }
}
