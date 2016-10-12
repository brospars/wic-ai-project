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
      'NORTH' : { x: -1, y: 0},
      'EAST' : { x: 0, y: 1},
      'SOUTH' : { x: 1, y: 0},
      'WEST' : { x: 0, y: -1},
      'NORTHEAST' : { x: -1, y: 1},
      'NORTHWEST' : { x: -1, y: -1},
      'SOUTHEAST' : { x: 1, y: 1},
      'SOUTHWEST' : { x: 1, y: -1},
      'TAKENORTH' : { x: -2, y: 0},
      'TAKEEAST' : { x: 0, y: 2},
      'TAKESOUTH' : { x: 2, y: 0},
      'TAKEWEST' : { x: 0, y: -2},
      'TAKENORTHEAST' : { x: -2, y: 2},
      'TAKENORTHWEST' : { x: -2, y: -2},
      'TAKESOUTHEAST' : { x: 2, y: 2},
      'TAKESOUTHWEST' : { x: 2, y: -2}
    };

    this.init();
};

Board.prototype.init = function(){
    var max = this.size-1;
    var min = 0;

    for(var i=0;i<this.size;i++){
        this.board.push([]);
        for(var j=0;j<this.size;j++){
            // node coordinate
            var node = {
                'x': i,
                'y': j
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
                'SOUTHWEST' : false,
                'TAKENORTH' : false,
                'TAKEEAST' : false,
                'TAKESOUTH' : false,
                'TAKEWEST' : false,
                'TAKENORTHEAST' : false,
                'TAKENORTHWEST' : false,
                'TAKESOUTHEAST' : false,
                'TAKESOUTHWEST' : false
            };


            // check if NORTHEAST and SOUTHWEST are allowed in these coordinates
            if(node.x == (-node.y+max) || node.x == (-node.y+max)-2 || node.x == (-node.y+max)+2){
              if(node.x > min && node.y < max){
                moves.NORTHEAST = true;
              }
              if(node.x < max && node.y > min){
                moves.SOUTHWEST = true;
              }
              if(node.x > min+1 && node.y < max-1){
                moves.TAKENORTHEAST = true;
              }
              if(node.x < max-1 && node.y > min+1){
                moves.TAKESOUTHWEST = true;
              }
            }

            // check if NORTHWEST and SOUTHEAST are allowed in these coordinates
            if(node.x == node.y || node.x == node.y+2 || node.x == node.y-2){
              if(node.x < max && node.y < max){
                moves.SOUTHEAST = true;
              }
              if(node.x > min && node.y > min){
                moves.NORTHWEST = true;
              }
              if(node.x < max-1 && node.y < max-1){
                moves.TAKESOUTHEAST = true;
              }
              if(node.x > min+1 && node.y > min+1){
                moves.TAKENORTHWEST = true;
              }
            }

            // check NORTH, EAST, SOUTH, WEST are allowed in these coordinates
            if(node.y < max){
              moves.EAST = true;
            }
            if(node.y > min){
              moves.WEST = true;
            }
            if(node.x > min){
              moves.NORTH = true;
            }
            if(node.x < max){
              moves.SOUTH = true;
            }
            if(node.y < max-1){
              moves.TAKEEAST = true;
            }
            if(node.y > min+1){
              moves.TAKEWEST = true;
            }
            if(node.x > min+1){
              moves.TAKENORTH = true;
            }
            if(node.x < max-1){
              moves.TAKESOUTH = true;
            }


            // add moves to the node
            node.moves = moves;

            // add node to the board
            this.board[i].push(node);
        }
    }

    this.drawBoard();

};

Board.prototype.drawBoard = function(){

  var element = document.getElementById(this.elementID);
  var width = element.getBoundingClientRect().width-160;
  var height = element.getBoundingClientRect().height-160;

  for(var i=0;i<this.size;i++){
    for(var j=0;j<this.size;j++){
      var node = this.board[i][j];
      var coordX = node.x*(width/(this.size-1))+80;
      var coordY = node.y*(height/(this.size-1))+80;

      node.coordX = coordX;
      node.coordY = coordY;

      svg.circle(coordX, coordY, 18).attr({fill:"grey"});

      var moves = this.board[i][j].moves;


      for(var key in moves) {
        if(moves[key]){
          var coordX_2 = coordX + this.movesVector[key].x * ( (width-width*0.2) / (this.size-1) );
          var coordY_2 = coordY + this.movesVector[key].y * ( (height-height*0.2) / (this.size-1) );

          svg.line(coordX, coordY, coordX_2, coordY_2)
              .attr({strokeWidth:5,stroke:"grey",strokeLinecap:"round"});
        }
      }
    }
  }
};

Board.prototype.getNearestNode = function(x,y){
  var minDistance = 99999;
  var nearestNode = null;

  for(var i=0;i<this.size;i++){
    for(var j=0;j<this.size;j++){
      var node = this.board[i][j];
      var distance = Math.sqrt(Math.pow(node.coordX-x,2)+Math.pow(node.coordY-y,2));
      if(distance < minDistance){
        minDistance = distance;
        nearestNode = node;
      }
    }
  }

  return nearestNode;
};

Board.prototype.movePawnFromNode = function(oldNode,newNode){
  newNode.pawn = oldNode.pawn;
  delete oldNode.pawn;
};

Board.prototype.getNodeByCoordinates = function(coordX,coordY){
  var node = null;

  for(var i=0;i<this.size;i++){
    for(var j=0;j<this.size;j++){
      var n = this.board[i][j];

      if(n.coordX == coordX && n.coordY == coordY){
        node = n;
      }
    }
  }

  return node;
};

// return the direction if the move is allowed else return false
Board.prototype.getPathBetweenNodes = function(oldNode,newNode){
  var moveX = newNode.x - oldNode.x;
  var moveY = newNode.y - oldNode.y;
  for(var k in this.movesVector){
    if(this.movesVector[k].x == moveX && this.movesVector[k].y == moveY && oldNode.moves[k]){
      return k;
    }
  }
  return false;
};
