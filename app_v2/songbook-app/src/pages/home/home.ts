import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SongIndexServiceProvider } from "../../providers/song-index-service/song-index-service";
import { AboutPage} from "../about/about";
import {SongPage} from "../song/song";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [SongIndexServiceProvider]
})
export class HomePage {

  private songs: ISong[] = [];
  private query: string = '';
  private aboutPage: any;
  private songPage: any;

  constructor(public navCtrl: NavController, public songIndexService: SongIndexServiceProvider) {
    this.loadSongs();
    this.aboutPage = AboutPage;
    this.songPage = SongPage;
  }

  loadSongs(){
    this.songIndexService.load()
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
