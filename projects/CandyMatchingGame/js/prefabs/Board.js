var Match3 = Match3 || {};
// representing the logic of a match 3 game
Match3.Board = function(state, rows, cols, blockVariations){
    this.state = state;
    this.rows = rows;
    this.cols = cols;
    this.blockVariations = blockVariations;

    // main grid
    // represent all the blocks that seen at the screen
    this.grid = [];

    // initiate 2 x 2 array
    var i, j; 
    for  (i = 0; i < rows; i++){

        // for each row will be added new array for the corresponding column
        this.grid.push([]); 

        // go for each one of the elements of the column 
        // add zero for the value
        for (j = 0; j < cols; j++){
            this.grid[i].push(0);
        }
        
    }

    // reserve grid on top, for when new blocks are added
    // represent block that will come only when certain blocks are destroyed
    // may still have the same amount of column, because we might need blocks in any column
    // should only have 5 rows, because we cannot destroy more than 5 blocks at a time 
    this.reserveGrid = [];
    
    // there are 5 rows of candies for reserve
    this.RESERVE_ROW = 5;

    for  (i = 0; i < this.RESERVE_ROW; i++){

        // for each row will be added new array for the corresponding column
        this.reserveGrid.push([]); 

        // go for each one of the elements of the column 
        // add zero for the value
        for (j = 0; j < cols; j++){
            this.reserveGrid[i].push(0);
        }
        
    }

    // called populate grid method from the prototype
    this.populateGrid();
    this.populateReserveGrid();
  
};

// method for populate grid
Match3.Board.prototype.populateGrid = function(){

    var i, j , variation;
    for (i = 0; i < this.rows; i++){
        for (j = 0; j < this.cols; j++){

            // generate a number between 1 and maximum number of variation, which is 7
            // number must have uniform distribution, mean the probabilty of occurence should be the same
            // Math.random will give number in range (0,1), so need to times 7 and
            // using floor which takes to the closest integer
            
            variation = Math.floor(Math.random() * this.blockVariations) +1;
            this.grid[i][j] = variation;
            
        }
    }

    // we we start our game, we don't want to see any chains. so we will repopulate this grid until there is no chains.
    var chains = this.findAllChains();
    if (chains.length > 0){
        this.populateGrid()    
    }
    
};

// method for populate reserve grid

Match3.Board.prototype.populateReserveGrid = function(){
    var i, j , variation;
    for (i = 0; i < this.RESERVE_ROW; i++){
        for (j = 0; j < this.cols; j++){

            // generate a number between 1 and maximum number of variation, which is 7
            // number must have uniform distribution, mean the probabilty of occurence should be the same
            // Math.random will give number in range (0,1), so need to times 7 and
            // using floor which takes to the closest integer
            
            variation = Math.floor(Math.random() * this.blockVariations) +1;
            this.reserveGrid[i][j] = variation;
        }
    }
    
};

// lets print our board and the reserve board in a much prettier way

Match3.Board.prototype.consoleLog = function(){
    // reserve grid to be shown first
    var i, j , variation;

    // create a variable that will hold a string
    var prettyString = '';

    for (i = 0; i < this.RESERVE_ROW; i++){
        // when finsih showing a whole row we need to skip a new line
        prettyString += '\n';
        for (j = 0; j < this.cols; j++){
            
            // add space between each blocks
            prettyString += ' ' + this.reserveGrid[i][j];
            
        }
    }

    // when finish the wole reserve grid, create another extra line
    prettyString += '\n';

    // go through all columns again and print a dash sign
    for (j = 0; j < this.cols; j++){
        prettyString += ' -';
    }

    for (i = 0; i < this.rows; i++){

        prettyString += '\n';

        for (j = 0; j < this.cols; j++){
           
            prettyString += ' ' + this.grid[i][j];
        }
    }
   

};

// swapping two blocks -source and target parameter is an objects
Match3.Board.prototype.swap = function(source, target){

    // create variable for temporary target blocks
    var temp = this.grid[target.row][target.col];
    
    // replace target blocks with the source blocks
    this.grid[target.row][target.col] = this.grid[source.row][source.col];

    // replace source blocks with the temporary blocks
    this.grid[source.row][source.col] = temp;

    // We need to do here also need to update the row and column for our real blocks(candy).
    var tempRow = target.row;
    var tempCol = target.col;

    target.row = source.row;
    target.col = source.col;

    source.row = tempRow;
    source.col = tempCol;  
    
};

// checking if two blocks are adjacent or not
Match3.Board.prototype.checkAdjacent = function(source, target){
    // the adjacent blocks means the blocks are next to each other, whether in x or y position.
    // so the difference position (row or column) must be 1 only.

    var diffRow = Math.abs(source.row-target.row);
    var diffCol = Math.abs(source.col-target.col);

    var isAdjacent = (diffRow == 1 && diffCol === 0) || (diffRow == 0 && diffCol === 1);

    // will return true or false
    return isAdjacent;

};

