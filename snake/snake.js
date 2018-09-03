const cnv = document.getElementById("gc");
const ctx = cnv.getContext("2d");

var box = 32;

const ground = new Image();
const foodImg = new Image();

const up = new Audio();
const down = new Audio();
const left = new Audio();
const right = new Audio();
const eat = new Audio();
const death = new Audio();


up.src = "audio/up.mp3";
down.src = "audio/down.mp3";
left.src = "audio/left.mp3";
right.src = "audio/right.mp3";
eat.src = "audio/eat.mp3";
death.src = "audio/dead.mp3";


ground.src = "img/ground.png";
foodImg.src = "img/food.png";

var snakeX = 1, snakeY = 3;

let snake = [];
var tail = 5;


let food = {
    x : Math.floor(Math.random()*17+1),
    y : Math.floor(Math.random()*15+3)
}

var score = 0;
var gameOver = false;

document.addEventListener("keydown", direction);

var d;

window.onload = function() {
    setInterval(draw, 100);
}

function direction(event) {
    var code = event.keyCode;
    
    if(code == 37 && d !== "RIGHT") {
        d = "LEFT";
        left.play();
    } else if(code == 38 && d !== "DOWN") {
        d = "UP";
        up.play();
    } else if(code == 39 && d !== "LEFT") {
        d = "RIGHT";
        right.play();
    } else if(code == 40 && d !== "UP") {
        d = "DOWN";
        down.play();
    }
    
//    console.log("dir " + d);
}

function draw() {
    
    ctx.drawImage(ground, 0, 0);
    
    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score, 2*box, 1.6*box);
    ctx.fillText("Length: " + tail, 4*box, 1.6*box);
    
    if(gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "45px Changa one";
        ctx.fillText("Game Over!", 6*box, 7*box);
        
        ctx.font = "30px Changa one";
        ctx.fillText("Reload the page to restart", 5*box, 9*box);
        
        return;
    }
    
    if(d == "LEFT") snakeX--;
    else if(d == "RIGHT") snakeX++;
    else if(d == "UP") snakeY--;
    else if(d == "DOWN") snakeY++;
//    console.log(d + " " + snakeY);
    
    snake.push({x:snakeX, y:snakeY});
    while(snake.length > tail) {
        snake.shift();
    }
    
    if(snakeX >= (17+1)) {
        snakeX = 1;
//        console.log("X: " + x);
    }
    if(snakeX < 1) {
        snakeX = (16+1);
    }
    if(snakeY >= (15+3)) {
        snakeY = 3;
    }
    if(snakeY < 3) {
        snakeY = (14+3);
    }
    
    if(snakeX == food.x && snakeY == food.y) {
        tail++;
        score++;
        eat.play();
        
        food = {
            x : Math.floor(Math.random()*17+1),
            y : Math.floor(Math.random()*15+3)
        }
//        console.log(tail);
    }
    
    for(var i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == snake.length-1) ? "red" : "lime";
        ctx.fillRect(snake[i].x*box, snake[i].y*box, box, box);
        
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x*box, snake[i].y*box, box, box);
        
        if(i != snake.length-1) {
            if(snake[i].x == snake[snake.length-1].x && snake[i].y == snake[snake.length-1].y) {
                if(snake.length > 5) {
                    gameOver = true;
                    death.play();
                }
            }
        }
    }
    
    ctx.drawImage(foodImg, food.x*box, food.y*box);
    
}
