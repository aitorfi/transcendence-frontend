'use strict'

import { join, button, game_state, ballx, bally, Player1Y, Player2Y, screen_mesagge, color, Player1Points, Player2Points, serverTime, speedx, speedy, Player1Name, Player2Name, Player1Id, Player2Id } from "./com.js";
//Game variables
let canvas;
let ctx;
let player1Up, player1Down;
let player2Up, player2Down;
let gameLoopId;
let timeoutId;
let player1Score;
let player2Score;
//let wait;
//let finish;
let connect = 0;
let latency;
let x;
let fX;
let fY;

//constants  
const BALL_SIZE = 10;
//const PADDLE_SPEED = 6;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

export function onlineInitializeGame() {



	canvas = document.getElementById('pongCanvas');
	ctx = canvas.getContext('2d');
	player1Up = false;
	player1Down = false;
	player2Up = false;
	player2Down = false;
	player1Score = 0;
	player2Score = 0;
	//wait = false;
	//finish = false;


    document.addEventListener('keydown', (event) => {
		if (event.key === 'w' && player1Up == false)
		{
			button("upOn");
			player1Up = true;
		}
		if (event.key === 's' && player1Down == false)
		{
			button("downOn");
			player1Down = true;
		} 
    });

    document.addEventListener('keyup', (event) => {
		if (event.key === 'w')
		{
			button("upOff");
			player1Up = false;
		}
		if (event.key === 's')
		{
			button("downOff");
			player1Down = false;
		}	
    });

	const h1Element = document.querySelector('#pong-container h1');
	  // Cambia el texto del h1



	h1Element.textContent = localStorage.getItem("tournament");

	//wait = true;
	
	if (connect == 0)
	{
		join();
		connect = 1;
	}
	//deactivateKeydown();
	updateScore();
    gameLoop();
}


function gameLoop() {
	
	if(game_state == "playing")
	{
		if (x != ballx)
		{
			cleanCanva();
			x = ballx;
			drawCanva();
		}
	}
	else if (game_state == "waiting"){

		showMessage(screen_mesagge, color);
	}
	refresh();	
}

function drawRect(x, y) {
	ctx.fillStyle = 'white';
	ctx.fillRect(x, y, 10, 100);
}

function drawBall() {
	//console.log("Front time: ", Date.now() / 1000, "    Back time: ", serverTime)
	//console.log("Speed X: ", speedx, "    Speed Y: ", speedy)
	//console.log("latency: ", latency)
	ctx.fillStyle = 'yellow';
	ctx.beginPath();
	
	latency = (Date.now() / 1000) - serverTime;
	fX = ballx + speedx * latency;
	fY = bally + speedy * latency;
	
	ctx.arc(fX, fY, 10, 0, 6.28318);
	//ctx.arc(ballx, bally, 10, 0, 6.28318);
	ctx.fill();
}

function drawDashedLine() {
    ctx.beginPath();
    ctx.setLineDash([5, 5]); // Define el patrón de línea discontinua
    ctx.moveTo(canvas.width / 2, 0); // Comienza en la parte superior
    ctx.lineTo(canvas.width / 2, canvas.height); // Termina en la parte inferior
    ctx.strokeStyle = 'white'; // Color de la línea
    ctx.lineWidth = 1; // Ancho de la línea
    ctx.stroke();
    ctx.setLineDash([]); // Restablece el patrón de línea a sólido
}

function cleanCanva()
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//canvas.width = canvas.width;
}

function drawCanva()
{
	/* drawRect(0, Player1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
	drawRect(canvas.width - PADDLE_WIDTH, Player2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
	drawBall(ballx, bally, BALL_SIZE, 'white'); */
	drawRect(0, Player1Y);
	drawRect(590, Player2Y);
	drawDashedLine();
	drawBall();
	//drawBall(ballx, bally);
}

export function updateScore() {



    document.getElementById('player1-avatar').src = "http://localhost:50000/api/users/avatar/" + Player1Id + "/";
    document.getElementById('player1-name-score').textContent = Player1Name + ": " + Player1Points;
    
    document.getElementById('player2-avatar').src = "http://localhost:50000/api/users/avatar/" + Player2Id + "/";
    document.getElementById('player2-name-score').textContent = Player2Name + ": " + Player2Points;
}

function refresh() {
	gameLoopId = requestAnimationFrame(gameLoop);
}

export function terminateGame() {
	document.removeEventListener('keydown', gameLoop);

	if (gameLoopId)
		cancelAnimationFrame(gameLoopId);
	if (timeoutId)
		clearTimeout(timeoutId);
}

function showMessage(message, color) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color;
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';

    // Dividimos el mensaje en líneas, usando "\n" como separador
    const lines = message.split('\n');
    
    // Para centrar cada línea verticalmente, ajustamos la posición Y para cada línea
    lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, canvas.height / 2 + (index * 40)); // Ajusta el valor 40 para el espaciado entre líneas
    });
}


