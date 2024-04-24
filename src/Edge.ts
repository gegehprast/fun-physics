import p5, { Vector } from 'p5'
import Particle from './Particle'

type EdgeType = 'topEdge' | 'rightEdge' | 'bottomEdge' | 'leftEdge'

class Edge {
    private p: p5

    public a: Vector

    public b: Vector

    public type: EdgeType

    public normal!: Vector

    public color!: p5.Color

    public debug: boolean = false

    constructor(p: p5, a: Vector, b: Vector, type: EdgeType) {
        this.p = p
        this.a = a
        this.b = b
        this.type = type

        this.setNormal()

        this.setColor()
    }

    private setNormal() {
        if (this.type === 'topEdge') {
            this.normal = this.p.createVector(0, 1)
        }

        if (this.type === 'rightEdge') {
            this.normal = this.p.createVector(-1, 0)
        }

        if (this.type === 'bottomEdge') {
            this.normal = this.p.createVector(0, -1)
        }

        if (this.type === 'leftEdge') {
            this.normal = this.p.createVector(1, 0)
        }
    }

    private setColor() {
        if (this.type === 'topEdge') {
            this.color = this.p.color(255, 0, 0)
        }

        if (this.type === 'rightEdge') {
            this.color = this.p.color(0, 255, 0)
        }

        if (this.type === 'bottomEdge') {
            this.color = this.p.color(0, 0, 255)
        }

        if (this.type === 'leftEdge') {
            this.color = this.p.color(255, 255, 0)
        }
    }

    private friction(particle: Particle) {
        // friction formula: f = -1 * u * n
        const friction = particle.velocity
            .copy()
            .normalize()
            .mult(-1)
            .setMag(0.5 * particle.mass)

        particle.applyForce(friction)
    }

    private keepWithinBoundaries(particle: Particle) {
        if (this.type === 'topEdge') {
            particle.position.y = this.a.y + particle.radius
            particle.velocity.y *= -1
        }

        if (this.type === 'rightEdge') {
            particle.position.x = this.b.x - particle.radius
            particle.velocity.x *= -1
        }

        if (this.type === 'bottomEdge') {
            particle.position.y = this.b.y - particle.radius
            particle.velocity.y *= -1
        }

        if (this.type === 'leftEdge') {
            particle.position.x = this.a.x + particle.radius
            particle.velocity.x *= -1
        }
    }

    public detect(particles: Particle[]) {
        particles.forEach((particle) => {
            const edgeVector = p5.Vector.sub(this.a, this.b)
            const startToParticle = p5.Vector.sub(particle.position, this.a)
            const dotA = p5.Vector.dot(startToParticle, edgeVector)
            const dotB = p5.Vector.dot(edgeVector, edgeVector)
            const projection = edgeVector.copy().mult(dotA / dotB)
            const closestPoint = p5.Vector.add(this.a, projection)

            const distance = p5.Vector.dist(particle.position, closestPoint) - particle.radius

            if (distance < 0) {
                this.keepWithinBoundaries(particle)
                this.friction(particle)
            }

            // debug
            if (!this.debug) return

            if (this.type === 'topEdge') {
                // draw projection
                this.p.stroke(this.color)
                this.p.line(
                    closestPoint.x,
                    closestPoint.y,
                    particle.position.x,
                    particle.position.y - particle.radius
                )
            }

            if (this.type === 'rightEdge') {
                // draw projection
                this.p.stroke(this.color)
                this.p.line(
                    closestPoint.x,
                    closestPoint.y,
                    particle.position.x + particle.radius,
                    particle.position.y
                )
            }

            if (this.type === 'bottomEdge') {
                this.p.stroke(this.color)
                this.p.line(
                    closestPoint.x,
                    closestPoint.y,
                    particle.position.x,
                    particle.position.y + particle.radius
                )
            }

            if (this.type === 'leftEdge') {
                this.p.stroke(this.color)
                this.p.line(
                    closestPoint.x,
                    closestPoint.y,
                    particle.position.x - particle.radius,
                    particle.position.y
                )
            }
        })
    }

    public setDebug(debug: boolean) {
        this.debug = debug
    }

    public draw() {
        this.p.stroke(255)
        this.p.line(this.a.x, this.a.y, this.b.x, this.b.y)
    }
}

export default Edge
