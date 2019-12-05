// From Professor Wheeland's 
// "Smooth Keyboard Control" Demo

// Modified slightly for our  
// desired inputs 

/*
const keyboard = Object.freeze({
	SPACE: 		32,
	UP: 		38, 
    DOWN: 		40,
    S:          65,
    W:          87
});*/

// this is the "key daemon" that we poll every frame
let keys = [];

addKeys();

/*
window.onkeyup = (e) => {
//	console.log("keyup=" + e.keyCode);
	keys[e.keyCode] = false;
	e.preventDefault();
};

window.onkeydown = (e)=>{
//	console.log("keydown=" + e.keyCode);
	keys[e.keyCode] = true;
	
	var char = String.fromCharCode(e.keyCode);
	if (char == " "){
        // pauses game
        //console.log("pause");
    }
};*/

function addKeys(){
	keys.push(keyboard("w"));
	keys.push(keyboard("s"));
	keys.push(keyboard("ArrowUp"));
	keys.push(keyboard("ArrowDown"));
	keys.push(keyboard(" "));
}