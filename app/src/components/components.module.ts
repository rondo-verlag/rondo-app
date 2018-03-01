import {NgModule} from '@angular/core';
import {BrowserlinkComponent} from './browserlink/browserlink';
import { SongtextComponent } from './songtext/songtext';
import {RondoSlideComponent} from "./rondo-slide/rondo-slide";

@NgModule({
    declarations: [
        BrowserlinkComponent,
        SongtextComponent,
        RondoSlideComponent
    ],
    imports: [],
    exports: [
        BrowserlinkComponent,
        SongtextComponent,
        RondoSlideComponent
    ]
})
export class ComponentsModule {
}
