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

Game.prototype.getAllowedMoves = function(pawn){
  var board = gameboard.board;
  return [];
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
  if(nearestNode && !nearestNode.pawn){
    this.animate({ cx: nearestNode.coordX,cy: nearestNode.coordY }, 200);
    game.gameboard.movePawnFromNode(this,nearestNode);
  }else{
    this.animate({ cx: this.data("ox"),cy: this.data("oy") }, 200);
  }
  
}