// A chain mean when three or more blocks are on the same line.
// Here we want to check wheter a single block is chained or not.
Match3.Board.prototype.isChained = function(block) {
    var isChained = false;
    var variation = this.grid[block.row][block.col];
    var row = block.row;
    var col = block.col;

    // check at the same row, to the left
    if (variation == this.grid[row][col-1] && variation == this.grid[row][col-2]){
        isChained = true;
    }
    // check at the same row, to the right
    if (variation == this.grid[row][col+1] && variation == this.grid[row][col+2]){
        isChained = true;
    }
 
    // check at the same column, to upward
    // need to make sure the row is not at the second row to avoid erros. We didn't do it at column because for example grid[1][-2] will return undefine only. But grid[-1][2] will return error.
    if (this.grid[row-2]){
        if (variation == this.grid[row-1][col] && variation == this.grid[row-2][col]){
            isChained = true;
        }
    }

    // check at the same column, to downwards
    // need to make sure the row is not at the last and second last row to avoid erros. We didn't do it at column because for example grid[1][8] will return undefine only. But grid[8][2] will return error.  
    if (this.grid[row+2]){
        if (variation == this.grid[row+1][col] && variation == this.grid[row+2][col]){
            isChained = true;
        }
    }
    
    // check at the center -horizontal
    if (variation == this.grid[row][col-1] && variation == this.grid[row][col+1]){
        isChained = true;
    }

    // check at the center -vertical
    if (this.grid[row-1] && this.grid[row+1]){
        if (variation == this.grid[row-1][col] && variation == this.grid[row+1][col]){
            isChained = true;
        }
    }

    // will return true or false
    return isChained;
   
};

// find all the chains from the all the blocks
Match3.Board.prototype.findAllChains = function() {
    var chained = []
    var i, j;

    for (i = 0; i < this.rows; i++){
        for (j = 0; j < this.cols; j++){
            if(this.isChained({row: i, col: j})){
                chained.push({row: i, col: j});
            }
        }
    }
    
    // return an array that consist blocks position that is chained
    return chained;

};

// clear all the chains
// assign zero to all the chained blocks in the grid
Match3.Board.prototype.clearChains = function(){
    var chainedBlocks = this.findAllChains();

    chainedBlocks.forEach(function(block){
        this.grid[block.row][block.col] = 0;

        // kill the real block object (object)
        // we will cal getBlockFromColRow method from Game.js to check if the block position match with the candies and kill it
        this.state.getBlockFromColRow(block).kill();

    }, this) // 'this' refer to Match3.board

    
};

// drop a block in the main grid from a position to another. The source is set to zero.
Match3.Board.prototype.dropBlock = function(sourceRow, targetRow, col){
    this.grid[targetRow][col] = this.grid[sourceRow][col];
    this.grid[sourceRow][col] = 0 ;
       
    this.state.dropBlock(sourceRow, targetRow, col);

};

// drop a block in the reserve grid from a position to another. The source is set to zero.
Match3.Board.prototype.dropReserveBlock = function(sourceRow, targetRow, col){

    this.grid[targetRow][col] = this.reserveGrid[sourceRow][col];
    this.reserveGrid[sourceRow][col] = 0 ;

    this.state.dropReserveBlock(sourceRow, targetRow, col);

    
};

// complete update grids
// after cleaning the chains, make blocks fall to cover empty cells
// move down blocks to fill in empty slots
// we are going to go through all the rows starting from below
// everytime we find the zero, we will climb up on that column until we find the first non-zero.
Match3.Board.prototype.updateGrid = function(){
    var i, j, k, foundBlock;

    // go through all the rows, from the bottom to up
    // bottom index is 7, thats why we minus 1, because this.rows = 8
    for (i = this.rows-1; i>=0; i--){
        
        // now go through all the column, from left to right
        for (j = 0; j < this.cols; j++){
            // if the block is zero, then get climb up to get a non zero one
            if (this.grid[i][j] === 0){
                foundBlock = false; //means we didn't find the non zero blocks yet

                // climb up from main grid first 
                // k is the row above i. because now the block at i is 0, so we check the block above it that none zero one.
                for (k = i - 1; k >=0; k--){ 
                    if (this.grid[k][j] > 0){ // found non zero block
                        this.dropBlock(k, i, j); //use function dropBlock to replace i with k
                     
                        foundBlock = true; 
                        break;   
                    }
                }

                // climb up from reserve grid, when we cannot find the non zero block from the main grid
                if (!foundBlock){ //means if it true
                    for (k = this.RESERVE_ROW-1; k >=0; k--){ 
                        if (this.reserveGrid[k][j] > 0){ // found non zero block
                            this.dropReserveBlock(k, i, j); //use function dropReserve Block to replace i with k
                            // no need to keep track of foundBlock because will find one for sure
                         
                            break;
                        }
                    } 

                }
            }
        }
    }

    // after we completed move down blocks to fill in empty slots, some of blocks in the reserve grid will have zero values. 
    // so we need to repopulate the reserve grid.
    this.populateReserveGrid()

    
};
