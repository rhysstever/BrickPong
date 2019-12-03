// From Professor Wheeland's 
// "Smooth Keyboard Control" Demo

// Motified slightly for our  
// desired inputs 

const keyboard = Object.freeze({
	SPACE: 		32,
	UP: 		38, 
    DOWN: 		40,
    S:          65,
    W:          87
});

// this is the "key daemon" that we poll every frame
const keys = [];

window.onkeyup = (e) => {
//	console.log("keyup=" + e.keyCode);
	keys[e.keyCode] = false;
	e.preventDefault();
};

window.onkeydown = (e)=>{
//	console.log("keydown=" + e.keyCode);
	keys[e.keyCode] = true;
	
	// checking for other keys - ex. 'p' and 'P' for pausing
	var char = String.fromCharCode(e.keyCode);
	if (char == " "){
        // pauses game
        //console.log("pause");
    }

    if (char == "W"){
        // move player 1 up
        //console.log("P1 up");
        player1.move(-1);
    }
    else if (char == "S"){
        // move player 1 down
        //console.log("P1 down");
        player1.move(1);
    }
    else{
        player1.move(0);
    }

    if (char == "&"){
        // move player 2 up
        //console.log("P2 up");
        player2.move(-1);
    }
    else if (char == "("){
        // move player 2 down
        //console.log("P2 down");
        player2.move(1);
    }
    else{
        player2.move(0);
    }
};