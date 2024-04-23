import p5 from 'p5'

let frameRateDisplay: string = ''
let frameCounter: number = 0

export function showFrameRate(p: p5) {
    frameCounter++

    // update frame rate every 10 frames
    if (frameCounter % 10 === 0) {
        frameCounter = 0
        frameRateDisplay = p.frameRate().toFixed()
    }

    p.noStroke()
    p.fill(0)
    p.rect(0, 0, 25, 25)
    p.fill(255)
    p.text(frameRateDisplay, 5, 15)
}

export function arrow(p: p5, base: p5.Vector, vec: p5.Vector, myColor: p5.Color) {
    p.push()
    p.stroke(myColor)
    p.fill(myColor)
    p.translate(base.x, base.y)
    p.line(0, 0, vec.x, vec.y)
    p.rotate(vec.heading())
    const arrowSize = 7
    p.translate(vec.mag() - arrowSize, 0)
    p.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0)
    p.pop()
}


function circleHitsWall(
    circleCenter: p5.Vector,
    circleRadius: number,
    wallStart: p5.Vector,
    wallEnd: p5.Vector
): boolean {
    // Create the wall vector
    const wallVector = p5.Vector.sub(wallEnd, wallStart)

    // Create the vector from the wall start to the circle center
    const startToCircle = p5.Vector.sub(circleCenter, wallStart)

    // Project the startToCircle vector onto the wall vector
    const projection = wallVector.copy().mult(
        p5.Vector.dot(startToCircle, wallVector) / p5.Vector.dot(wallVector, wallVector)
    )

    // Add the projection to the wall start to find the closest point on the wall to the circle
    const closestPoint = p5.Vector.add(wallStart, projection)

    // Check if the closest point is beyond the ends of the wall
    if (
        p5.Vector.dot(
            p5.Vector.sub(closestPoint, wallStart),
            p5.Vector.sub(closestPoint, wallEnd)
        ) > 0
    ) {
        // The closest point is beyond the ends of the wall, so check the distance to the ends of the wall instead
        return (
            p5.Vector.dist(circleCenter, wallStart) <= circleRadius ||
            p5.Vector.dist(circleCenter, wallEnd) <= circleRadius
        )
    } else {
        // The closest point is on the wall, so check the distance to the closest point
        return p5.Vector.dist(circleCenter, closestPoint) <= circleRadius
    }
}