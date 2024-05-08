import p5 from 'p5'
import Particle from '../Particle'
import { HSB_MAX } from '../config'

abstract class NBody {
    protected p: p5

    public particles: Particle[] = []

    constructor(p: p5) {
        this.p = p

        this.beforeDraw = this.beforeDraw.bind(this)
        this.getTrailShape = this.getTrailShape.bind(this)
        this.getParticleShape = this.getParticleShape.bind(this)
    }

    public beforeDraw(particle: Particle) {
        // increment hue
        particle.color.x = (particle.color.x + 1) % HSB_MAX
    }

    public getTrailShape(particle: Particle) {
        let opacity = 0

        for (let i = 0; i < particle.trails.length - 1; i++) {
            opacity += HSB_MAX / particle.trails.length
            particle.canvas.stroke(particle.color.x, particle.color.y, particle.color.z, opacity)
            particle.canvas.line(
                particle.trails[i].x,
                particle.trails[i].y,
                particle.trails[i + 1].x,
                particle.trails[i + 1].y
            )

            // star shape trails
            // particle.canvas.noStroke()
            // particle.canvas.fill(particle.color.x, particle.color.y, particle.color.z, opacity)
            // particle.canvas.push()
            // particle.canvas.translate(particle.trails[i].x, particle.trails[i].y)
            // particle.canvas.rotate(particle.trails[i].heading())
            // particle.canvas.beginShape()

            // for (let j = 0; j < 5; j++) {
            //     const angle = this.p.TWO_PI * j * 0.4
            //     const x = this.p.cos(angle) * particle.radius / 2
            //     const y = this.p.sin(angle) * particle.radius / 2
            //     particle.canvas.vertex(x, y)
            // }

            // particle.canvas.endShape(this.p.CLOSE)
            // particle.canvas.pop()
        }
    }

    public getParticleShape(particle: Particle) {
        particle.canvas.noStroke()
        particle.canvas.fill(particle.color.x, particle.color.y, particle.color.z)
        particle.canvas.push()
        particle.canvas.translate(particle.position.x, particle.position.y)
        particle.canvas.rotate(particle.velocity.heading())
        particle.canvas.beginShape()

        // star shape
        for (let i = 0; i < 5; i++) {
            const angle = this.p.TWO_PI * i * 0.4
            const x = this.p.cos(angle) * particle.radius
            const y = this.p.sin(angle) * particle.radius
            particle.canvas.vertex(x, y)
        }

        particle.canvas.endShape(this.p.CLOSE)
        particle.canvas.pop()
    }
}

export default NBody
