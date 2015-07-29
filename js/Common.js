/*
 * note on documentation: jsdoc doesn't handle loose module pattern very well, the internal
 * reference to self gets inserted into the chain eg THEGAME.player is documented as THEGAME.common.Player
 * @alias seems like it should work but it doesn't so using @name to force name change
 */


/**
 * Includes all common level data, such as player animations and controls
 * @class
 */
var THEGAME = (function (common) {
 
    /**
    * player object, houses phaser player object
    * @memberof THEGAME
    * @name player
    */
    common.player = {};
    common.currentstate = {};
    common.nextlevel = {};  //for preloading
    
    /**
    * preload common assets such as player animations and gui 
    * @memberof THEGAME
    * @name preload
    */
    common.preload = function () {
        console.info("common preload method");
        Utilities.monitorPerformance(common.currentstate);
        
        var cs= common.currentstate.game;
        cs.load.image('star', 'assets/sprites/star.png');
        cs.load.image('diamond', 'assets/sprites/diamond.png');
        cs.load.spritesheet('cat', 'assets/sprites/catfull001.png', 64, 64);
        cs.load.spritesheet('bubble-border','assets/sprites/speech2.png',9,9);
        cs.load.image('bubble-tail', 'assets/sprites/speech1.png');
        cs.load.bitmapFont('speech', 'assets/fonts/speech.png', 'assets/fonts/speech.xml');
    };

    /**
    * setup common elements of game stage such as world physics, player controls
    * @memberof THEGAME
    * @name create
    */
    common.create = function () {
        console.info("common create method");
        
        var cs= common.currentstate.game;
        cs.stage.disableVisibilityChange = true;
        cs.stage.backgroundColor = '#124184';
        //cs.world.setBounds(0, 0, 1600, 1200);
        cs.physics.startSystem(Phaser.Physics.P2JS);
        cs.physics.p2.restitution = 0.0; //bounciness
        cs.physics.p2.gravity.y = 1000;
        cs.physics.p2.friction = 5;
        var worldMaterial = cs.physics.p2.createMaterial('worldMaterial');
        //  4 trues = the 4 faces of the world in left, right, top, bottom order
        cs.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        
        //THEGAME.phaser.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        //THEGAME.phaser.scale.startFullScreen(false);
    };
    
    /**
    * setup player sprites, animations and physics body, game camera mode
    * @memberof THEGAME
    * @name setupPlayer
    */
    common.setupPlayer = function (currentState) {
        
        common.player = currentState.game.add.sprite(THEGAME.playerSpawnX,THEGAME.playerSpawnY,'cat');
        currentState.game.physics.p2.enable( common.player);
        common.player.body.collideWorldBounds = true;
        common.player.body.fixedRotation = true;
        common.player.anchor.setTo(0.5, 0.5);
        common.player.animations.add('walk',  currentState.math.numberArray(0,15), 30, true);
        common.player.animations.add('stand',currentState.math.numberArray(20,34), 10, true);
        common.player.animations.add('leap',currentState.math.numberArray(42,51 ), 20, false);
        common.player.body.onBeginContact.add(currentState.playerHit, currentState);
        currentState.game.camera.follow(common.player);
        common.player.jumpstate=0;
    };    
    
    
    /**
    * common update method, includes player controls and general non level specific updates
    * @memberof THEGAME
    * @name update
    */
    common.update = function () {
        currentState=common.currentstate;
        player=common.player;
        cursors = currentState.game.input.keyboard.createCursorKeys();
            //var player=currentPlayer;
            //var player=currentState.player;
            
            //if player is not jumping
            if (player.jumpstate==0 || player.airmove==1){
                
                //  Reset the players velocity (movement)
                //player.body.velocity.x = 0;
                
                if (cursors.left.isDown || currentState.game.input.keyboard.isDown(Phaser.Keyboard.A)){
           
                    player.body.velocity.x = -150;
                    player.animations.play('walk');
                    player.scale.setTo(-1,1);
                }
                else if (cursors.right.isDown || currentState.game.input.keyboard.isDown(Phaser.Keyboard.D)){
                    //  Move to the right
                    player.body.velocity.x = 150;
                    player.animations.play('walk');
                    player.scale.setTo(1,1); 
                }
                else{
                    player.animations.play('stand');
   
                }
                
                //  Allow the player to jump if they are touching the ground.
                if ((   cursors.up.isDown || 
                        currentState.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) 
                        &&  player.jumpstate==0){
                    
                    if (player.jumpstate==0){
                        player.animations.play('leap');
                        player.jumpstate=1;
                        player.body.velocity.y = -550;
                    }
                }
            };

            if (common.checkIfCanJump()) { 
                player.jumpstate=0;
            };
        
            common.updateParallax();
    };
    
    
    /**
    * Check to see if player is standing on something, needs more work
    * can currently jump off of non collidable items such as collectables
    * @memberof THEGAME
    * @name checkIfCanJump
    */
    common.checkIfCanJump= function () {
        var yAxis = p2.vec2.fromValues(0, 1);
        var result = false;

        for (var i = 0; i < common.currentstate.game.physics.p2.world.narrowphase.contactEquations.length; i++)
        {
            var c = common.currentstate.game.physics.p2.world.narrowphase.contactEquations[i];

            if (c.bodyA === common.player.body.data || c.bodyB === common.player.body.data)
            {
                var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
                if (c.bodyA === player.body.data) d *= -1;
                if (d > 0.5) result = true;
            }
        }
        return result;
    }
    
    /**
    * change the offset of the background image based on players current position
    * @memberof THEGAME
    * @name updateParallax
    */
    common.updateParallax= function (){
        //could build support for an array of bg images with mutiple scaling
        //if (THEGAME.player.x>(THEGAME.width/2))
        THEGAME.bgsprite.tilePosition.x =  THEGAME.player.x*0.2;
        
    };
        
    return common;
}(THEGAME || {})); 

