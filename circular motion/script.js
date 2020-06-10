import utils from "./utils";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2,
};

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

// Event Listeners
addEventListener("mousemove", (event) => {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

addEventListener("resize", () => {
	canvas.width = innerWidth;
	canvas.height = innerHeight;

	init();
});

// Objects
class Particle {
	constructor(x, y, radius, color) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.color = color;
		this.radians = Math.random() * 2 * Math.PI;
		this.velocity = 0.01;
		this.distanceFromCenter = utils.randomIntFromRange(100, 150);
		this.lastMouse = {
			x: x,
			y: y,
		};
		this.initialPosition = {
			x: x,
			y: y,
		};
		this.wobble = 0;
	}

	draw(lastPoint) {
		c.beginPath();
		c.strokeStyle = this.color;
		c.lineWidth = 3;
		c.moveTo(lastPoint.x, lastPoint.y);
		c.lineTo(this.x, this.y);
		c.stroke();
		c.closePath();
	}

	update() {
		//Move points over time
		const lastPoint = { x: this.x, y: this.y };

		//Drag effect
		this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
		this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

		//Circular Motion
		this.radians += this.velocity;
		this.wobble = Math.sin(this.radians) * this.distanceFromCenter;
		this.x =
			this.initialPosition.x + Math.cos(this.radians) * this.distanceFromCenter + this.wobble;
		this.y = this.initialPosition.y + Math.sin(this.radians) * this.distanceFromCenter;
		this.draw(lastPoint);
	}
}

// Implementation
let particles;
function init() {
	particles = [];
	for (let i = 0; i < 50; i++) {
		const radius = Math.random() * 2 + 1;
		const color = utils.randomColor();
		particles.push(new Particle(canvas.width / 2, canvas.height / 2, radius, color));
	}
}

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	c.fillStyle = "rgba(255,255,255,0.05)";
	c.fillRect(0, 0, canvas.width, canvas.height);
	particles.forEach((particle) => {
		particle.update();
	});
}

init();
animate();
