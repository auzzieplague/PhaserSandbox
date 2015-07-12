var TitleMenu = function(game){}

TitleMenu.prototype = {

  preload: function(){
        
        this.game.load.image("backdrop", 'assets/images/titlebg.png');
        this.game.load.image("reaper","assets/images/reaper.png");
	},
  	create: function(){
        var Backdrop = this.game.add.image(0,0,"backdrop");
        var Logo = this.game.add.image(350,350,"reaper");
        
        this.game.add.tween(Logo).to( { alpha: 0 }, 3000).start().onComplete.add(
                function () {this.game.state.start("Level1"); 
                }, this);
	}
}