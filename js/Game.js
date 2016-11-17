/*
* @author Boris Gallet, Benoit Rospars
* @subject Master WIC 2016 AI Project
*
*
* @description
*
*/

var Game = function(otherGame){
  if (otherGame) {
    this.size = otherGame.size;
    this.gameboard = otherGame.gameboard.clone();
    this.whitePawns = otherGame.whitePawns;
    this.blackPawns = otherGame.blackPawns;
    this.countTurn = otherGame.countTurn;
    this.currentTurn = otherGame.currentTurn;
    this.currentTurnMoves = otherGame.currentTurnMoves;
  } else {
    this.size = 5;
    this.gameboard = null;
    this.whitePawns = 0;
    this.blackPawns = 0;
    this.countTurn = 1;
    this.currentTurn = "WHITE";
    this.currentTurnMoves = [];
  }
};

Game.prototype.init = function(){
  this.gameboard = new Board(5,"board");
  var board = this.gameboard.board;


  for(var y=0;y<this.size;y++){
    for(var x=0;x<this.size;x++){
      if(y<board.length/2-1 || (y<board.length/2 && x<board.length/2-1)){
        //create white pawn at coordinate
        var pawn = new Pawn("WHITE",board[y][x].coordX,board[y][x].coordY);
        //add pawn to the board
        board[y][x].pawn = pawn;
        //add pawn to white pawns list
        this.whitePawns++;
        //Start listening for move action
        pawn.drawnPawn.drag(move, start, stop );
      }
      if(y>board.length/2 || (y>board.length/2-1 && x>board.length/2)){
        //create black pawn at coordinate
        var pawn = new Pawn("BLACK",board[y][x].coordX,board[y][x].coordY);
        //add pawn to the board
        board[y][x].pawn = pawn;
        //add pawn to black pawns list
        this.blackPawns++;
        //Start listening for move action
        pawn.drawnPawn.drag(move, start, stop );
      }
    }
  }
  this.startTurn();
};

Game.prototype.isMoveAllowed = function(oldNode,newNode){
  
  // check if the moved pawn is the color of the current turn
  if(oldNode.pawn.color != this.currentTurn){
    console.log("Pawn is "+oldNode.pawn.color+" current turn is "+this.currentTurn);
    return "ERROR";
  }

  // check if the moved is contained in currentTurnMoves
  for(var key in this.currentTurnMoves){
    if(this.currentTurnMoves[key].currentNode.x == oldNode.x && this.currentTurnMoves[key].currentNode.y == oldNode.y){
      var targetNodes = this.currentTurnMoves[key].currentNodePawnMoves;
      for(var index in targetNodes){
        if(targetNodes[index].targetNode.x == newNode.x && targetNodes[index].targetNode.y == newNode.y){
          if(targetNodes[index].isEatMove){
            targetNodes[index].toBeEatenNode.pawn.drawnPawn.remove();
            delete targetNodes[index].toBeEatenNode.pawn;

            if(this.currentTurn == "WHITE"){
              this.blackPawns--;
            }else{
              this.whitePawns--;
            }

            return "EATMOVE"
          }
          return "MOVE";
        }
      }
    }
  }
  console.log("This move is not allowed");
  return "ERROR";
};

// Look for all possible moves for the team
Game.prototype.getAllPossibleMoves = function () {
  var allPossiblesMoves = [];
  //for each node for the current team we look for all the possible moves
  for(var y=0;y<this.size;y++){
    for(var x=0;x<this.size;x++){
      var currentNode = this.gameboard.board[y][x];
      if(currentNode.pawn && currentNode.pawn.color == this.currentTurn){
        var currentNodePawnMoves = this.getNodePawnPossibleMoves(currentNode, false);
        if(currentNodePawnMoves.length>0){
          allPossiblesMoves.push({currentNode,currentNodePawnMoves});
        }
      }
    }
  }
  return allPossiblesMoves;
};

