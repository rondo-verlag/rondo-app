import { NgModule } from '@angular/core';
import { SongSearchPipe } from './../pipes/song-search/song-search';
import { FreePipe } from './../pipes/free/free';
@NgModule({
	declarations: [SongSearchPipe,
    FreePipe],
	imports: [],
	exports: [SongSearchPipe,
    FreePipe]
})
export class PipesModule {}
