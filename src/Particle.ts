import p5, { Vector } from 'p5'
import { arrow } from './helper'
import { C, GRAVITATIONAL_CONSTANT, GRAVITY, HSB_MAX } from './config'

class Particle {
    private p: p5

    public position: Vector

    public acceleration: Vector = new Vector(0, 0)

    public velocity: Vector = new Vector(0, 0)

    public mass: number

    public radius: number

    public canvas: p5.Graphics

    public trails: p5.Vector[] = []

    public color: p5.Vector

    private lastAcceleration: Vector = new Vector(0, 0)

    private trailsLength: number = 25

    private debug: boolean = false

    private attraction: boolean = true

    private beforeDraw?: (partile: Particle) => void

    private particleShape?: (partile: Particle) => void

    private trailShape?: (partile: Particle) => void

    private beforeFirstUpdate?: (partile: Particle) => void

    private firstUpdate: boolean = true

    constructor(p: p5, pos: Vector, mass: number, radius: number, initialVelocity?: Vector) {
        this.p = p
        this.position = pos
        this.mass = mass
        this.radius = radius
        this.canvas = p.createGraphics(p.width, p.height)
        this.canvas.colorMode(p.HSB, HSB_MAX)
        this.color = p.createVector(0, HSB_MAX, HSB_MAX)

        if (initialVelocity) {
            this.velocity = initialVelocity
        }
    }

    public surfaceArea() {
        return (2 * Math.PI * this.radius) / 2
    }

    public applyForce(force: Vector) {
        const f = force.copy().div(this.mass)
        this.acceleration.add(f)
    }

    public attract(target: Particle) {
        if (!this.attraction) return

        // Newton's law of universal gravitation: F = G * (m1 * m2) / r^2
        const direction = target.position.copy().sub(this.position)
        const distance = direction.mag()
        const force = (GRAVITATIONAL_CONSTANT * this.mass * target.mass) / Math.pow(distance, 2)
        const forceVector = direction.copy().setMag(force)

        this.applyForce(forceVector)
    }

    public oldAttract(target: Particle) {
        if (!this.attraction) return

        const force = Vector.sub(this.position, target.position)
        const distance = this.p.constrain(force.magSq(), 0, 250)
        const G = GRAVITY
        const strength = (G * (this.mass * target.mass)) / distance
        force.setMag(strength)
        target.applyForce(force)
    }

    public update() {
        if (this.firstUpdate) {
            this.beforeFirstUpdate && this.beforeFirstUpdate(this)
            this.firstUpdate = false
        }

        this.velocity.add(this.acceleration)

        if (this.velocity.mag() >= C) {
            this.velocity.setMag(C)
        }

        this.position.add(this.velocity)
        this.lastAcceleration = this.acceleration.copy()
        this.acceleration.set(0, 0)

        // add the current position to the trails
        this.trails.push(this.p.createVector(this.position.x, this.position.y))

        // if the trails array is too long, remove the oldest trail
        if (this.trails.length > this.trailsLength) {
            this.trails.shift()
        }
    }

    public draw() {
        this.beforeDraw && this.beforeDraw(this)

        this.p.image(this.canvas, 0, 0)
        this.canvas.clear()
        this.canvas.strokeWeight(1)

        this.drawTrails()

        this.drawParticle()

        if (this.debug) this.drawDebug()
    }

    private drawTrails() {
        if (this.trailShape) {
            this.trailShape(this)
            return
        }

        let opacity = 0

        for (let i = 0; i < this.trails.length - 1; i++) {
            opacity += HSB_MAX / this.trails.length
            this.canvas.stroke(this.color.x, this.color.y, this.color.z, opacity)
            this.canvas.line(
                this.trails[i].x,
                this.trails[i].y,
                this.trails[i + 1].x,
                this.trails[i + 1].y
            )
        }
    }

    private drawParticle() {
        if (this.particleShape) {
            this.particleShape(this)
            return
        }

        this.canvas.fill(this.color.x, this.color.y, this.color.z)
        this.canvas.noStroke()
        this.canvas.circle(this.position.x, this.position.y, this.radius * 2)
    }

    private drawDebug() {
        // draw radius for debugging
        this.p.line(
            this.position.x,
            this.position.y,
            this.position.x + this.radius,
            this.position.y
        )

        // draw velocity for debugging with line and arrow
        arrow(this.p, this.position, this.velocity.copy().mult(10), this.p.color('pink'))

        // draw velocity for debugging with text
        this.p.noStroke()
        this.p.fill('pink')
        this.p.textSize(11)
        this.p.text(
            `v: (${this.velocity.x.toFixed(2)}, ${this.velocity.y.toFixed(2)})`,
            this.position.x + this.radius + 10,
            this.position.y
        )
        this.p.text(
            `mag: ${this.velocity.mag().toFixed(2)}`,
            this.position.x + this.radius + 10,
            this.position.y + 20
        )
        this.p.text(
            `acc: (${this.lastAcceleration.x.toFixed(2)}, ${this.lastAcceleration.y.toFixed(2)})`,
            this.position.x + this.radius + 10,
            this.position.y + 40
        )
    }

    public setDebug(debug: boolean) {
        this.debug = debug
    }

    public setAttraction(attraction: boolean) {
        this.attraction = attraction
    }

    public setMass(mass: number) {
        this.mass = mass
    }

    public setRadius(radius: number) {
        this.radius = radius
    }

    public setTrailLength(length: number) {
        this.trailsLength = length
    }

    public setParticleShape(shape: (partile: Particle) => void) {
        this.particleShape = shape
    }

    public setTrailShape(shape: (partile: Particle) => void) {
        this.trailShape = shape
    }

    public setBeforeDraw(callback: (partile: Particle) => void) {
        this.beforeDraw = callback
    }

    public setBeforeFirstUpdate(callback: (partile: Particle) => void) {
        this.beforeFirstUpdate = callback
    }
}

export default Particle
