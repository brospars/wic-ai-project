/*
 * @author Boris Gallet, Benoit Rospars
 * @subject Master WIC 2016 AI Project
 *
 *
 * @different IAs
 *
 *
 */

var IA = function (mode,playerColor) {
  this.mode = mode;
  this.playerColor = playerColor;
  this.opponentColor = (this.playerColor == "WHITE") ? "BLACK":"WHITE";
  this.countCalculatedState = 0;
  this.calculatedStates = [];
  this.bestState;
};

IA.prototype.calculateNextMove = function (board,turn,moves) {
  var turn = turn;
  var virtualBoard = cloneBoard(board);
  var turnPossibleMoves = moves ? moves : getTurnPossibleMoves(virtualBoard,turn);

  if (this.mode == "RANDOM") {
    return this.getMoveRandom(turnPossibleMoves);
  } else if (this.mode == "EATFIRST") {
    return this.getMoveEatFirst(turnPossibleMoves);
  }else if (this.mode == "MINIMAX") {
    var starttime = new Date().getTime();
    
    var move = this.getMoveMiniMax(0,virtualBoard,turnPossibleMoves,turn);
    /* Print search tree 
    for(var i in this.calculatedStates){
        for(var j in this.calculatedStates[i]){
          console.log(printBoard(this.calculatedStates[j][j].board));
        }
    }*/
    console.log("Total number of states explored : "+this.countCalculatedState);
    console.log("Best final state : ",this.bestState);
    var endtime = new Date().getTime();
    console.log(endtime-starttime+"ms");
    return move;
  }else{ //default return random 
    return this.getMoveRandom(turnPossibleMoves);
  }
  
};

IA.prototype.getMoveRandom = function (turnPossibleMoves) {
  var indexOrigin = getRandomInt(0,turnPossibleMoves.length);
  var indexTarget = getRandomInt(0,turnPossibleMoves[indexOrigin].targets.length);
  return {
    origin:turnPossibleMoves[indexOrigin].origin,
    target:turnPossibleMoves[indexOrigin].targets[indexTarget]
  };
};

IA.prototype.getMoveEatFirst = function (turnPossibleMoves) {  
  for(var indexOrigin in turnPossibleMoves){
    for(var indexTarget in turnPossibleMoves[indexOrigin].targets){
      var currentTarget = turnPossibleMoves[indexOrigin].targets[indexTarget];
      if(currentTarget.isEatMove){
        return {
          origin:turnPossibleMoves[indexOrigin].origin,
          target:turnPossibleMoves[indexOrigin].targets[indexTarget]
        };
      }
    }
  }
  
  var indexOrigin = getRandomInt(0,turnPossibleMoves.length);
  var indexTarget = getRandomInt(0,turnPossibleMoves[indexOrigin].targets.length);
  return {
    origin:turnPossibleMoves[indexOrigin].origin,
    target:turnPossibleMoves[indexOrigin].targets[indexTarget]
  };
};

IA.prototype.getMoveMiniMax = function (depth,board,turnPossibleMoves,turn) {
  if(depth < 6){
    for(var indexOrigin in turnPossibleMoves){
      for(var indexTarget in turnPossibleMoves[indexOrigin].targets){
        var move = {
            origin:turnPossibleMoves[indexOrigin].origin,
            target:turnPossibleMoves[indexOrigin].targets[indexTarget]
        };

        var nextState = this.simulateTurn(board,move,turn);
        var nextTurn = nextState.turn;
        var nextBoard = nextState.board;
        var nextMoves = getTurnPossibleMoves(nextBoard,nextTurn);
        
        if(!this.bestState || 
           /*nextState.count[this.playerColor]-nextState.count[this.opponentColor] > 
           this.bestState.count[this.playerColor]-this.bestState.count[this.opponentColor]*/
           nextState.count[this.opponentColor] < this.bestState.count[this.opponentColor]
          ){
          this.bestState = nextState;
        }
        
        if(this.calculatedStates[depth] == undefined){
          this.calculatedStates[depth] = [];
        }
        
        this.calculatedStates[depth].push(nextState);
        this.countCalculatedState++;
        
        this.getMoveMiniMax(depth+1,nextBoard,nextMoves,nextTurn);
      }
    }
  }
};

IA.prototype.simulateTurn = function (board, move, turn) {
  var board = cloneBoard(board);
  var origin = board[move.origin.y][move.origin.x];
  var target = board[move.target.y][move.target.x];
  
  target.pawn = origin.pawn;
  delete origin.pawn;
  
  if(move.target.isEatMove){
    var eaten = board[move.target.toBeEatenNode.y][move.target.toBeEatenNode.x];    
    delete eaten.pawn;
  }
  
  turn = (turn == "WHITE") ? "BLACK":"WHITE";
  
  return {
    board:board,
    turn:turn,
    count:countPawns(board)
  };
};







