import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {HttpModule} from '@angular/http';

import {MyApp} from './app.component';
import {SonglistPage} from '../pages/songlist/songlist';
import {SongSearchPipe} from "../pipes/song-search/song-search";
import {AboutPage} from "../pages/about/about";
import {SongPage} from "../pages/song/song";
import {SongHtmlProvider} from '../providers/song-html/song-html';
import {SongIndexProvider} from '../providers/song-index/song-index';
import {BrowserlinkComponent} from "../components/browserlink/browserlink";
import {SongtextComponent} from "../components/songtext/songtext";
import {AppVersionProvider} from '../providers/app-version/app-version';
import {Insomnia} from "@ionic-native/insomnia";
import {File} from '@ionic-native/file';
import {NativeAudio} from '@ionic-native/native-audio';
import {InAppPurchase} from '@ionic-native/in-app-purchase';
import {PurchaseProvider} from '../providers/purchase/purchase';
import {NativeStorage} from '@ionic-native/native-storage';
import {AppStateProvider} from '../providers/app-state/app-state';
import {FreePipe} from "../pipes/free/free";
import {RondoSlideComponent} from "../components/rondo-slide/rondo-slide";
import { MidiProvider } from '../providers/midi/midi';


@NgModule({
    declarations: [
        MyApp,
        SonglistPage,
        AboutPage,
        SongPage,
        SongSearchPipe,
        FreePipe,
        BrowserlinkComponent,
        SongtextComponent,
        RondoSlideComponent
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
        AppVersionProvider,
        Insomnia,
        File,
        NativeAudio,
        InAppPurchase,
        PurchaseProvider,
        NativeStorage,
        AppStateProvider,
        MidiProvider
    ]
})
export class AppModule {
}
