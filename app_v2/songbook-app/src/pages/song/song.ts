import {ApplicationRef, Component, ElementRef, Injector} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SongHtmlProvider} from "../../providers/song-html/song-html";
import {AppVersionProvider} from "../../providers/app-version/app-version";

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

  private section: string = 'text';

  private song: ISong;
  private songtext: string = '';
  private pageNumbers: string = '';

  private appElementRef: ElementRef;

  private scroll = false;
  private scrollTimer = null;
  private lastScrollPosition: number = -1;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public songHtmlProvider: SongHtmlProvider,
      public appVersionProvider: AppVersionProvider,
      private applicationRef: ApplicationRef,
      private injector: Injector
  ) {
    this.song = this.navParams.data.song;
    this.loadSongtext();
    this.generatePageNumbersHtml();
    this.appElementRef = injector.get(applicationRef.componentTypes[0]).elementRef;
  }

  loadSongtext(){
    this.songHtmlProvider.load(this.song.id)
    .then((data: any) => {
      this.songtext = data;
    });
  }

  ionViewDidLoad() {
    this.exitFullscreen();
  }

  public generatePageNumbersHtml() {
    let pages = [];
    if(this.song.pageRondo2017){
      pages.push('<span class="rondo-orange">'+this.song.pageRondo2017+'</span>');
    }
    if(this.song.pageRondoGreen){
      pages.push('<span class="rondo-green">'+this.song.pageRondoGreen+'</span>');
    }
    if(this.song.pageRondoBlue){
      pages.push('<span class="rondo-blue">'+this.song.pageRondoBlue+'</span>');
    }
    if(this.song.pageRondoRed){
      pages.push('<span class="rondo-red">'+this.song.pageRondoRed+'</span>');
    }
    this.pageNumbers = pages.join('&nbsp;|&nbsp;')
  }

  public onScroll(event: any) {
    if (event.directionY == 'up') {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  }

  public exitFullscreen(){
    document.body.classList.remove('rondo-fullscreen');
  };

  public enterFullscreen(){
    document.body.classList.add('rondo-fullscreen');
  };

  public toggleChords(){
    document.body.classList.toggle('rondo-show-chords');
  };

  public playMedia(chord: string) {
    console.log('play' + chord);
  }

  get app_version() {
    return this.appVersionProvider.getAppVersion();
  }

  // document.querySelector('#rondo_scrollable > .scroll-content').scrollTop

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

  public getScrollTimeout(){
    if(document.body.classList.contains('rondo-show-chords')){
      return 40
    } else {
      return 80;
    }
  };

  public startAutoScroll(){
    /*if(window.plugins !== undefined){
      window.plugins.insomnia.keepAwake();
    }*/
    this.scroll = true;
    this.scrollTimer = setInterval(() => {
      if(this.lastScrollPosition == this.getScrollPosition()){
        this.stopAutoScroll();
      } else {
        this.lastScrollPosition = this.getScrollPosition();
        this.scrollBy(1);
      }
    }, this.getScrollTimeout());
  };

  public stopAutoScroll(){
    /*if(window.plugins !== undefined) {
      window.plugins.insomnia.allowSleepAgain();
    }*/
    this.scroll = false;
    clearInterval(this.scrollTimer);
    this.lastScrollPosition = -1;
  };

}
