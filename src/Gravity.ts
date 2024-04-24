import { Vector } from 'p5'
import Particle from './Particle'
import { GRAVITY } from './config'

class Gravity {
    public enabled: boolean = false

    public apply(particles: Particle[]) {
        if (this.enabled === false) return

        for (const particle of particles) {
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
