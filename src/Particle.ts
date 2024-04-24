import p5, { Vector } from 'p5'
import { arrow } from './helper'

class Particle {
    private p: p5

    public position: Vector

    public acceleration: Vector = new Vector(0, 0)

    public velocity: Vector = new Vector(0, 0)

    public mass: number

    public radius: number

    constructor(p: p5, pos: Vector, mass: number, radius: number) {
        this.p = p
        this.position = pos
        this.mass = mass
        this.radius = radius
    }

    public surfaceArea() {
        return (2 * Math.PI * this.radius) / 2
    }

    public applyForce(force: Vector) {
        const f = force.copy().div(this.mass)
        this.acceleration.add(f)
    }

    public draw() {
        this.p.fill(255)
        this.p.stroke('red')
        this.p.circle(this.position.x, this.position.y, this.radius * 2)

        // draw radius for debugging
        this.p.stroke('red')
        this.p.line(
            this.position.x,
            this.position.y,
            this.position.x + this.radius,
            this.position.y
        )

        // draw velocity for debugging with line and arrow
        arrow(this.p, this.position, this.velocity.copy().mult(10), this.p.color('orange'))

        // draw velocity for debugging with text
        this.p.noStroke()
        this.p.fill('orange')
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


        this.velocity.add(this.acceleration)
        this.position.add(this.velocity)
        this.acceleration.set(0, 0)

        // prevent particle from wiggling when velocity is very low
        if (this.velocity.mag() < 0.01) {
            this.velocity.set(0, 0)
        }
    }
}

export default Particle
