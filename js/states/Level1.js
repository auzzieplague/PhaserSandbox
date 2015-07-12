
var Level1 = function (game) {
    // declare variables here that should be availble from each function
    var player, wolf, platforms, cursors, stars, triggers, score, ball, scoreText, fpstext, startext, fx, bgmusic, emitter, map, layer, backgroundlayer, bgsprite, bgsounds1, bgsounds2;
};
 
Level1.prototype = {

	preload: function () {
        common.preload(this);
        this.game.load.image('backdrop', 'assets/levels/level1_backdrop.png');
        this.game.load.image('layer2', 'assets/levels/level1_pathway.png');
        this.game.load.image('foreground', 'assets/levels/level1_foreground.png');

        this.game.load.audio('sfx', 'assets/audio/fx_mixdown.ogg');
        this.game.load.audio('bg1', 'assets/audio/rain.mp3');
        this.game.load.audio('bg2', 'assets/audio/crickets.mp3');
   
        this.game.load.image('wizball', 'assets/sprites/wizball.png');
        
        //tilemap
        this.game.load.tilemap('map', 'assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles1', 'assets/tiles/tiles1.png');

	},
   
    
  	create: function()
    {
        common.create(this);
 
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
   
        
      
        common.setupPlayer(this);
        
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
        
        fx = this.game.add.audio('sfx');
        fx.addMarker('ping', 10, 1.0);
      
        
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
                    break;
                 case "wizball":
                        this.speak(player, "this is awkward!",20,-20, 5000);
                    break;
                   
                default:
                    utility.output("no player collision handler in playerHit for "+body.sprite.key);
            }
        } 
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
        bubble.destroy();
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


//*/