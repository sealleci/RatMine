import { addElmClass, removeElmClass } from '@/utils/dom.ts'
import { HEX_DIRECTION_LIST, HexVector, PlaneVector, convertHexVectorToPlaneVector } from '@/utils/geometry.ts'

enum TileType {
    BLANK = 'blank',
    NUMBER = 'number',
    MINE = 'mine'
}

enum TileSurfaceType {
    NORMAL = 'normal',
    REVEALED = 'revealed',
    FLAG = 'flag',
    VINE = 'vine'
}

abstract class AbstractHexTile {
    public readonly hex_coord: HexVector
    public readonly plane_coord: PlaneVector
    public readonly step: number // The steps from the center hex tile.
    public readonly type: TileType
    protected surface_type: TileSurfaceType
    protected is_vine: boolean // Determine whether the tile has vine or not.
    protected elm: HTMLElement | null

    constructor(type: TileType, hex_x: number, hex_y: number, hex_z: number, plane_x: number, plane_y: number, step: number) {
        this.type = type
        this.hex_coord = new HexVector(hex_x, hex_y, hex_z)
        this.plane_coord = new PlaneVector(plane_x, plane_y)
        this.step = step
        this.type = TileType.BLANK
        this.surface_type = TileSurfaceType.NORMAL
        this.is_vine = false
        this.elm = null
    }

    static isCertainType(_: AbstractHexTile): _ is AbstractHexTile {
        return true
    }

    abstract click(): void
    abstract hover(): void

    getSurfaceType(): TileSurfaceType {
        return this.surface_type
    }

    isVine(): boolean {
        return this.is_vine
    }

    addElmClass(class_name: string) {
        if (this.elm) {
            addElmClass(this.elm, class_name)
        }
    }

    removeElmClass(class_name: string) {
        if (this.elm) {
            removeElmClass(this.elm, class_name)
        }
    }

    setFlag() {
        if (this.surface_type === TileSurfaceType.NORMAL) {
            this.surface_type = TileSurfaceType.FLAG
        }
    }

    unsetFlag() {
        if (this.surface_type === TileSurfaceType.FLAG) {
            this.surface_type = TileSurfaceType.NORMAL
        }
    }


    isClickable(): boolean {
        return true
    }

    render(base: number) {
        const new_hex_elm: HTMLElement = document.createElement('div')

        new_hex_elm.className = 'hex'
        new_hex_elm.style.height = `${base * 2}px`
        new_hex_elm.style.width = `${base * Math.sqrt(3)}px`
        new_hex_elm.style.left = `${this.plane_coord.x}px`
        new_hex_elm.style.top = `${this.plane_coord.y}px`
        new_hex_elm.setAttribute('hex_id', this.hex_coord.getId())

        document.querySelector('#mine-field')?.appendChild(new_hex_elm)
        this.elm = new_hex_elm
    }
}

class BlankHexTile extends AbstractHexTile {
    constructor(hex_x: number, hex_y: number, hex_z: number, plane_x: number, plane_y: number, step: number) {
        super(TileType.BLANK, hex_x, hex_y, hex_z, plane_x, plane_y, step)
    }

    click() { }

    hover() { }
}

class NumberHexTile extends AbstractHexTile {
    public readonly num: number

    constructor(hex_x: number, hex_y: number, hex_z: number, plane_x: number, plane_y: number, step: number, num: number) {
        super(TileType.NUMBER, hex_x, hex_y, hex_z, plane_x, plane_y, step)
        this.num = num
    }

    static isCertainType(tile: AbstractHexTile): tile is NumberHexTile {
        return tile.type === TileType.MINE
    }

    click() { }

    hover() { }
}

class MineHexTile extends AbstractHexTile {
    constructor(hex_x: number, hex_y: number, hex_z: number, plane_x: number, plane_y: number, step: number) {
        super(TileType.MINE, hex_x, hex_y, hex_z, plane_x, plane_y, step)
    }

    static isCertainType(tile: AbstractHexTile): tile is MineHexTile {
        return tile.type === TileType.MINE
    }

    click() { }

    hover() { }
}

class HexTileList<T extends AbstractHexTile = AbstractHexTile>{
    private data: T[]

    constructor() {
        this.data = []
    }

    push(hex_tile: T) {
        this.data.push(hex_tile)
    }

