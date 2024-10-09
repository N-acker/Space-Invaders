
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

//aliens 
let alienArray = []; //holds all our aliens 
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize; 
let alienImg;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; //the number of aliens to defeat 
let alienVelocityX = 1 //alien moving speed

//bullets
let bulletArray = [];
let bulletVelocityY = -10; //bullet moving speed

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

    alienImg = new Image();
    alienImg.src = "./images/alien.png";
    createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip); //keydown is whenever a user presses a key down and when this happens we check moveShip to see which one was pressed
}

function update(){

    requestAnimationFrame(update);

    context.clearRect(0, 0, board.width, board.height);

    //ship is being drawn on canvas over and over again 
    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    //alien is being drawn on canvas over and over again
    for(let n=0; n<alienArray.length; n++){
        let alien = alienArray[n];
        if(alien.alive){
            alien.x += alienVelocityX;

            // if alien touches the boarders 
            if((alien.x + alien.width >= board.width) || (alien.x <= 0)){
                alienVelocityX *= -1;
                alien.x += alienVelocityX*2

                //move all aliens by one row when they touch the edge of the canvas
                for(let m=0; m<alienArray.length; m++){
                    alienArray[m].y += alienHeight; //if the y position is 2 it then becomes 3
                }
            }
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
        }
    }
}

// the parameter e stands for event 
function moveShip(e){
    if((e.code == "ArrowLeft") && (ship.x - shipVelocityX >= 0)){

        ship.x -= shipVelocityX; //move left one tile

    }else if((e.code == "ArrowRight") && (ship.x + shipVelocityX + ship.width <= board.width)){
        ship.x += shipVelocityX; //move right one tile
    }
}


function createAliens(){
    for(let i=0; i<alienColumns; i++ ){
        for(let j=0; j<alienRows; j++){
            let alien = {
                img : alienImg,
                x : alienX + i*alienWidth, //this is the x-coordinate of that specific alien
                y : alienY + j*alienHeight, //this is the y-coordinate of that specific alien
                width : alienWidth,
                height : alienHeight, 
                alive: true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function shoot(e){

    if (e.code == "Space"){
        //shoot
        let bullet = {
        x : ship.x + shipWidth*15/32, //places the bullet directly in front of the canon
        y : ship.y,
        width : tileSize/8,
        height : tileSize/2,
        used : false //if the bullet touches an alien it gets set to true indicating a bullet has been used
        }

    }
}