/* 
* @author Boris Gallet, Benoit Rospars
* @subject Master WIC 2016 AI Project
* @
*
* @description
* The Board class describe the object representing the game board
*/

var Board = function(size,elementID){
    this.board = [];
    this.elementID = elementID;
    this.size = size;
    this.movesVector = {
      'NORTH' : { x: 0, y: 1},
      'EAST' : { x: 1, y: 0},
      'SOUTH' : { x: 0, y: -1},
      'WEST' : { x: -1, y: 0},
      'NORTHEAST' : { x: 1, y: 1},
      'NORTHWEST' : { x: -1, y: 1},
      'SOUTHEAST' : { x: 1, y: -1},
      'SOUTHWEST' : { x: -1, y: -1}
    };
    
    this.init();
};

Board.prototype.init = function(){
    var max = parseInt(this.size/2);
    var min = -parseInt(this.size/2);

    for(var i=0;i<this.size;i++){
        for(var j=0;j<this.size;j++){
            // node coordinate
            var node = {
                'x': j-max,
                'y': i-max
            };

            // node allowed moves
            var moves = {
                'NORTH' : false,
                'EAST' : false,
                'SOUTH' : false,
                'WEST' : false,
                'NORTHEAST' : false,
                'NORTHWEST' : false,
                'SOUTHEAST' : false,
                'SOUTHWEST' : false
            };
            

            // check if NORTHEAST and SOUTHWEST are allowed in these coordinates
            if(node.x == node.y || node.x == node.y-2 || node.x == node.y+2){
              if(node.x < max && node.y < max){
                moves.NORTHEAST = true;
              }
              if(node.x > min && node.y > min){
                moves.SOUTHWEST = true;
              }
            }

            // check if NORTHWEST and SOUTHEAST are allowed in these coordinates
            if(node.x == -node.y || node.x == -node.y-2 || node.x == -node.y+2){
              if(node.x < max && node.y > min){
                moves.SOUTHEAST = true;
              }
              if(node.x > min && node.y < max){
                moves.NORTHWEST = true;
              }
            }

            // check NORTH, EAST, SOUTH, WEST are allowed in these coordinates
            if(node.x < max){
              moves.EAST = true;
            }
            if(node.x > min){
              moves.WEST = true;
            }
            if(node.y < max){
              moves.NORTH = true;
            }
            if(node.y > min){
              moves.SOUTH = true;
            }
            
            
            // add moves to the node
            node.moves = moves;
            
            // add node to the board
            this.board.push(node);
        }
    }
    
    this.drawBoard();

};

Board.prototype.drawBoard = function(){
  
  var element = document.getElementById(this.elementID);
  var width = element.getBoundingClientRect().width;
  var height = element.getBoundingClientRect().height;
  var offset = parseInt(this.size/2);
  
  for(var i=0;i<this.board.length;i++){
    var node = this.board[i];
    var coordX = (node.x + offset)*((width-width*0.2)/(this.size-1))+width*0.1;
    var coordY = (node.y + offset)*((height-height*0.2)/(this.size-1))+height*0.1;
    
    node.coordX = coordX;
    node.coordY = coordY;

    svg.circle(coordX, coordY, 18).attr({fill:"grey"});
    
    var moves = this.board[i].moves;


    for(var key in moves) {
      if(moves[key]){
        var coordX_2 = coordX + this.movesVector[key].x * ( (width-width*0.2) / (this.size-1) );
        var coordY_2 = coordY + this.movesVector[key].y * ( (height-height*0.2) / (this.size-1) );

        svg.line(coordX, coordY, coordX_2, coordY_2)
            .attr({strokeWidth:5,stroke:"grey",strokeLinecap:"round"});
      }
    }
    
  }
};






