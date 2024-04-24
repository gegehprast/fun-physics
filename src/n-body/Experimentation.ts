import p5 from 'p5'
import Particle from '../Particle'
import { CENTERX, CENTERY, SPEED_SCALE } from '../config'
import NBody from './NBody'

class Experimentation extends NBody {
    constructor(p: p5) {
        super(p)
        
        const countA = 12
        const countB = 12
        const massA = 5
        const massB = 100
        const tangentMagA = 5
        const tangentMagB = 4

        for (let i = 0; i < countA; i++) {
            this.p.fill(i * 40, 255, 255)
            const x = CENTERX - 300 * this.p.sin((this.p.TWO_PI / countA) * i)
            const y = CENTERY - 300 * this.p.cos((this.p.TWO_PI / countA) * i)
            const tangent = this.p
                .createVector(x, y)
                .sub(CENTERX, CENTERY)
                .rotate(this.p.HALF_PI)
                .setMag(tangentMagA)

            this.particles.push(
                new Particle(
                    this.p,
                    this.p.createVector(x, y),
                    massA,
                    15,
                    this.p.color(this.p.random(255), this.p.random(150), this.p.random(150)),
                    tangent
                )
            )
        }

        for (let i = 0; i < countB; i++) {
            this.p.fill(i * 40, 255, 255)
            const x = CENTERX - 300 * this.p.sin((this.p.TWO_PI / countB) * i)
            const y = CENTERY - 300 * this.p.cos((this.p.TWO_PI / countB) * i)
            const tangent = this.p
                .createVector(x, y)
                .sub(CENTERX, CENTERY)
                .rotate(this.p.HALF_PI)
                .mult(-1)
                .setMag(tangentMagB)

            this.particles.push(
                new Particle(
                    this.p,
                    this.p.createVector(x, y),
                    massB,
                    10,
                    this.p.color(this.p.random(255), this.p.random(150), this.p.random(150)),
                    tangent
                )
            )
        }
    }
}

export default Experimentation
