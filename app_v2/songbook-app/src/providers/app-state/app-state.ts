import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {NativeStorage} from "@ionic-native/native-storage";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class AppStateProvider {

    private _hasBought: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(public storage: NativeStorage) {
        this.initState();
    }

    public initState() {
        this.storage.getItem('hasBought')
            .then(
                (data) => {
                    this._hasBought.next(data)
                },
                (error) => {
                    // if item not set yet, set initial value
                    console.log('hasBought was not set', JSON.stringify(error));
                    this.storage.setItem('hasBought', false).then(
                        () => {
                            this._hasBought.next(false);
                        }
                    )
                });
    }

    get hasBought(): Observable<boolean> {
        return this._hasBought.asObservable();
    }

    public getHasBought(): boolean {
        return this._hasBought.getValue();
    }

    public setHasBought(value: boolean) {
        this._hasBought.next(value);
        this.storage.setItem('hasBought', value);
    }

}
