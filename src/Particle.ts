import p5, { Vector } from 'p5'
import { arrow } from './helper'
import { C, GRAVITY, SPEED_SCALE } from './config'

class Particle {
    private p: p5

    public position: Vector

    public acceleration: Vector = new Vector(0, 0)

    public velocity: Vector = new Vector(0, 0)

    public mass: number

    public radius: number

    public debug: boolean = false

    public attraction: boolean = true

    private canvas: p5.Graphics

    private trails: p5.Vector[] = []

    private primaryHue = 0

    private trailHue = 0

    public color: p5.Color

    private lastAcceleration: Vector = new Vector(0, 0)

    constructor(
        p: p5,
        pos: Vector,
        mass: number,
        radius: number,
        color: p5.Color,
        initialVelocity?: Vector
    ) {
        this.p = p
        this.position = pos
        this.mass = mass
        this.radius = radius
        this.color = color
        this.primaryHue = p.random(255)
        this.trailHue = this.primaryHue

        this.canvas = p.createGraphics(p.width, p.height)
        this.canvas.colorMode(p.HSB, 255)

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
        const distance = this.p.constrain(force.magSq(), 0, 250)
        const G = GRAVITY
        const strength = (G * (this.mass * target.mass)) / distance
        force.setMag(strength)
        target.applyForce(force)
    }

    public update() {
        this.velocity.add(this.acceleration)

        if (this.velocity.mag() >= C) {
            this.velocity.setMag(C)
        }

        this.position.add(this.velocity)
        this.lastAcceleration = this.acceleration.copy()
        this.acceleration.set(0, 0)
    }

    public drawTrails() {
        // add the current position to the trails
        this.trails.push(this.p.createVector(this.position.x, this.position.y))

        // if the trails array is too long, remove the oldest trail
        if (this.trails.length > 25) {
            this.trails.shift()
        }

        // render the trail
        this.p.image(this.canvas, 0, 0)
        this.canvas.clear()
        this.canvas.strokeWeight(1)

        // increment the hue for the next trail
        this.trailHue = (this.trailHue + 1) % 255

        // draw the trails with decreasing opacity
        let opacity = 0

        for (let i = 0; i < this.trails.length - 1; i++) {
            opacity += 255 / this.trails.length
            this.canvas.stroke(this.trailHue, 255, 255, opacity)
            this.canvas.line(
                this.trails[i].x,
                this.trails[i].y,
                this.trails[i + 1].x,
                this.trails[i + 1].y
            )
        }
    }

    public draw() {
        // increment the hue for the next trail
        this.primaryHue = (this.primaryHue + 1) % 255

        // draw the main particle
        this.canvas.fill(this.primaryHue, 255, 255)
        this.canvas.noStroke()
        // this.canvas.circle(this.position.x, this.position.y, this.radius * 2)
        // draw star
        this.canvas.push()
        this.canvas.translate(this.position.x, this.position.y)
        this.canvas.rotate(this.p.frameCount * 0.15)
        this.canvas.beginShape()
        for (let i = 0; i < 5; i++) {
            const angle = this.p.TWO_PI * i * 0.4
            const x = this.p.cos(angle) * this.radius
            const y = this.p.sin(angle) * this.radius
            this.canvas.vertex(x, y)
        }
        this.canvas.endShape(this.p.CLOSE)
        this.canvas.pop()

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

    public setColor(color: p5.Color) {
        this.color = color
    }

    public setMass(mass: number) {
        this.mass = mass
    }

    public setRadius(radius: number) {
        this.radius = radius
    }
}

export default Particle