    find(hex_id: string): T | null {
        for (const hex_tile of this.data) {
            if (hex_tile.hex_coord.getId() === hex_id) {
                return hex_tile
            }
        }

        return null
    }

    clear() {
        this.data = []
    }

    getLen(): number {
        return this.data.length
    }

    set(data: T[]) {
        this.data = data
    }
}

class MineBoard {
    accessor size: number // The number of hex tiles on a radius of the board.
    private hex_tile_list: HexTileList
    static readonly HEX_TILE_RADIUS: number = 26 // The radius length of a hex tile.
    static readonly HEX_TILE_SPACING: number = 1 // The spacing between two hex tiles.

    constructor(size: number) {
        this.size = size
        this.hex_tile_list = new HexTileList()
    }

    findHexTile(hex_id: string): AbstractHexTile | null {
        return this.hex_tile_list.find(hex_id)
    }

    clear() { }

    init() { }

    /**
     * Generate a mine board by BFS.
     */
    generateBlankBoard(center_plane_x: number, center_plane_y: number) {
        const center_hex_tile: AbstractHexTile = new BlankHexTile(0, 0, 0, center_plane_x, center_plane_y, 0)
        const hex_tile_queue: AbstractHexTile[] = []
        const hex_tile_visited_dict: Record<string, boolean> = {} // Determine whether a hex tile has been visited or not.
        const hex_tile_list: AbstractHexTile[] = [] // The result of generated hex tiles.

        function isHexTileVisited(hex_tile_id: string) {
            if (hex_tile_id in hex_tile_visited_dict) {
                return hex_tile_visited_dict[hex_tile_id]
            } else {
                hex_tile_visited_dict[hex_tile_id] = false
                return false
            }
        }

        hex_tile_visited_dict[center_hex_tile.hex_coord.getId()] = true
        hex_tile_queue.push(center_hex_tile)

        while (hex_tile_queue.length !== 0) {
            const cur_hex_tile: AbstractHexTile = hex_tile_queue.shift()!

            hex_tile_list.push(cur_hex_tile)
            // TODO: The moment of rendering.
            // top_hex_tile.render(MineBoard.HEX_TILE_RADIUS)

            for (const hex_direction of HEX_DIRECTION_LIST) {
                const hex_pos: HexVector = cur_hex_tile.hex_coord.plus(hex_direction)

                if (!isHexTileVisited(hex_pos.getId())) {
                    const step: number = cur_hex_tile.step + 1

                    if (step <= this.size) {
                        const plane_pos: PlaneVector = cur_hex_tile.plane_coord.plus(
                            convertHexVectorToPlaneVector(hex_direction, MineBoard.HEX_TILE_RADIUS)
                        )

                        hex_tile_visited_dict[hex_pos.getId()] = true
                        // Generate blank hex tiles at first.
                        hex_tile_queue.push(
                            new BlankHexTile(
                                hex_pos.x, hex_pos.y, hex_pos.z, plane_pos.x, plane_pos.y, step
                            )
                        )
                    }
                }
            }
        }

        this.hex_tile_list.set(hex_tile_list)
    }
}

class HexTileHint {
    private hex_tile: AbstractHexTile | null
    private tick: number
    private is_done: boolean
    private static readonly DURATION: number = 4500 // The duration of a hint animation.
    private static readonly TICK_INTERVAL: number = 10 // The interval between ticks of a hint animation.

    constructor() {
        this.hex_tile = null
        this.tick = 0
        this.is_done = false
    }

    isDone(): boolean {
        return this.is_done
    }

    init(hex_tile_elm: AbstractHexTile) {
        this.hex_tile = hex_tile_elm
        this.tick = 0
        this.is_done = false
    }

    activate() {
        if (!this.hex_tile) {
            this.is_done = true
            return
        }

        if (
            this.tick >= HexTileHint.DURATION / HexTileHint.TICK_INTERVAL ||
            this.hex_tile.getSurfaceType() !== TileSurfaceType.NORMAL
        ) {
            this.hex_tile.removeElmClass('hex-shake')
            this.is_done = true
        }
        else {
            this.tick += 1
        }
    }
}

class HighlightHexTile { }

export { AbstractHexTile, HexTileHint, HighlightHexTile, MineBoard, TileSurfaceType, TileType }
