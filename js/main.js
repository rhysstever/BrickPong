"use strict";
const app = new PIXI.Application(1200,600);
document.body.appendChild(app.view);

const sceneWidth = app.view.width;
const sceneHeight = app.view.height;
let colors = [];
let stage;
let paused;

let startScene, gameScene, gameOverScene;
let titleLabel, startButton, p1ScoreLabel, p2ScoreLabel, pauseLabel, gameOverScoreLabel, gameOverText, playAgainButton;
let winner;
let score = 0;

window.onload = setup;

let player1, player2, ball1, ball2;
let bricks = [];
let balls = [];

function setup() {
    addColors();
    paused = false;

	stage = app.stage;
    // #1 - Create the `start` scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);
    startScene.visible = true;
	
    // #2 - Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    // #3 - Create the `gameOver` scene and make it invisible
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);
	
    // #4 - Create labels for all 3 scenes
    createLabelsAndButtons();

    // #5 - Create players
    player1 = new Player(0xFFFFFF, 0, 0, 20, 80, 1, 5);
    player2 = new Player(0xFFFFFF, 0, 0, 20, 80, 1, 5);
    gameScene.addChild(player1);
    gameScene.addChild(player2);

    // #6 - Spawn Bricks
    buildBricks();

    // #7 - Spawn Balls
    ball1 = new Ball(0xFFFFFF, 0, 0, 5, 200);
    ball2 = new Ball(0xFFFFFF, 0, 0, 5, 200);
    balls.push(ball1);
    balls.push(ball2);
    gameScene.addChild(ball1);
    gameScene.addChild(ball2);

    // #8 - run the gameloop
    app.ticker.add(gameLoop);
}

function gameLoop(){
    if (paused){
        pauseLabel.isAlive = true;
        gameScene.addChild(pauseLabel);
        return;
    } 

    if(!gameScene.visible) return;

    // Removes the pause label if not being used
    pauseLabel.isAlive = false;
    gameScene.removeChild(pauseLabel);
	
	// #1 - Calculate "delta time"
	let dt = 1/app.ticker.FPS;
    if (dt > 1/12) dt=1/12;

    // #2 - Move players (by mouse)
    /*
    let mousePosition = app.renderer.plugins.interaction.mouse.global;
    player1.y = mousePosition.y - (player1.height / 2);
    player2.y = mousePosition.y - (player1.height / 2);*/
    checkKeys();
    
    // #3 - Bounds checking
    player1.bounds();
    player2.bounds();

    // #4 - Move Balls
    for(let b of balls){
        b.move(dt);

        // Ball hitting top and bottom "walls"
        // Will reflect and keep going
        if(b.y <= b.radius || b.y >= sceneHeight - b.radius){
            b.reflectY();
            b.move(dt);
        }

        // Ball hitting either side "goal"
        // Will be removed from the scene
        if(b.x <= -100 || b.x >= sceneWidth){
            gameScene.removeChild(b);
            b.isAlive = false;
        }
    }

    // #5 - Collision Checks
    collisionDetection();

    // #6 - Checking Brick health, removing them if health = 0
    for(let b of bricks){
        if(b.health <= 0){
            gameScene.removeChild(b);
            b.isAlive = false;
        }
    }
    
    // #7 - Clean-up
    balls = balls.filter(b=>b.isAlive);
    bricks = bricks.filter(b=>b.isAlive);
}

function addColors(){
    colors.push(0xFF5154);
    colors.push(0x91A6FF);
    colors.push(0xFF88DC);
    colors.push(0xFAFF7F);
    colors.push(0xEAFDF8);
}

function randColor(){
    return colors[parseInt(Math.random() * 5)];
}

function checkKeys(){
    for(let i = 0; i < keys.length; i++){
        // console.log(keys[i].isDown);
        if(keys[i].isDown) {
            // console.log(keys[i]);            
            switch(i){
                case 0:
                    player1.y -= player1.speed;
                    break;
                case 1:
                    player1.y += player1.speed;
                    break;
                case 2:
                    player2.y -= player2.speed;
                    break;
                case 3:
                    player2.y += player2.speed;
                    break;
            }
        }

        keys[4].press = () => {
            paused = !paused;
        }
    }
}

