
window.onload = function () {
  var socket = io.connect("http://24.16.255.56:8888");

  socket.on("load", function (data) {
      console.log(data);
  });

  var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/emerald.png");
ASSET_MANAGER.queueDownload("./img/sonic.png");
ASSET_MANAGER.queueDownload("./img/sonichurt.png");
ASSET_MANAGER.queueDownload("./img/sonic2.png");
ASSET_MANAGER.queueDownload("./img/tails.png");
ASSET_MANAGER.queueDownload("./img/tailshurt.png");
ASSET_MANAGER.queueDownload("./img/tails2.png");
ASSET_MANAGER.queueDownload("./img/knuckles.png");
ASSET_MANAGER.queueDownload("./img/knuckleshurt.png");
ASSET_MANAGER.queueDownload("./img/knuckles2.png");

  var text = document.getElementById("text");
  var saveButton = document.getElementById("save");
  var loadButton = document.getElementById("load");
  var gameEngine = new GameEngine();
  var savedState = [];
  //var entities = [];

  for (x = 0; x <= 100; x+=100) {
    for (y = 0; y <= 100; y+=100) {
      var sonicmember = new Faction(gameEngine, "sonic", x, y);
        savedState.push(sonicmember);	
    }   	
  }
  
  for (x = 0; x <= 100; x+=100) {
    for (y = 0; y <= 100; y+=100) {
      var knucklesmember = new Faction(gameEngine, "knuckles", x+600, y);
      savedState.push(knucklesmember);	
    }   	
  }
  
  for (x = 0; x <= 100; x+=100) {
    for (y = 0; y <= 100; y+=100) {
      var tailsmember = new Faction(gameEngine, "tails", x, y+600);
      savedState.push(tailsmember);		
    }   	
  }



  var myNumber = 5;

  saveButton.onclick = function () {
    console.log("save");
    text.innerHTML = "Saved."
    socket.emit("save", { studentname: "Matthew Fomich", statename: "Savestate", data: "Game Data" });
    
    // This data is needed for each entity
    // this.faction = faction;
    // this.charge = 100;
    // this.hp = 100;
    // this.states = ["normal", "hurt", "mutated"];
    // this.state = this.states[0];
    // this.width = 100;
    // this.height = 100;
    // this.powerSource = false;
    // this.charged = true;
    // this.attack = false;
    // this.won = true;
    // this.countdown = 100;
    // this.sonicAlive = true;
    // this.knucklesAlive = true;
    // this.tailsAlive = true;
    // this.xDestination = 345;
    // this.yDestination = 345;

    if (gameEngine == undefined) {
        console.log("Error: gameEngine is not defined.");
        return;
    }
   


    for (var i = 1; i < gameEngine.entities.length; i++) {
      var ent = gameEngine.entities[i];
     // savedState.entities[i].x = ent.x;
     // savedState.entities[i].y = ent.y;

      savedState[i] = new Faction(gameEngine, ent.faction, ent.x, ent.y);

      savedState[i].charge = ent.charge;
      savedState[i].hp = ent.hp;
      savedState[i].states = ent.states;
      savedState[i].state = ent.state;
      savedState[i].width = ent.width;
      savedState[i].height = ent.height;
      savedState[i].powerSource = ent.powerSource;
      savedState[i].charged = ent.charged;
      savedState[i].attack = ent.attack;
      savedState[i].won = ent.won;
      savedState[i].countdown = ent.countdown;
      savedState[i].sonicAlive = ent.sonicAlive;
      savedState[i].knucklesAlive = ent.knucklesAlive;
      savedState[i].tailsAlive = ent.tailsAlive;
      savedState[i].xDestination = ent.xDestination;
      savedState[i].yDestination = ent.yDestination;

      console.log(i);
      console.log(ent.faction);

    }


  };

  loadButton.onclick = function () {
    console.log("load");
    text.innerHTML = "Loaded."
    socket.emit("load", { studentname: "Matthew Fomich", statename: "Savestate" });

    for (var i = 1; i < gameEngine.entities.length; i++) {
      var ent = savedState[i];

      // Add each entity to the array of entities.
      //entities.push(ent);

      console.log(i);
      console.log(ent.faction);
      //gameEngine.entities[i].x = ent.x;
    //  gameEngine.entities[i].y = ent.y;

    gameEngine.entities[i] = new Faction(gameEngine, ent.faction, ent.x, ent.y);

      gameEngine.entities[i].charge = ent.charge;
      gameEngine.entities[i].hp = ent.hp;
      gameEngine.entities[i].states = ent.states;
      gameEngine.entities[i].state = ent.state;
      gameEngine.entities[i].width = ent.width;
      gameEngine.entities[i].height = ent.height;
      gameEngine.entities[i].powerSource = ent.powerSource;
      gameEngine.entities[i].charged = ent.charged;
      gameEngine.entities[i].attack = ent.attack;
      gameEngine.entities[i].won = ent.won;
      gameEngine.entities[i].countdown = ent.countdown;
      gameEngine.entities[i].sonicAlive = ent.sonicAlive;
      gameEngine.entities[i].knucklesAlive = ent.knucklesAlive;
      gameEngine.entities[i].tailsAlive = ent.tailsAlive;
      gameEngine.entities[i].xDestination = ent.xDestination;
      gameEngine.entities[i].yDestination = ent.yDestination;

    }
   
  };

  function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game) {
	this.powerSource = true;
	this.x = 220;
	this.y = 280;
	this.width = 860 * .4;
	this.height = 548 * .4;
    this.emerald = new Animation(ASSET_MANAGER.getAsset("./img/emerald.png"), 0, 0, 726, 463, 0.5, 1, true, true);
    Entity.call(this, game, 0, 400);
    this.radius = 200;
}

