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

const BOUNDARY = 0

const planets = [
    {
        name: 'sun',
        massRatioToEarth: 3330,
        sizeRatioToEarth: 109 * 0.025,
        distanceFromSun: 0,
        color: 'yellow',
        initialVelocity: new p5.Vector(0, 0),
    },
    {
        name: 'sun',
        massRatioToEarth: 3330,
        sizeRatioToEarth: 109 * 0.025,
        distanceFromSun: 0.15,
        color: 'yellow',
        initialVelocity: new p5.Vector(0, 0.25),
    },
    {
        name: 'sun',
        massRatioToEarth: 3330,
        sizeRatioToEarth: 109 * 0.025,
        distanceFromSun: 0.2,
        color: 'yellow',
        initialVelocity: new p5.Vector(0, 0.5),
    },
    {
        name: 'mercury',
        massRatioToEarth: 0.0553,
        sizeRatioToEarth: 0.383,
        distanceFromSun: 0.39,
        color: 'grey',
        initialVelocity: new p5.Vector(0, 1.5),
    },
    {
        name: 'venus',
        massRatioToEarth: 0.815,
        sizeRatioToEarth: 0.949,
        distanceFromSun: 0.72,
        color: 'orange',
        initialVelocity: new p5.Vector(0, 2.5),
    },
    {
        name: 'earth',
        massRatioToEarth: 1,
        sizeRatioToEarth: 1,
        distanceFromSun: 1,
        color: 'blue',
        initialVelocity: new p5.Vector(0, 3.5),
    },
    {
        name: 'moon',
        massRatioToEarth: 0.0123,
        sizeRatioToEarth: 0.273,
        distanceFromSun: 1.05,
        color: 'grey',
        initialVelocity: new p5.Vector(0, 3.5),
    },
    {
        name: 'mars',
        massRatioToEarth: 0.107,
        sizeRatioToEarth: 0.532,
        distanceFromSun: 1.52,
        color: 'red',
        initialVelocity: new p5.Vector(0, 4.5),
    },
    {
        name: 'jupiter',
        massRatioToEarth: 317.8 * 0.25,
        sizeRatioToEarth: 11.21 * 0.25,
        distanceFromSun: 5.2,
        color: 'brown',
        initialVelocity: new p5.Vector(0, 2),
    },
    {
        name: 'saturn',
        massRatioToEarth: 95.2 * 0.25,
        sizeRatioToEarth: 9.45 * 0.25,
        distanceFromSun: 9.54,
        color: 'lightbrown',
        initialVelocity: new p5.Vector(0, 2),
    },
    {
        name: 'uranus',
        massRatioToEarth: 14.5,
        sizeRatioToEarth: 3.981,
        distanceFromSun: 19.2,
        color: 'cyan',
        initialVelocity: new p5.Vector(0, 2),
    },
    {
        name: 'neptune',
        massRatioToEarth: 17.1,
        sizeRatioToEarth: 3.865,
        distanceFromSun: 30.1,
        color: 'lightblue',
        initialVelocity: new p5.Vector(0, 1.5),
    },
    {
        name: 'pluto',
        massRatioToEarth: 0.0022,
        sizeRatioToEarth: 0.186,
        distanceFromSun: 39.4,
        color: 'lightgrey',
        initialVelocity: new p5.Vector(0, 1.2),
    },
]

const sketch = (p: p5) => {
    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT)

        grid = new Grid(p)
        mousePosition = new MousePosition(p)

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

        for (const planet of planets) {
            const mass = planet.massRatioToEarth * 0.001
            const radius = planet.sizeRatioToEarth * 10
            const distance = planet.distanceFromSun * 500
            const color = p.color(planet.color)
            const x = CENTERX + distance
            const y = CENTERY
            const pos = p.createVector(x, y)
            const particle = new Particle(p, pos, mass, radius, color, planet.initialVelocity)

            particles.push(particle)
        }

        gravity = new Gravity(particles)
        wind = new Wind(p, particles)
        drags = [
            // vacuum
            new Drag(p, 0, p.createVector(0, 0), WIDTH, HEIGHT, particles, p.color(0, 0, 0, 0)),
            // air
            // new Drag(p, 0.2, p.createVector(0, 0), WIDTH, 1000, particles, p.color(150, 50)),
            // water
            // new Drag(p, 2, p.createVector(260, 250), 100, 100, particles, p.color(0, 0, 255, 100)),
            // new Drag(p, 2, p.createVector(400, 350), 100, 300, particles, p.color(0, 0, 255, 100)),
            // new Drag(p, 2, p.createVector(80, 400), 400, 100, particles, p.color(0, 0, 255, 100)),
            // new Drag(p, 2, p.createVector(300, 800), 100, 100, particles, p.color(0, 0, 255, 100)),
            // new Drag(p, 2, p.createVector(0, 1000), WIDTH, 300, particles, p.color(0, 0, 255, 100)),
        ]

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
                for (const particle of particles) {
                    particle.setDebug(!particle.debug)
                }

                topEdge.setDebug(!topEdge.debug)
                rightEdge.setDebug(!rightEdge.debug)
                bottomEdge.setDebug(!bottomEdge.debug)
                leftEdge.setDebug(!leftEdge.debug)
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
        }
    }

    p.draw = () => {
        p.background(0)

        grid.draw()

        gravity.apply()

        for (const particle of particles) {
            for (const other of particles) {
                if (particle !== other) {
                    particle.attract(other)
                }
            }
        }

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

        // update and draw particle trails
        for (const particle of particles) {
            particle.update()
            particle.drawTrails()
        }

        // draw particles
        for (const particle of particles) {
            particle.draw()
        }

        mousePosition.draw()

        showFrameRate(p)
    }
}

new p5(sketch)
