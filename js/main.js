"use strict";
const app = new PIXI.Application(600,600);
document.body.appendChild(app.view);
let stage;

let startScene,gameScene,gameOverScene;

function setup() {
	stage = app.stage;
    // #1 - Create the `start` scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);
	
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
}

function gameLoop(){
	if (paused) return; // keep this commented out for now
	
	// #1 - Calculate "delta time"
	let dt = 1/app.ticker.FPS;
    if (dt > 1/12) dt=1/12;
}

function startGame(){
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
}