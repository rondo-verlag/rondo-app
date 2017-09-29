import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {AppVersionProvider} from "../../providers/app-version/app-version";

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

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public appVersionProvider: AppVersionProvider
  ) {}

  get app_version() {
    return this.appVersionProvider.getAppVersion();
  }

}
