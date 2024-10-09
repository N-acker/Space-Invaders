
//board variables 
let tileSize = 32;
let rows = 16;
let columns = 16;

let board; //board variable
let boardWidth = tileSize * columns; //32 * 16
let boardHeight = tileSize * rows; //32 * 16
let context; // using this variable to draw on canvas 

// ship variables 
let shipWidth = tileSize*2;
let shipHeight = tileSize;
let shipX = tileSize * columns/2 - tileSize; //this is the x-coordinates for our ship (its basically starts in the middle of the canvas)
let shipY = tileSize * rows - tileSize*2 //this is the starting y-coordinates for our ship (its basically the bottom 2 rows all the time)
// basically the coordinates of the ship are 2 tiles which are in the middle at the bottom of the canvas

// this is our ship object
let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height : shipHeight
}

let shipImg;
let shipVelocityX = tileSize; //whenever we move the ship it moves one tile over

window.onload = function() {

    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); //applying context so that we can draw on board 

    //draw initial ship 
    // context.fillStyle="green";
    // context.fillRect(ship.x, ship.y, ship.width, ship.height);
    // we don't need the top 2 lines since we have an actual ship image 

    shipImg = new Image();
    shipImg.src = "./images/ship.png"; 
    shipImg.onload = function() {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip); //keydown is whenever a user presses a key down and when this happens we check moveShip to see which one was pressed
}

function update(){

    requestAnimationFrame(update);

    context.clearRect(0, 0, board.width, board.height);

    //ship is being drawn on canvas over and over again 
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

}

// the parameter e stands for event 
function moveShip(e){
    if((e.code == "ArrowLeft") && (ship.x - shipVelocityX >= 0)){

        ship.x -= shipVelocityX; //move left one tile

    }else if((e.code == "ArrowRight") && (ship.x + shipVelocityX + ship.width <= board.width)){
        ship.x += shipVelocityX; //move right one tile
    }
}
