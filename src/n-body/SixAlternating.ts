import p5 from 'p5'
import Particle from '../Particle'
import { CENTERX, CENTERY, HSB_MAX } from '../config'
import NBody from './NBody'

class SixAlternating extends NBody {
    constructor(p: p5) {
        super(p)

        const countA = 6
        const countB = 6
        const massA = 100
        const massB = 50
        const tangentMagA = 4
        const tangentMagB = 1

        for (let i = 0; i < countA; i++) {
            this.p.fill(i * 40, 255, 255)
            const x = CENTERX - 300 * this.p.sin((this.p.TWO_PI / countA) * i)
            const y = CENTERY - 300 * this.p.cos((this.p.TWO_PI / countA) * i)
            const tangent = this.p
                .createVector(x, y)
                .sub(CENTERX, CENTERY)
                .rotate(this.p.HALF_PI)
                .setMag(tangentMagA)
            const particle = new Particle(
                this.p,
                this.p.createVector(x, y),
                massA,
                12,
                tangent
            )
            particle.color = this.p.createVector(this.p.random(HSB_MAX), HSB_MAX, HSB_MAX)
            particle.setTrailLength(100)
            particle.setBeforeDraw(this.beforeDraw)
            particle.setParticleShape(this.getParticleShape)
            particle.setTrailShape(this.getTrailShape)

            this.particles.push(particle)
        }

        for (let i = 0; i < countB; i++) {
            this.p.fill(i * 40, 255, 255)
            const x = CENTERX - 300 * this.p.cos((this.p.TWO_PI / countB) * i)
            const y = CENTERY - 300 * this.p.sin((this.p.TWO_PI / countB) * i)
            const tangent = this.p
                .createVector(x, y)
                .sub(CENTERX, CENTERY)
                .rotate(this.p.HALF_PI)
                .mult(-1)
                .setMag(tangentMagB)
            const particle = new Particle(
                this.p,
                this.p.createVector(x, y),
                massB,
                8,
                tangent
            )
            particle.color = this.p.createVector(this.p.random(HSB_MAX), HSB_MAX, HSB_MAX)
            particle.setTrailLength(30)
            particle.setBeforeDraw(this.beforeDraw)
            particle.setParticleShape(this.getParticleShape)

            this.particles.push(particle)
        }
    }
}

export default SixAlternating
