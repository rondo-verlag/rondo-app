import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Slides} from 'ionic-angular';
import {Insomnia} from "@ionic-native/insomnia";
import {NativeAudio} from "@ionic-native/native-audio";
import {SongIndexProvider} from "../../providers/song-index/song-index";
import {AppStateProvider} from "../../providers/app-state/app-state";
import {MidiProvider} from "../../providers/midi/midi";

/**
 * Generated class for the SongPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

    private scroll = false;
    private scrollTimer = null;
    private scrollElement: Element = null;
    private lastScrollPosition: number = -1;
    private autoScrollInQueue: boolean = false;
    private sameLastScrollPositionCounter: number = 0;

    private playingChordId: string = '';

    private readonly NUM_PAGES = 5;
    private readonly MIDDLE_PAGE = 2;
    private pages: number[] = [0,0,0,0,0];
    private allPages: number[] = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public appState: AppStateProvider,
                public songIndexProvider: SongIndexProvider,
                private insomnia: Insomnia,
                private nativeAudio: NativeAudio,
                public midiPlayer: MidiProvider
    ) {
        this.song = this.navParams.data.song;
        // load song info because maybe an alternative was clicked
        this.loadSongInfo(this.song.id);
        this.loadPages();
        // set visible slide id until other data is loaded
        this.pages[this.MIDDLE_PAGE] = this.song.id;
    }

    ionViewDidLoad() {
        this.exitFullscreen();
    }

    ionViewDidLeave() {
        this.stopAutoScroll();
        this.midiPlayer.stopSong();
        this.exitFullscreen();
    }

    public toggleChords() {
        if (this.section == 'text') {
            document.body.classList.toggle('rondo-show-chords');
        }
    };

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
        this.midiPlayer.stopSong();
    }

    // Scrolling
    // ------------------------


    public scrollUp() {
        this.exitFullscreen();
    }

    public scrollDown() {
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
        if (this.section != 'text') {
            return;
        }
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
