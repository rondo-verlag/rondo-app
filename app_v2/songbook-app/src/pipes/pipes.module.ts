import { NgModule } from '@angular/core';
import { SongSearchPipe } from './../pipes/song-search/song-search';
@NgModule({
	declarations: [SongSearchPipe],
	imports: [],
	exports: [SongSearchPipe]
})
export class PipesModule {}
