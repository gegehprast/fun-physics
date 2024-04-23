import { Vector } from 'p5'
import Particle from './Particle'
import { GRAVITY } from './config'

class Gravity {
    public particles: Particle[]

    constructor(particles: Particle[]) {
        this.particles = particles
    }

    public apply() {
        const gravity = new Vector(0, GRAVITY)

        for (const particle of this.particles) {
            const weight = gravity.mult(particle.mass)
            particle.applyForce(weight)
        }
    }
}

export default Gravity
