import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SongIndexServiceProvider } from "../../providers/song-index-service/song-index-service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [SongIndexServiceProvider]
})
export class HomePage {

  private songs = [];

  constructor(public navCtrl: NavController, public songIndexService: SongIndexServiceProvider) {
    this.loadSongs();
  }

  loadSongs(){
    this.songIndexService.load()
    .then(data => {
      this.songs = data;
    });
  }

}
