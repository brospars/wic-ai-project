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
	this.mode = "DEBILE";
};

IA.prototype.init = function(){

};

IA.prototype.doMove = function(game){
	if(this.mode == "DEBILE"){
		var move = this.getMoveDebile(game);
		console.log(move);
		game.doMove(move);
	}
};

IA.prototype.getMoveDebile = function(game){
	return {
		"origin":game.currentTurnMoves[0].currentNode,
		"target":game.currentTurnMoves[0].currentNodePawnMoves[0].targetNode
	};
}