//3rd party speech bubble stuff (make our own later)


THEGAME.SpeechBubble = function(x, y, width, text,currentState) {
        Phaser.Sprite.call(this, currentState, x, y);
        width = width || 27;
        var height = 18;

        // Set up our text and run our custom wrapping routine on it
        this.bitmapText = currentState.add.bitmapText(x + 12, y + 4, 'speech', text, 22);
        SpeechBubble.wrapBitmapText(this.bitmapText, width);
        var bounds = this.bitmapText.getLocalBounds();
        
        if (bounds.width + 18 > width) width = bounds.width + 18;
        if (bounds.height + 14 > height) height = bounds.height + 14;
        
        this.borders = [
            currentState.make.tileSprite(x + 9, y + 9, width - 9, height - 9, 'bubble-border', 4),
            currentState.make.image(x, y, 'bubble-border', 0),
            currentState.make.image(x + width, y, 'bubble-border', 2),
            currentState.make.image(x + width, y + height, 'bubble-border', 8),
            currentState.make.image(x, y + height, 'bubble-border', 6),
            currentState.make.tileSprite(x + 9, y, width - 9, 9, 'bubble-border', 1),
            currentState.make.tileSprite(x + 9, y + height, width - 9, 9, 'bubble-border', 7),
            currentState.make.tileSprite(x, y + 9, 9, height - 9, 'bubble-border', 3),
            currentState.make.tileSprite(x + width, y + 9, 9, height - 9, 'bubble-border', 5)
        ];  

        for (var b = 0, len = this.borders.length; b < len; b++) {
            this.addChild(this.borders[b]);   
        }
        this.tail = this.addChild(currentState.make.image(x + 18, y + 3 + height, 'bubble-tail'));
        this.addChild(this.bitmapText);
        this.bitmapText.tint = 0x111111;
        this.pivot.set(x + 25, y + height + 24);
    };

THEGAME.SpeechBubble.prototype = Object.create(Phaser.Sprite.prototype);
THEGAME.SpeechBubble.prototype.constructor = THEGAME.SpeechBubble;

THEGAME.SpeechBubble.wrapBitmapText = function (bitmapText, maxWidth) {
    var words = bitmapText.text.split(' '), output = "", test = "";
    
    for (var w = 0, len = words.length; w < len; w++) {
        test += words[w] + " ";
        bitmapText.text = test;
        bitmapText.updateText();
        if (bitmapText.textWidth > maxWidth) {
            output += "\n" + words[w] + " ";
        }
        else {
            output += words[w] + " ";
        }
        test = output;
    }
    
    output = output.replace(/(\s)$/gm, ""); // remove trailing spaces
    bitmapText.text = output;
    bitmapText.updateText();
}

