import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SongHtmlProvider {

    //private data = [];

    constructor(public http: Http) {
    }

    public load(id: string) {
        // TODO: fix load from cache
        /*if (this.data[id]) {
          // already loaded data
          return Promise.resolve(this.data);
        }*/

        return new Promise(resolve => {
            this.http.get('assets/songdata/songs/html/' + id + '.html')
                .map(res => res.text())
                .subscribe(data => {
                    //this.data[id] = data;
                    resolve(data);
                });
        });
    }

}