Background.prototype = new Entity();
Background.prototype.constructor = Background;

Background.prototype.update = function () {
}

Background.prototype.draw = function (ctx) {
    ctx.fillStyle = "Green";
    ctx.fillRect(0,500,800,300);
    
    // Faction bases
    ctx.fillStyle = "Blue";
    ctx.fillRect(0,0,200,200);
    
    ctx.fillStyle = "Red";
    ctx.fillRect(600,0,200,200);
    
    ctx.fillStyle = "Yellow";
    ctx.fillRect(0,600,200,200);
    
    
    this.emerald.drawFrame(0, ctx, 220, 280, .473);

    
    Entity.prototype.draw.call(this);
}

function collisionDetected(entity1, entity2) {

    return entity1.x + entity1.width >= entity2.x
        && entity1.x <= entity2.x + entity2.width
        && entity1.y + entity1.height >= entity2.y
        && entity1.y < entity2.y + entity2.height;

}

function Faction(game, faction, x, y) {
	
	this.faction = faction;
	this.charge = 100;
	this.hp = 100;
	this.states = ["normal", "hurt", "mutated"];
	this.state = this.states[0];
	this.width = 100;
	this.height = 100;
	this.powerSource = false;
	this.charged = true;
	this.attack = false;
	this.won = true;
	this.countdown = 100;
	
	this.sonicAlive = true;
	this.knucklesAlive = true;
	this.tailsAlive = true;
	
	this.xDestination = 345;
	this.yDestination = 345;
	
	this.animation = new Animation(ASSET_MANAGER.getAsset("./img/sonic.png"), 0, 0, 100, 100, 0.5, 1, true, true);
    this.sonic = new Animation(ASSET_MANAGER.getAsset("./img/sonic.png"), 0, 0, 100, 100, 0.5, 1, true, true);
    this.sonichurt = new Animation(ASSET_MANAGER.getAsset("./img/sonichurt.png"), 0, 0, 100, 100, 0.5, 1, true, true);
    this.sonic2= new Animation(ASSET_MANAGER.getAsset("./img/sonic2.png"), 0, 0, 100, 100, 0.5, 1, true, true);
    this.knuckles = new Animation(ASSET_MANAGER.getAsset("./img/knuckles.png"), 0, 0, 100, 100, 0.5, 1, true, true);
    this.knuckleshurt = new Animation(ASSET_MANAGER.getAsset("./img/knuckleshurt.png"), 0, 0, 100, 100, 0.5, 1, true, true);
    this.knuckles2 = new Animation(ASSET_MANAGER.getAsset("./img/knuckles2.png"), 0, 0, 100, 100, 0.5, 1, true, true);
    this.tails = new Animation(ASSET_MANAGER.getAsset("./img/tails.png"), 0, 0, 100, 100, 0.5, 1, true, true);
    this.tailshurt = new Animation(ASSET_MANAGER.getAsset("./img/tailshurt.png"), 0, 0, 100, 100, 0.5, 1, true, true);
    this.tails2 = new Animation(ASSET_MANAGER.getAsset("./img/tails2.png"), 0, 0, 100, 100, 0.5, 1, true, true);
    
    this.jumping = false;
    this.radius = 100;
    this.ground = 400;
    Entity.call(this, game, x, y);
}

