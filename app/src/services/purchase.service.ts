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
        console.error('Store Error ' + JSON.stringify(err));
      });

      this.registerProducts();
      this.registerListeners();
      this.setupVerification();

      this.store.initialize()
        .then(() => this.store.update())
        .then(() => this.restore())
        .catch(err => console.error('Store Initialization Error', err))
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
    // Try restoring first
    this.restore()

    if (AppState.hasBought !== true) {
      const offer = this.store.get(PRODUCT_ID)?.getOffer();
      if (offer) {
        this.store.order(offer).then(() => {
          console.log('Offer' + offer)
        }, (e: unknown) => {
          //Purchase error
          console.error("Error on Buy " + JSON.stringify(e))
        });
      }
    }
  }

  public restore() {
    this.restorePurchasesIOS();
    this.restorePurchases();
  }


  private restorePurchasesIOS() {
    this.store.restorePurchases()
      .catch(err => console.error('Error restoring purchases', err))
  }

  public isBought(): boolean {
    if (Capacitor.isNativePlatform() && this.store) {
      return this.store.owned(PRODUCT_ID);
    }
    return false;
  }

  private restorePurchases() {
    let owned = this.isBought();
    console.log('Premium already buyed' + owned)
    if (owned) {
      AppState.setHasBought(true);
    }
  }
}

const PurchaseService = new purchaseService();
export default PurchaseService;
