/*
    speechbubbles, tile finding and other things common to all levels
*/

var Common = function (game){
};

Common.prototype ={
    preload:function(currentState) {
        
        utility.output("loading common assests","info");
        utility.monitorPerformance(currentState);
        
        currentState.game.load.image('star', 'assets/sprites/star.png');
        currentState.game.load.image('diamond', 'assets/sprites/diamond.png');
        currentState.game.load.spritesheet('dude', 'assets/sprites/dude.png', 32, 48);
        currentState.game.load.spritesheet('bubble-border','assets/sprites/speech2.png',9,9);
        currentState.game.load.image('bubble-tail', 'assets/sprites/speech1.png');
        currentState.game.load.bitmapFont('speech', 'assets/fonts/speech.png', 'assets/fonts/speech.xml');
        
        /*//particle emitter
        this.game.load.image('fire1', 'assets/sprites/fire1.png');
        this.game.load.image('fire2', 'assets/sprites/fire2.png');
        this.game.load.image('fire3', 'assets/sprites/fire3.png');
        this.game.load.image('smoke', 'assets/sprites/smoke-puff.png');
        //*/

    },
    
    create:function (currentState){
         //dont stop game when leave browser
        currentState.game.stage.disableVisibilityChange = true;
        currentState.game.stage.backgroundColor = '#124184';
        //currentState.game.world.setBounds(0, 0, 1600, 1200);
        currentState.game.physics.startSystem(Phaser.Physics.P2JS);
        currentState.game.physics.p2.restitution = 0.0; //bounciness
        currentState.game.physics.p2.gravity.y = 1000;
        currentState.game.physics.p2.friction = 5;
        var worldMaterial = currentState.game.physics.p2.createMaterial('worldMaterial');
        //  4 trues = the 4 faces of the world in left, right, top, bottom order
        currentState.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
        
         
        
    },
    
    setupPlayer : function (currentState) {
     
        player = currentState.game.add.sprite(currentState.game.width /2 , currentState.game.world.height - 300, 'dude');
        currentState.game.physics.p2.enable(player);
        player.body.collideWorldBounds = true;
        player.body.fixedRotation = true;
        player.anchor.setTo(0.5, 0.5);
        //anims
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5, 6, 7, 8], 10, true);
        //collisions
        player.body.onBeginContact.add(currentState.playerHit, currentState);
        currentState.game.camera.follow(player);
    },
     /**
    * helper function to return array of info for matching tile id,
    useful for spawning emitters on specific tiles
    */
    getTileLocations:function (layer, id){
        var h=0; var v=0; var results = [];
        while (v < layer.height){
            h=0;
            while (h < layer.width){
                if ( layer.data[v][h].index==id ){
                    var info={x:layer.data[v][h].worldX ,
                              y:layer.data[v][h].worldY,
                              width:layer.data[v][h].width,
                              height: layer.data[v][h].height,
                              tilex:h,
                              tiley:v,
                              adjustedx:layer.data[v][h].worldX+layer.data[v][h].centerX,
                              adjustedy:layer.data[v][h].worldY+layer.data[v][h].centerY
                             };
                    results.push(info)
                }
            h++;
            }
        v++;
        }
       return results;
    }
};


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