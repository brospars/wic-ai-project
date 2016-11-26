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
  this.whitePawns = 0;
  this.blackPawns = 0;
  this.countTurn = 1;
  this.currentTurn = "WHITE";
  this.currentTurnMoves = [];
  this.gameIsRunning = false;
  this.timeouts = [];
  this.history = [];
};

Game.prototype.init = function(){
  this.gameboard = new Board(5,"board");
  var board = this.gameboard.board;
  
  var element = document.getElementById(this.gameboard.elementID);
  var pawnSize = parseInt(element.getBoundingClientRect().width/15);

  for(var y=0;y<this.size;y++){
    for(var x=0;x<this.size;x++){
      if(y<board.length/2-1 || (y<board.length/2 && x<board.length/2-1)){
        //create white pawn at coordinate
        var pawn = new Pawn("WHITE",board[y][x].coordX,board[y][x].coordY,pawnSize);
        //add pawn to the board
        board[y][x].pawn = pawn;
        //add pawn to white pawns list
        this.whitePawns++;
        //Start listening for move action
        pawn.drawnPawn.drag(move, start, stop );
      }
      if(y>board.length/2 || (y>board.length/2-1 && x>board.length/2)){
        //create black pawn at coordinate
        var pawn = new Pawn("BLACK",board[y][x].coordX,board[y][x].coordY,pawnSize);
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

//Resume the game if not already running
Game.prototype.start = function(){
  if(!this.gameIsRunning){
    this.gameIsRunning = true;
    this.startTurn();
  }  
};

//Pause the game
Game.prototype.pause = function(){
  this.gameIsRunning = false;
};

//if IA mode get next move else get possible moves
Game.prototype.startTurn = function(){
  if(this.gameIsRunning){
    if(this.currentTurn == "WHITE" && options.whiteIAEnabled){
      var ia = new IA(options.whiteIAMode, this.currentTurn);
      var move = ia.calculateNextMove(this.gameboard.board, this.currentTurn);
      this.doMove(move);
    }else if(this.currentTurn == "BLACK" && options.blackIAEnabled){
      var ia = new IA(options.blackIAMode, this.currentTurn);
      var move = ia.calculateNextMove(this.gameboard.board, this.currentTurn);
      this.doMove(move);
    }else{
      this.currentTurnMoves = getTurnPossibleMoves(cloneBoard(this.gameboard.board),this.currentTurn);
    }
  }
};

//if IA mode get next move (rebound)
Game.prototype.startRebound = function(moves){
  console.log("REBOUND");
  var game = this;
  
  if(this.currentTurn == "WHITE" && options.whiteIAEnabled){
    var ia = new IA(options.whiteIAMode, this.currentTurn);
    var move = ia.calculateNextMove(game.gameboard.board, game.currentTurn, moves);
    game.doMove(move);       
  }else if(this.currentTurn == "BLACK" && options.blackIAEnabled){
    var ia = new IA(options.blackIAMode, this.currentTurn);
    var move = ia.calculateNextMove(game.gameboard.board, game.currentTurn, moves);
    game.doMove(move);
  }else{
    this.currentTurnMoves = moves;
  }
};

// Change current turn, count it and start new turn
Game.prototype.endTurn = function(){
  this.currentTurn = this.currentTurn == "WHITE" ? "BLACK":"WHITE";
  this.countTurn++;
  this.history.push(cloneBoard(this.gameboard.board));
    
  if(this.blackPawns < 1){
    this.endGame("White");
    return;
  }
  if(this.whitePawns < 1){
    this.endGame("Black");
    return;
  }
  
  this.startTurn();
};


Game.prototype.doMove = function(move){
  var game = this;
  var origin = this.gameboard.board[move.origin.y][move.origin.x];
  var target = this.gameboard.board[move.target.y][move.target.x];
  
  origin.pawn.drawnPawn.animate({ 
    cx: target.coordX,
    cy: target.coordY 
  }, options.speed);  
  
  this.gameboard.movePawnFromNode(move);
  
  if(move.target.isEatMove){
    console.log(move.origin.pawn+" eat "+move.target.toBeEatenNode.pawn);
    if(move.target.toBeEatenNode.pawn == "WHITE"){
      this.whitePawns = this.whitePawns-1;
    }else{
      this.blackPawns= this.blackPawns-1;
    }    
    
    console.log("turn : "+this.countTurn,"w : "+this.whitePawns,"b : "+this.blackPawns);
    
    var virtualBoard = cloneBoard(this.gameboard.board);
    var reboundMoves = {
      origin:virtualBoard[move.target.y][move.target.x],
      targets:getPawnPossibleMoves(virtualBoard,virtualBoard[target.y][target.x],true)
    };    
    
    if(reboundMoves.targets.length > 0){
      this.timeouts.push(setTimeout(function(){game.startRebound([reboundMoves]);},options.speed*2));
    }else{
      this.timeouts.push(setTimeout(function(){game.endTurn();},options.speed*2));
    }    
    
  }else{
    this.timeouts.push(setTimeout(function(){game.endTurn();},options.speed*2));
  }
  
};


Game.prototype.getMove = function(origin,target){
  
  // check if the moved pawn is the color of the current turn
  if(origin.pawn.color != this.currentTurn){
    console.log("Pawn is "+origin.pawn.color+" current turn is "+this.currentTurn);
    return "ERROR";
  }

  // check if the moved is contained in currentTurnMoves
  for(var key in this.currentTurnMoves){
    if(this.currentTurnMoves[key].origin.x == origin.x && this.currentTurnMoves[key].origin.y == origin.y){
      var targets = this.currentTurnMoves[key].targets;
      for(var index in targets){
        if(targets[index].x == target.x && targets[index].y == target.y){
          return {
            origin:this.currentTurnMoves[key].origin,
            target:this.currentTurnMoves[key].targets[index]
          };
        }
      }
    }
  }
  
  console.log("This move is not allowed");
  return "ERROR";
};

// popup to annouce who win
Game.prototype.endGame = function(color){
  console.log(this.history);
  for(var i in this.history){
    console.log(printBoard(this.history[i]));
  }
  alert(color+' wins !');
};

// clear all event and timeouts, then destroy himself
Game.prototype.destroy = function(){
  for(var key in this.timeouts){
    clearTimeout(this.timeouts[key]);
  }
};

var move = function(dx,dy) {
  this.attr({
    cx: parseInt(this.data("ox")) + dx,
    cy: parseInt(this.data("oy")) + dy
  });
}

var start = function() {
  this.data('origTransform', this.transform().local);
  this.data("ox", this.attr("cx") );
  this.data("oy", this.attr("cy") );
}
var stop = function() {
  var origin = game.gameboard.getNodeByCoordinates(this.data("ox"),this.data("oy"));
  var target = game.gameboard.getNearestNode(this.attr("cx"),this.attr("cy"));

  //If move allowed then move to nearest and end turn
  var move = game.getMove(origin,target);
  if(move != "ERROR"){
    game.doMove(move);
  //Else return to oldNode
  }else{
    this.animate({ cx: origin.coordX,cy: origin.coordY }, 200);
  }

}
