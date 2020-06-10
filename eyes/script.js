const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let eyes = [];
let theta;

const mouse = {
	x: canvas.width,
	y: canvas.height,
};

window.addEventListener("mousemove", (event) => {
	mouse.x = event.x;
	mouse.y = event.y;
});

window.addEventListener("resize", () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	init();
});

class Eye {
	constructor(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
	}
	draw() {
		//draw eye
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		c.fillStyle = "red";
		c.fill();
		c.closePath();
		//get angle b/w mouse and iris
		let dx = mouse.x - this.x;
		let dy = mouse.y - this.y;
		theta = Math.atan2(dy, dx);
		//draw iris
		let iris_x = this.x + Math.cos(theta) * (this.radius / 10);
		let iris_y = this.y + Math.sin(theta) * (this.radius / 10);
		irisRadius = this.radius / 1.2;
		c.beginPath();
		c.arc(iris_x, iris_y, irisRadius, 0, 2 * Math.PI, true);
		c.fillStyle = "white";
		c.fill();
		c.closePath();
		//draw pupil
		let pupil_x = iris_x + Math.cos(theta) * (irisRadius / 2.1);
		let pupil_y = iris_y + Math.sin(theta) * (irisRadius / 2.1);
		pupilRadius = this.radius / 2.5;
		c.beginPath();
		c.arc(pupil_x, pupil_y, pupilRadius, 0, 2 * Math.PI, true);
		c.fillStyle = "black";
		c.fill();
		c.closePath();
		//draw pupil reflection
		c.beginPath();
		c.arc(
			pupil_x - pupilRadius / 3,
			pupil_y - pupilRadius / 3,
			pupilRadius / 3,
			0,
			Math.PI * 2,
			true
		);
		c.fillStyle = "rgba(255,255,255,0.1)";
		c.fill();
		c.closePath();
		//draw mouse
		// c.beginPath();
		// c.arc(mouse.x, mouse.y, 50, 0, 2 * Math.PI, true);
		// c.fillStyle = "blue";
		// c.fill();
		// c.closePath();
	}
}

function init() {
	eyes = [];
	let overlapping = false;
	let noofeyes = 200;
	let protection = 10000;
	let counter = 0;
	while (eyes.length < noofeyes && counter < protection) {
		for (let i = 0; i < noofeyes; i++) {
			let eye = {
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				radius: Math.floor(Math.random() * 50) + 20,
			};
			overlapping = false;
			for (let i = 0; i < eyes.length; i++) {
				let previousEye = eyes[i];
				let dX = eye.x - previousEye.x;
				let dY = eye.y - previousEye.y;
				let distance = Math.sqrt(dX * dX + dY * dY);
				if (distance < eye.radius + previousEye.radius) {
					overlapping = true;
					break;
				}
			}
			if (!overlapping) {
				eyes.push(new Eye(eye.x, eye.y, eye.radius));
			}
			counter++;
		}
	}
}

function animate() {
	requestAnimationFrame(animate);
	c.fillStyle = "rgba(0,0,0,0.25)";
	c.fillRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < eyes.length; i++) {
		eyes[i].draw();
	}
}
init();
animate();
