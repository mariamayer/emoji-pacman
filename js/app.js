var map = [
  [1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1],
  [1,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,0,1],
  [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
  [1,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,1],
  [1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,0,0,1,0,1,0,0,0,0,0,0,0,0,1,0,1,0,0,1],
  [1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1],
];

grid = new PF.Grid(10, 20);
var game=true;
var rows=10;
var cols=20;
var fruit=false;

function Pacman(){
  this.rows=rows;
  this.cols=cols;
  this.position=[Math.round(this.rows/2),Math.round(this.cols/2)];
  this.direction='';
  this.stuck=false;
  this.fruits=[[0,0],[9,16],[2,19],[8,3]];
  this.score=0;
  this.pills=135;
}

Pacman.prototype.stop = function() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }
};

Pacman.prototype.updateScore = function() {
  this.score=(this.pills-$('.pill').length)*10;
  $('.board .score').html(this.score);
  if($('.pill').length===0)
  this.drawPacmanWin();
};
Pacman.prototype.stop = function() {
  if (this.intervalId) {
    clearInterval(this.intervalId);
    this.intervalId = undefined;
  }
};

Pacman.prototype.drawPacmanWin = function(){
  $('.ghost img').remove();
  $('.pacman').empty();
  $('.pacman').append('<img src="img/win.png" alt="">');
  $('.info').append('You Win <img src="img/win-text.png" alt="">');
  this.stop();
};

Pacman.prototype.renderBoard = function(){
  for (var row = 0; row < this.rows; row++) {
    for (var col = 0; col < this.cols; col++) {
      if(map[row][col]){
        $('.container').append($('<div>')
          .addClass('pill')
          .addClass('cell')
          .attr('data-row', row)
          .attr('data-col', col)
          .attr('data-pill', true)
        );
      }else{
        $('.container').append($('<div>')
          .addClass('border')
          .attr('data-row', row)
          .attr('data-col', col)
        );
        grid.setWalkableAt(row , col, false);
      }
    }
  }
  for (var i = 0; i < this.fruits.length; i++) {
    var selector = '[data-row=' + this.fruits[i][0] + ']' +
                     '[data-col=' + this.fruits[i][1] + ']';
    $(selector).removeClass('pill').addClass('fruit');
  }
};

Pacman.prototype._canMove = function(position){
  var selector = '[data-row=' + position[0] + ']' +
                   '[data-col=' + position[1] + ']';
  if($(selector).hasClass('cell')){
    return true;
  }else{
    return false;
  }
};

Pacman.prototype._removePill = function(position){
  var selector = '[data-row=' + position[0] + ']' +
                   '[data-col=' + position[1] + ']';
  if($(selector).hasClass('fruit')){
    fruit=true;
    setTimeout(function(){ fruit=false; }, 4000);
  }
  $(selector).removeClass('pill fruit');
};

Pacman.prototype.drawPacman = function(){
  var selector = '[data-row=' + this.position[0] + ']' +
                   '[data-col=' + this.position[1] + ']';
  $(selector).addClass('pacman');
  $(selector).append('<img src="img/pacman.png" alt="">');
  if(!this.stuck){
    $('.pacman img').addClass(this.direction);
  }
};

Pacman.prototype.drawPacmanDead = function(){
  $('.ghost img').remove();
  $('.pacman').empty();
  $('.info').append('Game Over <img src="img/loose-text.png" alt="">');
  $('.pacman').append('<img src="img/dead.png" alt="">');
  this.stop();
};

Pacman.prototype.clearPacman = function() {
  $('.pacman').removeClass('pacman').empty();
};

Pacman.prototype.removeAnimation = function(){
  $('.pacman img').removeClass();
  this.stuck=true;
};

Pacman.prototype.move=function(){
  switch(this.direction) {
    case 'left':
      if(this._canMove([this.position[0],this.position[1]-1])){
          this.position[1]-=1;
          this.stuck=false;
      }else{
          this.removeAnimation();
      }
      break;

    case 'right':
      if(this._canMove([this.position[0],this.position[1]+1])){
        this.position[1]+=1;this.stuck=false;
      }else{
          this.removeAnimation();
      }
      break;

    case 'up':
      if(this._canMove([this.position[0]-1,this.position[1]])){
          this.position[0]-=1;this.stuck=false;
      }else{
          this.removeAnimation();
      }
      break;

    case 'down':
      if(this._canMove([this.position[0]+1,this.position[1]])){
      this.position[0]+=1;
          this.stuck=false;
      }else{
          this.removeAnimation();
      }
      break;
  }
  this._removePill(this.position);
};
Pacman.prototype.updateDir = function(direction) {
  this.direction=direction;
};

Pacman.prototype.update = function() {
  if(game){
    this.move();
    this.clearPacman();
    this.drawPacman();
    this.updateScore();
  }else{
    this.drawPacmanDead();
  }
};

Pacman.prototype.start = function() {
  if (!this.intervalId) {
    this.intervalId = setInterval(this.update.bind(this), 100);
  }
};

Pacman.prototype.assignControlsToKeys = function() {
  $('body').on('keydown', function(e) {
    switch (e.keyCode) {
      case 38: // arrow up
        this.updateDir('up');
        break;
      case 40: // arrow down
        this.updateDir('down');
        break;
      case 37: // arrow left
        this.updateDir('left');
        break;
      case 39: // arrow right
        this.updateDir('right');
        break;
      case 80: // p pause
        if (this.intervalId) {
          this.stop();
        } else {
          this.start();
        }
        break;
    }
  }.bind(this));
};

$(document).ready(function(){
  var pacman=new Pacman();
  pacman.renderBoard();
  pacman.start();
  pacman.assignControlsToKeys();
});
