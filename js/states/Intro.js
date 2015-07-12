var Intro = function(game){}
 
Intro.prototype = {
	preload: function(){
        
        this.game.load.image("backdrop", 'assets/images/titlebg.png');
        this.game.load.image("reaper","assets/images/reaper.png");
        this.game.load.audio("thunder","assets/audio/thunder1.mp3");
	},
  	create: function(){
        var Backdrop = this.game.add.image(0,0,"backdrop");
        var Logo = this.game.add.image(350,350,"reaper");
        
        this.game.add.audio("thunder").play();
        Logo.alpha = 0;
        
        this.game.add.tween(Logo).to( { alpha: 1 }, 3000).start().onComplete.add(
                function () {this.game.state.start("TitleMenu"); 
                }, this);
	}
}