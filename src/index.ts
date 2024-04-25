import p5 from 'p5'
import { showFrameRate } from './helper'
import Particle from './Particle'
import { CENTERX, CENTERY, HEIGHT, WIDTH } from './config'
import MousePosition from './MousePosition'
import Hexagonal6Body from './n-body/Hexagonal6Body'
import NBody from './n-body/NBody'
import Pentagon from './n-body/Pentagon'
import FourBody from './n-body/FourBody'
import Experimentation from './n-body/Experimentation'
import FiveComets from './n-body/FiveComets'
import PulsingHeart from './n-body/PulsingHeart'
import SixAlternating from './n-body/SixAlternating'
import SixRunawayStar from './n-body/SixRunawayStar'

let debug = false
let particleAttraction = true
let mousePosition: MousePosition

let particles: Particle[] = []
let nBodyModes: NBody[] = []
let currentNBodyMode: number = 0

let hue = 0

const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT)
        p.colorMode(p.HSB, 100)

        mousePosition = new MousePosition(p)
        
        nBodyModes = [
            new FiveComets(p),
            new FourBody(p),
            new Hexagonal6Body(p),
            new Pentagon(p),
            new PulsingHeart(p),
            new SixAlternating(p),
            new SixRunawayStar(p),
        ]

        particles = nBodyModes[currentNBodyMode].particles

        p.keyPressed = () => {
            // pause / play with space bar
            if (p.keyCode === 32) {
                if (p.isLooping()) {
                    p.noLoop()
                } else {
                    p.loop()
                }
            }

            // toggle debug with 'd'
            if (p.key === 'd') {
                debug = !debug

                for (const particle of particles) {
                    particle.setDebug(debug)
                }
            }

            // toggle attraction with 'a'
            if (p.key === 'a') {
                particleAttraction = !particleAttraction

                for (const particle of particles) {
                    particle.setAttraction(particleAttraction)
                }
            }

            // change n-body mode with 'n'
            if (p.key === 'n') {
                currentNBodyMode = (currentNBodyMode + 1) % nBodyModes.length
                particles = nBodyModes[currentNBodyMode].particles
            }
        }
    }

    p.draw = () => {
        p.background(0)

        // attract particles to each other
        for (const particle of particles) {
            for (const other of particles) {
                if (particle !== other) {
                    particle.attract(other)
                }
            }
        }

        // update and draw particle trails
        for (const particle of particles) {
            particle.update()
            particle.draw()
        }

        // draw circle from the center of the canvas
        hue = (hue + 1) % 100
        p.noFill()
        p.stroke(hue, 100, 100)
        p.circle(CENTERX, CENTERY, 600)

        // others
        others(p)
    }
}

function others(p: p5) {
    mousePosition.draw()

    showFrameRate(p)
}

new p5(sketch)
