var Match3 = Match3 || {};

Match3.GameState = {

    // first function called when your States starts up 
    init: function(){
        this.NUM_ROWS = 8;
        this.NUM_COLS = 8;
        // seven different type of candies
        this.NUM_VARIATIONS = 7; 
        this.BLOCK_SIZE = 35;
        // 200 miliseconds
        this.SWAP_ANIMATION = 200; 
        this.DROP_ANIMATION = 600;
             
       
    },
      
    create: function(){
        
        // game backgroud
        this.BLOCK_SIZEbackground = this.add.sprite(0, 0, 'background');

        // this.add is for create any of the Phaser Game Objects and adds them to the game world.
        // a group is a container for display objects that allows for fast pooling, recycling and collision checks.
        // this.blocks will be Phaser.Group  
        // this group will keep all of the blocks in the game
        // can check from the children of this.block from console
        this.blocks = this.add.group();
        // board model (constructor is inside Board.js)
        this.board = new Match3.Board(this, this.NUM_ROWS, this.NUM_COLS, this.NUM_VARIATIONS);
        
        // call consoleLog method in the Match3.Board prototype
        this.board.consoleLog()

        // we will create method to draw board and call it here
        this.drawBoard();

        this.score = 0;
        this.scoreText = this.add.text(36, 50,'Score:  ' + this.score, {fontSize: 36}); 
       
    },

    // we want to create individual block to be able to reuse these elements in a pool objects.
    // x and y is the coordinates
    // data is an object: {assets:  , row: , col: }
    createBlock: function(x, y, data){
        
        // getFirstExists(exists = boolean) -is to get the first display objects that exists or doesn't exists.
        // if true, find the first existing child, else find the first non-existing child.
        // now, grab on that block if there is any
        // so now we make it false, so we get the first one that doesn't exists.
        
        var block = this.blocks.getFirstExists(false); 
        
        //now block = null

        if(!block){ // if true (means block = null)
            block = new Match3.Block(this, x, y, data); //create new block
            
            // add(child = the display object to add as a child )
            // add an existing object as the top child to this group
            this.blocks.add(block); // we will add this block to the group
            // it will return DisplayObject
        }
        else { // if the blocks already exists
            block.reset(x, y, data); //set the block back to being alive
        }   
        return block;

    },

    // create board 
    drawBoard: function(){
        var i,j, block, square;

        // semi-tranparent black squares
        // bitmapData(width = width in pixels, height = height in pixels)
        // A bitmapData object can be manipulated and drawn to like a traditional Canvas object and used to texture Sprites.
        var squareBitmap = this.add.bitmapData(this.BLOCK_SIZE + 4, this.BLOCK_SIZE + 4);
        // it will return Phaser.BitmapData
        // A BirmapData object contains a Canvas element to which you can draw anything you like via normal context operations. 

        // ctx is a reference to BitmapData.context.
        // fillStyle is a HTML canvas property, not from phaser
        // fillStyle property sets or return the color/ gradient/ pattern used to fill the drawing.
        squareBitmap.ctx.fillStyle = '#000';

        // fillRect is a Html canvas method
        // fillRect method draws a "filled" rectangle. 
        // fillRect(x = x-coordinate upper-left corner, y = y-coordinate upper-, width, height)
        squareBitmap.ctx.fillRect(0, 0, this.BLOCK_SIZE + 4, this.BLOCK_SIZE + 4);

        // we want to draw small square for the candies on the board
        for (i = 0; i < this.NUM_ROWS; i++){
            for (j = 0; j < this.NUM_COLS; j++){

                // x and y  is the upper left coordinates of each squares
                // 36 and 150 is the margin of the board
                // 6 is the distance between each squares
                x = 36 + j * (this.BLOCK_SIZE + 6);
                y = 150 + i * (this.BLOCK_SIZE + 6);

                square = this.add.sprite(x, y, squareBitmap);
                square.anchor.setTo(0.5);
                square.alpha = 0.3;

                // now we will add a  candy inside the square by called createBlock method
                // this.board.grid is from board.js (Match3.Board.prototype.populateGrid), so it will give random number 

                this.createBlock(x, y, {asset: 'block' + this.board.grid[i][j], row: i, col: j})
                
            } 
        }
    
    // now we have create the whole square with the candies.
    // but the problem is the squares are on top of the candies. 
    // this is because we create the blocks first at the beginning and then we added a new things, so they go on top of previous group.
    // so what can we do is to send our whole group of blocks to the top for that.
    // bringtoTop(child = The child to bring to the top of this group. ) will brings the given child to the top of this group so it renders above all other children.
    this.game.world.bringToTop(this.blocks);

    },

    // method to check the blocks from board.js match with the real block(candies)
    getBlockFromColRow: function(position){

        var foundBlock;

        this.blocks.forEachAlive(function(block){
            if(block.row === position.row && block.col === position.col){
                foundBlock = block;
            }
        }, this);
        return foundBlock;
        
    },

    // method to drop real block(candies) from the main blocks to the block that has been killed
    dropBlock: function(sourceRow, targetRow, col){

        // called getBlockFromColRow to match the sourceRow from board.js to the real block(candy)
        var block = this.getBlockFromColRow({row: sourceRow, col: col})

        
        // y-coordinate for the target block
        var targetY = 150 + targetRow * (this.BLOCK_SIZE + 6);

        // we want to drop the block from source to target
        // so we change the sorce row of the block to the target row
        block.row = targetRow;
        

        // ceate a tween on thconsole.log(sourceRow)e block that we want to drop
        // a tween allows us to alter one or more properties of a target object over a defined period of time.
        //can be used for things such as alpha fading Sprites, scaling them or motion. 
        var blockMovement =this.game.add.tween(block);
        // will return Phaser.Tween

        // 'to' is property of Phaser.Tween
        // to(properties(object) = properties of the object that we want to tween, duration)
        // here we want to move y coordinate of the souce block to the targetY coodinate
        blockMovement.to({y: targetY}, this.DROP_ANIMATION)
        
        // start the tween running
        blockMovement.start();

    },

    // method to drop real block(candies) from the reserve blocks to the block that has been killed
    dropReserveBlock: function(sourceRow, targetRow, col){
        
        // now the block from sorceRow is from the sky (reserve grid), and this block hasn't created yet as candy
        // so we need to create this block first from createBlock method.

        // x and y cordinate for the reserve block 
        // x-coordinate will follow the target column
        var x = 36 + col * (this.BLOCK_SIZE + 6);
        // because the reserve block come from the sky, we make it negative (out of the screen)
        var y =  -(this.BLOCK_SIZE + 6) * this.board.RESERVE_ROW + sourceRow*(this.BLOCK_SIZE+6);
        
        // we will create block here. But for the asset we use "this.board.grid" not "this.board.reserveGrid".
        // this is because we already replace the targetRow for grid row with  the sourceRow for reserveGrid in board.js.
        var block = this.createBlock(x, y, {asset: 'block' + this.board.grid[targetRow][col], row: targetRow, col: col})
        
        var targetY = 150 + targetRow * (this.BLOCK_SIZE + 6);

        blockMovement =this.game.add.tween(block);
 
        blockMovement.to({y: targetY}, this.DROP_ANIMATION);
        blockMovement.start();
        
    },

    // method to swap two adjacent real blocks(candy)
    // let block 1 and block 2 as two adject blocks
    swapBlocks: function(block1, block2){

        // add tween to block 1
        var block1Movement = this.game.add.tween(block1);
        // change block 1 coordinate to block 2
        block1Movement.to({x: block2.x, y: block2.y}, this.SWAP_ANIMATION);
          
        // onComplete event is fired when the Tween and all of its children completes.
        // 'add' is to add an event listener for this signal
        // add(listener = The function to call when this Signal is dispatched. )  
        block1Movement.onComplete.add(function(){
            
            // we will call swap funciton from board.js because we need to update our model as well.
            this.board.swap(block1, block2);

            if (!this.isReversingSwap){ //no reversing swap
                // find all chaines from board.js. It will return an array that consist blocks position that is chained
                var chains = this.board.findAllChains();

                if (chains.length > 0){ // means there is a chain
                    this.updateScore();
                    this.updateBoard();
;
                    
                    
                }
                else{ // when there is no chain
                    this.isReversingSwap = true;
                    this.swapBlocks(block1, block2);
                }
            }
            else{
                this.isReversingSwap = false;
            }
            
        }, this)
        
        block1Movement.start();

        // add tween to block 2
        var block2Movement = this.game.add.tween(block2);
        // change block 2 coordinate to block 2
        block2Movement.to({x: block1.x, y: block1.y}, this.SWAP_ANIMATION);
        block2Movement.start();
     
    },

    pickBlock: function(block){
        if (this.isBoardBlocked){ //if UI(user interface is blocked)
            return;
        }
        // if there is nothing selected yet, then user able to select the candies
        if(!this.selectedBlock){
            //will change the block size that has been selected
            block.scale.setTo(1.5); 

            // assign the selected block to the block that has been choosen
            this.selectedBlock = block;
        }

        // when user already select the 'selected block', now the user will select the next block, 'target block' that he want to swap with the selected block.
        else{
            this.targetBlock = block;

            // check if the 'selected block' and 'target block' is adjacent
            // we use function 'checkAdjacent' from board.js.
            if (this.board.checkAdjacent(this.selectedBlock, this.targetBlock)){
                this.selectedBlock.scale.setTo(1);

                // need to block the user interface when use has choosen 'target block' and 'selected block' 
                this.isBoardBlocked = true;
                this.swapBlocks(this.selectedBlock, this.targetBlock)

                this.clearSelection();

                
            }
            // if 'selected' and 'target' block are not adjacent
            else{ 
                this.clearSelection();
            }
           
        }
    },

    clearSelection: function(){
        this.isBoardBlocked = false;
        this.selectedBlock = null;
        this.blocks.setAll('scale.x', 1);
        this.blocks.setAll('scale.y', 1);
    },

    updateBoard: function(){
        this.board.clearChains();
        this.board.updateGrid();
        
        // after dropping has ended
        // for 200 seconds check
        this.game.time.events.add(200, function(){
            // see if there are chains
            var chains = this.board.findAllChains();
            if (chains.length > 0){ 
                this.updateScore();
                this.updateBoard();
                }
            else{
                this.clearSelection();
            }
               
        }, this)

    },

     updateScore: function(){
        
        this.score = this.score + 1;
        
        this.scoreText.text= 'Score: ' + this.score;
        

    }
};


