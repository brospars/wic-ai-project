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
  this.countedStates = 0;
};

IA.prototype.calculateNextMove = function (board,turn,moves,isRebound) {
  var starttime = new Date().getTime();
  var turn = turn;
  var virtualBoard = cloneBoard(board);
  var turnPossibleMoves = moves ? moves : getTurnPossibleMoves(virtualBoard,turn);

  if (this.mode == "RANDOM") {
    return this.getMoveRandom(turnPossibleMoves);
  } else if (this.mode == "EATFIRST") {
    return this.getMoveEatFirst(turnPossibleMoves);
  }else if (this.mode == "MINIMAX") {
    if(isRebound){
      return this.getMoveEatFirst(turnPossibleMoves);
    }
    return this.getMoveMiniMax(virtualBoard,turnPossibleMoves,turn);
  }else if (this.mode == "ALPHA-BETA PRUNING") {
    if(isRebound){
      return this.getMoveEatFirst(turnPossibleMoves);
    }
    return this.getMoveAlphaBeta(virtualBoard,turnPossibleMoves,turn);
  }else{ //default return random
    return this.getMoveRandom(turnPossibleMoves);
  }

  var endtime = new Date().getTime();
  console.log(endtime-starttime+"ms");
};

IA.prototype.getMoveRandom = function (turnPossibleMoves) {
  this.countedStates++;
  
  var indexOrigin = getRandomInt(0,turnPossibleMoves.length);
  var indexTarget = getRandomInt(0,turnPossibleMoves[indexOrigin].targets.length);
  return {
    origin:turnPossibleMoves[indexOrigin].origin,
    target:turnPossibleMoves[indexOrigin].targets[indexTarget]
  };
};

IA.prototype.getMoveEatFirst = function (turnPossibleMoves) {
  this.countedStates++;
  
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
  var bestSoFar = -999;
  var chosenMoves = [];
  var countCalculs = 0;

  max(0,board,turnPossibleMoves,turn);
  var chosenMove = chosenMoves[getRandomInt(0,chosenMoves.length)].move;

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
              if(val > bestSoFar){
                  bestSoFar = val;
                  chosenMoves = [];
              }
              chosenMoves.push({move:move,val:val});
            }
          }
        }
      }

      return max;
    }else{
      
      return ia.eval(board);
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
      return ia.eval(board);
    }
  }
};

IA.prototype.getMoveAlphaBeta = function (board,turnPossibleMoves,turn) {
  var ia = this;
  var maxDepth = (this.playerColor == "WHITE") ? options.whiteIADepth : options.blackIADepth;
  var bestSoFar = -999;
  var chosenMoves = [];
  var alpha = -999;
  var beta = 999;
  var countCalculs = 0;
  var countPruning = 0;

  // We run the reccursive algorythm for the current board
  alphabeta(0,board,turnPossibleMoves,turn, alpha, beta);
  var chosenMove = chosenMoves[getRandomInt(0,chosenMoves.length)].move;
  //console.log(chosenMoves);
  
  var nbPossibles = 0;
  
  for(var indexOrigin in turnPossibleMoves){
    for(var indexTarget in turnPossibleMoves[indexOrigin].targets){
      nbPossibles++;
    }
  }

  /*console.log("Number of calculs in Alpha-Beta Prunning "+ countCalculs);
  console.log("Number of Pruning : " + countPruning);
  console.log("Number of Possible moves,candidat moves : ",nbPossibles,chosenMoves.length);*/
  return chosenMove;

  function alphabeta(depth, board, turnPossibleMoves, turn, alpha, beta){
    if(depth == maxDepth){
      return ia.eval(board) //If we are on a leaf, we return the value
    } else {
      if (depth%2 != 0) { //if we are on Minimize node for all children we do
        var val = 999;
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

            countCalculs++;
            val = Math.min(val, alphabeta(depth+1,nextBoard,nextMoves,nextTurn, alpha, beta));
            
            if(alpha >= val){ //If alpha lower than val min we're alphaPrunning and return val
              countPruning++;
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

            countCalculs++;
            
            var recursiveVal = alphabeta(depth+1,nextBoard,nextMoves,nextTurn, alpha, beta);             
            if(recursiveVal >= val){
              val = recursiveVal;
              if(depth == 0){
                if(val > bestSoFar){
                  bestSoFar = val;
                  chosenMoves = [];
                }
                chosenMoves.push({move:move,val:val});
              }
            }
            
            if(val >= beta){ //if value in max greater or egal than beta so we're betaPrunning and return val
              countPruning++;
              return val;
            }            
            alpha = Math.max(alpha,val); //We update the value of the minimize node
          }
        }
      }

      return val;
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
    
    this.simulateRebound(board,target);
  }
  
  turn = (turn == "WHITE") ? "BLACK":"WHITE";
  
  this.countedStates++;

  return {
    board:board,
    turn:turn
  };
};

IA.prototype.simulateRebound = function (board, bouncingPawn) {
  var targets = getPawnPossibleMoves(board,board[bouncingPawn.y][bouncingPawn.x],true);
  if(targets.length > 0){
    var board = cloneBoard(board);
    var origin = board[bouncingPawn.y][bouncingPawn.x];
    var target = board[targets[0].y][targets[0].x];
    
    target.pawn = origin.pawn;
    delete origin.pawn;
    
    var eaten = board[targets[0].toBeEatenNode.y][targets[0].toBeEatenNode.x];
    delete eaten.pawn;
    
    board = this.simulateRebound(board,target);
  }else{
    return board;
  }
};

IA.prototype.eval = function(board){
  var scores = countPawns(board);
  if(this.playerColor == "WHITE"){
    return -scores["BLACK"];
  }else{
    return -scores["WHITE"];
  }
};