Faction.prototype = new Entity();
Faction.prototype.constructor = Faction;

Faction.prototype.update = function () {
	this.sonicAlive = false;
	this.knucklesAlive = false;
	this.tailsAlive = false;
    
	if (this.charge < 10 && this.state != "mutated") {
		this.state = this.states[2];
		this.hp = this.hp + 30;
	} else if (this.charge > 90) {
		this.state = this.states[0];
	}
	
	if (this.state != "mutated") {
		if (this.hp < 10) {
			this.state = this.states[1];
		} else if (this.hp > 90) {
			this.state = this.states[0];
		}
	} 
	
	
	
	// check collison
	for (var i = 1; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent.faction == "sonic") {
        	this.sonicAlive = true;
        } else if (ent.faction == "knuckles") {
        	this.knucklesAlive = true;
        } else if (ent.faction == "tails") {
        	this.tailsAlive = true;
        }
        if (ent !== this && collisionDetected(this, ent)) {
        	
        	
        	if (this.faction == ent.faction) {
        		
        	} else if (!(ent.powerSource == true)) { // not the same faction
        		if (this.hp > 1) {
        			this.hp = this.hp - 1;
        			if (ent.faction == "tails") {
        				this.hp = this.hp + Math.random()/8;
        			}
        			if (ent.faction == "knuckles") {
        				this.hp = this.hp - Math.random()/8;
        			}
        			if (ent.faction == "knuckles" && ent.state == "mutated") {
        				this.hp = this.hp + Math.random()/3;	
        			}
        			if (ent.faction == "sonic" && ent.state == "mutated") {
        			this.hp = this.hp - Math.random() * 1.3;	
        			ent.hp = ent.hp + Math.random();
        			if (this.hp < 1) {
        				this.hp = 1;
        			}
        			}
        			
        			if (this.faction == "sonic" && this.state != "mutated") {
        				this.hp = this.hp + (Math.random()/2);
        			} else if (this.faction == "knuckles" && this.state == "mutated") {
        				this.hp = this.hp + Math.random()/2 + .6;
        			}
        		} else if (this.charge > 1) {
        			this.charge = this.charge - 2;
        		} else {
        			this.faction = ent.faction;
        		}
        		
        		
        	}
        	
        }
        
    }
	
	// on the emerald
	if (this.x >= 170 && this.x <= 860 * .4 + 170 && this.y >= 230 && this.y <= 548 * .4 + 230) {
    	this.charge = this.charge + 3;
    	if (this.charge >= 95) {
    		this.charged = true;
    	}
    }
	
	// Faction bases
    if (this.faction == "sonic" && this.x >= 0 && this.x <= 200 && this.y >= 0 && this.y <= 200) {
    	this.hp += 1;
//    	if (Math.random() < 0.002) {
//    		this.charge = 0;
//    		this.hp = 100;
//    		this.faction = "knuckles";
//    	}
    }
    
    else if (this.faction == "knuckles" && this.x >= 600 && this.x <= 800 && this.y >= 0 && this.y <= 200) {
    	this.hp += 1;
//    	if (Math.random() < 0.002) {
//    		this.charge = 60;
//    		this.hp = 60;
//    		this.faction = "tails";
//    	}
    }
    
    else if (this.faction == "tails" && this.x >= 0 && this.x <= 200 && this.y >= 600 && this.y <= 800) {
    	this.hp += 1;
//    	if (Math.random() < 0.01) {
//    		this.charge = 0;
//    		this.faction = "sonic";
//    	}
    }
    
    /* Destinations
     * 
     * minus 30 to all
     * Sonic base x = 100, y , 100
     * Knuckles base x = 700, y = 100
     * Tails base x = 100, y = 700
     * Emerald base = 282 x , y = 250
     * random 1 - 60
     * 
     * direction +1-2
     */
    
    // A.I
    
