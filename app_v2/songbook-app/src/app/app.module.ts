import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SongIndexServiceProvider } from '../providers/song-index-service/song-index-service';
import {SongSearchPipe} from "../pipes/song-search/song-search";
import {AboutPage} from "../pages/about/about";
import {SongPage} from "../pages/song/song";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    AboutPage,
    SongPage,
    SongSearchPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    AboutPage,
    SongPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SongIndexServiceProvider
  ]
})
export class AppModule {}
