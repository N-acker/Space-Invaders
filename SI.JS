
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
let alienImgWhite;
let alienImgCyan;
let alienImgMagenta;
let alienImgYellow;
let alienImages = [];

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; //the number of aliens to defeat 
let alienVelocityX = 1 //alien moving speed

//bullets
let bulletArray = [];
let bulletVelocityY = -10; //bullet moving speed

let score = 0;
let gameOver = false;

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

    alienImgWhite = new Image();
    alienImgWhite.src = "./images/alien.png";
    alienImages.push(alienImgWhite);

    alienImgCyan = new Image();
    alienImgCyan.src = "./images/alien-cyan.png";
    alienImages.push(alienImgCyan);

    alienImgMagenta = new Image();
    alienImgMagenta.src = "./images/alien-magenta.png";
    alienImages.push(alienImgMagenta);

    alienImgYellow = new Image();
    alienImgYellow.src = "./images/alien-yellow.png";
    alienImages.push(alienImgYellow);

    createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip); //keydown is whenever a user presses a key down and when this happens we check moveShip to see which one was pressed
    document.addEventListener("keyup", shoot); //keyup means you have to release the key in order to shoot

}

function update(){

    requestAnimationFrame(update);

    if(gameOver){
        context.clearRect(0, 0, board.width, board.height);

        context.fillStyle="red";
        context.font="48px courier"
        context.textAlign = "center"; 
        context.fillText("GAME OVER", board.width/2, board.height/2 - 40);

        context.fillStyle="white";
        context.font="24px courier"
        context.fillText("Score: " + score, board.width/2, board.height/2 + 20);
        return;
    }

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

                //move all aliens down by one row when they touch the edge of the canvas
                for(let m=0; m<alienArray.length; m++){
                    alienArray[m].y += alienHeight; //if the y position is 2 it then becomes 3
                }
            }
            context.drawImage(alien.img, alien.x, alien.y, alien.width, alien.height);

            if(alien.y >= ship.y){
                gameOver = true;
            }
        }
    }

    // bullets
    for(let k=0; k<bulletArray.length; k++){
        let bullet = bulletArray[k];
        bullet.y += bulletVelocityY
        context.fillStyle="blue";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        //bullet collision with aliens 
        for( j=0; j<alienArray.length; j++){
            let alien = alienArray[j];
            if(!bullet.used && alien.alive && detectcollision(bullet, alien)){
                bullet.used = true;
                alien.alive = false; 
                alienCount--;
                score += 100;
            }
        }
    }


    // clear bullets 
    while(bulletArray.length>0 && (bulletArray[0].used || bulletArray[0].y < 0)){
        bulletArray.shift(); //removes the first element of the array
        // console.log(bulletArray);
    }

    // next level
    if (alienCount == 0){
        // increase the number of aliens in columns and rows by 1 
        alienColumns = Math.min(alienColumns + 1, columns/2 -2); //cap at 16/2 -2 = 6 to prevent from touching the canvas
        alienRows = Math.min(alienRows + 1, rows - 4); //cap at 16-4 = 12 to prevent from touching the ship immediatley 
        alienVelocityX += 0.2; //increases the alien movement speed 
        alienArray = [];
        bulletArray = []; // bullet array cleared to prevent bullet from previous level hitting new set of aliens in new level
        createAliens();
    }

    context.fillStyle="white";
    context.font="16px courier"
    context.fillText(score, 5, 20);
}




// the parameter e stands for event 
function moveShip(e){
    
    if(gameOver){
        return;
    }

    if((e.code == "ArrowLeft") && (ship.x - shipVelocityX >= 0)){

        ship.x -= shipVelocityX; //move left one tile

    }else if((e.code == "ArrowRight") && (ship.x + shipVelocityX + ship.width <= board.width)){
        ship.x += shipVelocityX; //move right one tile
    }
}


function createAliens(){
    for(let i=0; i<alienColumns; i++ ){
        
        for(let j=0; j<alienRows; j++){

            let randomAlienImg = alienImages[Math.floor(Math.random() * alienImages.length)];
            
            let alien = {
                img : randomAlienImg,
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

    if(gameOver){
        return;
    }

    if (e.code == "Space"){
        //shoot
        let bullet = {
        x : ship.x + shipWidth*15/32, //places the bullet directly in front of the canon
        y : ship.y,
        width : tileSize/8,
        height : tileSize/2,
        used : false //if the bullet touches an alien it gets set to true indicating a bullet has been used
        }

        bulletArray.push(bullet); //the bullet object gets pushed to the end of the array

    }
}


// this function detetcs when 2 objects (specifically 2 rectangles) collide
function detectcollision(a, b){
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner 
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner  
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height  > b.y;  //a's bottom left corner passes b's top left corner 
}

