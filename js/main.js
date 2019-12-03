"use strict";
const app = new PIXI.Application(1200,600);
document.body.appendChild(app.view);

const sceneWidth = app.view.width;
const sceneHeight = app.view.height;
let colors = []
let stage;

let startScene,gameScene,gameOverScene,winner,gameOverScoreLabel;

window.onload = setup;

let player1,player2;
let bricks = [];
let balls = [];

function setup() {
    addColors();

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
    player1 = new Player();
    player2 = new Player(0xFFFFFF, 0, 0, 80, 80, 1);

    // #6 - Spawn Bricks
    buildBricks();

    // #7 - run the gameloop
    app.ticker.add(gameLoop);
}

function gameLoop(){
	//if (paused) return; // keep this commented out for now
	
	// #1 - Calculate "delta time"
	let dt = 1/app.ticker.FPS;
    if (dt > 1/12) dt=1/12;

    // Check if bricks have been hit
    for(let b = 0; b < balls.length; b++){
        for(let i = 0; i < bricks.length; i++){
            if(rectsIntersect(balls[b], bricks[i])){
                hitBrick(i);
            }
        }
    }  
}

function buildBricks(){
    let height = 100;
    let width = 100;
    let xStart = (sceneWidth / 4) - (width * 3)/4;
    for(let i = 0; i < 3; i++){
        for(let j = 0; j < 6; j++){            
            let b = new Brick(randColor(), xStart + (i * height/2), (j * width/2), width, height, 8, 2);
            bricks.push(b);
            gameScene.addChild(b);
        }
    }   
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

function createLabelsAndButtons(){
    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: "Futura"
    });

    let startLabel1 = new PIXI.Text("Brick Pong");
    startLabel1.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 96,
        fontFamily: 'Futura',
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    startLabel1.x = 50;
    startLabel1.y = 120;
    startScene.addChild(startLabel1);

    let startLabel2 = new PIXI.Text("Made for 2 players!");
    startLabel2.style = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 32,
        fontFamily: "Futura",
        fontStyle: "italic",
        stroke: 0xFF0000,
        strokeThickness: 6
    });

    startLabel2.x = 185;
    startLabel2.y = 300;
    startScene.addChild(startLabel2);

    let startButton = new PIXI.Text("Start Game");
    startButton.style = buttonStyle;
    startButton.x = 80;
    startButton.y = sceneHeight - 100;
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
        stroke: 0xFF00000,
        strokeThickness: 4
    });

    /*
    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);*/

    //change this text when game is over
    let gameOverText = new PIXI.Text("Victory for {winner}!");
    textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 64,
        fontFamily: "Futura",
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    gameOverText.style = textStyle;
    gameOverText.x = 100;
    gameOverText.y = sceneHeight/2 - 160;
    gameOverScene.addChild(gameOverText);

    let playAgainButton = new PIXI.Text("Play Again?");
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
}

function hitBrick(i=0){
    let b = bricks[i];
    b.health = b.health - 1;
    b.hit();
}