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
  
  this.init();
};

Game.prototype.init = function(){
    var gameboard = new Board(5,"board");
    
    var board = gameboard.board;
    
    
    for(var i=0;i<board.length;i++){
      if(i<board.length/2-1){
        var pawn = new Pawn("WHITE",board[i].x,board[i].y,board[i].coordX,board[i].coordY);
        board[i].pawn = pawn;
      }
      if(i>board.length/2){
        var pawn = new Pawn("BLACK",board[i].x,board[i].y,board[i].coordX,board[i].coordY);
        board[i].pawn = pawn;
      }
    }
}