this.won = true;
    
    var ent = this.game.entities[i];
    for (var i = 1; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        //console.log(ent.faction);
        //console.log(this.faction);
        if (!(this.faction ==  ent.faction)) {
        	this.won = false;
        }
    }
    
   
    if (this.won == true && this.countdown < 0) {  
    	 for (var i = 1; i < this.game.entities.length; i++) {
    	        var ent = this.game.entities[i];
    	        ent.charge = 0;
        		ent.hp = 0;
            	ent.x = Math.cos(Math.random()) * 500;
            	ent.y = Math.sin(Math.random()) * 500;
            	ent.countdown = 1000;
            	//reset = Math.random();
            	if (Math.random() > .7) {
            		ent.faction = "knuckles";
            	} else if (Math.random() > .5) {
            		ent.faction = "sonic";
            	} else {
            		ent.faction = "tails";
            	}
    	 }
    		
        	
        	
    	
    } else {
    	this.countdown = this.countdown - 1;
    	 // Self preservation
        if (this.faction == "sonic") {
        	if ((this.state == "hurt" || this.hp < 40) || ((this.state == "mutated") && this.hp < 95 && this.attack == false)) {
        		this.attack = false
            	this.xDestination = 50;
            	this.yDestination = 50;
            } else if (this.charge >= 50 && this.charged == true && this.attack == false) {
            	// random tails or knuckles base
            	choice = Math.random();
            	this.attack = true;
            	if (choice > .5 && this.knucklesAlive == true) {
            		this.xDestination = 650;
                	this.yDestination = 50;
            	} else if (this.tailsAlive == true) {
            		this.xDestination = 50;
                	this.yDestination = 650;
            	} else {
            		this.xDestination = 650;
                	this.yDestination = 50;
            	}
            } else if (this.attack == false || this.charge < 30) {
            	this.charged = false
            	this.attack = false
            	this.xDestination = 345;
            	this.yDestination = 340;
            }
        }
        
        if (this.faction == "tails") {
        	if (this.state == "hurt" || this.hp < 50) {
        		this.attack = false
            	this.xDestination = 50;
            	this.yDestination = 650;
            } else if (this.charge >= 50 && this.charged == true && this.attack == false) {
            	// random tails or knuckles base
            	choice = Math.random();
            	this.attack = true;
            	if (choice > .4 && this.sonicAlive == true) {
            		this.xDestination = 50;
                	this.yDestination = 50;
            	} else if (this.knucklesAlive == true) {
            		this.xDestination = 650;
                	this.yDestination = 50;
            	} else {
            		this.xDestination = 50;
                	this.yDestination = 50;
            	}
            } else if (this.attack == false || this.charge < 50) {
            	this.charged = false
            	this.attack = false
            	this.xDestination = 345;
            	this.yDestination = 340;
            }
        }
        
        if (this.faction == "knuckles") {
        	if (this.state == "hurt") {
        		this.attack = false
            	this.xDestination = 650;
            	this.yDestination = 50;
            } else if (this.charge >= 50 && this.charged == true && this.attack == false) {
            	// random tails or knuckles base
            	choice = Math.random();
            	this.attack = true;
            	if (choice > .5 && this.tailsAlive == true) {
            		this.xDestination = 50;
                	this.yDestination = 650;
            	} else if (this.sonicAlive == true) {
            		this.xDestination = 50;
                	this.yDestination = 50;
            	} else {
            		this.xDestination = 50;
                	this.yDestination = 650;
            	}
            } else if (this.attack == false || this.charge < 40) {
            	this.charged = false
            	this.attack = false
            	this.xDestination = 345;
            	this.yDestination = 340;
            }
        }
        
        if (this.attack == true) {
        	for (var i = 1; i < this.game.entities.length; i++) {
        		var ent = this.game.entities[i];
                if (ent !== this && collisionDetected(this, ent) && this.faction != ent.faction) {
                	//tempx = this.x - ent.x;
                	//tempy = this.y - ent.y;
                	euclidean = Math.sqrt((this.x - ent.x)*(this.x - ent.x) + (this.y - ent.y)*(this.y - ent.y));
                	if (euclidean < 100) {
//                		this.xDestination = ent.xDestination;
//                		this.yDestination = ent.yDestination;
                		this.xDestination = ent.x;
                		this.yDestination = ent.y;
                	}
        	}
        }
        	 
        }
        
        
        if (this.x < this.xDestination - 1) {
        	this.x = this.x + 1;
        	if (this.faction == ("sonic")) {
        		this.x = this.x + Math.random() * 1.2;
        	}
        } else if (this.x > this.xDestination + 1) {
        	this.x = this.x - 1;
        	if (this.faction == ("sonic")) {
        		this.x = this.x - Math.random() * 1.2;
        	}
        }
        
        if (this.y < this.yDestination - 1) {
        	this.y = this.y + 1;
        	if (this.faction == ("sonic")) {
        		this.y = this.y + Math.random() * 1.2;
        	}
        } else if (this.y > this.yDestination + 1) {
        	this.y = this.y - 1;
        	if (this.faction == ("sonic")) {
        		this.y = this.y - Math.random() * 1.2;
        	}
        }
    }
    
    
   
    
    
    
    
    
    //ctx.fillStyle = "Red";
   // ctx.fillRect(600,0,200,200);
    
    //ctx.fillStyle = "Yellow";
   // ctx.fillRect(0,600,200,200);
	
	
	
	this.charge = this.charge - .10;
	if (this.faction == "tails") {
		this.hp = this.hp + .1;
	}
	
	if (this.faction == "sonic" && this.state == "mutated") {
		this.hp = this.hp + .04;
	}
	
	if (this.charge < 0) {
		this.charge = 0;
	} else if (this.charge > 100) {
		this.charge = 100;
	}
	
	if (this.hp > 100) {
		this.hp = 100;
	}
	
	
    Entity.prototype.update.call(this);
}

