function Pacman(){
  this.rows=rows;
  this.cols=cols;
  this.position=[Math.round(this.rows/2),Math.round(this.cols/2)];
  this.direction='';
  this.stuck=false;
  this.fruits=[[0,0],[9,16],[2,19],[8,3]];
}

Pacman.prototype.drawPacman = function(){
  var selector = '[data-row=' + this.position[0] + ']' +
                   '[data-col=' + this.position[1] + ']';
  $(selector).addClass('pacman');
  $(selector).append('<img src="img/pacman.png" alt="">');
  if(!this.stuck){
    $('.pacman img').addClass(this.direction);
  }
};

Pacman.prototype.canMove = function(position){
  var selector = '[data-row=' + position[0] + ']' +
                   '[data-col=' + position[1] + ']';
  if($(selector).hasClass('cell')){
    return true;
  }else{
    return false;
  }
};

Pacman.prototype.removePill = function(position){
  var selector = '[data-row=' + position[0] + ']' +
                   '[data-col=' + position[1] + ']';
  if($(selector).hasClass('fruit')){
    fruit=true;
    setTimeout(function(){ fruit=false; }, 4000);
  }
  $(selector).removeClass('pill fruit');
};


Pacman.prototype.removeAnimation = function(){
  $('.pacman img').removeClass();
  this.stuck=true;
};

Pacman.prototype.move=function(){
  switch(this.direction) {
    case 'left':
      if(this.canMove([this.position[0],this.position[1]-1])){
          this.position[1]-=1;
          this.stuck=false;
      }else{
          this.removeAnimation();
      }
      break;

    case 'right':
      if(this.canMove([this.position[0],this.position[1]+1])){
        this.position[1]+=1;this.stuck=false;
      }else{
          this.removeAnimation();
      }
      break;

    case 'up':
      if(this.canMove([this.position[0]-1,this.position[1]])){
          this.position[0]-=1;this.stuck=false;
      }else{
          this.removeAnimation();
      }
      break;

    case 'down':
      if(this.canMove([this.position[0]+1,this.position[1]])){
      this.position[0]+=1;
          this.stuck=false;
      }else{
          this.removeAnimation();
      }
      break;
  }
  this.removePill(this.position);
};

Pacman.prototype.updateDir = function(direction) {
  this.direction=direction;
};
