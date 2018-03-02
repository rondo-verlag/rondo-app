import {Component, Input} from '@angular/core';
import {SongHtmlProvider} from "../../providers/song-html/song-html";
import {SongIndexProvider} from "../../providers/song-index/song-index";
import {AppVersionProvider} from "../../providers/app-version/app-version";

@Component({
    selector: 'songtext',
    templateUrl: 'songtext.html'
})
export class SongtextComponent {

    @Input() id: number;

    public songtext: string = 'Wird geladen ...';
    public song: ISong = {
        id: 0,
        title: '',
        pageRondoRed: null,
        pageRondoBlue: null,
        pageRondoGreen: null,
        pageRondo2017: null,
        interpret: '',
        chords: [],
        alternative: false,
        free: false,
        license: ''
    };

    private pageNumbers: string = '';

    constructor(
        public songHtmlProvider: SongHtmlProvider,
        public songIndexProvider: SongIndexProvider,
        public appVersionProvider: AppVersionProvider
    ) {}

    ngOnChanges() {
        if (this.id > 0) {
            this.loadSongtext();
            this.loadSongInfo();
        }
    }

    public loadSongtext() {
        this.songHtmlProvider.load(this.id)
            .then((data: any) => {
                this.songtext = data;
            });
    }

    public loadSongInfo() {
        this.songIndexProvider.loadSong(this.id).then((song) => {
            this.song = song;
            this.generatePageNumbersHtml();
        })
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

    get app_version() {
        return this.appVersionProvider.getAppVersion();
    }
}