Faction.prototype.draw = function (ctx) {
    if (this.faction == "sonic") {
    	
    	if (this.state == "normal") {
    		this.sonic.drawFrame(0, ctx, this.x, this.y);
    	} else if (this.state == "hurt") {
    		this.sonichurt.drawFrame(0, ctx, this.x, this.y);
    	} else {
    		this.sonic2.drawFrame(0, ctx, this.x, this.y);
    	}
    	
    }
    else if (this.faction == "tails") {
    	
    	if (this.state == "normal") {
    		this.tails.drawFrame(0, ctx, this.x, this.y);
    	} else if (this.state == "hurt") {
    		this.tailshurt.drawFrame(0, ctx, this.x, this.y);
    	} else {
    		this.tails2.drawFrame(0, ctx, this.x, this.y);
    	}
    	
    } else if (this.faction == "knuckles") {
    	
    	if (this.state == "normal") {
    		this.knuckles.drawFrame(0, ctx, this.x, this.y);
    	} else if (this.state == "hurt") {
    		this.knuckleshurt.drawFrame(0, ctx, this.x, this.y);
    	} else {
    		this.knuckles2.drawFrame(0, ctx, this.x, this.y);
    	}
    	
    }
    
    ctx.fillStyle = "Cyan";
    ctx.fillRect(this.x + 10,this.y+80,this.charge * .8,10);
    ctx.fillStyle = "Orange";
    ctx.fillRect(this.x + 10,this.y+90,this.hp * .8,10);
    
    
    Entity.prototype.draw.call(this);
}

// the "main" code begins here

// var ASSET_MANAGER = new AssetManager();

// ASSET_MANAGER.queueDownload("./img/emerald.png");
// ASSET_MANAGER.queueDownload("./img/sonic.png");
// ASSET_MANAGER.queueDownload("./img/sonichurt.png");
// ASSET_MANAGER.queueDownload("./img/sonic2.png");
// ASSET_MANAGER.queueDownload("./img/tails.png");
// ASSET_MANAGER.queueDownload("./img/tailshurt.png");
// ASSET_MANAGER.queueDownload("./img/tails2.png");
// ASSET_MANAGER.queueDownload("./img/knuckles.png");
// ASSET_MANAGER.queueDownload("./img/knuckleshurt.png");
// ASSET_MANAGER.queueDownload("./img/knuckles2.png");

ASSET_MANAGER.downloadAll(function () {
	
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');

    //var gameEngine = new GameEngine();
    var bg = new Background(gameEngine);
    gameEngine.addEntity(bg);
    

      
    for (x = 0; x <= 100; x+=100) {
    	for (y = 0; y <= 100; y+=100) {
    		var sonicmember = new Faction(gameEngine, "sonic", x, y);
        	gameEngine.addEntity(sonicmember);	
    	}   	
    }
    
    for (x = 0; x <= 100; x+=100) {
    	for (y = 0; y <= 100; y+=100) {
    		var knucklesmember = new Faction(gameEngine, "knuckles", x+600, y);
        	gameEngine.addEntity(knucklesmember);	
    	}   	
    }
    
    for (x = 0; x <= 100; x+=100) {
    	for (y = 0; y <= 100; y+=100) {
    		var tailsmember = new Faction(gameEngine, "tails", x, y+600);
        	gameEngine.addEntity(tailsmember);	
    	}   	
    }

   // var sonicmember = new Faction(gameEngine, "sonic", 100, 100);
	//gameEngine.addEntity(sonicmember);	

    savedState = gameEngine;
    gameEngine.init(ctx);
    gameEngine.start();
})

};
