import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'songSearch',
})
export class SongSearchPipe implements PipeTransform {
    transform(rows: any, query: string, ...args) {
        if (!query) {
            return rows;
        }
        return rows.filter((row) => {
            return this.isShown(row, query)
        });
    }

    private isShown(row, query): boolean {
        return ((row.title.toLowerCase().indexOf(query.toLowerCase()) || '') !== -1 ||
            !row.alternative && (row.interpret.toLowerCase().indexOf(query.toLowerCase()) || '') !== -1 ||
            !row.alternative && row.pageRondoRed == query ||
            !row.alternative && row.pageRondoBlue == query ||
            !row.alternative && row.pageRondoGreen == query);
    }
}
