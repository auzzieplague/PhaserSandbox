/*
    speechbubbles, tile finding and other things common to all levels
*/

var Common = function (game){};

Common.prototype ={
    
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