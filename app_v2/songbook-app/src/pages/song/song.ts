import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import {AppVersionProvider} from "../../providers/app-version/app-version";
import {Insomnia} from "@ionic-native/insomnia";
import {NativeAudio} from "@ionic-native/native-audio";
import {SongIndexProvider} from "../../providers/song-index/song-index";
import {AppStateProvider} from "../../providers/app-state/app-state";

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

    @ViewChild(Slides) slides: Slides;

    // tslint:disable-next-line
    private section: string = 'text';

    private song: ISong;
    private pageNumbers: string = '';

    private scroll = false;
    private scrollTimer = null;
    private scrollElement: Element = null;
    private lastScrollPosition: number = -1;
    private autoScrollInQueue: boolean = false;
    private sameLastScrollPositionCounter: number = 0;

    private playingSong: boolean = false;
    private songInitialized: boolean = false;
    private songInitializeTriesLeft: number = 20;

    private playingChordId: string = '';

    private readonly NUM_PAGES = 5;
    private readonly MIDDLE_PAGE = 2;
    private pages: number[] = [0,0,0,0,0];
    private allPages: number[] = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public appState: AppStateProvider,
                public songIndexProvider: SongIndexProvider,
                public appVersionProvider: AppVersionProvider,
                private insomnia: Insomnia,
                private nativeAudio: NativeAudio
    ) {
        this.song = this.navParams.data.song;
        // load song info because maybe an alternative was clicked
        this.loadSongInfo(this.song.id);
        this.generatePageNumbersHtml();
        this.loadPages();
        // set visible slide id until other data is loaded
        this.pages[this.MIDDLE_PAGE] = this.song.id;
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

    // Slides
    // ------------------------

    public loadPages() {
        if (this.allPages.length == 0) {
            this.songIndexProvider.loadSlides(this.appState.getHasBought()).then((ids: number[]) => {
                this.allPages = ids;
                this.initialVisiblePages()
            });
        } else {
            this.initialVisiblePages()
        }
    }

    public initialVisiblePages() {
        let index = this.allPages.indexOf(this.song.id);
        for (let i = 0; i < this.NUM_PAGES; i++) {
            let allPagesIndex = index + (i - this.MIDDLE_PAGE);
            // wrap around in the beginning
            if (allPagesIndex < 0) {
                allPagesIndex = this.allPages.length + allPagesIndex;
            }
            // wrap around in the end
            if (allPagesIndex > this.allPages.length - 1) {
                allPagesIndex = allPagesIndex - this.allPages.length;
            }
            this.pages[i] = this.allPages[allPagesIndex];
        }
    }

    public pushPage() {
        let index = this.allPages.indexOf(this.pages[this.NUM_PAGES - 1]);
        if (this.allPages[index + 1] === undefined) {
            this.pages.push(this.allPages[0]);
        } else {
            this.pages.push(this.allPages[index + 1]);
        }
        this.pages.shift();
    }

    public popPage() {
        let index = this.allPages.indexOf(this.pages[0]);
        if (index == 0) {
            this.pages.unshift(this.allPages[this.allPages.length - 1]);
        } else {
            this.pages.unshift(this.allPages[index - 1]);
        }
        this.pages.pop();
    }

    public loadSongInfo(id: number) {
        if (id > 0 && this.song.id != id) {
            this.songIndexProvider.loadSong(id).then((song) => {
                this.song = song;
                this.generatePageNumbersHtml();
            })
        }
    }

    public slideChanged() {
        let index = this.slides.getActiveIndex();
        //console.log('slideChanged', index);
        if (index > this.MIDDLE_PAGE) {
            this.pushPage();
            this.slides.slidePrev(0);
        }
        if (index < this.MIDDLE_PAGE) {
            this.popPage();
            this.slides.slideNext(0);
        }
        //console.log('current: ', this.slides.getActiveIndex());
        if (this.slides.getActiveIndex() !== this.MIDDLE_PAGE) {
            //console.log('readjust');
            this.slideChanged();
        } else {
            this.loadSongInfo(this.pages[this.MIDDLE_PAGE]);
        }
        //console.log(this.pages);
        this.stopAutoScroll();
    }

    // Scrolling
    // ------------------------


    private scrollUp() {
        this.exitFullscreen();
    }

    private scrollDown() {
        this.enterFullscreen();
    }

    private getScrollPosition() {
        if (this.scrollElement) {
            return this.scrollElement.scrollTop;
        } else {
            return 0;
        }
    }

    private scrollBy(y: number) {
        if (this.scrollElement) {
            this.scrollElement.scrollTop = this.getScrollPosition() + y;
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
        this.enterFullscreen();
        this.scroll = true;
        this.sameLastScrollPositionCounter = 10;
        this.scrollElement = document.querySelector('#rondo_scrollable .swiper-slide-active .slide-zoom');
        this.scrollTimer = setInterval(() => {
            if (this.sameLastScrollPositionCounter <= 0) {
                this.stopAutoScroll();
            } else {
                if (this.lastScrollPosition == this.getScrollPosition()) {
                    this.sameLastScrollPositionCounter--;
                } else {
                    this.sameLastScrollPositionCounter = 10;
                }
                this.lastScrollPosition = this.getScrollPosition();
                this.autoScrollInQueue = true;
                this.scrollBy(1);
            }
        }, this.getScrollTimeout());
    };

    public stopAutoScroll() {
        this.insomnia.allowSleepAgain();
        this.scroll = false;
        clearInterval(this.scrollTimer);
        this.lastScrollPosition = -1;
        this.exitFullscreen();
    };

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
