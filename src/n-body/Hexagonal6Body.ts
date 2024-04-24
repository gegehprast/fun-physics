import p5 from 'p5'
import Particle from '../Particle'
import { CENTERX, CENTERY } from '../config'
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

            this.particles.push(
                new Particle(
                    p,
                    p.createVector(x, y),
                    200,
                    10,
                    p.color(p.random(255), p.random(255), p.random(255)),
                    tangent
                )
            )
        }
    }
}

export default Hexagonal6Body
