import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'free',
})
export class FreePipe implements PipeTransform {
    /**
     * Takes a value and makes it lowercase.
     */
    transform(rows: any, free: boolean, ...args) {
        return rows.filter((row: ISong) => {
            return row.free == free;
        });
    }
}
