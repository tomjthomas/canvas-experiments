import utils from "./utils";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
	x: undefined,
	y: undefined,
};

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

addEventListener("click", (event) => {
	let x = event.x;
	let y = event.y;
	let color = utils.randomColor();
	let radius = utils.randomIntRange(2, 4);
	particles.push(new Particle(x, y, radius, color));
});

// Objects
class Particle {
	constructor(x, y, radius, color) {
		this.x = x;
		this.y = y;
		this.velocity = {
			x: (Math.random() - 0.5) * 3,
			y: (Math.random() - 0.5) * 3,
		};
		this.radius = radius;
		this.color = color;
		this.mass = 1;
	}

	draw() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.fillStyle = this.color;
		c.fill();
		c.strokeStyle = this.color;
		c.stroke();
		c.closePath();
	}

	connect(particle) {
		c.beginPath();
		c.moveTo(this.x, this.y);
		c.lineTo(particle.x, particle.y);
		c.strokeStyle = this.color;
		c.stroke();
	}

	update(particles) {
		this.draw();
		//Check collision between particles
		for (let i = 0; i < particles.length; i++) {
			if (this == particles[i]) {
				continue;
			}
			let particleDistance =
				utils.getDistance(this.x, this.y, particles[i].x, particles[i].y) -
				(this.radius - particles[i].radius);
			if (particleDistance < 0) {
				utils.resolveCollision(this, particles[i]);
			}
			if (particleDistance < 45) {
				this.connect(particles[i]);
			}
		}
		//Check collision with borders
		if (this.x - this.radius <= 0 || this.x + this.radius >= innerWidth) {
			this.velocity.x = -this.velocity.x;
		}
		if (this.y - this.radius <= 0 || this.y + this.radius >= innerHeight) {
			this.velocity.y = -this.velocity.y;
		}

		//Mouse interaction
		if (utils.getDistance(mouse.x, mouse.y, this.x, this.y) < 100 + this.radius) {
			this.connect(mouse);
		}
		//Add motion to particles
		this.x += this.velocity.x;
		this.y += this.velocity.y;
	}
}

// Implementation
let particles;
function init() {
	particles = [];
	for (let i = 0; i < 500; i++) {
		const radius = utils.randomIntRange(2, 4);
		let x = utils.randomIntRange(radius, canvas.width - radius);
		let y = utils.randomIntRange(radius, canvas.height - radius);
		const color = utils.randomColor();

		if (i != 0) {
			for (let j = 0; j < particles.length; j++) {
				if (utils.getDistance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0) {
					x = utils.randomIntRange(radius, canvas.width - radius);
					y = utils.randomIntRange(radius, canvas.height - radius);
					j = -1;
				}
			}
		}

		particles.push(new Particle(x, y, radius, color));
	}
}

// Animation Loop
function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0, 0, canvas.width, canvas.height);
	particles.forEach((particle) => {
		particle.update(particles);
	});
}

init();
animate();
