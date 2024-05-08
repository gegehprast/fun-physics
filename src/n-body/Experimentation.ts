import p5 from 'p5'
import Particle from '../Particle'
import {
    CENTERX,
    CENTERY,
    DISTANCE_SCALE,
    GRAVITATIONAL_CONSTANT_SCALE,
    HSB_MAX,
    RADIUS_SCALE,
} from '../config'
import NBody from './NBody'

class Experimentation extends NBody {
    constructor(p: p5) {
        super(p)

        const earthMass = 5.972e24 * 0.00000000000000000000000001
        const eartRadius = 6371 * RADIUS_SCALE
        const earthDistance = 149600000 * DISTANCE_SCALE
        const sunMass = earthMass * 333000
        const sunRadius = eartRadius * 109.2
        const moonMass = earthMass * 0.0123
        const moonRadius = eartRadius * 0.273
        const moonDistanceFromEarth = 384400 * DISTANCE_SCALE

        const sun = new Particle(p, p.createVector(CENTERX, CENTERY), sunMass, sunRadius)
        sun.setTrailLength(10)
        sun.color = this.p.createVector(60, HSB_MAX, HSB_MAX)

        const earth = new Particle(
            p,
            p.createVector(CENTERX + earthDistance, CENTERY),
            earthMass,
            eartRadius,
            p.createVector(0, 9.3)
        )
        earth.setTrailLength(1500)
        earth.setBeforeDraw(this.beforeDraw)
        earth.setParticleShape(this.getParticleShape)
        earth.color = this.p.createVector(220, HSB_MAX, HSB_MAX)

        const moon = new Particle(
            p,
            p.createVector(CENTERX + earthDistance + moonDistanceFromEarth, CENTERY),
            moonMass,
            moonRadius,
            p.createVector(0, 6)
        )
        moon.setTrailLength(100)
        moon.setBeforeDraw(this.beforeDraw)
        moon.setParticleShape(this.getParticleShape)
        moon.color = this.p.createVector(0, HSB_MAX, HSB_MAX)

        this.particles.push(sun)
        this.particles.push(earth)
        // this.particles.push(moon)
    }
}

export default Experimentation
