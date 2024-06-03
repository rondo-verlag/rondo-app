import 'cordova-plugin-purchase'
import 'cordova-plugin-purchase/www/store'
import { Capacitor } from "@capacitor/core";
import AppState from "@/AppState";

const PRODUCT_ID = 'ch.rondo.songbookapp.fullversion';

class purchaseService {
  private store: CdvPurchase.Store

  constructor() {
    document.addEventListener('deviceready', this.initializeStore, false);
  }

  private initializeStore = () => {
    if (Capacitor.isNativePlatform()) {
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
    this.store.register([
      {
        id: PRODUCT_ID,
        type: CdvPurchase.ProductType.NON_CONSUMABLE,
        platform: CdvPurchase.Platform.GOOGLE_PLAY
      },
      {
        id: PRODUCT_ID,
        type: CdvPurchase.ProductType.NON_CONSUMABLE,
        platform: CdvPurchase.Platform.APPLE_APPSTORE
      }
    ]);
  }

  private registerListeners() {
    this.store.when().approved((transaction) => {
      transaction.verify();
    })
  }

  private setupVerification() {
    this.store.when().verified((receipt) => {
      if (receipt.id == PRODUCT_ID) {
        AppState.setHasBought(true)
      }
      receipt.finish();
    })
  }

  public buy() {
    const offer = this.store.get(PRODUCT_ID)?.getOffer();
    if (offer) {
      this.store.order(offer).then(() => {
        console.log(offer)
      }, (e: unknown) => {
        //Purchase error
        console.error("Error on Buy " + e)
      });
    }
  }

  public restore() {
    this.store.restorePurchases().then(() => {
      AppState.setHasBought(true)
    })
  }
}

const PurchaseService = new purchaseService();
export default PurchaseService;
