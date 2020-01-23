import { Component, OnInit, OnChanges,DoCheck, Renderer2, ChangeDetectionStrategy} from '@angular/core';

const create2DArray = (n,m,val) => {
   return new Array(n).fill(val).map(x => new Array(m).fill(val))
}

const cloneArray = ( arr ) => {
    let i, copy;

    if( Array.isArray( arr ) ) {
        copy = arr.slice( 0 );
        for( i = 0; i < copy.length; i++ ) {
            copy[ i ] = cloneArray( copy[ i ] );
        }
        return copy;
    } else {
        return arr;
    }
}

const isGridEmpty = (grid) => {
  let sum = grid.reduce(function(i,v) { return [...i,...v] },[] ) 
     .reduce(function(i,v) { return i + v }, 0); 

  return sum === 0 ? true : false;
}


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ],

})
export class AppComponent implements OnInit {
  name = '';
  rows=20;
  cols=80;
  grid = create2DArray(this.rows, this.cols, 0);
  generation = 0;
  playing = false;
  intervalId;
  
  constructor(private renderer : Renderer2) {
  }
ngOnInit(){

}
  trackByID = (i) => i;
  
  handleCellClick = (e: any) => {
    if (this.playing) return;
    const [row, col] = e.target.getAttribute('id').split('-');
    const hasClass = e.target.classList.contains('alive');
    if(hasClass) {
      this.renderer.removeClass(e.target, 'alive');
      let newState = this.grid.map(inner => inner.slice());
      this.grid[row][col] = 0;
    } else {
      this.renderer.addClass(e.target, 'alive');
      let newState = this.grid.map(inner => inner.slice());
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
      
      }, 200);
	}

  pauseGame = () => {
		clearInterval(this.intervalId);
    this.playing = false; 
	}

  clearGrid = () => {
    clearInterval(this.intervalId);
    this.playing = false; 
    this.grid = create2DArray(this.rows, this.cols, 0);
  }

  randomFillGrid = () => {
    if (this.playing) return;
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.cols; j++) {
            if (Math.random() * 10 < 2) {
                this.grid[i][j] = 1;
            }
        }
    }

  }

  play = () => {
    let g = cloneArray(this.grid);
		let g2 = cloneArray(this.grid);
    

		for (let i = 0; i < this.rows; i++) {
		  for (let j = 0; j < this.cols; j++) {
		
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
		    if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = 0;
		    if (!g[i][j] && count === 3) g2[i][j] = 1;
		  }
		}

    //update state re-renderer    

    this.grid = g2;
    this.generation++;
  }


}
