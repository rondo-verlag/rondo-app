import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import { AboutPage} from "../about/about";
import {SongPage} from "../song/song";
import {SongIndexProvider} from "../../providers/song-index/song-index";
import {AppStateProvider} from "../../providers/app-state/app-state";

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
  private hasBought: boolean = false;

  constructor(
      public navCtrl: NavController,
      public songIndexProvider: SongIndexProvider,
      public appState: AppStateProvider
  ) {
    this.loadSongs();
    this.aboutPage = AboutPage;
    this.songPage = SongPage;

    this.hasBought = this.appState.getHasBought();
        this.appState.hasBought.subscribe((val) => {
            this.hasBought = val;
        })
  }

  loadSongs(){
    this.songIndexProvider.loadIndex()
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
