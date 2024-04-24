import p5 from 'p5'

class MousePosition {
    private p: p5

    constructor(p: p5) {
        this.p = p
    }

    public draw() {
        // Draw the mouse position in the bottom left corner
        this.p.fill(255)
        this.p.noStroke()
        this.p.textSize(16)
        this.p.text(
            `(${this.p.mouseX}, ${this.p.mouseY})`,
            10,
            this.p.height - 10
        )
    }
}

export default MousePosition
