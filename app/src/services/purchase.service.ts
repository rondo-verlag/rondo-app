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
      this.store.verbosity = CdvPurchase.LogLevel.INFO;

      this.store.error((err: unknown) => {
        AppState.addPurchaseLog('Store Error: ' + JSON.stringify(err));
      });

      this.registerProducts();
      this.registerListeners();
      this.setupVerification();

      this.store.initialize()
        .then(() => {
          AppState.addPurchaseLog('Store Initialized');
          return this.store.update();
        })
        .then(() => {
          AppState.addPurchaseLog('Store Updated');
          return this.restore();
        })
        .catch(err => {
          AppState.addPurchaseLog('Store Initialization Error: ' + JSON.stringify(err));
        })
    } else {
      console.warn('Not running on native platform')
      return;
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
      AppState.addPurchaseLog('Transaction Approved: ' + transaction.productID);
      transaction.verify();
    })
  }

  private setupVerification() {
    this.store.when().verified((receipt) => {
      AppState.addPurchaseLog('Receipt Verified: ' + receipt.id);
      if (receipt.id == PRODUCT_ID) {
        AppState.setHasBought(true)
      }
      receipt.finish();
    })
  }

  public buy() {
    // Try restoring first
    this.restore()

    if (AppState.hasBought !== true) {
      const product = this.store.get(PRODUCT_ID);
      const offer = product?.getOffer();
      if (offer) {
        AppState.addPurchaseLog('Ordering Product: ' + PRODUCT_ID);
        this.store.order(offer).then(() => {
          AppState.addPurchaseLog('Order placed: ' + PRODUCT_ID);
        }, (e: unknown) => {
          //Purchase error
          AppState.addPurchaseLog("Error on Buy: " + JSON.stringify(e));
        });
      } else {
        AppState.addPurchaseLog('No offer found for: ' + PRODUCT_ID);
      }
    }
  }

  public restore() {
    this.restorePurchasesIOS();
    this.restorePurchases();
  }


  private restorePurchasesIOS() {
    AppState.addPurchaseLog('Restoring purchases (iOS)...');
    this.store.restorePurchases()
      .catch(err => AppState.addPurchaseLog('Error restoring purchases: ' + JSON.stringify(err)))
  }

  public isBought(): boolean {
    if (Capacitor.isNativePlatform() && this.store) {
      return this.store.owned(PRODUCT_ID);
    }
    return false;
  }

  private restorePurchases() {
    let owned = this.isBought();
    AppState.addPurchaseLog('Premium already owned: ' + owned);
    if (owned) {
      AppState.setHasBought(true);
    }
  }
}

const PurchaseService = new purchaseService();
export default PurchaseService;
