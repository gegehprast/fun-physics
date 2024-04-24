import p5 from 'p5'
import { showFrameRate } from './helper'
import Particle from './Particle'
import { CENTERX, CENTERY, HEIGHT, WIDTH } from './config'
import Edge from './Edge'
import Gravity from './Gravity'
import Wind from './Wind'
import Drag from './Drag'
import Grid from './Grid'
import MousePosition from './MousePosition'
import Hexagonal6Body from './n-body/Hexagonal6Body'
import NBody from './n-body/NBody'
import Pentagon from './n-body/Pentagon'
import FourBody from './n-body/FourBody'
import Experimentation from './n-body/Experimentation'

let debug = false
let particles: Particle[] = []

let grid: Grid
let mousePosition: MousePosition

let topEdge: Edge
let rightEdge: Edge
let bottomEdge: Edge
let leftEdge: Edge

let gravity: Gravity
let wind: Wind
let drags: Drag[] = []

let placeholderParticle: Particle

const BOUNDARY = 0

let nBodyModes: NBody[] = []
let currentNBodyMode: number = 0

let hue = 0

const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT)
        p.colorMode(p.HSB, 255)

        grid = new Grid(p)
        mousePosition = new MousePosition(p)

        placeholderParticle = new Particle(
            p,
            p.createVector(p.mouseX, p.mouseY),
            2,
            10,
            p.color(255),
            p.createVector(0, 0)
        )

        topEdge = new Edge(
            p,
            p.createVector(BOUNDARY, BOUNDARY),
            p.createVector(p.width - BOUNDARY, BOUNDARY),
            'topEdge'
        )
        rightEdge = new Edge(
            p,
            p.createVector(p.width - BOUNDARY, BOUNDARY),
            p.createVector(p.width - BOUNDARY, p.height - BOUNDARY),
            'rightEdge'
        )
        bottomEdge = new Edge(
            p,
            p.createVector(p.width - BOUNDARY, p.height - BOUNDARY),
            p.createVector(BOUNDARY, p.height - BOUNDARY),
            'bottomEdge'
        )
        leftEdge = new Edge(
            p,
            p.createVector(BOUNDARY, p.height - BOUNDARY),
            p.createVector(BOUNDARY, BOUNDARY),
            'leftEdge'
        )

        gravity = new Gravity()
        wind = new Wind(p)
        drags = [
            // vacuum
            new Drag(p, 0, p.createVector(0, 0), WIDTH, HEIGHT, particles, p.color(0, 0, 0, 0)),
            // air
            // new Drag(p, 0.01, p.createVector(0, 0), WIDTH, HEIGHT, particles, p.color(150, 50)),
            // water
            // new Drag(p, 2, p.createVector(260, 250), 100, 100, particles, p.color(0, 0, 255, 100)),
            // new Drag(p, 2, p.createVector(400, 350), 100, 300, particles, p.color(0, 0, 255, 100)),
            // new Drag(p, 2, p.createVector(80, 400), 400, 100, particles, p.color(0, 0, 255, 100)),
            // new Drag(p, 2, p.createVector(300, 800), 100, 100, particles, p.color(0, 0, 255, 100)),
            // new Drag(p, 2, p.createVector(0, 1000), WIDTH, 300, particles, p.color(0, 0, 255, 100)),
        ]
        
        nBodyModes = [new Experimentation(p), new Pentagon(p), new FourBody(p), new Hexagonal6Body(p)]

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

                topEdge.setDebug(debug)
                rightEdge.setDebug(debug)
                bottomEdge.setDebug(debug)
                leftEdge.setDebug(debug)
            }

            // toggle attraction with 'a'
            if (p.key === 'a') {
                for (const particle of particles) {
                    particle.setAttraction(!particle.attraction)
                }
            }

            // toggle gravity with 'g'
            if (p.key === 'g') {
                gravity.toggle()
            }

            // toggle grid with 'r'
            if (p.key === 'r') {
                grid.toggle()
            }

            // change n-body mode with 'n'
            if (p.key === 'n') {
                currentNBodyMode = (currentNBodyMode + 1) % nBodyModes.length
                particles = nBodyModes[currentNBodyMode].particles
            }
        }

        p.mousePressed = () => {
            // add a particle at the mouse position
            const pos = p.createVector(p.mouseX, p.mouseY)
            const mass = placeholderParticle.mass
            const radius = placeholderParticle.radius
            const color = p.color(p.random(255), p.random(255), p.random(255))
            const initialVelocity = p.createVector(p.random(-5, 5), p.random(-5, 5))

            // particles.push(new Particle(p, pos, mass, radius, color))
        }

        p.mouseWheel = (event: WheelEvent) => {
            // change the mass of the placeholder particle
            const mass = p.constrain(placeholderParticle.mass + event.deltaY / 100, 1, 300)
            placeholderParticle.setMass(mass)
            placeholderParticle.setRadius(p.map(placeholderParticle.mass, 1, 10, 5, 15))
        }
    }

    p.draw = () => {
        p.background(0)

        grid.draw()

        gravity.apply(particles)

        for (const particle of particles) {
            for (const other of particles) {
                if (particle !== other) {
                    particle.attract(other)
                }
            }
        }

        if (p.keyIsDown(p.UP_ARROW)) wind.blowUp(particles)
        if (p.keyIsDown(p.RIGHT_ARROW)) wind.blowRight(particles)
        if (p.keyIsDown(p.DOWN_ARROW)) wind.blowDown(particles)
        if (p.keyIsDown(p.LEFT_ARROW)) wind.blowLeft(particles)

        drags.forEach((drag) => drag.apply())
        drags.forEach((drag) => drag.draw())

        // topEdge.detect(particles)
        // rightEdge.detect(particles)
        // bottomEdge.detect(particles)
        // leftEdge.detect(particles)

        topEdge.draw()
        rightEdge.draw()
        bottomEdge.draw()
        leftEdge.draw()

        // update and draw particle trails
        for (const particle of particles) {
            particle.update()
            particle.drawTrails()
            particle.draw()
        }

        placeholderParticle.position = p.createVector(p.mouseX, p.mouseY)
        placeholderParticle.draw()

        mousePosition.draw()

        // draw circle from the center of the canvas
        hue = (hue + 1) % 255
        p.noFill()
        p.stroke(hue, 255, 255)
        p.circle(CENTERX, CENTERY, 600)

        // // draw figure 8
        // for (let i = 0; i < 6; i++) {
        //     const x = CENTERX + 300 * p.cos((p.TWO_PI / 6) * i)
        //     const y = CENTERY + 300 * p.sin((p.TWO_PI / 6) * i)

        //     p.fill(255)
        //     p.circle(x, y, 10)
        // }
        
        showFrameRate(p)
    }
}

new p5(sketch)
