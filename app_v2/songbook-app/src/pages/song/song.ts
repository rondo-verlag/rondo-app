import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {SongHtmlProvider} from "../../providers/song-html/song-html";
import {AppVersionProvider} from "../../providers/app-version/app-version";
import {Insomnia} from "@ionic-native/insomnia";
import {NativeAudio} from "@ionic-native/native-audio";
import {SongIndexProvider} from "../../providers/song-index/song-index";

/**
 * Generated class for the SongPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

function getWindow(): RondoWindow {
    return window;
}

interface RondoWindow extends Window {
    MidiPlayer?: any;
}

@IonicPage()
@Component({
    selector: 'page-song',
    templateUrl: 'song.html',
})
export class SongPage {

    private section: string = 'text';

    private song: ISong;
    private songtext: string = '';
    private pageNumbers: string = '';

    private scroll = false;
    private scrollTimer = null;
    private lastScrollPosition: number = -1;

    private playingSong: boolean = false;
    private songInitialized: boolean = false;
    private songInitializeTriesLeft: number = 20;

    private playingChordId: string = '';

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public songHtmlProvider: SongHtmlProvider,
                public songIndexProvider: SongIndexProvider,
                public appVersionProvider: AppVersionProvider,
                private insomnia: Insomnia,
                private nativeAudio: NativeAudio
    ) {
        this.song = this.navParams.data.song;
        this.loadSongtext();
        // load song info because maybe an alternative was clicked
        this.loadSongInfo(this.song.id);
        this.generatePageNumbersHtml();
    }

    public loadSongtext() {
        this.songHtmlProvider.load(this.song.id)
            .then((data: any) => {
                this.songtext = data;
            });
    }

    public loadSongInfo(id: string) {
        this.songIndexProvider.loadSong(id).then((song) => {
            this.song = song;
        })
    }

    ionViewDidLoad() {
        this.exitFullscreen();
    }

    ionViewDidLeave() {
        this.stopAutoScroll();
        this.stopSong();
        this.exitFullscreen();
    }

    public generatePageNumbersHtml() {
        let pages = [];
        if (this.song.pageRondo2017) {
            pages.push('<span class="rondo-orange">' + this.song.pageRondo2017 + '</span>');
        }
        if (this.song.pageRondoGreen) {
            pages.push('<span class="rondo-green">' + this.song.pageRondoGreen + '</span>');
        }
        if (this.song.pageRondoBlue) {
            pages.push('<span class="rondo-blue">' + this.song.pageRondoBlue + '</span>');
        }
        if (this.song.pageRondoRed) {
            pages.push('<span class="rondo-red">' + this.song.pageRondoRed + '</span>');
        }
        this.pageNumbers = pages.join('&nbsp;|&nbsp;')
    }

    public toggleChords() {
        document.body.classList.toggle('rondo-show-chords');
    };

    get app_version() {
        return this.appVersionProvider.getAppVersion();
    }


    // Scrolling
    // ------------------------

    private getScrollPosition() {
        let element = document.querySelector('#rondo_scrollable > .scroll-content');
        if (element) {
            return document.querySelector('#rondo_scrollable > .scroll-content').scrollTop;
        } else {
            return 0;
        }
    }

    private scrollBy(y: number) {
        let element = document.querySelector('#rondo_scrollable > .scroll-content');
        if (element) {
            document.querySelector('#rondo_scrollable > .scroll-content').scrollTop = this.getScrollPosition() + y;
        }
    }

    public getScrollTimeout() {
        if (document.body.classList.contains('rondo-show-chords')) {
            return 40
        } else {
            return 80;
        }
    };

    public startAutoScroll() {
        this.insomnia.keepAwake();
        this.scroll = true;
        this.scrollTimer = setInterval(() => {
            if (this.lastScrollPosition == this.getScrollPosition()) {
                this.stopAutoScroll();
            } else {
                this.lastScrollPosition = this.getScrollPosition();
                this.scrollBy(1);
            }
        }, this.getScrollTimeout());
    };

    public stopAutoScroll() {
        this.insomnia.allowSleepAgain();
        this.scroll = false;
        clearInterval(this.scrollTimer);
        this.lastScrollPosition = -1;
    };

    public onScroll(event: any) {
        if (event.directionY == 'up') {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }

    public exitFullscreen() {
        document.body.classList.remove('rondo-fullscreen');
    };

    public enterFullscreen() {
        document.body.classList.add('rondo-fullscreen');
    };

    // MIDI
    // ------------------------

    // Ugly hack:
    // songInitialized is needed for iOS, because it fails to play sometimes for unknown reason.
    // if that happens, we just try to play again...
    public playSong() {
        // Abort if clicked in browser
        if (!getWindow().MidiPlayer) {
            return;
        }
        if (!this.songInitialized || !this.playingSong) {
            getWindow().MidiPlayer.setup(
                getWindow().MidiPlayer.getPathFromAsset("assets/songdata/songs/midi/" + this.song.id + ".mid"),
                ["1", "2", "3", "4", "5"],
                () => {
                    //console.log('RONDO: Song initialized...');
                    //$scope.$apply(() => {
                    this.playingSong = true;
                    //});
                    getWindow().MidiPlayer.play();
                },
                (data) => {
                    console.log("RONDO: Error occured:", data);
                    this.playingSong = false;
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
                        // 0: someting went wrong
                        if (!this.songInitialized) {
                            // try again if we are not yet initialized
                            if (this.songInitializeTriesLeft > 0) {
                                this.songInitializeTriesLeft--;
                                this.playSong();
                            }
                        } else {
                            // song stopped manually
                            this.songInitialized = false;
                            this.songInitializeTriesLeft = 20;
                            if (this.playingSong) {
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
        this.playingSong = false;
        if (getWindow().MidiPlayer) {
            getWindow().MidiPlayer.stop();
            getWindow().MidiPlayer.release();
        }
    };

    public toggleSong() {
        if (this.playingSong) {
            this.stopSong();
        } else {
            this.playSong();
        }
    };

    // Chords Playback
    // ------------------------

    public playChord(chord: string) {
        try {
            let stopId = this.playingChordId;
            if (stopId) {
                this.nativeAudio.stop(stopId).then(
                    () => {
                        this.nativeAudio.unload(stopId);
                    },
                    () => {
                    }
                );
            }
        } catch (e) {
            console.log(e);
        }

        let uniqueId = 'rondo_chord_' + chord;
        this.nativeAudio.preloadComplex(uniqueId, 'assets/songdata/mp3-chords/' + chord + '.mp3', 1, 1, 0).then(
            () => {
                this.playingChordId = uniqueId;
                this.nativeAudio.play(uniqueId, () => {
                    this.nativeAudio.unload(uniqueId);
                }).then(
                    () => {
                    },
                    (e) => {
                        console.log('play error', uniqueId, e);
                    }
                );
            },
            () => {
                console.log('preload error', uniqueId);
            }
        );
    }

}
