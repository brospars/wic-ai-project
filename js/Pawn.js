/*
* @author Boris Gallet, Benoit Rospars
* @subject Master WIC 2016 AI Project
*
*
* @description
*
*/

var Pawn = function(color,coordX,coordY){
  this.color = color;
  this.coordX = coordX;
  this.coordY = coordY;
  this.drawnPawn;

  this.drawnPawn();
};

Pawn.prototype.getCoordinates = function(){
 return [this.x, this.y];
}

Pawn.prototype.drawnPawn = function(){
  this.drawnPawn = svg.circle(this.coordX, this.coordY, 40)
    .attr({strokeWidth:3, stroke:"black",fill:this.color,strokeLinecap:"round"});
}
