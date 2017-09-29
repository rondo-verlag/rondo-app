import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { SonglistPage } from '../pages/songlist/songlist';
import {SongSearchPipe} from "../pipes/song-search/song-search";
import {AboutPage} from "../pages/about/about";
import {SongPage} from "../pages/song/song";
import { SongHtmlProvider } from '../providers/song-html/song-html';
import { SongIndexProvider } from '../providers/song-index/song-index';
import {BrowserlinkComponent} from "../components/browserlink/browserlink";
import { AppVersionProvider } from '../providers/app-version/app-version';

@NgModule({
  declarations: [
    MyApp,
    SonglistPage,
    AboutPage,
    SongPage,
    SongSearchPipe,
    BrowserlinkComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SonglistPage,
    AboutPage,
    SongPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SongHtmlProvider,
    SongIndexProvider,
    AppVersionProvider
  ]
})
export class AppModule {}
