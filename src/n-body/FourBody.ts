import p5 from 'p5'
import Particle from '../Particle'
import { CENTERX, CENTERY } from '../config'
import NBody from './NBody'

class FourBody extends NBody {
    constructor(p: p5) {
        super(p)

        for (let i = 0; i < 4; i++) {
            this.p.fill(i * 40, 255, 255)
            const x = CENTERX - 300 * this.p.sin((this.p.TWO_PI / 4) * i)
            const y = CENTERY - 300 * this.p.cos((this.p.TWO_PI / 4) * i)
            const tangent = this.p
                .createVector(x, y)
                .sub(CENTERX, CENTERY)
                .rotate(this.p.HALF_PI)
                .setMag(4)

            this.particles.push(
                new Particle(
                    this.p,
                    this.p.createVector(x, y),
                    100,
                    10,
                    this.p.color(this.p.random(255), this.p.random(150), this.p.random(150)),
                    tangent
                )
            )
        }
    }
}

export default FourBody