function createLabelsAndButtons(){
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: "Futura"
    });

    titleLabel = new PIXI.Text("Brick Pong");
    titleLabel.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 96,
        fontFamily: 'Futura',
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    titleLabel.x = (sceneWidth - titleLabel.width) / 2;
    titleLabel.y = sceneHeight / 4 - titleLabel.height;
    startScene.addChild(titleLabel);

    let startLabel2 = new PIXI.Text("Made for 2 players!");
    startLabel2.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 32,
        fontFamily: "Futura",
        fontStyle: "italic",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    startLabel2.x = (sceneWidth - startLabel2.width) / 2;
    startLabel2.y = 300;
    startScene.addChild(startLabel2);

    startButton = new PIXI.Text("Start Game");
    startButton.style = buttonStyle;
    startButton.x = (sceneWidth - startButton.width) / 2;
    startButton.y = 3 * (sceneHeight / 4) - startButton.height;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame);
    startButton.on("pointerover", e=>e.target.alpha = 0.7);
    startButton.on("pointerout", e=>e.currentTarget.alpha = 1.0);
    startScene.addChild(startButton);

    //Readd this once we implement scores
    let textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 18,
        fontFamily: "Futura",
        stroke: 0xFF0000,
        strokeThickness: 4
    });

    p1ScoreLabel = new PIXI.Text();
    p1ScoreLabel.style = textStyle;
    p1ScoreLabel.x = 10;
    p1ScoreLabel.y = 10;
    gameScene.addChild(p1ScoreLabel);
    increaseScoreBy(0, p1ScoreLabel);

    p2ScoreLabel = new PIXI.Text();
    p2ScoreLabel.style = textStyle;
    p2ScoreLabel.x = sceneWidth - 80 - p2ScoreLabel.width;
    p2ScoreLabel.y = 10;
    gameScene.addChild(p2ScoreLabel);
    increaseScoreBy(0, p2ScoreLabel);

    pauseLabel = new PIXI.Text();
    pauseLabel.style = textStyle;
    pauseLabel.x = 50;
    pauseLabel.y = sceneHeight - 50;
    pauseLabel.isAlive = false;

    //change this text when game is over
    textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 64,
        fontFamily: "Futura",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    
    gameOverText = new PIXI.Text("Victory for {winner}!");
    gameOverText.style = textStyle;
    gameOverText.x = 100;
    gameOverText.y = sceneHeight/2 - 160;
    gameOverScene.addChild(gameOverText);

    playAgainButton = new PIXI.Text("Play Again?");
    playAgainButton.style = buttonStyle;
    playAgainButton.x = 150;
    playAgainButton.y = sceneHeight - 100;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup",startGame);
    playAgainButton.on("pointerover",e=>e.target.alpha = 0.7);
    playAgainButton.on("pointerout", e=>e.currentTarget.alpha = 1.0);
    gameOverScene.addChild(playAgainButton);

    //Same as winner text when game is over
    gameOverScoreLabel = new PIXI.Text("Final score: player1.score to player2.score");
    gameOverScoreLabel.style = textStyle;
    gameOverScoreLabel.x = 100;
    gameOverScoreLabel.y = sceneHeight - 300;
    gameOverScene.addChild(gameOverScoreLabel);
}

function startGame(){
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;

    player1.x = 50;
    player1.y = 20;
    player2.x = sceneWidth - 50 - player2.width;
    player2.y = 20;

    ball1.x = sceneWidth / 4;
    ball1.y = sceneHeight / 2;
    ball2.x = 3 * sceneWidth / 4;
    ball2.y = sceneHeight / 2;
}

function buildBricks(){
    let height = 100;
    let width = 100;
    let xStart = (sceneWidth / 4) - (width * 3)/4;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 6; j++){            
            let b = new Brick(randColor(), xStart + (i * height/2), (j * width/2), width, height, 1, 2);
            bricks.push(b);
            gameScene.addChild(b);
        }
    }   
}

function hitBrick(b){
    b.health = b.health - 1;
    b.hit();
    increaseScoreBy(10, p1ScoreLabel);
    // console.log(b.health);
}

function increaseScoreBy(value, label){
    score += value;
    label.text = `Score:  ${score}`;
}

function collisionDetection(){
    for(let ball of balls){
        // Ball-bricks collisions
        for(let brick of bricks){
            if(rectsIntersect(ball, brick)){
                // console.log('Brick hit');
                hitBrick(brick);

                // The ball is above or below the brick
                if((ball.x + ball.radius > brick.x) && (ball.x - ball.radius < brick.x + brick.width))
                    ball.reflectY();

                // The ball is to the left or right of the brick
                if((ball.y + ball.radius > brick.y) && (ball.y - ball.radius < brick.y + brick.height))
                    ball.reflectX();
            }
        }

        // Ball-bumper collisions
        if(rectsIntersect(ball, player1)){
            // console.log('Player 1 hit');
            ball.reflectX();
        }
        else if(rectsIntersect(ball, player2)){
            // console.log('Player 2 hit');
            ball.reflectX();
        }
    }  
}