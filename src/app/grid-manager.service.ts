import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';

const create2DArray = (n,m,val) => {
  return new Array(n).fill(val).map(x => new Array(m).fill(val))
}

@Injectable({
  providedIn: 'root'
})
export class GridManagerService {
  rows=20;
  cols=80;

  constructor() {

  }

  initState():Observable<Array<Array<number>>> {
    return of(create2DArray(this.rows, this.cols, 0));
  }

  clearGrid():Observable<Array<Array<number>>> {

    return of(create2DArray(this.rows, this.cols, 0));
  }

  randomFillGrid():Observable<Array<Array<number>>> {
    let grid = create2DArray(this.rows, this.cols, 0);

    for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.cols; j++) {
            if (Math.random() * 10 < 2) {
                grid[i][j] = 1;
            }
        }
    }

    return of(grid);
  }


}
