import { Component, OnInit } from '@angular/core';
import { GridManagerService } from '../grid-manager.service';


//only 2d array of array
const cloneArray = ( arr ) => {
  let i, copy;

  if( Array.isArray( arr ) ) {
      copy = arr.slice( 0 );
      for( i = 0; i < copy.length; i++ ) {
          copy[ i ] = cloneArray( copy[ i ] );
      }
      return copy;
  }  else {
      return arr;
  }
}

const isGridEmpty = (grid) => {
let sum = grid.reduce(function(i,v) { return [...i,...v] },[] )
   .reduce(function(i,v) { return i + v }, 0);

return sum === 0 ? true : false;
}

@Component({
  selector: 'app-game-of-life',
  templateUrl: './game-of-life.component.html',
  styleUrls: ['./game-of-life.component.css']
})
export class GameOfLifeComponent implements OnInit {
  grid: Array<Array<number>>;
  intervalId;
  generation = 0;
  playing = false;

  constructor(private gridService:GridManagerService)
  {

  }

  ngOnInit() {
    this.gridService.initState().subscribe(data=>this.grid = data);
  }

  trackByID = (i) => i;

  getCellColor(i, j, isActive){
    if (isActive) {
      let maxX=20;
      let maxY=4;
      let minX=10;
      let minY=2;

      let stepX = (maxX-minX)/this.gridService.cols;
      let stepY = (maxY-minY)/this.gridService.rows;

      let x = j*stepX + minX;
      let y = i*stepY + minY;

      return {"background-color":`hsl(${Math.floor(j/this.gridService.cols*360)}, 50%, ${x*y}%)`};
    } else {
      return {"background-color":"#efefef"};
    }

  }

  handleCellClick = (e: any) => {
    if (this.playing) return;
    const [row, col] = e.target.getAttribute('id').split('-');
    const hasClass = e.target.classList.contains('alive');
    if(hasClass) {
      this.grid[row][col] = 0;
    } else {
      this.grid[row][col] = 1;
    }
  }

  startGame = () => {
		clearInterval(this.intervalId);
		this.intervalId = setInterval(() =>{
      this.playing = true;
      this.play();

      if (isGridEmpty(this.grid) && this.generation > 1) {
        clearInterval(this.intervalId);
        this.playing = false;
      }

    }, 180);
	}

  pauseGame = () => {
		clearInterval(this.intervalId);
    this.playing = false;
	}

  clearGrid = () => {
    clearInterval(this.intervalId);
    this.playing = false;
    this.gridService.clearGrid().subscribe(data=>this.grid = data);
  }

  randomFillGrid = () => {
    if (this.playing) return;
    this.gridService.randomFillGrid().subscribe(data=>this.grid = data);
  }

  play = () => {
    let g = cloneArray(this.grid);

		for (let i = 0; i < this.gridService.rows; i++) {
		  for (let j = 0; j < this.gridService.cols; j++) {

        let count = 0;
				for (var di = -1; di <= 1; di++) {
					for (var dj = -1; dj <= 1; dj++) {
						if ( di == 0 && dj == 0){}
						else if (typeof this.grid[i+di] !== 'undefined'
								&& typeof this.grid[i+di][j+dj] !== 'undefined'
								&& this.grid[i+di][j+dj] === 1) {
						count++;
						}
					}
				}
		    if (g[i][j] && (count < 2 || count > 3)) g[i][j] = 0;
		    if (!g[i][j] && count === 3) g[i][j] = 1;
		  }
		}

    this.grid = g;
    this.generation++;
  }


}
