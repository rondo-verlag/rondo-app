import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  private song: ISong;
  private section: string = 'text';

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.song = this.navParams.data.song;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SongPage');
  }

  public playMedia(chord: string) {
    console.log('play' + chord);
  }

}
