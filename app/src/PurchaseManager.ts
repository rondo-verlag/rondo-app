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
            InAppPurchase2.when(PRODUCT_ID).updated( (product: IAPProduct) => {
                console.log('Updated' + JSON.stringify(product));
                if (product.owned) {
                    AppState.setHasBought(true);
                }
            });
            InAppPurchase2.when(PRODUCT_ID).loaded( (product: IAPProduct) => {
                console.log('Loaded' + JSON.stringify(product));
                if (product.owned) {
                    AppState.setHasBought(true);
                }
            });
            // Handle the product deliverable
            InAppPurchase2.when(PRODUCT_ID).approved((product: IAPProduct) => {
                console.log('Approved' + JSON.stringify(product));
                AppState.setHasBought(true);
                product.finish();
            })
        }
        InAppPurchase2.refresh();
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
