import 'cordova-plugin-purchase'
import 'cordova-plugin-purchase/www/store'
import { Capacitor } from "@capacitor/core";

const PRODUCT_ID = 'ch.rondo.songbookapp.fullversion';

class InAppPurchaseService {
  private store: CdvPurchase.Store

  constructor() {
    document.addEventListener('deviceready', this.initializeStore, false);
  }

  private initializeStore = () => {
    if (Capacitor.isNativePlatform()) {
      this.store = CdvPurchase.store;
      this.store.verbosity = CdvPurchase.LogLevel.DEBUG;

      this.store = CdvPurchase.store;
      this.store.verbosity = CdvPurchase.LogLevel.DEBUG;

      this.store.error((err: unknown) => {
        console.error('Store Error ' + JSON.stringify(err));
      });

      this.registerProducts();
      this.registerListeners();
      this.setupVerification();

      this.store.initialize().then(() => {
        this.store.update().then(() => {
          this.store.restorePurchases();
        });
      });
    }
  }

  private registerProducts() {
    this.store.register({
      id: PRODUCT_ID,
      type: CdvPurchase.ProductType.NON_CONSUMABLE,
      platform: CdvPurchase.Platform.GOOGLE_PLAY
    });
  }

  private registerListeners() {
    this.store.when().approved((transaction) => {
      transaction.verify();
    })
  }

  private setupVerification() {
    this.store.when().verified((receipt) => {
      if (receipt.id == PRODUCT_ID) {
        //give users coins or do something
      }
      receipt.finish();
    })
  }

  public buy() {
    const offer = this.store.get(PRODUCT_ID)?.getOffer();
    if (offer) {
      this.store.order(offer).then(() => {
        //Purchase in progress
      }, (e: unknown) => {
        //Purchase error
        console.error("Error on Buy " + e)
      });
    }
  }
}

const inAppPurchaseService = new InAppPurchaseService();
export default inAppPurchaseService;
