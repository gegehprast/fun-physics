import p5 from 'p5'
import Particle from './Particle'

class Wind {
    private p: p5

    public particles: Particle[]

    constructor(p: p5, particles: Particle[]) {
        this.p = p
        this.particles = particles
    }

    blowUp() {
        for (const particle of this.particles) {
            particle.applyForce(this.p.createVector(0, -1))
        }
    }

    blowRight() {
        for (const particle of this.particles) {
            particle.applyForce(this.p.createVector(1, 0))
        }
    }

    blowDown() {
        for (const particle of this.particles) {
            particle.applyForce(this.p.createVector(0, 1))
        }
    }

    blowLeft() {
        for (const particle of this.particles) {
            particle.applyForce(this.p.createVector(-1, 0))
        }
    }
}

export default Wind
