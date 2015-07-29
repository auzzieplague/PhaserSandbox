/**
 * Includes GUI functionality
 * @class
 */
var THEGAME = (function (common) {
    
   
    common.speak = function (sprite, text, x, y, delay ){
        // add speech box as child object, fade over time
        // delete after time expires.

        //game.time.events.add(Phaser.Timer.SECOND * 4, removeSpeech(bubble), this);
        //^timer events broken, use tweening instead .. use onComplete method for callback

        var bubble = sprite.addChild(new common.SpeechBubble(x, y, 256, text,common.currentstate));
        bubble.alpha=0.8;
        //to(properties, duration, ease, autoStart, delay, repeat, yoyo)
        var tween=common.currentstate.game.add.tween(bubble).to( { alpha: 0 }, 2000, 
                                            Phaser.Easing.Linear.None, 
                                            true, 3000, 0, false);

        tween.onComplete.add(this.removeSpeech,this);
    };
    
    common.removeSpeech= function (bubble) {
        bubble.destroy();
        //console.log(bubble);
    };
        
    
    common.lockSpeak = function (sprite,text,timer,callback) {
        //here the player should be stopped
        //pressing a key / clicking can speed up text
        //the callback may lead to another speech bubble / animation
    };
 
    common.SpeechBubble = function(x, y, width, text,currentState) {
            
        Phaser.Sprite.call(this, currentState, x, y);
        width = width || 27;
        var height = 18;

        // Set up our text and run our custom wrapping routine on it
        this.bitmapText = THEGAME.currentstate.add.bitmapText(x + 12, y + 4, 'speech', text, 22);
        common.SpeechBubble.wrapBitmapText(this.bitmapText, width);
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

    common.SpeechBubble.prototype = Object.create(Phaser.Sprite.prototype);
    common.SpeechBubble.prototype.constructor = common.SpeechBubble;

    common.SpeechBubble.wrapBitmapText = function (bitmapText, maxWidth) {
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

        
    return common;
}(THEGAME || {})); 



