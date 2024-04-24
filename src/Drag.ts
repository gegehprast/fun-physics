import p5 from 'p5'
import Particle from './Particle'

class Drag {
    private p: p5

    public coefficient = 1

    public position: p5.Vector

    public width: number

    public height: number

    public particles: Particle[]

    public color: p5.Color

    constructor(
        p: p5,
        coefficient: number, 
        pos: p5.Vector,
        width: number,
        height: number,
        particles: Particle[],
        color: p5.Color
    ) {
        this.p = p
        this.coefficient = coefficient
        this.position = pos
        this.width = width
        this.height = height
        this.particles = particles
        this.color = color
    }

    apply() {
        for (const particle of this.particles) {
            if (
                particle.position.x + particle.radius > this.position.x &&
                particle.position.x - particle.radius < this.position.x + this.width &&
                particle.position.y + particle.radius > this.position.y &&
                particle.position.y - particle.radius < this.position.y + this.height
            ) {
                const surfaceArea = particle.surfaceArea()
                const speed = particle.velocity.magSq()
                const dragMagnitude = this.coefficient * this.p.map(surfaceArea, 0, 1000, 0, 1)
                const drag = particle.velocity
                    .copy()
                    .normalize()
                    .mult(-1)
                    .setMag(speed * dragMagnitude)
                particle.applyForce(drag)
            }
        }
    }

    draw() {
        this.p.fill(this.color)
        this.p.rect(this.position.x, this.position.y, this.width, this.height)
    }
}

export default Drag
