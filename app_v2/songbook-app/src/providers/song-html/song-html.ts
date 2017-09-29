import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SongHtmlProvider {

  private data = [];

  constructor(public http: Http) {}

  public load(id: string) {
    // TODO: fix load from cache
    /*if (this.data[id]) {
      // already loaded data
      return Promise.resolve(this.data);
    }*/

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular HTTP provider to request the data,
      // then on the response, it'll map the JSON data to a parsed JS object.
      // Next, we process the data and resolve the promise with the new data.
      this.http.get('/assets/songdata/songs/html/' + id + '.html')
        .map(res => res.text())
        .subscribe(data => {
          // we've got back the raw data, now generate the core schedule data
          // and save the data for later reference
          //this.data[id] = data;
          resolve(data);
        });
    });
  }

}
