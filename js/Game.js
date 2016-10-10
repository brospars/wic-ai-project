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
  this.init();
};

Game.prototype.init = function(){
    this.gameboard = new Board(5,"board");
    var board = this.gameboard.board;
    
    
    for(var i=0;i<this.size;i++){
      for(var j=0;j<this.size;j++){
        if(j<board.length/2-1 || (j<board.length/2 && i<board.length/2-1)){
          var pawn = new Pawn("WHITE",board[i][j].x,board[i][j].y,board[i][j].coordX,board[i][j].coordY);
          board[i][j].pawn = pawn;
          pawn.drawnPawn.drag(move, start, stop );
        }
        if(j>board.length/2 || (j>board.length/2-1 && i>board.length/2)){
          var pawn = new Pawn("BLACK",board[i][j].x,board[i][j].y,board[i][j].coordX,board[i][j].coordY);
          board[i][j].pawn = pawn;
          pawn.drawnPawn.drag(move, start, stop );
        }
      }
    }
};

Game.prototype.getAllowedMoves = function(pawn){
  var board = gameboard.board;
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
  console.log('finished dragging');
  
}