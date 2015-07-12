
var Level1 = function (game) {
    // declare variables here that should be availble from each function
    var player, wolf, platforms, cursors, stars, triggers, score, ball, scoreText, fpstext, startext, fx, bgmusic, emitter, map, layer, backgroundlayer, bgsprite, bgsounds1, bgsounds2;
};
 
Level1.prototype = {

	preload: function () {
        
        
        utility.output("loading level 1","info");
        utility.monitorPerformance(this);
        
        this.game.load.image('backdrop', 'assets/levels/level1_backdrop.png');
        //this.game.load.image('layer1', 'moonclouds');
        this.game.load.image('layer2', 'assets/levels/level1_pathway.png');
        this.game.load.image('foreground', 'assets/levels/level1_foreground.png');
        
        this.game.load.image('star', 'assets/sprites/star.png');
        this.game.load.image('diamond', 'assets/sprites/diamond.png');
        this.game.load.spritesheet('dude', 'assets/sprites/dude.png', 32, 48);
        
        this.game.load.audio('sfx', 'assets/audio/fx_mixdown.ogg');
        this.game.load.audio('bg1', 'assets/audio/rain.mp3');
        this.game.load.audio('bg2', 'assets/audio/crickets.mp3');
        
         //particle emitter
        this.game.load.image('fire1', 'assets/sprites/fire1.png');
        this.game.load.image('fire2', 'assets/sprites/fire2.png');
        this.game.load.image('fire3', 'assets/sprites/fire3.png');
        this.game.load.image('smoke', 'assets/sprites/smoke-puff.png');
        this.game.load.image('wizball', 'assets/sprites/wizball.png');
        this.game.load.image('tiles1', 'assets/tiles/tiles1.png');

        //tilemap
        this.game.load.tilemap('map', 'assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);

        //speech bubble
        this.game.load.spritesheet('bubble-border','assets/sprites/speech2.png',9,9);
        this.game.load.image('bubble-tail', 'assets/sprites/speech1.png');
        this.game.load.bitmapFont('speech', 'assets/fonts/speech.png', 'assets/fonts/speech.xml');
	},
   
    
  	create: function()
    {
        
        //dont stop game when leave browser
        this.game.stage.disableVisibilityChange = true;
        this.game.stage.backgroundColor = '#124184';
        //this.game.world.setBounds(0, 0, 1600, 1200);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.restitution = 0.0; //bounciness
        this.game.physics.p2.gravity.y = 1000;
        this.game.physics.p2.friction = 5;
        var worldMaterial = this.game.physics.p2.createMaterial('worldMaterial');
        //  4 trues = the 4 faces of the world in left, right, top, bottom order
        this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);

        //this.game.physics.p2.setPostBroadphaseCallback(checkOverlap, this);   //this is used to start the check

        map = this.game.add.tilemap('map');
        map.addTilesetImage('tiles1');
        layer = map.createLayer('tiles');
        map.setCollision(1-5);
        this.game.physics.p2.convertTilemap(map, layer);
        var a = this.game.physics.p2.convertCollisionObjects(map,"collisions");
        layer.resizeWorld();
        
        //setup background layers for parallax
        bgsprite = this.game.add.tileSprite(0, 0, this.game.world.width, 768, 'backdrop');
        this.game.add.sprite(0, 0, 'layer2');
   
        
        //setup player physics
        player = this.game.add.sprite(this.game.width /2 , this.game.world.height - 300, 'dude');
        this.game.physics.p2.enable(player);
        player.body.collideWorldBounds = true;
        player.body.fixedRotation = true;
        player.anchor.setTo(0.5, 0.5);
        //anims
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        //collisions
        player.body.onBeginContact.add(this.playerHit, this);
        this.game.camera.follow(player);
        
        //setup collectables
        stars = this.game.add.group();
        stars.enableBody = true;
        stars.physicsBodyType = Phaser.Physics.P2JS;
        common.getTileLocations (map.layers[0],7).forEach( function (starlocation){
            var star = stars.create(starlocation.adjustedx, starlocation.adjustedy, 'star');
        });
        
        ball = this.game.add.sprite(1000, this.game.world.height - 1000, 'wizball');
        this.game.physics.p2.enable(ball);
        ball.enableBody=true;
        ball.physicsBodyType = Phaser.Physics.P2JS;
        ball.body.collideWorldBounds = true;
        ball.body.setCircle(30);
        ball.scale.setTo(0.7, 0.7)
        
        triggers = this.game.add.group();
        triggers.enableBody = true;
        triggers.physicsBodyType = Phaser.Physics.P2JS;

        var triggerlocations=common.getTileLocations (map.layers[0],5);
        triggerlocations.forEach( function (trigger){
            var newTrigger = triggers.create(trigger.adjustedx, trigger.adjustedy, 'diamond');
            newTrigger.body.static =true;
            newTrigger.body.data.shapes[0].sensor=true;
        });


        scoreText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });
        scoreText.fixedToCamera=true;
        fpstext = this.game.add.bitmapText(16, 48, 'speech','fps: 0',32 );
        fpstext.fixedToCamera=true;
        startext = this.game.add.text(16, 80, 'stars: 0', { fontSize: '32px', fill: '#FFF' });
        startext.fixedToCamera=true;

        //audio
        bgsounds1=this.game.add.audio('bg1');
        bgsounds2=this.game.add.audio('bg2');
        bgsounds1.volume=0.5;
        bgsounds2.volume=0.5;
        bgsounds2.play(null, 0, 0.5, true);
        bgsounds1.play(null, 0, 0.5, true);
        //bgsounds1.play();
        //bgsounds2.play();
        
        fx = this.game.add.audio('sfx');
        fx.addMarker('ping', 10, 1.0);
        //speech bubble
        //var bubble = this.game.world.add(new SpeechBubble(this.game, 350, this.game.world.height - 700, 256, "test speech bubble text, with automatic wrapping."));
        
        //add foreground layer last so it renders on top
        this.game.add.sprite(0, 0, 'foreground');
        
        
	},
    
    update: function()
    {    
        //input control
        {   
            cursors = this.game.input.keyboard.createCursorKeys();

             //  Reset the players velocity (movement)
            player.body.velocity.x = 0;


            if (cursors.left.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.A))
            {
                //  Move to the left
                player.body.velocity.x = -150;
                player.animations.play('left');
                
                //should be mapped to current world position
                bgsprite.tilePosition.x += 0.5;
            }
            else if (cursors.right.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.D))
            {
                //  Move to the right
                player.body.velocity.x = 150;
                player.animations.play('right');
                bgsprite.tilePosition.x -= 0.5;
            }
            else
            {
                //  Stand still
                player.animations.stop();
                player.frame = 4;

            }

            //  Allow the player to jump if they are touching the ground.
            if ((cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)))
                // && checkIfCanJump()) //&& player.body.touching.down)
            {
                player.body.velocity.y = -350;
            }
        }

        fpstext.text = 'fps: '+ this.game.time.fps;
        startext.text ="stars : "+stars.children.length;
    },
    
    playerHit: function (body, shapeA, shapeB, equation) {
        //not all physics bodys are sprites, check which we are dealing with
        if (body.sprite){
            switch(body.sprite.key) {
                case "star":
                        this.removeCollectable(body.sprite);
                    break;
                case "diamond":
                        this.removeCollectable(body.sprite);
                        this.speak(player, "you ran over a trigger!",20,-20, 5000);
                    break;
                   
                default:
                    utility.output("no player collision handler in playerHit for "+body.sprite.key);
            }
        } 
    },
    
    doTrigger : function (trigger){
        // do speech bubble
        //speak(player, "you ran over a trigger!",20,-20, 5000);
    },
    
    
    lockspeak : function (sprite,text,timer,callback) {
        //here the player should be stopped
        //pressing a key / clicking can speed up text
        //the callback may lead to another speech bubble / animation
    },
    
    speak: function (sprite, text, x, y, delay ){
        // add speech box as child object, fade over time
        // delete after time expires.

        //game.time.events.add(Phaser.Timer.SECOND * 4, removeSpeech(bubble), this);
        //^timer events broken, use tweening instead .. use onComplete method for callback

        var bubble = sprite.addChild(new SpeechBubble(x, y, 256, text,this.game));
        bubble.alpha=0.8;
        //to(properties, duration, ease, autoStart, delay, repeat, yoyo)
        var tween=this.game.add.tween(bubble).to( { alpha: 0 }, 2000, 
                                            Phaser.Easing.Linear.None, 
                                            true, 3000, 0, false);

        tween.onComplete.add(this.removeSpeech,this);
    },
    
    removeSpeech: function (bubble) {
        //need to delete bubble
        console.log(bubble);
    },
    
    

    removeCollectable: function (star) {
        star.kill();
        stars.remove(star);     //having trouble removing from array
        fx.play('ping');
    },

    //use this function to handle none responsive collisions
    checkOverlap: function (body1, body2) {
        //return false to allow pass through,
        //handle specific collisions here

        return true;
    },

    hurtspot: function (sp, tile){
       //tile.alpha=0.1;
       layer.dirty=true;
        //tile.worldX
       ball.position.x=tile.worldX-40;
       ball.position.y=tile.worldY-80;
    },

   
    
    checkIfCanJump() {
        var yAxis = p2.vec2.fromValues(0, 1);
        var result = false;

        for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++)
        {
            var c = game.physics.p2.world.narrowphase.contactEquations[i];

            if (c.bodyA === player.body.data || c.bodyB === player.body.data)
            {
                var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
                if (c.bodyA === player.body.data) d *= -1;
                if (d > 0.5) result = true;
            }
        }
        return result;
    }
    //*/
    
}

