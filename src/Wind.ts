import p5 from 'p5'
import Particle from './Particle'

class Wind {
    private p: p5
    
    constructor(p: p5) {
        this.p = p
    }

    blowUp(particles: Particle[]) {
        for (const particle of particles) {
            particle.applyForce(this.p.createVector(0, -1))
        }
    }

    blowRight(particles: Particle[]) {
        for (const particle of particles) {
            particle.applyForce(this.p.createVector(1, 0))
        }
    }

    blowDown(particles: Particle[]) {
        for (const particle of particles) {
            particle.applyForce(this.p.createVector(0, 1))
        }
    }

    blowLeft(particles: Particle[]) {
        for (const particle of particles) {
            particle.applyForce(this.p.createVector(-1, 0))
        }
    }
}

export default Wind
