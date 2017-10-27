import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class AppVersionProvider {

    public getAppVersion() {
        return '2.0.3'
    }

}
