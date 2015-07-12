
/*debug utilities, file loading / handling functions
nothing related to ingame content
*/
var Utilities = function (game){};

Utilities.prototype ={
    //enabled state of various logging methods
    log : true,
    info : true,
    debug : true,
    warn : true,
    error : true,
    showfps : false,
    
    /*control logging mechanism, \
    *(file or console, show enabled types only)
    */
    output : function (message,type) {
        console.warn(message);
        /*console.log('console.log');
        console.info('console.info');
        console.debug('console.debug');
        console.warn('console.warn');
        console.error('console.error');
        */
    },
    
    monitorPerformance : function (currentState){
        showfps=true;
        currentState.time.advancedTiming = true;
    }
    
};
