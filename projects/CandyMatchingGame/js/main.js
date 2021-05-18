
// if the global variable exits then use it, if not then lets start witht he new objects
var Match3 = Match3 || {};

// set the dimension of the game
Match3.game = new Phaser.Game(360, 640, Phaser.AUTO);

// add: function (key, state = Phaser.State/ object/ function, autoStart = True/false)
Match3.game.state.add('Boot', Match3.BootState);
Match3.game.state.add('Preload', Match3.PreloadState);
Match3.game.state.add('Game', Match3.GameState);

Match3.game.state.start('Boot');