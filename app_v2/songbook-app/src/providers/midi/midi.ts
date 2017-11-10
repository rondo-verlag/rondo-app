
import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

function getWindow(): RondoWindow {
    return window;
}

interface RondoWindow extends Window {
    MidiPlayer?: any;
}

@Injectable()
export class MidiProvider {


    private _playingSong: BehaviorSubject<boolean> = new BehaviorSubject(false);

    //public playingSong: boolean = false;

    private songInitialized: boolean = false;
    private songInitializeTriesLeft: number = 20;

    constructor() {

    }

    get playingSong(): Observable<boolean> {
        return this._playingSong.asObservable();
    }

    // MIDI
    // ------------------------

    // Ugly hack:
    // songInitialized is needed for iOS, because it fails to play sometimes for unknown reason.
    // if that happens, we just try to play again...
    public playSong(id) {
        // Abort if clicked in browser
        if (!getWindow().MidiPlayer) {
            return;
        }
        if (!this.songInitialized || !this._playingSong.getValue()) {
            getWindow().MidiPlayer.setup(
                getWindow().MidiPlayer.getPathFromAsset("assets/songdata/songs/midi/" + id + ".mid"),
                ["1", "2", "3", "4", "5"],
                () => {
                    //console.log('RONDO: Song initialized...');
                    //$scope.$apply(() => {
                    this._playingSong.next(true);
                    //});
                    getWindow().MidiPlayer.play();
                },
                (data) => {
                    console.log("RONDO: Error occured:", data);
                    this._playingSong.next(false);
                },
                (data) => {
                    //console.log("RONDO: Status Updates: ", data);
                    if (data == 2) {
                        // 2: started playing
                        this.songInitialized = true;
                    }
                    if (data == 3) {
                        // 3: stopped playing
                        this.stopSong();
                    }
                    if (data <= 0) {
                        // 0: something went wrong
                        if (!this.songInitialized) {
                            // try again if we are not yet initialized
                            if (this.songInitializeTriesLeft > 0) {
                                this.songInitializeTriesLeft--;
                                this.playSong(id);
                            }
                        } else {
                            // song stopped manually
                            this.songInitialized = false;
                            this.songInitializeTriesLeft = 20;
                            if (this._playingSong.getValue()) {
                                // song stopped because its at the end (ios only)
                                //$scope.$apply(() => {
                                this.stopSong();
                                //});
                            }
                        }
                    }
                }
            );
        }
    };

    public stopSong() {
        this._playingSong.next(false);
        if (getWindow().MidiPlayer) {
            getWindow().MidiPlayer.stop();
            getWindow().MidiPlayer.release();
        }
    };

    public toggleSong(id) {
        if (this._playingSong.getValue()) {
            this.stopSong();
        } else {
            this.playSong(id);
        }
    };

}
