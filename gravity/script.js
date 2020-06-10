const canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext("2d");

let mouse = {
	x: undefined,
	y: undefined,
};

const gravity = 0.3;
const airfriction = 0.8;
const groundfriction = 0.7;
const clickForce = 300;

function randomIntRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
function randomColour() {
	const colours = ["#F2B807", "#1C6C8C", "#D90B31"];
	let colour = colours[Math.floor(Math.random() * colours.length)];
	return colour;
}

window.addEventListener("resize", function () {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	init();
});
window.addEventListener("click", function (event) {
	mouse.x = event.x;
	mouse.y = event.y;
});

class Ball {
	constructor(x, y, dx, dy, radius, colour) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.radius = radius;
		this.colour = colour;
	}

	draw() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		c.fillStyle = this.colour;
		c.fill();
		c.stroke();
		c.closePath();
	}
	update() {
		if (this.y + this.radius + this.dy > canvas.height) {
			this.dy = -this.dy * airfriction;
		} else {
			this.dy += gravity;
		}

		if (this.x + this.radius + this.dx > canvas.width || this.x - this.radius <= 0) {
			this.dx = -this.dx;
		}

		if (this.y - this.radius + this.dy < 0) {
			this.dy = -this.dy;
		}

		if (Math.floor(this.y + this.radius) == Math.floor(canvas.height)) {
			this.dx = this.dx * groundfriction;
		}

		if (Math.abs(mouse.x - this.x) <= 100 && Math.abs(mouse.y - this.y) <= 100) {
			this.dy = -(this.dy + clickForce / this.radius);
			this.dx = (Math.random() - 0.5) * 2 * (this.dx + clickForce / this.radius);
		}
		this.x += this.dx;
		this.y += this.dy;
		this.draw();
	}
}

function clearClick() {
	mouse.x = undefined;
	mouse.y = undefined;
}

let ball;
let ballArray = [];
function init() {
	ballArray = [];
	for (let i = 0; i < 150; i++) {
		let radius = randomIntRange(20, 30);
		let x = randomIntRange(radius, canvas.width - radius);
		let y = randomIntRange(radius, canvas.height / 2);
		let dx = randomIntRange(-2, 2);
		let dy = randomIntRange(-2, 2);
		let colour = randomColour();
		ballArray.push(new Ball(x, y, dx, dy, radius, colour));
	}

	animate();
}

function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < ballArray.length; i++) {
		ballArray[i].update();
	}
	clearClick();
}

init();
