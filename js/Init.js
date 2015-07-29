/**
 * Bootstrap for game, sets up display and detects control mechanisms.
 * @class
 * @param {object} public - reference to self for Module Pattern
 * @return {object} public - reference to self
 */
var THEGAME = (function (game) {
    
    THEGAME.playerSpawnX=600;
    THEGAME.playerSpawnY=200;
    
    
    function DetectTouchCapability() {
        console.info("exec private method");
    }

     /**
    * initialise game engine
    * @memberof THEGAME
    * @name initialise
    */
    game.initialise = function () {        
        game.currentstate=THEGAME.LEVEL1;
        
        game.phaser = new Phaser.Game(1024, 768, Phaser.AUTO, 'phaser' );
        game.phaser.state.add("currentstate",game.currentstate);
        game.phaser.state.start("currentstate");
        //todo: add next level and preload it
    };
    
    return game;
}(THEGAME || {})); 