//Look for possible moves for a node, recursivly if it's a bounce
Game.prototype.getNodePawnPossibleMoves = function(node, isBounce) {
  var nodePawnPossibleMoves = [];
  for(var direction in node.moves){
    if(node.moves[direction]){
      var directionVector = this.gameboard.movesVector[direction];
      var targetNode = this.gameboard.board[node.y + directionVector.y][node.x + directionVector.x];
      if(direction.indexOf("TAKE")==-1 && !isBounce){
        if(!targetNode.pawn){
          nodePawnPossibleMoves.push({targetNode:targetNode, isEatMove : false, toBeEatenNode : null});
        }
      } else {
        // check if the pawn between is a different color pawn
        var testNodeDirection = direction.replace("TAKE", "");
        var directionEatVector = this.gameboard.movesVector[testNodeDirection];
        var toBeEatenNode = this.gameboard.board[node.y + directionEatVector.y][node.x + directionEatVector.x];

        if(toBeEatenNode.pawn && !targetNode.pawn && toBeEatenNode.pawn.color != node.pawn.color){
          nodePawnPossibleMoves.push({targetNode:targetNode, isEatMove : true, toBeEatenNode : toBeEatenNode});
        }
      }
    }
  }
  return nodePawnPossibleMoves;
};

Game.prototype.getNodeAllPossibleEatMoves = function(node){
  var nodeAllPossibleEatMoves = this.getNodePawnPossibleMoves(node, true);

  return [{currentNode:node,currentNodePawnMoves:nodeAllPossibleEatMoves}];
};


Game.prototype.startTurn = function(param){
  if(param != "REBOUND"){
    this.currentTurnMoves = this.getAllPossibleMoves();
  }
  console.log(this.currentTurnMoves);
  var g = this;
  console.log("Game object startTurn",g);

  if(iaWhite != undefined && this.currentTurn == "WHITE"){
    //iaWhite.doMove(g);
  }else if(iaBlack != undefined && this.currentTurn == "BLACK"){
    //iaBlack.doMove(g);
  }
};

// Moving the object pawn in the board array
Game.prototype.endTurn = function(oldNode,newNode,moveType){
  this.gameboard.movePawnFromNode(oldNode,newNode);

  if(moveType == "EATMOVE"){
    var nodePawnPossibleMoves = this.getNodeAllPossibleEatMoves(newNode);
    if (nodePawnPossibleMoves[0].currentNodePawnMoves.length > 0){
      this.currentTurnMoves = nodePawnPossibleMoves;
      this.startTurn("REBOUND");
    } else {
      if(this.whitePawns > 0 && this.blackPawns > 0){
        this.currentTurn = this.currentTurn == "WHITE" ? "BLACK":"WHITE";
        this.countTurn++;
        this.startTurn();
      }else{
        return;
      }      
    }
  } else {
    if(this.whitePawns > 0 && this.blackPawns > 0){
      this.currentTurn = this.currentTurn == "WHITE" ? "BLACK":"WHITE";
      this.countTurn++;
      this.startTurn();
    }else{
      return;
    }
  }
};


Game.prototype.doMove = function(move){
  console.log(move);
  move.origin.pawn.drawnPawn.animate({ 
    cx: move.target.coordX,
    cy: move.target.coordY 
  }, 10);

  var game = this;

  setTimeout(function(){
    var moveType = game.isMoveAllowed(move.origin,move.target);
    game.endTurn(move.origin,move.target,moveType);
  },10);
};

Game.prototype.clone = function() {
  return new Game(this);
};



var move = function(dx,dy) {
  this.attr({
    cx: parseInt(this.data("ox")) + dx,
    cy: parseInt(this.data("oy")) + dy
  });
}

var start = function() {
  this.data('origTransform', this.transform().local );
  this.data("ox", this.attr("cx") );
  this.data("oy", this.attr("cy") );
}
var stop = function() {
  var nearestNode = game.gameboard.getNearestNode(this.attr("cx"),this.attr("cy"));
  var oldNode = game.gameboard.getNodeByCoordinates(this.data("ox"),this.data("oy"));

  //If move allowed then move to nearest and end turn
  var moveType = game.isMoveAllowed(oldNode,nearestNode)
  if(moveType != "ERROR"){
    
    this.animate({ cx: nearestNode.coordX,cy: nearestNode.coordY }, 200);
    game.endTurn(oldNode,nearestNode,moveType);
  //Else return to oldNode
  }else{
    this.animate({ cx: oldNode.coordX,cy: oldNode.coordY }, 200);
  }

}
