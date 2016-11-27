/*
* @author Boris Gallet, Benoit Rospars
* @subject Master WIC 2016 AI Project
* @
*
* @description
* The Log save the history of the game
*/

var Log = function(){
  this.history = [];
};

Log.prototype.addState = function(state){
	var id = this.history.push(state);
  this.drawStaticBoard(state.board,id);
}

Log.prototype.printHistory = function(){
	for(var i in this.history){
    	console.log(printBoard(this.history[i].board));
  }
}

Log.prototype.drawStaticBoard = function(board,id){
	var svgWrap = $('<svg class="history-svg" id="history'+id+'"></svg>');
  $('#history').prepend(svgWrap);

  var historySvg = Snap('#history'+id);

  var offset = parseInt(300/10);
  var width = 300-offset*2;
  var height = 300-offset*2;
  var size = board.length-1;

	for (var y = 0; y < board.length; y++) {
    	for (var x = 0; x < board[y].length; x++) {
        if(board[y][x].pawn){
          var coordX = x*(width/size)+offset;
          var coordY = y*(height/size)+offset;
          historySvg.circle(coordX, coordY, width/(size*2.2)).attr({strokeWidth:3, stroke:"black",fill:board[y][x].pawn,strokeLinecap:"round"});
        }        
    	}
    }
}