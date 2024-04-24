import p5, { Vector } from 'p5'
import { arrow } from './helper'
import { GRAVITY } from './config'

class Particle {
    private p: p5

    public position: Vector

    public acceleration: Vector = new Vector(0, 0)

    public velocity: Vector = new Vector(0, 0)

    public mass: number

    public radius: number

    public debug: boolean = false

    public attraction: boolean = true

    private trail: p5.Graphics

    private trails: p5.Vector[] = []

    private hue = 0

    public color: p5.Color

    constructor(p: p5, pos: Vector, mass: number, radius: number, color: p5.Color, initialVelocity?: Vector) {
        this.p = p
        this.position = pos
        this.mass = mass
        this.radius = radius
        this.color = color

        this.trail = p.createGraphics(p.width, p.height)
        this.trail.colorMode(p.HSB, 255)

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

        const force = Vector.sub(this.position, target.position)
        const distance = this.p.constrain(force.magSq(), 0.1, 100)
        const G = GRAVITY
        const strength = (G * (this.mass * target.mass)) / distance
        force.setMag(strength)
        target.applyForce(force)
    }

    public update() {
        this.velocity.add(this.acceleration)
        this.position.add(this.velocity)
        this.acceleration.set(0, 0)
    }

    public drawTrails() {
        // add the current position to the trails
        this.trails.push(this.p.createVector(this.position.x, this.position.y))

        // if the trails array is too long, remove the oldest trail
        if (this.trails.length > 50) {
            this.trails.shift()
        }

        // render the trail
        this.p.image(this.trail, 0, 0)
        this.trail.clear()
        this.trail.strokeWeight(1)

        // increment the hue for the next trail
        this.hue = (this.hue + 1) % 255

        // draw the trails with decreasing opacity
        let opacity = 0

        for (let i = 0; i < this.trails.length - 1; i++) {
            opacity += 255 / this.trails.length
            this.trail.fill(this.hue, 255, 255, opacity)
            this.trail.noStroke()
            this.trail.circle(this.trails[i].x, this.trails[i].y, this.radius * 2)
        }
    }

    public draw() {
        // draw the main particle
        this.p.fill(this.color)
        this.p.noStroke()
        this.p.circle(this.position.x, this.position.y, this.radius * 2)

        if (!this.debug) return

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
        this.p.textSize(16)
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
            `acc: (${this.acceleration.x.toFixed(2)}, ${this.acceleration.y.toFixed(2)})`,
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
}

export default Particle
