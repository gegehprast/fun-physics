import p5 from 'p5'

class Grid {
    private p: p5

    public enabled: boolean = false

    constructor(p: p5) {
        this.p = p
    }

    public draw() {
        if (!this.enabled) return

        this.p.stroke(255)

        for (let x = 0; x < this.p.width; x += 20) {
            this.p.line(x, 0, x, this.p.height)
        }

        for (let y = 0; y < this.p.height; y += 20) {
            this.p.line(0, y, this.p.width, y)
        }
    }

    public toggle() {
        this.enabled = !this.enabled
    }
}

export default Grid
