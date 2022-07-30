import {IAPProduct, InAppPurchase2} from '@awesome-cordova-plugins/in-app-purchase-2';
import AppState from "@/AppState";

const PRODUCT_ID = 'ch.rondo.songbookapp.fullversion';

export class PurchaseManager {

    private static initialized = false;

    public static initialize() {
        if (!this.initialized) {
            this.initialized = true;

            // register products
            InAppPurchase2.register({
                id: PRODUCT_ID,
                type: InAppPurchase2.NON_CONSUMABLE,
            });

            // setup listeners
            InAppPurchase2.when(PRODUCT_ID).updated(this.productUpdated);
            InAppPurchase2.when(PRODUCT_ID).loaded(this.productUpdated);
            InAppPurchase2.when(PRODUCT_ID).owned(this.productUpdated);
            InAppPurchase2.when(PRODUCT_ID).finished(this.productUpdated);
            // Handle the product deliverable
            InAppPurchase2.when(PRODUCT_ID).approved((product: IAPProduct) => {
                console.log('Approved' + JSON.stringify(product));
                AppState.setHasBought(true);
                product.finish();
            })
        }
        InAppPurchase2.refresh();
    }

    private static async productUpdated(product: IAPProduct) {
        if (product.owned) {
            AppState.setHasBought(true);
        }
    }

    public static async buy() {
            let product = InAppPurchase2.get(PRODUCT_ID)
            if (product.owned) {
                AppState.setHasBought(true);
            } else {
                InAppPurchase2.order(PRODUCT_ID);
            }
    }

    public static restore(): boolean {
        InAppPurchase2.refresh();
        let product = InAppPurchase2.get(PRODUCT_ID)
        console.log('Restore' + JSON.stringify(product));
        if (product.owned) {
            AppState.setHasBought(true);
            return true;
        } else {
            return false
        }
    }
}
