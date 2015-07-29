
/**
 * Debugging Utilities, has no relation to ingame content!
 * @class
 * @param {object} public - reference to self for Module Pattern
 * @return {object} public - reference to self
 */
var Utilities = (function (public) {
    
    //private vars
    var log = true;
    var info = true;
    var debug = true;
    var warn = true;
    var error = true;
    var showfps = false;
    
    var expectedGlobals=1000;
    
    /**
    * debug logging wrapper
    * @name output
    * @memberof Utilities
    * @ param {string} message - the text message to use
    * @ param {string} type - the type of logging to use (warn,log,error,debug,info)
    */
    public.output = function (message,type) {
        console.warn(message);
    };
    
    /**
    * sets up prerequisites for performance monitoring
    * @name monitorPerformance
    * @memberof Utilities
    * @ param {object} currentState - reference to the current game / game state
    */
    public.monitorPerformance = function (currentState){
        showfps=true;
        currentState.time.advancedTiming = true;
    };
    
   /**
    * checks global variables, excludes common globals, warns if over limit
    * @name monitorGlobals
    * @memberof Utilities
    * @ param {integer} expected - sets the expected number of globals
    */
    public.monitorGlobals = function (expected){
        expectedGlobals=expected || 1000;
        var globalsList=Object.keys(window);
        for(var i = globalsList.length - 1; i >= 0; i--) {
            //add ignore cases here
            switch (globalsList[i]){
                case "Utilities":
                case "top":
                case "document":
                case "location":
                case "window":
                case "external":
                case "chrome":
                case "PIXI":
                case "p2":      
                case "Phaser":
                    globalsList.splice(i,1);
                    break;
            }
        }
        
        console.info("Filtered Globals",globalsList);
        if ( globalsList.length > expectedGlobals){
            console.warn("UTILS: Expecting ", expectedGlobals, " but found ", globalsList.length, " globals");
        }
            
    };

    /**
    * Finds locations of tiles, useful for placing objects at coordinates
    * based on a tile location, emitters, enemy spawn etc
    * @name getTileLocations
    * @memberof Utilities
    * @ param {object} layer - reference to tilemap layer
    * @ param {integer} id - tile id to match
    * @ return  array of info for matching tile id from layer 
    */
    public.getTileLocations=function (layer, id){
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
    };
    
    return public;

}(Utilities || {})); 
