/*
* @author Boris Gallet, Benoit Rospars
* @subject Master WIC 2016 AI Project
*
*
* @different IAs
*
*
*/

var IA = function(color){
	this.color = color;
	this.mode = "MINMAX";
};

IA.prototype.init = function(){

};

IA.prototype.doMove = function(game){
	if(this.mode == "DEBILE"){
		var move = this.getMoveDebile(game);
		game.doMove(move);
	}else if(this.mode == "MINMAX"){

	}
};

IA.prototype.getMoveDebile = function(game){
	var indexOrigin = getRandomInt(0,game.currentTurnMoves.length);
	var indexTarget = getRandomInt(0,game.currentTurnMoves[indexOrigin].currentNodePawnMoves.length);

	return {
		"origin":game.currentTurnMoves[indexOrigin].currentNode,
		"target":game.currentTurnMoves[indexOrigin].currentNodePawnMoves[indexTarget].targetNode
	};
}

IA.prototype.getMoveMinMax = function(game, profondeur){

}

/*
*	Take the current state of the game and simulate the move
*/
IA.prototype.simulateTurn = function(game,oldNode,newNode,moveType){
	var game2 = new Game();
	Object.assign(game2,game);
	game2.currentTurn = "BLACK";

	console.log(game,game2);
	/*
  game.gameboard.movePawnFromNode(oldNode,newNode);

  if(moveType == "EATMOVE"){
    var nodePawnPossibleMoves = game.getNodeAllPossibleEatMoves(newNode);
    if (nodePawnPossibleMoves[0].currentNodePawnMoves.length > 0){
      game.currentTurnMoves = nodePawnPossibleMoves;
      game.startTurn("REBOUND");
    } else {
      if(game.whitePawns > 0 && game.blackPawns > 0){
        game.currentTurn = game.currentTurn == "WHITE" ? "BLACK":"WHITE";
        game.countTurn++;
        game.startTurn();
      }else{
        return;
      }      
    }
  } else {
    if(game.whitePawns > 0 && game.blackPawns > 0){
      game.currentTurn = game.currentTurn == "WHITE" ? "BLACK":"WHITE";
      game.countTurn++;
      game.startTurn();
    }else{
      return;
    }
  }*/
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}