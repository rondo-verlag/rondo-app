import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FreePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
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
