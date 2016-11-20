/*
* @author Boris Gallet, Benoit Rospars
* @subject Master WIC 2016 AI Project
*
*
* @description
*
*/

var Pawn = function(color,coordX,coordY,size){
  this.color = color;
  this.coordX = coordX;
  this.coordY = coordY;
  this.size = size;
  this.drawnPawn;

  this.drawPawn();
};

Pawn.prototype.getCoordinates = function(){
 return [this.x, this.y];
}

Pawn.prototype.drawPawn = function(){
  this.drawnPawn = svg.circle(this.coordX, this.coordY, this.size)
    .attr({strokeWidth:3, stroke:"black",fill:this.color,strokeLinecap:"round"});
}
