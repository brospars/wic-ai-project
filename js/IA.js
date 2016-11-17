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
		var move = this.getMoveMinMax(game,4);
		game.doMove(move);
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
	var gameClone = game.clone();
	var bestMove = 100;
	var chosenMove = this.getMoveDebile(game);
	var ia = this;

	function max(gameClone){
		for(var i=0; i<gameClone.currentTurnMoves.length; i++){
			for(var j=0; j<gameClone.currentTurnMoves[i].currentNodePawnMoves.length; j++){
				var oldNode = gameClone.currentTurnMoves[i].currentNode;
				var newNode = gameClone.currentTurnMoves[i].currentNodePawnMoves[j].targetNode;
				var moveType = gameClone.currentTurnMoves[i].currentNodePawnMoves[j].isEatMove ? "EATMOVE" : "";
				var newStateGame = ia.simulateTurn(gameClone,oldNode,newNode,moveType);

				if(game.currentTurn == "WHITE" && newStateGame.blackPawns < bestMove){
					bestMove = newStateGame.blackPawns;
					chosenMove = {
						"origin":game.currentTurnMoves[i].currentNode,
						"target":game.currentTurnMoves[i].currentNodePawnMoves[j].targetNode
					}
				}

				if(game.currentTurn == "BLACK" && newStateGame.whitePawns < bestMove){
					bestMove = newStateGame.whitePawns;
					chosenMove = {
						"origin":game.currentTurnMoves[i].currentNode,
						"target":game.currentTurnMoves[i].currentNodePawnMoves[j].targetNode
					}
				}

				//this.getMoveMinMax(newStateGame,profondeur-1);

			}
		}
	}
	
	max(gameClone);

	return chosenMove;	
}

/*
*	Take the current state of the game and simulate the move
*/
IA.prototype.simulateTurn = function(game,oldNode,newNode){
	var gameClone = game.clone();

	var moveType = gameClone.isMoveAllowed(oldNode,newNode);

	gameClone.gameboard.movePawnFromNode(oldNode,newNode);

	if(moveType == "EATMOVE"){
		var nodePawnPossibleMoves = gameClone.getNodeAllPossibleEatMoves(newNode);
		if (nodePawnPossibleMoves[0].currentNodePawnMoves.length > 0){
		  gameClone.currentTurnMoves = nodePawnPossibleMoves;
		} else {
		  if(gameClone.whitePawns > 0 && gameClone.blackPawns > 0){
		    gameClone.currentTurn = gameClone.currentTurn == "WHITE" ? "BLACK":"WHITE";
		    gameClone.countTurn++;
		    gameClone.currentTurnMoves = gameClone.getAllPossibleMoves();
		  }    
		}
	} else {
		if(gameClone.whitePawns > 0 && gameClone.blackPawns > 0){
		  gameClone.currentTurn = gameClone.currentTurn == "WHITE" ? "BLACK":"WHITE";
		  gameClone.countTurn++;
		  gameClone.currentTurnMoves = gameClone.getAllPossibleMoves();
		}
	}

  return gameClone;
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}