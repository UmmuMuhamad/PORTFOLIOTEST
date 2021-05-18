var Match3 = Match3 || {};

Match3.Block = function(state, x, y, data){

    // call() method is predefined js method
    // can be used to invoke(call) method with an owner object as an argument parameter.
    // so an object can use a method belonging to another object.
    // here, we call the Phaser.Sprite function, using it on 'this' object, with parameter : state.game, x, y, data.asset.
    // Phaser.sprite = function(game = Phaser.Game, x = coordinate , y = coordinate, key = image/texture)
    Phaser.Sprite.call(this, state.game, x, y, data.asset);
 
    this.game = state.game;
    this.state = state;
    this.row = data.row;
    this.col = data.col;

    this.anchor.setTo(0.5);

    // listen for input
    this.inputEnabled = true;

    // The Events component is a collection of events fired by the parent Game Object.
    // on Input Down is instance of Phaser.signal
    // This signal is dispatched if the Game Object has inputEnabled set to true.
    // 'add' will add an event listener for this signal
    // add(listener = The function to call when this Signal is dispatched, listenerContext = The context under which the listener will be executed)
    this.events.onInputDown.add(state.pickBlock, this.state);
    // will return Phaser.SignalBinding
    // It is an object representing the binding between the Signal and listener.
};

// we want the block from Game.js to inherits all Phaser.Sprite properties. 
// so need to set the block prototype, which is Match3.Block.prototype as an instance of Phaser.Sprite like this:
Match3.Block.prototype = Object.create(Phaser.Sprite.prototype);

// But we need to set back Macth3.block.prototype constructor as Match3.Block
Match3.Block.prototype.constructor = Match3.Block;

Match3.Block.prototype.reset = function(x, y , data){
    // Phaser.Sprite inherit reset prototype from Phaser.Component.LoadTexture.
    // Thats why need to add prototype(.prototype) when want to use that prototype
    // here, we call the Phaser.Sprite.prototype.reset function, using it on 'this' object, with parameter : x, y
    Phaser.Sprite.prototype.reset.call(this, x, y);
    // this moves the Game Object to the given x/y  world coordinates.

    // loadTexture is for changes the base texture the Game Objet is using
    // The old texture is removed and the new one is referenced or fetched from the Cache.
    this.loadTexture(data.asset);
    

    this.row = data.row;
    this.col = data.col;
};

Match3.Block.prototype.kill = function(){

    // the block will change to block burst image
    this.loadTexture(this.key +'Burst');
    // add animation to the block burst
    this.anim = this.animations.add('burst');
    // play(framerate = framerateto play the animation. The speed is gives in frame per second, loop = boolean)
    this.anim.play(10, false);
    this.col = null;
    this.row = null;
    
    
    // here is animation time that our block will be killed
    // time is the core internal game clock. It constructor is Phaser.time It manages the elapsed time and calculation of elapsed values, used for game object motion and tweens, and also handles the standard Timer pool.
    // events is a Phaser.Timer object bound to the master clock which events can be added to. It constructor is Phaser.Timer.
    // 'add' will adds a new Events to this Timer
    // add(delay= number in milliseconds, in game time, before the timer event occurs, callback = is a function that will be called when the timer event occurs)
    this.game.time.events.add(500, function(){
        // kill() is to kills a game object
        // it will sets the game object alive, exists and visible to false.
        // after finish the delay time, the deadBean will dessapear.
        Phaser.Sprite.prototype.kill.call(this);

        // will return PIXI.Display.Object
        
    }, this);
    // will return Phaser.Timer.Event

  
};





