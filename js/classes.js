class Brick extends devicePixelRatio.Sprite{
    constructor(color=0xFFFFFF, x=0, y=0, width=50, height=50){
        super();
        this.beginFill(color);
        this.drawRect(-2,-3,4,6);
        this.endFill();
        this.x = x;
        this.y = y;
        this.fwd = {x:0,y:-1};
        this.speed = 400;
        this.isAlive = true;
        Object.seal(this);
    }
}