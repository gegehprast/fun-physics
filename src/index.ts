import p5 from 'p5'
import { showFrameRate } from './helper'
import Particle from './Particle'
import { HEIGHT, WIDTH } from './config'
import Edge from './Edge'
import Gravity from './Gravity'
import Wind from './Wind'

let particle: Particle
let particle2: Particle

let topEdge: Edge
let rightEdge: Edge
let bottomEdge: Edge
let leftEdge: Edge

let gravity: Gravity
let wind: Wind

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

        particle = new Particle(p, 200, 200, 2)
        particle2 = new Particle(p, 400, 400, 4)

        gravity = new Gravity([particle, particle2])
        wind = new Wind(p, [particle, particle2])
    }

    p.draw = () => {
        p.background(0)

        gravity.apply()

        if (p.keyIsDown(p.UP_ARROW)) wind.blowUp()
        if (p.keyIsDown(p.RIGHT_ARROW)) wind.blowRight()
        if (p.keyIsDown(p.DOWN_ARROW)) wind.blowDown()
        if (p.keyIsDown(p.LEFT_ARROW)) wind.blowLeft()

        topEdge.detect([particle, particle2])
        rightEdge.detect([particle, particle2])
        bottomEdge.detect([particle, particle2])
        leftEdge.detect([particle, particle2])

        topEdge.draw()
        rightEdge.draw()
        bottomEdge.draw()
        leftEdge.draw()

        particle2.draw()
        particle.draw()

        showFrameRate(p)
    }
}

new p5(sketch)
