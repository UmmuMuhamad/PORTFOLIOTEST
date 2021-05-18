var Match3 = Match3 || {};

// loading the game assets
Match3.PreloadState ={
    // show loading screen
    preload: function(){

        // create a new sprite with specific position
        // will save as an object in Phaser.Sprite 
        // sprite(X, Y, key =image, frame = if texture or sprite sheet is used, then can specify the frame used, group)
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'bar');

        // sets the origin point of the texture
        this.preloadBar.anchor.set(0.5);
        this.preloadBar.scale.setTo(100, 1);

        // set sprite to be preload
        // allows us to easily make loading bars for games.
        // sprite will automatically be made visible when calling this.
        // setPrelaodSprite( sprite, direction)
        this.load.setPreloadSprite(this.preloadBar);

        // load game assets
        this.load.image('block1', 'images/apple.png')
        this.load.image('block2', 'images/banana.png')
        this.load.image('block3', 'images/watermelon.png')
        this.load.image('block4', 'images/strawberry.png')
        this.load.image('block5', 'images/pear.png')
        this.load.image('block6', 'images/orange.png')
        this.load.image('block7', 'images/durian.png')
        this.load.spritesheet('block1Burst', 'images/apple_explode.png',35, 35);
        this.load.spritesheet('block2Burst', 'images/banana_explode.png',35, 35);
        this.load.spritesheet('block3Burst', 'images/watermelon_explode.png',35, 35);
        this.load.spritesheet('block4Burst', 'images/strawberry_explode.png',35, 35);
        this.load.spritesheet('block5Burst', 'images/pear_explode.png',35, 35);
        this.load.spritesheet('block6Burst', 'images/orange_explode.png',35, 35);
        this.load.spritesheet('block7Burst', 'images/durian_explode.png',35, 35);
        this.load.image('background', 'images/backyard2.png');
        
    },

    create: function(){
        this.state.start('Game');
        

    }
}
