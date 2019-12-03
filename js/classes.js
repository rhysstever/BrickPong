class Brick extends PIXI.Sprite{
    constructor(color=0xFFFFFF, x=0, y=0, width=50, height=50, health=3, scoreValue=1){
        super();
        this.beginFill(color);
        this.drawRect(-2,-3,4,6);
        this.endFill();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.health = health;
        this.isAlive = true;
        this.scoreValue = scoreValue;
        Object.seal(this);
    }

    hit(){
        if(this.health <= 0){
            this.isAlive = false;
        }
    }
}

class Ball extends PIXI.Sprite{
    constructor(color=0xFFFFFF, x=0, y=0, radius=4){
        super();
        this.beginFill(color);
        this.drawCircle(0,0,radius);
        this.endFill();
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.fwd = {x:0, y:0};
        this.speed = 50;
        this.isAlive = true;
    }

    changeVel(xVel=0, yVel=0){
        this.fwd = {x:this.fwd.x + xVel, y: this.fwd.y + yVel};
    }
}

class Player extends PIXI.Sprite{
    constructor(color=0xFFFFFF, x=0, y=0, width=80, height=80, id=0, score=0){
        super();
        this.beginFill(color);
        this.drawRect(-2,-3,width,height);
        this.endFill();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.isAlive = true;
        Object.seal(this);
    }
}