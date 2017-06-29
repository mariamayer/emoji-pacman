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

function Game(){
  this.pacman=new Pacman();
  this.ghost=new Ghost();
  this.rows=rows;
  this.cols=cols;
  this.position=[Math.round(this.rows/2),Math.round(this.cols/2)];
  this.direction='';
  this.stuck=false;
  this.fruits=[[0,0],[9,16],[2,19],[8,3]];
  this.score=0;
  this.pills=135;
  this.assignControlsToKeys();
  this.renderBoard();
  this.showStart();
}

Game.prototype.assignControlsToKeys = function() {
  $('body').on('keydown', function(e) {
    switch (e.keyCode) {
      case 38: // arrow up
        this.pacman.updateDir('up');
        break;
      case 40: // arrow down
        this.pacman.updateDir('down');
        break;
      case 37: // arrow left
        this.pacman.updateDir('left');
        break;
      case 39: // arrow right
        this.pacman.updateDir('right');
        break;
      case 80: // p pause
        if (this.intervalPacman) {
          this.stop();
        } else {
          this.start();
          this.ghost.start();
        }
        break;
    }
  }.bind(this));
};

Game.prototype.renderBoard = function(){
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

Game.prototype.showStart = function(){
  this.intervalStart = setInterval(function(){$(".h3").toggle();}, 600);
};

Game.prototype.updatePacman = function() {
  if(game){
    this.pacman.move();
    this.clearPacman();
    this.pacman.drawPacman();
    this.updateScore();
  }else{
    this.drawPacmanDead();
  }
};

Game.prototype.updateScore = function() {
  this.score=(this.pills-$('.pill').length)*10;
  $('.board .score').html(this.score);
  if($('.pill').length===0)
  this.drawPacmanWin();
};

Game.prototype.start = function() {

  var ghost1=new Ghost([2,7],'right','grey',true);
	setTimeout(function(){ ghost1.start(); }, 1000);

	var ghost3=new Ghost([2,10],'right','violet',false);
	setTimeout(function(){ ghost3.start(); }, 2000);

	var ghost2=new Ghost([2,6],'left','red',false);
	setTimeout(function(){ ghost2.start(); }, 4000);

	var ghost4=new Ghost([4,10],'left','brown',false);
	setTimeout(function(){ ghost4.start(); }, 3000);

  if (!this.intervalPacman) {
    this.intervalPacman = setInterval(this.updatePacman.bind(this), 100);
  }
};

Game.prototype.stop = function() {
  clearInterval(this.ghost.intervalGhost);
  this.ghost.intervalGhost = undefined;
  clearInterval(this.intervalPacman);
  this.intervalPacman = undefined;
};

Game.prototype.drawPacmanDead = function(){
  $('.ghost img').remove();
  $('.pacman').empty();
  $('.info').append('Game Over <img src="img/loose-text.png" alt="">');
  $('.pacman').append('<img src="img/dead.png" alt="">');
  this.stop();
};

Game.prototype.clearPacman = function() {
  $('.pacman').removeClass('pacman').empty();
};

Pacman.prototype.drawPacmanWin = function(){
  $('.ghost img').remove();
  $('.pacman').empty();
  $('.pacman').append('<img src="img/win.png" alt="">');
  $('.info').append('You Win <img src="img/win-text.png" alt="">');
  this.stop();
};


$(document).ready(function(){
  var game=new Game();
  flag=true;
  game.pacman.drawPacman();
  $('body').on('keydown', function() {
    if(flag){
      $('.h3').remove();
      game.start();
      flag=false;
    }
  });
});
