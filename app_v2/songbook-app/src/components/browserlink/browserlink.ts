import {Component, Input} from '@angular/core';
import { Platform} from "ionic-angular";

var cordova: any;

/**
 * Generated class for the BrowserlinkComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'browserlink',
  templateUrl: 'browserlink.html'
})
export class BrowserlinkComponent {

  @Input() url: string;

  constructor(private platform: Platform) {}

  public launchBrowser() {
    this.platform.ready().then(() => {
        cordova.InAppBrowser.open(this.url, "_system", "location=true");
    });
  }

}
