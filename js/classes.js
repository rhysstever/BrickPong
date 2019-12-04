class Brick extends PIXI.Graphics{
    constructor(color=0xFF0000, x=0, y=0, width=50, height=50, health=3, scoreValue=1){
        super();
        this.beginFill(color);
        this.drawRect(x,y,width,height);
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

class Ball extends PIXI.Graphics{
    constructor(color=0xFFFFFF, x=0, y=0, radius=4){
        super();
        this.beginFill(color);
        this.drawCircle(x,y,radius);
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

    reflectX(){
        this.fwd.x *= -1;
    }

    reflectY(){
        this.fwd.y *= -1;
    }
}

class Player extends PIXI.Graphics{
    constructor(color=0xFFFFFF, x=0, y=0, width=20, height=80,  id=0, speed=0, maxSpeed=50, score=0){
        super();
        this.beginFill(color);
        this.drawRect(-2,-3,width,height);
        this.endFill();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.maxSpeed = maxSpeed;
        this.isAlive = true;
        Object.seal(this);
    }

    bounds(){
        if(this.y > sceneHeight - this.height)
            this.y = sceneHeight - this.height;

        if(this.y < 0)
            this.y = 0
    }
}