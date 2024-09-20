'use strict'

let canvas;
let ctx;
let player1Y, player2Y;
let ballX, ballY;
let ballSpeedX, ballSpeedY;
let player1Up, player1Down;
let player2Up, player2Down;
let gameLoopId;

const BALL_SIZE = 10;
const PADDLE_SPEED = 6;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

export function initializeGame() {
	canvas = document.getElementById('pongCanvas');
	ctx = canvas.getContext('2d');
	ballSpeedX = 8;
	ballSpeedY = 1;
	player1Up = false;
	player1Down = false;
	player2Up = false;
	player2Down = false;

    player1Y = (canvas.height - PADDLE_HEIGHT) / 2;
    player2Y = (canvas.height - PADDLE_HEIGHT) / 2;
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;

    document.addEventListener('keydown', (event) => {
		if (event.key === 'w') player1Up = true;
		if (event.key === 's') player1Down = true;
		if (event.key === 'ArrowUp') player2Up = true;
		if (event.key === 'ArrowDown') player2Down = true;
    });

    document.addEventListener('keyup', (event) => {
		if (event.key === 'w') player1Up = false;
		if (event.key === 's') player1Down = false;
		if (event.key === 'ArrowUp') player2Up = false;
		if (event.key === 'ArrowDown') player2Down = false;
    });

    gameLoop();
}

function drawRect(x, y, w, h, color) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
	ctx.fillStyle = color;
	ctx.beginPath();
	ctx.arc(x, y, size, 0, Math.PI * 2);
	ctx.fill();
}

function gameLoop() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	drawRect(0, player1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
	drawRect(canvas.width - PADDLE_WIDTH, player2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
	drawBall(ballX, ballY, BALL_SIZE, 'white');

	if (player1Up && player1Y > 0)
		player1Y -= PADDLE_SPEED;
	if (player1Down && player1Y < canvas.height - PADDLE_HEIGHT)
		player1Y += PADDLE_SPEED;
	if (player2Up && player2Y > 0)
		player2Y -= PADDLE_SPEED;
	if (player2Down && player2Y < canvas.height - PADDLE_HEIGHT)
		player2Y += PADDLE_SPEED;

	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height)
		ballSpeedY = -ballSpeedY;

	if (ballX <= PADDLE_WIDTH) {
		if (ballY > player1Y && ballY < player1Y + PADDLE_HEIGHT)
			ballSpeedX = -ballSpeedX;
	} else if (ballX + BALL_SIZE >= canvas.width - PADDLE_WIDTH) {
		if (ballY > player2Y && ballY < player2Y + PADDLE_HEIGHT)
			ballSpeedX = -ballSpeedX;
	}

	gameLoopId = requestAnimationFrame(gameLoop);
}

export function terminateGame() {
	if (gameLoopId)
		cancelAnimationFrame(gameLoopId);
}
