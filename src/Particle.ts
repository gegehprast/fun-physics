import p5, { Vector } from 'p5'
import { arrow } from './helper'

class Particle {
    private p: p5

    public position: Vector

    public acceleration: Vector = new Vector(0, 0)

    public velocity: Vector = new Vector(0, 0)

    public mass: number

    public radius: number

    constructor(p: p5, x: number, y: number, mass: number) {
        this.p = p
        this.position = new Vector(x, y)
        this.mass = mass
        this.radius = mass * 10
    }

    public applyForce(force: Vector) {
        const f = force.copy().div(this.mass)
        this.acceleration.add(f)
    }

    public draw() {
        this.velocity.add(this.acceleration)
        this.position.add(this.velocity)
        this.acceleration.set(0, 0)

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
    }
}

export default Particle
