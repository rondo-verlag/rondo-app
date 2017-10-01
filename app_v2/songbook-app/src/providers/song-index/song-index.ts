import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SongIndexProvider {

    private data: ISong[] = null;

    constructor(public http: Http) {
    }

    public loadIndex(): Promise<ISong[]> {
        if (this.data) {
            // already loaded data
            return Promise.resolve(this.data);
        }

        return new Promise(resolve => {
            this.http.get('assets/songdata/songs/song-index.json')
                .map(res => res.json())
                .subscribe(data => {
                    this.data = data;
                    resolve(this.data);
                });
        });
    }

    public loadSong(id: string): Promise<ISong> {
        return new Promise(resolve => {
            this.loadIndex().then((index) => {
                // find song entry by id
                index.some((song) => {
                    if (song.alternative == false && song.id == id) {
                        resolve(song);
                        return true;
                    }
                    return false;
                });
            })
        })
    }

}
