import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import { AboutPage} from "../about/about";
import {SongPage} from "../song/song";
import {SongIndexProvider} from "../../providers/song-index/song-index";

@Component({
  selector: 'page-songlist',
  templateUrl: 'songlist.html',
  providers: [SongIndexProvider]
})
export class SonglistPage {

  private songs: ISong[] = [];
  private query: string = '';
  private aboutPage: any;
  private songPage: any;

  constructor(
      public navCtrl: NavController,
      public songIndexProvider: SongIndexProvider
  ) {
    this.loadSongs();
    this.aboutPage = AboutPage;
    this.songPage = SongPage;
  }

  loadSongs(){
    this.songIndexProvider.load()
    .then((data: ISong[]) => {
      this.songs = data;
    });
  }

  public clearSearch() {
    this.query = '';
    setTimeout(() => {
      document.getElementById('song-search-input').focus();
    }, 500);
  };

}
