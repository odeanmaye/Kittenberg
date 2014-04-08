$(function(){
	$('#overlay').show();
	
	//prevent mobile windows from dragging and scrolling
	document.body.addEventListener('touchstart', function(e){
		e.preventDefault();
	});
	
	frameRate = 16;
	timer = 0;
	timeout = false;
	resetInterval = frameRate/2;
	
	pipes = new Array();
	
	gameOver = true;
	gravityInc = 5;
	scrollSpeed = 8;
	pipeCount = 0;
	
	setInterval(function(){animate();}, 1000/frameRate);
	
	stage = {
		width:360, 
		height:480, 
		ground:400
	}
	
	bird = {
		selector:$('#bird'), 
		x:170, 
		y:230, 
		width:20, 
		height:20, 
		init:function(){
			this.selector.css('top', this.y).css('left', this.x);
		}, 
		update:function(){
			if(this.y + gravity<stage.ground-this.height){
				this.y += gravity;
			} else if(this.y + gravity>stage.ground-this.height){
				this.y = stage.ground - this.height;
				endGame();
			}
			if(gravity < 40){
				gravity += gravityInc;
			}
			for(var i=0; i<pipes.length; i++){
				if(!pipes[i].passed){
					if(this.x + this.width + scrollSpeed> pipes[i].x && this.x < pipes[i].x + pipes[i].width){
						if(this.x + this.width < pipes[i].x){
							offsetX = this.x + this.width - pipes[i].x;
						} else {
							offsetX = 0;
						}
						if(this.y + this.height > pipes[i].y && this.y < pipes[i].y + pipes[i].height){
							for(var x=0; x<pipes.length; x++){
								pipes[x].x += offsetX;
								pipes[x].draw();
							}
							if(offsetX == 0){
								if(pipes[i].type == 'top'){
									bird.y = pipes[i].height;
								} else {
									bird.y = pipes[i].y - bird.height;
								}
							}
							endGame();
						}
					} else if(this.x > pipes[i].x + pipes[i].width){
						pipes[i].passed = true;
						if(pipes[i].type == 'bottom'){
							score++;
							$('#score').html(score);
						}
					}
				}
			}
		}, 
		draw:function(){
			this.selector.css('top', this.y);
		}
	}
	bird.init();
	
	$('body').keydown(function(event){
		//alert('event: '+event.which);
		if(event.which == 13){//enter
			if(gameOver){
				init();
			}
		}
		if(event.which == 32){//spacebar
			if(gameOver && !timeout){
				init();
			} else {
				flap();
			}
		}
	});
	
	$('#game').bind('mousedown touchstart', function(){
		if(!timeout){
			if(gameOver){
				init();
			} else {
				flap();
			}
		}
	});
});

function addPipe(){
	var pipeTopHeight = 50+50*Math.floor(Math.random()*4);
	var pipeBottomHeight = stage.ground - pipeTopHeight - 100;
	var extraPipe = Number(1) + pipeCount;
	$('#stage').prepend('<div id="pipe' + pipeCount + '" class="abs pipe"/>');
	$('#stage').prepend('<div id="pipe' + (pipeCount + 1) + '" class="abs pipe"/>');
	pipeTop = {
		selector:$('#pipe' + pipeCount), 
		id:pipeCount, 
		width:50, 
		height: pipeTopHeight, 
		x:360, 
		y:0, 
		type:'top', 
		passed:false, 
		init:function(){
			this.selector.css('height', this.height);
		}, 
		update:function(){
			if(!gameOver){
				if(this.x + this.width >= 0){
					this.x -= scrollSpeed;
				} else { 
					this.selector.remove();
				}
			}
		}, 
		draw:function(){
			this.selector.css('left', this.x);
		}
	}
	pipeBottom = {
		selector:$('#pipe' + extraPipe), 
		id:extraPipe, 
		width:50, 
		height: pipeBottomHeight, 
		x:360, 
		y:stage.ground - pipeBottomHeight, 
		type:'bottom', 
		passed:false, 
		init:function(){
			this.selector.css('height', this.height).css('top', stage.ground-this.height);
		}, 
		update:function(){
			if(!gameOver){
				if(this.x + this.width >= 0){
					this.x -= scrollSpeed;
				} else { 
					this.selector.remove();
				}
			}
		}, 
		draw:function(){
			if(!gameOver){
				this.selector.css('left', this.x);
			}
		}
	}
	pipeTop.init();
	pipeBottom.init();
	pipes.push(pipeTop, pipeBottom);
	pipeCount += 2;
}

function animate(){
	if(!gameOver){
		if(timer > frameRate && timer%(20) == 0){
			addPipe();            
		}
		for(var i=0; i<pipes.length; i++){
			pipes[i].update();
			pipes[i].draw();
		}
		bird.update();
		bird.draw();
	}
	if(timeout){
		if(timer == 0){
			$('#screen').show();
		}
		if(timer == 1){
			$('#screen').hide();
		}
		if(timer == resetInterval){
			timeout = false;
			$('#title, #instructions').show();
		}
	}
	timer++;
}

function endGame(){
	gameOver = true;
	timeout = true;
	timer = 0;
}

function flap(){
	gravity = -20;
}

function init(){
	for(var i=0; i<pipes.length; i++){
		pipes[i].selector.remove();
	}
	pipes.splice(0);
	gameOver = false;
	timer = 0;
	score = 0;
	gravity = 0;
	bird.x = (stage.width - bird.width)/2;
	bird.y = (stage.height - bird.height)/2;
	$('#title, #instructions').hide();
	$('#score').html(score).show();
}