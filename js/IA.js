/*
 * @author Boris Gallet, Benoit Rospars
 * @subject Master WIC 2016 AI Project
 *
 *
 * @different IAs
 *
 *
 */

var IA = function (mode) {
  this.mode = mode;
};

IA.prototype.calculateNextMove = function (board,turn,moves) {
  var turn = turn;
  var virtualBoard = cloneBoard(board);
  var turnPossibleMoves = moves ? moves : getTurnPossibleMoves(virtualBoard,turn);

  if (this.mode == "RANDOM") {
    return this.getMoveRandom(turnPossibleMoves);
  } else if (this.mode == "MINMAX") {
    return this.getMoveMinMax();
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

IA.prototype.getMoveMinMax = function () {

};

IA.prototype.simulateTurn = function () {

};


