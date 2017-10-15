import {NgModule} from '@angular/core';
import {BrowserlinkComponent} from './browserlink/browserlink';
import { SongtextComponent } from './songtext/songtext';

@NgModule({
    declarations: [BrowserlinkComponent,
    SongtextComponent],
    imports: [],
    exports: [BrowserlinkComponent,
    SongtextComponent]
})
export class ComponentsModule {
}
