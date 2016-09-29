/* 
* @author Boris Gallet, Benoit Rospars
* @subject Master WIC 2016 AI Project
* 
*
* @description
* 
*/

var Pawn = function(color,x,y,coordX,coordY){
  this.color = color;
  this.x = x;
  this.y = y;
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
    
  this.drawnPawn.drag(move, start, stop );
}

var move = function(dx,dy) {
  this.attr({
      transform: this.data('origTransform') + (this.data('origTransform') ? "T" : "t") + [dx, dy]
  });
}

var start = function() {
  this.data('origTransform', this.transform().local );
}
var stop = function() {
  console.log('finished dragging');
}