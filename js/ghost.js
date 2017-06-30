function Ghost(position, direction, name, random){
	this.grid=grid;
	this.name=name;
	this.position = position;
	this.direction = direction;
	this.isWeak = false;
	this.path=[];
	this.randomPosx='';
	this.randomPosy='';
	this.oppositePosx='';
	this.oppositePosy='';
	this.rows=rows;
  this.cols=cols;
	this.map=map;
	this.distance=3;
	this.random=random;
	this.level=1;
}

Ghost.prototype.stop = function() {
  if (this.intervalGhost) {
    clearInterval(this.intervalGhost);
    this.intervalGhost = undefined;
  }
};

Ghost.prototype.getRandomPos = function() {
	var walkable=false;
	while (!walkable) {
		var x=Math.floor(Math.random()*this.rows);
		var y=Math.floor(Math.random()*this.cols);
		if(this.map[x][y]){
			walkable=true;
			this.randomPosx=x;
			this.randomPosy=y;
		}
	}
};

Ghost.prototype._canMove = function(position){
  var selector = '[data-row=' + position[0] + ']' +
                   '[data-col=' + position[1] + ']';
  if($(selector).hasClass('cell')){
    return true;
  }else{
    return false;
  }
};

Ghost.prototype.move = function() {
	if(this.path.length>0){

		pos1=this.position;
		pos2=this.path[1];
		this.position=pos2;

		if(pos1[0]==pos2[0]){

			if(pos1[1]<pos2[1]){
				this.direction='right';
			}else{
				this.direction='left';
			}
		}else if(pos1[1]==pos2[1]){
			if(pos1[0]<pos2[0]){
				this.direction='down';
			}else{
				this.direction='up';
			}
		}

	}else{

		switch(this.direction) {
			case 'left':
				if(this._canMove([this.position[0],this.position[1]-1]))
				this.position[1]-=1;
				break;

			case 'right':
				if(this._canMove([this.position[0],this.position[1]+1]))
				this.position[1]+=1;
				break;

			case 'up':
				if(this._canMove([this.position[0]-1,this.position[1]]))
				this.position[0]-=1;
				break;

			case 'down':
				if(this._canMove([this.position[0]+1,this.position[1]]))
				this.position[0]+=1;
				break;
		}

	}
};

Ghost.prototype._getDistance = function (pos1,pos2) {
	var a = pos1[0] - pos2[0];
	var b = pos1[1] - pos2[1];
	var c = Math.sqrt( a*a + b*b );
	return c;
};

Ghost.prototype.getOppositePos = function (x,y) {
	if(y>=0 && y<10)
	this.oppositePosy=19;
	else
	this.oppositePosy=0;
	if(x>=0 && x<5)
	this.oppositePosx=9;
	else
	this.oppositePosx=0;
};

Ghost.prototype.distanceToPacman = function(){
	pacmanPosition=[$('.pacman').data('row'),$('.pacman').data('col')];
	this.distance=this._getDistance(this.position,pacmanPosition);
};

Ghost.prototype.findPath = function () {
	var path;

	if(this.distance>=0 && this.distance<1.5){
		if(!fruit){
			game=false;
			this.stop();
		}else{
			$('.ghost-audio').get(0).play();
			this.stop();
		}
	}else{
		var distanceToOpposite;
		var finder = new PF.AStarFinder();
		var gridBackup = this.grid.clone();
		if(!this.random && this.distance>6){

			if(!fruit){

				path = finder.findPath(this.position[0], this.position[1],this.randomPosx,this.randomPosy, gridBackup);
				var distanceToRandom=this._getDistance(this.position,[this.randomPosx,this.randomPosy]);
				if(distanceToRandom<3)
				this.getRandomPos();

			}else{

				this.getOppositePos(pacmanPosition[0],pacmanPosition[1]);
				path = finder.findPath(this.position[0], this.position[1],this.oppositePosx, this.oppositePosy, gridBackup);
				distanceToOpposite=this._getDistance(this.position,[this.oppositePosx,this.oppositePosy]);
				if(distanceToOpposite<2)
				fruit=false;

			}

		}else{

			if(!fruit){
				path = finder.findPath(this.position[0], this.position[1], pacmanPosition[0], pacmanPosition[1], gridBackup);
			}else{
				this.getOppositePos(pacmanPosition[0],pacmanPosition[1]);
				path = finder.findPath(this.position[0], this.position[1],this.oppositePosx, this.oppositePosy, gridBackup);
				distanceToOpposite=this._getDistance(this.position,[this.oppositePosx,this.oppositePosy]);
				if(distanceToOpposite<1)
				fruit=false;
			}

		}

		this.path=path;
	}

};

Ghost.prototype.drawGhost = function() {

	var src;
	if(!fruit)
	src=this.name;
	else
	src='weak';

	var selector = '[data-row=' + this.position[0] + ']' +
                   '[data-col=' + this.position[1] + ']';
	$(selector).addClass('ghost');
  $(selector).addClass(this.name);
	$(selector).append('<img src="img/'+src+'.png" alt="">');
	$(selector+' img').addClass(this.direction);
};

Ghost.prototype.clearGhost = function() {
  $('.'+this.name).removeClass(this.name+' ghost multiple').empty();
};

Ghost.prototype.update = function() {
	if(game){
		this.distanceToPacman();
		this.move();
	  this.clearGhost();
	  this.drawGhost();
		this.findPath();
	}
};

Ghost.prototype.start=function(){
	this.assignControlsToKeys();
	this.getRandomPos();
	if (!this.intervalGhost) {
    this.intervalGhost = setInterval(this.update.bind(this,name),250);
  }
};

Ghost.prototype.updateDir = function(direction) {
  this.direction=direction;
};

Ghost.prototype.assignControlsToKeys = function() {
  $('body').on('keydown', function(e) {
    switch (e.keyCode) {
      case 80: // p pause
        if (this.intervalGhost) {
          this.stop();
        }
        break;
    }
  }.bind(this));
};
