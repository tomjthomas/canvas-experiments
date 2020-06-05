const canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let c = canvas.getContext("2d");

let mouse = {
	x: undefined,
	y: undefined,
};

const maxRadius = 60;

window.addEventListener("mousemove", function (event) {
	mouse.x = event.x;
	mouse.y = event.y;
});

window.addEventListener("resize", function (event) {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	init();
});

class Circle {
	constructor(x, y, dx, dy, radius) {
		this.x = x;
		this.y = y;
		this.dx = dx;
		this.dy = dy;
		this.radius = radius;
		this.minRadius = radius;
		this.color = randomColor();
	}
	draw() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.fill();
	}
	update() {
		this.draw();
		if (this.x + this.radius > innerWidth || this.x - this.radius < 0) {
			this.dx = -this.dx;
		}
		if (this.y + this.radius > innerHeight || this.y - this.radius < 0) {
			this.dy = -this.dy;
		}
		this.x += this.dx;
		this.y += this.dy;

		if (Math.abs(mouse.x - this.x) < 50 && Math.abs(mouse.y - this.y) < 50) {
			if (this.radius <= maxRadius) {
				this.radius += 1;
			}
		} else if (this.radius > this.minRadius) {
			this.radius -= 1;
		}
	}
}

function randomColor() {
	const colors = ["#F2B807", "#1C6C8C", "#D90B31"];
	let color = colors[Math.floor(Math.random() * colors.length)];
	return color;
}

let circleArray;

function init() {
	circleArray = [];
	for (let i = 0; i < 500; i++) {
		let radius = Math.random() * 7 + 3;
		let x = Math.random() * (innerWidth - radius * 2) + radius;
		let y = Math.random() * (innerHeight - radius * 2) + radius;
		let dx = (Math.random() - 0.5) * 2;
		let dy = (Math.random() - 0.5) * 2;
		circleArray.push(new Circle(x, y, dx, dy, radius));
	}
}

function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, innerWidth, innerHeight);
	for (let i = 0; i < circleArray.length; i++) {
		circleArray[i].update();
	}
}
init();
animate();
