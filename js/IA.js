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
  }else if (this.mode == "ALPHA-BETA PRUNING") {
    return this.getMoveAlphaBeta(virtualBoard,turnPossibleMoves,turn);
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
  var countCalculs = 0;

  max(0,board,turnPossibleMoves,turn);
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

          var val = min(depth+1,nextBoard,nextMoves,nextTurn);

          //We count each compare to analyze
          countCalculs++;

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

          var val = max(depth+1,nextBoard,nextMoves,nextTurn);

          countCalculs++;

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

IA.prototype.getMoveAlphaBeta = function (board,turnPossibleMoves,turn) {
  var ia = this;
  var maxDepth = (this.playerColor == "WHITE") ? options.whiteIADepth : options.blackIADepth;
  var chosenMoves = [];
  var alpha = -999;
  var beta = 999;
  var countCalculs = 0;
  var countPrunning = 0;

  // We run the reccursive algorythm for the current board
  alphabeta(0,board,turnPossibleMoves,turn, alpha, beta);
  var chosenMove = chosenMoves[getRandomInt(0,chosenMoves.length)];

  console.log("Number of calculs in Alpha-Beta Prunning "+ countCalculs);
  console.log("Number of Pruning : ")
  return chosenMove;

  function alphabeta(depth, board, turnPossibleMoves, turn, alpha, beta){
    if(depth == maxDepth){
      console.log("Alpha-Beta maxDepth Eval : " + eval(board));
      return eval(board) //If we are on a leaf, we return the value
    } else {
      if (depth%2 != 0) { //if we are on Minimize node for all children we do
        var val = 999;
        console.log("Minimize node level : " + depth );
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

            val = Math.min(val, alphabeta(depth+1,nextBoard,nextMoves,nextTurn, alpha, beta));
            if(alpha >= val){ //If alpha lower than val min we're alphaPrunning and return val
              countPrunning++;
              return val;
            }
            beta = Math.min(beta,val); //We update beta value because we're on minimize node
          }
        }
      } else { // If we're not on minimize node we are on maximize node
        var val = -999;
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

            console.log("val lvl 1 :" + val);

            val = Math.max(val, alphabeta(depth+1,nextBoard,nextMoves,nextTurn, alpha, beta));
            if(val >= beta){ //if value in max greater or egal than beta so we're betaPrunning and return val
              countPrunning++;
              return val;
            }
            console.log("val " + val + " | alpha : " + alpha);
            if(depth == 0 && alpha >= val){
              console.log("we add a move ");
              chosenMoves.push(move);
            }
            val = Math.max(alpha,val); //We update the value of the minimize node
          }
        }
      }
    }
  };
  /**
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

          var val = min(depth+1,nextBoard,nextMoves,nextTurn);
          countCalculs++;
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

          var val = max(depth+1,nextBoard,nextMoves,nextTurn);
          countCalculs++;
          if(val < min){
            min = val;
          }
        }
      }

      return min;
    }else{
      return eval(board);
    }
  } **/

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
    turn:turn
  };
};
