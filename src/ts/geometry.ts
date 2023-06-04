abstract class AbstractVector {
    public x: number
    public y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    abstract plus(coord: AbstractVector): AbstractVector
    abstract isEqual(coord: AbstractVector): boolean
    abstract toString(): string
}

class PlaneVector extends AbstractVector {
    constructor(x: number, y: number) {
        super(x, y)
    }

    plus(coord: PlaneVector): PlaneVector {
        return new PlaneVector(this.x + coord.x, this.y + coord.y)
    }

    isEqual(coord: PlaneVector): boolean {
        if (
            this.x == coord.x &&
            this.y == coord.y
        ) {
            return true
        } else {
            return false
        }
    }

    dot(coord: PlaneVector): number {
        return this.x * coord.x + this.y * coord.y
    }

    getNorm(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    toString(): string {
        return `(${this.x}, ${this.y})`
    }
}

class HexVector extends AbstractVector {
    public z: number

    constructor(x: number, y: number, z: number) {
        super(x, y)
        this.z = z
    }

    plus(coord: HexVector): HexVector {
        return new HexVector(this.x + coord.x, this.y + coord.y, this.z + coord.z)
    }

    isEqual(coord: HexVector): boolean {
        if (
            this.x == coord.x &&
            this.y == coord.y &&
            this.z == coord.z
        ) {
            return true
        } else {
            return false
        }
    }

    getId(): string {
        return `${this.x}_${this.y}_${this.z}`
    }

    static parseId(id: string): HexVector {
        const [x, y, z] = id.split('_').map(component => parseInt(component))
        return new HexVector(x, y, z)
    }

    toString(): string {
        return `(${this.x}, ${this.y}, ${this.z})`
    }
}

function convertHexVectorToPlaneVector(hex_coord: HexVector, hex_tile_radius: number): PlaneVector {
    return new PlaneVector(
        Math.sqrt(3) * (hex_coord.x + hex_coord.z / 2) * hex_tile_radius,
        - 3 / 2 * hex_coord.z * hex_tile_radius
    )
}

const HEX_DIRECTION_LIST = [
    new HexVector(-1, 0, 1),
    new HexVector(0, -1, 1),
    new HexVector(1, -1, 0),
    new HexVector(1, 0, -1),
    new HexVector(0, 1, -1),
    new HexVector(-1, 1, 0)
]

export { HEX_DIRECTION_LIST, HexVector, PlaneVector, convertHexVectorToPlaneVector }
