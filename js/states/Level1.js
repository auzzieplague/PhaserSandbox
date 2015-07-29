
/**
 * LEVEL1 content manager
 * @class
 * @param {object} public - reference to self for Module Pattern
 * @return {object} public - reference to self
 */
THEGAME.LEVEL1 = function (level) {
   
    var stars , fx;
    var scoretext, fpstext;
    
    /**
    * calls base preloader then continues to preload assets
    * @name preload
    * @memberof THEGAME.LEVEL1
    */
    level.preload = function () {
        THEGAME.preload();
        console.info("executing a current level preload");
        this.game.load.image('backdrop', 'assets/levels/level1_backdrop.png');
        this.game.load.image('layer2', 'assets/levels/level1_pathway.png');
        this.game.load.image('foreground', 'assets/levels/level1_foreground.png');
        this.game.load.audio('sfx', 'assets/audio/fx_mixdown.ogg');
        this.game.load.audio('bg1', 'assets/audio/rain.mp3');
        this.game.load.audio('bg2', 'assets/audio/crickets.mp3');
        this.game.load.image('wizball', 'assets/sprites/wizball.png');
        this.game.load.tilemap('map', 'assets/maps/level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles1', 'assets/tiles/tiles1.png');   
    };
    
    /**
    * calls base create method then continues to setup stage for level
    * @name create
    * @memberof THEGAME.LEVEL1
    */
    level.create = function () { 
        
        //todo: research if it's necessary to var these variables, 
        // they're not appearing globally
        THEGAME.create();
        console.info("executing a current level create");
        
        var map = this.game.add.tilemap('map');
        map.addTilesetImage('tiles1');
        var layer = map.createLayer('tiles');
        map.setCollision(1-5);
        this.game.physics.p2.convertTilemap(map, layer);
        var a = this.game.physics.p2.convertCollisionObjects(map,"collisions");
        layer.resizeWorld();
        
        //setup background layers for parallax
        THEGAME.bgsprite = this.game.add.tileSprite(0, 0, this.game.world.width, 768, 'backdrop');
        this.game.add.sprite(0, 0, 'layer2');
   
        THEGAME.setupPlayer(this);
        
        //setup collectables
        stars = this.game.add.group();
        stars.enableBody = true;
        stars.physicsBodyType = Phaser.Physics.P2JS;
        Utilities.getTileLocations (map.layers[0],7).forEach( function (starlocation){
            var star = stars.create(starlocation.adjustedx, starlocation.adjustedy, 'star');
        });
        
        var ball = this.game.add.sprite(1000, this.game.world.height - 1000, 'wizball');
        this.game.physics.p2.enable(ball);
        ball.enableBody=true;
        ball.physicsBodyType = Phaser.Physics.P2JS;
        ball.body.collideWorldBounds = true;
        ball.body.setCircle(30);
        ball.scale.setTo(0.7, 0.7)
        
        var triggers = this.game.add.group();
        triggers.enableBody = true;
        triggers.physicsBodyType = Phaser.Physics.P2JS;

        var triggerlocations=Utilities.getTileLocations (map.layers[0],5);
        triggerlocations.forEach( function (trigger){
            var newTrigger = triggers.create(trigger.adjustedx, trigger.adjustedy, 'diamond');
            newTrigger.body.static =true;
            newTrigger.body.data.shapes[0].sensor=true;
        });
        
        scoretext = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#FFF' });
        scoretext.fixedToCamera=true;
        fpstext = this.game.add.bitmapText(16, 48, 'speech','fps: 0',32 );
        fpstext.fixedToCamera=true;
        startext = this.game.add.text(16, 80, 'stars: 0', { fontSize: '32px', fill: '#FFF' });
        startext.fixedToCamera=true;
        
        //audio
        var bgsounds1=this.game.add.audio('bg1');
        var bgsounds2=this.game.add.audio('bg2');
        bgsounds1.volume=0.5;
        bgsounds2.volume=0.5;
        bgsounds2.play(null, 0, 0.5, true);
        bgsounds1.play(null, 0, 0.5, true);
        
        fx = this.game.add.audio('sfx');
        fx.addMarker('ping', 10, 1.0);
      
        
        this.game.add.sprite(0, 0, 'foreground');
    };
    
    /**
    * calls base update method then continues level update loop
    * @name create
    * @memberof THEGAME.LEVEL1
    */
    level.update = function () { 
        THEGAME.update();
        
        fpstext.text = 'fps: '+ this.game.time.fps;
        startext.text ="stars : "+stars.children.length;
    };
    
    
    /**
    * handles player responses to hitting objects (not always response collisions, eg collectables)
    * @name playerHit
    * @memberof THEGAME.LEVEL1
    * @param {object} body - physics body of colliding sprite
    * @param {object} ShapeA 
    * @param {object} ShapeB 
    * @param {object} Equation 
    */
    level.playerHit= function (body, shapeA, shapeB, equation) {
        //not all physics bodys are sprites, check which we are dealing with
        if (body){
            if (body.sprite){
                switch(body.sprite.key) {
                    case "star":
                            this.removeCollectable(body.sprite);
                        break;
                    case "diamond":
                            //do trigger action
                            this.removeCollectable(body.sprite);

                        break;
                     case "wizball":
                            THEGAME.speak(player, "this is awkward!",20,-20, 5000);
                        break;

                    default:
                        utility.output("no player collision handler in playerHit for "+body.sprite.key);
                }
            } 
        }
    };
    
    
    level.removeCollectable= function (star) {
        //try to generalize this to remove from parent colleciton
        star.kill();
        stars.remove(star);     //having trouble removing from array
        fx.play('ping');
    };
        
  
    
    return level;
}(THEGAME.LEVEL1 || {}); 
