import p5 from 'p5'
import Particle from '../Particle'
import { CENTERX, CENTERY, HSB_MAX } from '../config'
import NBody from './NBody'

class Hexagonal6Body extends NBody {
    constructor(p: p5) {
        super(p)
        
        for (let i = 0; i < 6; i++) {
            this.p.fill(i * 40, 255, 255)
            const x = CENTERX - 300 * this.p.sin((this.p.TWO_PI / 6) * i)
            const y = CENTERY - 300 * this.p.cos((this.p.TWO_PI / 6) * i)
            const tangent = this.p
                .createVector(x, y)
                .sub(CENTERX, CENTERY)
                .rotate(this.p.HALF_PI)
                .setMag(5)
            const particle = new Particle(
                this.p,
                this.p.createVector(x, y),
                200,
                10,
                tangent
            )
            particle.setTrailLength(1000)
            particle.setBeforeDraw(this.beforeDraw)
            particle.setParticleShape(this.getParticleShape)
            particle.color = this.p.createVector(this.p.random(HSB_MAX), HSB_MAX, HSB_MAX)

            this.particles.push(particle)
        }
    }
}

export default Hexagonal6Body
