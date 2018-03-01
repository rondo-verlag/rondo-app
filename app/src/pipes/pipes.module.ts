import {NgModule} from '@angular/core';
import {SongSearchPipe} from './song-search/song-search';
import {FreePipe} from './free/free';

@NgModule({
    declarations: [SongSearchPipe,
        FreePipe],
    imports: [],
    exports: [SongSearchPipe,
        FreePipe]
})
export class PipesModule {
}