var SpeechBubble = function(x, y, width, text,currentState) {
    Phaser.Sprite.call(this, currentState, x, y);
    
    // Some sensible minimum defaults
    width = width || 27;
    var height = 18;
    
    // Set up our text and run our custom wrapping routine on it
    this.bitmapText = currentState.add.bitmapText(x + 12, y + 4, 'speech', text, 22);
    SpeechBubble.wrapBitmapText(this.bitmapText, width);
    
    
    // Calculate the width and height needed for the edges
    var bounds = this.bitmapText.getLocalBounds();
    
    
    if (bounds.width + 18 > width) {
        width = bounds.width + 18;
    }
    
    if (bounds.height + 14 > height) {
        height = bounds.height + 14;
    }
    
    // Create all of our corners and edges
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
    
    // Add all of the above to this sprite
    for (var b = 0, len = this.borders.length; b < len; b++) {
        this.addChild(this.borders[b]);   
    }

    // Add the tail
    this.tail = this.addChild(currentState.make.image(x + 18, y + 3 + height, 'bubble-tail'));

    // Add our text last so it's on top
    this.addChild(this.bitmapText);
    this.bitmapText.tint = 0x111111;
    
    // Offset the position to be centered on the end of the tail
    this.pivot.set(x + 25, y + height + 24);
  
};


SpeechBubble.prototype = Object.create(Phaser.Sprite.prototype);
SpeechBubble.prototype.constructor = SpeechBubble;

SpeechBubble.wrapBitmapText = function (bitmapText, maxWidth) {
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
//*/