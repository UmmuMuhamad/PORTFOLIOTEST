var Match3 = Match3 || {};
// setting game configuration and loading the assets for the loading screen
Match3.BootState = {
    
    // first function called when your States starts up 
    init: function(){

        this.game.stage.backgroundColor = "fff";
    },   
    
    preload: function(){
        // show the entire game display 
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        // this.scale.pageAlignHorizontally
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        // add an image to the current load queue
        // the file is not  loaded immediately after calling this function.
        // the file is added to the que ready to be loaded when the loader starts. 
        // image(key, url, overwrite)
        this.load.image('bar','images/preloader-bar.png');
    },

    // is called once preload has completed 
    create: function(){
        
        // Start the given state
        // start(key, clearWorld=clear everyhing in boolean, clearCatch, clear the Game.Catch in boolean, parameter)
        this.state.start('Preload');

    }
};