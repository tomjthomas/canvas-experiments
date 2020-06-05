import utils from "./utils";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2,
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
	let radius = utils.randomIntRange(15, 20);
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
		this.opacity = 0;
	}

	draw() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
		c.save();
		c.globalAlpha = this.opacity;
		c.fillStyle = this.color;
		c.fill();
		c.restore();
		c.strokeStyle = this.color;
		c.stroke();
		c.closePath();
	}

	update(particles) {
		this.draw();
		//Check collision between particles
		for (let i = 0; i < particles.length; i++) {
			if (this == particles[i]) {
				continue;
			}
			if (
				utils.getDistance(this.x, this.y, particles[i].x, particles[i].y) -
					this.radius * 2 <
				0
			) {
				utils.resolveCollision(this, particles[i]);
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
		if (utils.getDistance(mouse.x, mouse.y, this.x, this.y) < 120 && this.opacity < 0.5) {
			this.opacity += 0.02;
		} else if (this.opacity > 0) {
			this.opacity -= 0.02;
			this.opacity = Math.max(0, this.opacity);
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
	for (let i = 0; i < 100; i++) {
		const radius = utils.randomIntRange(15, 20);
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
