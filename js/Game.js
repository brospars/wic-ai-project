/*
* @author Boris Gallet, Benoit Rospars
* @subject Master WIC 2016 AI Project
*
*
* @description
*
*/

var Game = function(){
  this.size = 5;
  this.gameboard = null;
  this.whitePawns = [];
  this.blackPawns = [];
  this.currentTurn = "WHITE";
  this.init();
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
        this.whitePawns.push(pawn);
        //Start listening for move action
        pawn.drawnPawn.drag(move, start, stop );
      }
      if(y>board.length/2 || (y>board.length/2-1 && x>board.length/2)){
        //create black pawn at coordinate
        var pawn = new Pawn("BLACK",board[y][x].coordX,board[y][x].coordY);
        //add pawn to the board
        board[y][x].pawn = pawn;
        //add pawn to black pawns list
        this.blackPawns.push(pawn);
        //Start listening for move action
        pawn.drawnPawn.drag(move, start, stop );
      }
    }
  }

  console.log(board);
  this.getAllPossibleMoves();
};

Game.prototype.isMoveAllowed = function(oldNode,newNode){
  console.log(oldNode,newNode);
  // check if the node is empty
  if(!newNode || newNode.pawn){
    console.log("Node does not exist or is occupied");
    return false;
  }
  
  // check if the moved pawn is the color of the current turn
  if(oldNode.pawn.color != this.currentTurn){
    console.log("Pawn is "+oldNode.pawn.color+" current turn is "+this.currentTurn);
    return false;
  }
  
  // check if the newNode is a neighbour of oldNode and if the path is allowed
  var direction = this.gameboard.getPathBetweenNodes(oldNode,newNode);
  if (direction == false){
    console.log("This move is not allowed ...  ");
    return false;
  } else if (direction.indexOf("TAKE")!=-1) {
    //check if the pawn between is a different team color
    var testNodeDirection = direction.replace("TAKE", "");
    var directionVector = this.gameboard.movesVector[testNodeDirection];
    var toBeEatenNode = this.gameboard.board[oldNode.y + directionVector.y][oldNode.x + directionVector.x];
    
    console.log(toBeEatenNode.pawn,oldNode.pawn);
    
    if(toBeEatenNode.pawn && toBeEatenNode.pawn.color != oldNode.pawn.color){
      toBeEatenNode.pawn.drawnPawn.remove();
      delete toBeEatenNode.pawn;
    } else {
      console.log("You don't have the right to eat your own pawns !");
      return false;
    }

  }
  return true;
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
  console.log(allPossiblesMoves);
  //return allPossiblesMoves;
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
          nodePawnPossibleMoves.push(targetNode);
        }
      } else {
        // check if the pawn between is a different color pawn
        var testNodeDirection = direction.replace("TAKE", "");
        var directionEatVector = this.gameboard.movesVector[testNodeDirection];
        var toBeEatenNode = this.gameboard.board[node.y + directionEatVector.y][node.x + directionEatVector.x];

        if(toBeEatenNode.pawn && toBeEatenNode.pawn.color != node.pawn.color){
          //nodePawnPossibleMoves.push(targetNode);
          // recursif call to look for another eating moves
          // this.getNodePawnPossibleMoves(targetNode, true);
        }
      }
    }
  }
  return nodePawnPossibleMoves;
};

Game.prototype.startTurn = function(){
  this.getAllPossibleMoves();
}

// Moving the object pawn in the board array
Game.prototype.endTurn = function(oldNode,newNode){
  this.gameboard.movePawnFromNode(oldNode,newNode);
  this.currentTurn = this.currentTurn == "WHITE" ? "BLACK":"WHITE";
  this.startTurn();
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
  if(game.isMoveAllowed(oldNode,nearestNode)){
    this.animate({ cx: nearestNode.coordX,cy: nearestNode.coordY }, 200);
    game.endTurn(oldNode,nearestNode);
  //Else return to oldNode
  }else{
    this.animate({ cx: oldNode.coordX,cy: oldNode.coordY }, 200);
  }

}
