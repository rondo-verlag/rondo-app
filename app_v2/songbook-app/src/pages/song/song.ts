import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SongHtmlProvider} from "../../providers/song-html/song-html";

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public songHtmlProvider: SongHtmlProvider) {
    this.song = this.navParams.data.song;
    this.loadSongs();
    this.generatePageNumbersHtml();
  }

  loadSongs(){
    this.songHtmlProvider.load(this.song.id)
    .then((data: any) => {
      this.songtext = data;
    });
  }

  //ionViewDidLoad() {
  //  console.log('ionViewDidLoad SongPage');
  //}

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

  public playMedia(chord: string) {
    console.log('play' + chord);
  }

}
