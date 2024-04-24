import p5 from 'p5'
import Particle from '../Particle'

abstract class NBody {
    protected p: p5

    public particles: Particle[] = []

    constructor(p: p5) {
        this.p = p

        p.randomSeed(1)
    }
}

export default NBody
