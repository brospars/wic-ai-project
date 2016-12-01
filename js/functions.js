function getTurnPossibleMoves(board, turn) {
  var turnPossibleMoves = [];

  //for each node for the current team we look for all the possible moves
  for (var y = 0; y < board.length; y++) {
    for (var x = 0; x < board[y].length; x++) {
      var currentNode = board[y][x];
      //if currentNode has pawn and is the right color then get pawn possible moves
      if (currentNode.pawn && currentNode.pawn == turn) {
        var currentPawnMoves = getPawnPossibleMoves(board, currentNode, false);
        if (currentPawnMoves.length > 0) {
          turnPossibleMoves.push({
            origin: {
              x: currentNode.x,
              y: currentNode.y,
              pawn: currentNode.pawn
            },
            targets: currentPawnMoves
          });
        }
      }
    }
  }

  return turnPossibleMoves;
}

function getPawnPossibleMoves(board, node, isBounce) {
  var pawnPossibleMoves = [];

  for (var direction in node.moves) {
    if (node.moves[direction]) {
      var directionVector = options.movesVector[direction];
      var targetNode = board[node.y + directionVector.y][node.x + directionVector.x];

      //non eating move
      if (direction.indexOf("TAKE") == -1 && !isBounce) {
        if (!targetNode.pawn) {
          pawnPossibleMoves.push({
            x: targetNode.x,
            y: targetNode.y,
            isEatMove: false,
            toBeEatenNode: null
          });
        }
        // eating move  
      } else {
        // check if the pawn between is a different color pawn
        var testNodeDirection = direction.replace("TAKE", "");
        var directionEatVector = options.movesVector[testNodeDirection];
        var toBeEatenNode = board[node.y + directionEatVector.y][node.x + directionEatVector.x];

        if (toBeEatenNode.pawn && !targetNode.pawn && toBeEatenNode.pawn != node.pawn) {
          pawnPossibleMoves.push({
            x: targetNode.x,
            y: targetNode.y,
            isEatMove: true,
            toBeEatenNode: {
              x: toBeEatenNode.x,
              y: toBeEatenNode.y,
              pawn: toBeEatenNode.pawn
            }
          });
        }
      }
    }
  }
  return pawnPossibleMoves;
}

function cloneBoard(board) {
  var clonedBoard = [];

  for (var y = 0; y < board.length; y++) {
    clonedBoard.push([]);
    for (var x = 0; x < board[y].length; x++) {
      var node = {
        x: board[y][x].x,
        y: board[y][x].y,
        moves: board[y][x].moves
      };

      if (board[y][x].pawn != undefined) {
        //si on clone deja un board cloné
        if (board[y][x].pawn == "WHITE" || board[y][x].pawn == "BLACK") {
          node.pawn = board[y][x].pawn;
        } else {
          node.pawn = board[y][x].pawn.color;
        }
      }


      clonedBoard[y].push(node);
    }
  }

  return clonedBoard;
}

function printBoard(board) {
  var print = '';
  for (var y = 0; y < board.length; y++) {
    print = print + '\n'
    for (var x = 0; x < board[y].length; x++) {
      if (board[y][x].pawn == "WHITE") {
        print = print + " ☺ "
      }else if (board[y][x].pawn == "BLACK") {
        print = print + " ☻ "
      }else{
        print = print + "   "
      }
    }
  }

  return print;
}

function countPawns(board) {
  var count = {"BLACK":0,"WHITE":0};
  for (var y = 0; y < board.length; y++) {
    for (var x = 0; x < board[y].length; x++) {
      if (board[y][x].pawn == "WHITE") {
        count["WHITE"]++;
      }else if (board[y][x].pawn == "BLACK") {
       count["BLACK"]++;
      }
    }
  }

  return count;
}

//Count pawns and calc scores from coordinates (corner : 3, ledge : 2, other: 1)
function countScores(board) {
  var scores = {"BLACK":0,"WHITE":0};
  var maxSize = board.length;
  for (var y = 0; y < board.length; y++) {
    for (var x = 0; x < board[y].length; x++) {
      var score = 1;
      if(y == 0 || x == 0 || y == maxSize || x == maxSize){
        score = 2;
      }

      if(x == 0 && y == 0 || x == maxSize && y == maxSize || x == 0 && y == maxSize || x == maxSize && y == 0){
        score = 3;
      }

      if (board[y][x].pawn == "WHITE") {
        scores["WHITE"] = scores["WHITE"]+score;
      }else if (board[y][x].pawn == "BLACK") {
       scores["BLACK"] = scores["BLACK"]+score;
      }
    }
  }

  return scores;
}

//Function Count winning parties 
function countWin(color){
  stats.nbGames++;
  if (color == "WHITE") {
    stats.whiteWin++;
  } else {
    stats.blackWin++;
  }
}

function newGameAuto(){
  svg.clear();
  svg = Snap('#board');
  game.destroy();
  game = new Game();
  game.init();
  game.start();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}