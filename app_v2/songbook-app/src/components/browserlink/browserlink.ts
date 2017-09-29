import {Component, Input} from '@angular/core';
import { Platform} from "ionic-angular";

function getWindow(): Window {
  return window;
}

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
        getWindow().open(this.url, '_system');
    });
  }

}
