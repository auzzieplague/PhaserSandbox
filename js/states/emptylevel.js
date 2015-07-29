
THEGAME.LEVEL1 = function (level) {
   
    level.preload = function () {
      console.info("executing a current level preload3");
    };
    
    level.create = function () { 
        THEGAME.create();
        console.info("executing a current level create");
    };
  
    return level;
}(THEGAME.LEVEL1 || {}); 
