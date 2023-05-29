abstract class AbstractCoordinate {
    public x: number
    public y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    abstract plus(coordinate: AbstractCoordinate): AbstractCoordinate
    abstract isEqual(coordinate: AbstractCoordinate): boolean
    abstract toString(): string
}

class PlainCoordinate extends AbstractCoordinate {
    constructor(x: number, y: number) {
        super(x, y)
    }

    plus(coordinate: PlainCoordinate): PlainCoordinate {
        return new PlainCoordinate(this.x + coordinate.x, this.y + coordinate.y)
    }

    isEqual(coordinate: PlainCoordinate): boolean {
        if (
            this.x == coordinate.x &&
            this.y == coordinate.y
        ) {
            return true
        } else {
            return false
        }
    }

    dot(coordinate: PlainCoordinate): number {
        return this.x * coordinate.x + this.y * coordinate.y
    }

    getDistance(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    toString(): string {
        return `(${this.x}, ${this.y})`
    }
}

class HexCoordinate extends AbstractCoordinate {
    public z: number

    constructor(x: number, y: number, z: number) {
        super(x, y)
        this.z = z
    }

    plus(coordinate: HexCoordinate): HexCoordinate {
        return new HexCoordinate(this.x + coordinate.x, this.y + coordinate.y, this.z + coordinate.z)
    }

    isEqual(coordinate: HexCoordinate): boolean {
        if (
            this.x == coordinate.x &&
            this.y == coordinate.y &&
            this.z == coordinate.z
        ) {
            return true
        } else {
            return false
        }
    }

    getMappingId(size: number): string {
        return `${this.x + size}_${this.y + size}_${this.z + size}`
    }

    toString(): string {
        return `(${this.x}, ${this.y}, ${this.z})`
    }
}

export { HexCoordinate, PlainCoordinate }
