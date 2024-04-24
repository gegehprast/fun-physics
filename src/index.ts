import p5 from 'p5'
import { showFrameRate } from './helper'
import Particle from './Particle'
import { HEIGHT, WIDTH } from './config'
import Edge from './Edge'
import Gravity from './Gravity'
import Wind from './Wind'
import Drag from './Drag'

let particles: Particle[] = []

let topEdge: Edge
let rightEdge: Edge
let bottomEdge: Edge
let leftEdge: Edge

let gravity: Gravity
let wind: Wind
let drags: Drag[] = []

const BOUNDARY = 0

const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT)

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

        // topEdge.setDebug(true)
        // rightEdge.setDebug(true)
        // bottomEdge.setDebug(true)
        // leftEdge.setDebug(true)

        particles = [
            new Particle(p, p.createVector(100, 50), 2, 10),
            new Particle(p, p.createVector(250, 50), 2, 20),
            new Particle(p, p.createVector(350, 50), 4, 10),
            new Particle(p, p.createVector(450, 50), 4, 20),
        ]

        gravity = new Gravity(particles)
        wind = new Wind(p, particles)
        drags = [
            // air
            new Drag(p, 0.2, p.createVector(0, 0), WIDTH, HEIGHT, particles, p.color(0)),
            // water
            new Drag(p, 2, p.createVector(50, 100), 100, 100, particles, p.color(0, 0, 255, 100)),
            new Drag(p, 2, p.createVector(260, 250), 100, 100, particles, p.color(0, 0, 255, 100)),
            new Drag(p, 2, p.createVector(400, 350), 100, 300, particles, p.color(0, 0, 255, 100)),
            new Drag(p, 2, p.createVector(80, 400), 400, 100, particles, p.color(0, 0, 255, 100)),
            new Drag(p, 2, p.createVector(270, 600), 100, 100, particles, p.color(0, 0, 255, 100)),
            new Drag(p, 2, p.createVector(300, 800), 100, 100, particles, p.color(0, 0, 255, 100)),
            new Drag(p, 2, p.createVector(0, 1000), WIDTH, 300, particles, p.color(0, 0, 255, 100)),
        ]

        // pause / play with space bar
        p.keyPressed = () => {
            if (p.keyCode === 32) {
                if (p.isLooping()) {
                    p.noLoop()
                } else {
                    p.loop()
                }
            }
        }
    }

    p.draw = () => {
        p.background(0)

        // // draw grid
        // p.stroke(255)
        // for (let x = 0; x < p.width; x += 20) {
        //     p.line(x, 0, x, p.height)
        // }
        // for (let y = 0; y < p.height; y += 20) {
        //     p.line(0, y, p.width, y)
        // }

        gravity.apply()

        if (p.keyIsDown(p.UP_ARROW)) wind.blowUp()
        if (p.keyIsDown(p.RIGHT_ARROW)) wind.blowRight()
        if (p.keyIsDown(p.DOWN_ARROW)) wind.blowDown()
        if (p.keyIsDown(p.LEFT_ARROW)) wind.blowLeft()

        drags.forEach((drag) => drag.apply())

        drags.forEach((drag) => drag.draw())

        topEdge.detect(particles)
        rightEdge.detect(particles)
        bottomEdge.detect(particles)
        leftEdge.detect(particles)

        topEdge.draw()
        rightEdge.draw()
        bottomEdge.draw()
        leftEdge.draw()

        for (const particle of particles) {
            particle.draw()
        }

        showFrameRate(p)
    }
}

new p5(sketch)
