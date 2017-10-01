import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

/*
  Generated class for the AppVersionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppVersionProvider {

  public getAppVersion() {
    return '2.0.1'
  }

}
