/*
* @author Boris Gallet, Benoit Rospars
* @subject Master WIC 2016 AI Project
*
*
* @different IAs
*
*
*/

var IA = function(){
};

IA.prototype.init = function(){

};

IA.prototype.calculateNextMove = function(mode, board, turn){
	var boardClone = cloneBoard(board);

	if(this.mode == "DEBILE"){
		return this.getMoveDebile(boardClone);
	}else if(this.mode == "MINMAX"){
		return this.getMoveMinMax(boardClone,4);
	}
};

IA.prototype.getMoveDebile = function(board){
	
}

IA.prototype.getMoveMinMax = function(board, profondeur){
	
}

IA.prototype.simulateTurn = function(game,oldNode,newNode){
	
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}