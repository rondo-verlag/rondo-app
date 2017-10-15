import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class SongIndexProvider {

    private data: ISongindex = null;

    constructor(public http: Http) {
    }

    public loadIndex(): Promise<ISong[]> {
        if (this.data) {
            // already loaded data
            return Promise.resolve(this.data.list);
        }
        return new Promise(resolve => {
            this._loadIndex().then(() => {
                resolve(this.data.list);
            })
        });
    }

    public loadSlides(paid: boolean): Promise<number[]> {
        if (this.data) {
            // already loaded data
            if (paid) {
                return Promise.resolve(this.data.slidesPaid);
            } else {
                return Promise.resolve(this.data.slidesFree);
            }
        }
        return new Promise(resolve => {
            this._loadIndex().then(() => {
                if (paid) {
                    resolve(this.data.slidesPaid);
                } else {
                    resolve(this.data.slidesFree);
                }
            })
        });
    }

    private _loadIndex(): Promise<ISongindex> {
        return new Promise(resolve => {
            this.http.get('assets/songdata/songs/song-index.json')
                .map(res => res.json())
                .subscribe(data => {
                    this.data = data;
                    resolve(this.data);
                });
        });
    }

    public loadSong(id: number): Promise<ISong> {
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
