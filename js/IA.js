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
};

IA.prototype.calculateNextMove = function (board,turn,moves) {
  var starttime = new Date().getTime();
  var turn = turn;
  var virtualBoard = cloneBoard(board);
  var turnPossibleMoves = moves ? moves : getTurnPossibleMoves(virtualBoard,turn);

  if (this.mode == "RANDOM") {
    return this.getMoveRandom(turnPossibleMoves);
  } else if (this.mode == "EATFIRST") {
    return this.getMoveEatFirst(turnPossibleMoves);
  }else if (this.mode == "MINIMAX") {
    return this.getMoveMiniMax(virtualBoard,turnPossibleMoves,turn);
  }else{ //default return random 
    return this.getMoveRandom(turnPossibleMoves);
  }

  var endtime = new Date().getTime();
  console.log(endtime-starttime+"ms");  
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

IA.prototype.getMoveMiniMax = function (board,turnPossibleMoves,turn) {
  var ia = this;
  var maxDepth = (this.playerColor == "WHITE") ? options.whiteIADepth : options.blackIADepth;
  var chosenMoves = [];
  
  console.log(max(0,board,turnPossibleMoves,turn));
  
  var chosenMove = chosenMoves[getRandomInt(0,chosenMoves.length)];

  return chosenMove;
  
  function max(depth,board,turnPossibleMoves,turn){
    if(depth < maxDepth){
      var max = -999;
      
      for(var indexOrigin in turnPossibleMoves){
        for(var indexTarget in turnPossibleMoves[indexOrigin].targets){
          var move = {
              origin:turnPossibleMoves[indexOrigin].origin,
              target:turnPossibleMoves[indexOrigin].targets[indexTarget]
          };

          var nextState = ia.simulateTurn(board,move,turn);
          var nextTurn = nextState.turn;
          var nextBoard = nextState.board;
          var nextMoves = getTurnPossibleMoves(nextBoard,nextTurn);
          
          ia.countCalculatedState++;

          var val = min(depth+1,nextBoard,nextMoves,nextTurn);
          
          if(val >= max){
            max = val;
            //Push to choseMoves if it's next move (aka depth = 0)
            if(depth == 0){
              chosenMoves.push(move);
            }
          }
        }
      }
        
      return max;
    }else{
      return eval(board);
    }
  }
  
  function min(depth,board,turnPossibleMoves,turn){
    if(depth < maxDepth){
      var min = 999;
      
      for(var indexOrigin in turnPossibleMoves){
        for(var indexTarget in turnPossibleMoves[indexOrigin].targets){
          var move = {
              origin:turnPossibleMoves[indexOrigin].origin,
              target:turnPossibleMoves[indexOrigin].targets[indexTarget]
          };

          var nextState = ia.simulateTurn(board,move,turn);
          var nextTurn = nextState.turn;
          var nextBoard = nextState.board;
          var nextMoves = getTurnPossibleMoves(nextBoard,nextTurn);
          
          ia.countCalculatedState++;

          var val = max(depth+1,nextBoard,nextMoves,nextTurn);
          
          if(val < min){
            min = val;
          }
        }
      }
      
      return min;
    }else{
      return eval(board);
    }
  }
  
  function eval(board){
    var scores = countScores(board);
    if(ia.playerColor == "WHITE"){
      return scores["WHITE"]-scores["BLACK"];
    }else{
      return scores["BLACK"]-scores["WHITE"];
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







