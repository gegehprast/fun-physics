import { Vector } from 'p5'
import Particle from './Particle'
import { GRAVITY } from './config'

class Gravity {
    public particles: Particle[]

    public enabled: boolean = false

    constructor(particles: Particle[]) {
        this.particles = particles
    }

    public apply() {
        if (this.enabled === false) return

        for (const particle of this.particles) {
            const gravity = new Vector(0, GRAVITY)
            const weight = gravity.mult(particle.mass)
            particle.applyForce(weight)
        }
    }

    public toggle() {
        this.enabled = !this.enabled
    }
}

export default Gravity
