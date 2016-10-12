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


  for(var i=0;i<this.size;i++){
    for(var j=0;j<this.size;j++){
      if(j<board.length/2-1 || (j<board.length/2 && i<board.length/2-1)){
        //create white pawn at coordinate
        var pawn = new Pawn("WHITE",board[i][j].x,board[i][j].y,board[i][j].coordX,board[i][j].coordY);
        //add pawn to the board
        board[i][j].pawn = pawn;
        //add pawn to white pawns list
        this.whitePawns.push(pawn);
        //Start listening for move action
        pawn.drawnPawn.drag(move, start, stop );
      }
      if(j>board.length/2 || (j>board.length/2-1 && i>board.length/2)){
        //create black pawn at coordinate
        var pawn = new Pawn("BLACK",board[i][j].x,board[i][j].y,board[i][j].coordX,board[i][j].coordY);
        //add pawn to the board
        board[i][j].pawn = pawn;
        //add pawn to black pawns list
        this.blackPawns.push(pawn);
        //Start listening for move action
        pawn.drawnPawn.drag(move, start, stop );
      }
    }
  }

  console.log(board);
};

Game.prototype.isMoveAllowed = function(oldNode,newNode){
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
  }
  return true;
};

// Moving the object pawn in the board array
Game.prototype.endTurn = function(oldNode,newNode){
  this.gameboard.movePawnFromNode(oldNode,newNode);
  this.currentTurn = this.currentTurn == "WHITE" ? "BLACK":"WHITE";
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
