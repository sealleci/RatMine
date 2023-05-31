import { addElmClass, removeElmClass } from '@/utils/dom.ts'
import { HEX_DIRECTION_LIST, HexVector, PlaneVector, convertHexVectorToPlaneVector } from '@/utils/geometry.ts'
import { rollRange } from '@/utils/util.ts'

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

    getId(): string {
        return this.hex_coord.getId()
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
        return this.surface_type === TileSurfaceType.NORMAL ||
            this.surface_type === TileSurfaceType.VINE
    }

    isFlagSettable(): boolean {
        return this.surface_type === TileSurfaceType.NORMAL ||
            this.surface_type === TileSurfaceType.FLAG ||
            this.surface_type === TileSurfaceType.VINE
    }

    createElm(hex_tile_radius: number) {
        const new_hex_tile_elm: HTMLElement = document.createElement('div')

        new_hex_tile_elm.className = 'hex'
        new_hex_tile_elm.style.height = `${hex_tile_radius * 2}px`
        new_hex_tile_elm.style.width = `${hex_tile_radius * Math.sqrt(3)}px`
        new_hex_tile_elm.style.left = `${this.plane_coord.x}px`
        new_hex_tile_elm.style.top = `${this.plane_coord.y}px`
        new_hex_tile_elm.setAttribute('hex_tile_id', this.getId())
        this.elm = new_hex_tile_elm
    }

    getElm(): HTMLElement | null {
        return this.elm
    }
}

class BlankHexTile extends AbstractHexTile {
    constructor(hex_x: number, hex_y: number, hex_z: number, plane_x: number, plane_y: number, step: number) {
        super(TileType.BLANK, hex_x, hex_y, hex_z, plane_x, plane_y, step)
    }

    static isCertainType(tile: AbstractHexTile): tile is BlankHexTile {
        return tile.type === TileType.BLANK
    }

    click() { }

    hover() { }
}

class NumHexTile extends AbstractHexTile {
    accessor num: number

    constructor(hex_x: number, hex_y: number, hex_z: number, plane_x: number, plane_y: number, step: number, num: number) {
        super(TileType.NUMBER, hex_x, hex_y, hex_z, plane_x, plane_y, step)
        this.num = num
    }

    static isCertainType(tile: AbstractHexTile): tile is NumHexTile {
        return tile.type === TileType.MINE
    }

    static constructFrom(hex_tile: AbstractHexTile, num: number): NumHexTile {
        const new_hex_tile = new NumHexTile(
            hex_tile.hex_coord.x,
            hex_tile.hex_coord.y,
            hex_tile.hex_coord.z,
            hex_tile.plane_coord.x,
            hex_tile.plane_coord.y,
            hex_tile.step,
            num
        )

        new_hex_tile.elm = hex_tile.getElm()
        new_hex_tile.surface_type = hex_tile.getSurfaceType()
        new_hex_tile.is_vine = hex_tile.isVine()

        return new_hex_tile
    }

    click() { }

    hover() { }
}

class MineHexTile extends AbstractHexTile {
    constructor(hex_x: number, hex_y: number, hex_z: number, plane_x: number, plane_y: number, step: number) {
        super(TileType.MINE, hex_x, hex_y, hex_z, plane_x, plane_y, step)
    }

    static constructFrom(hex_tile: AbstractHexTile): MineHexTile {
        const new_hex_tile = new MineHexTile(
            hex_tile.hex_coord.x,
            hex_tile.hex_coord.y,
            hex_tile.hex_coord.z,
            hex_tile.plane_coord.x,
            hex_tile.plane_coord.y,
            hex_tile.step
        )

        new_hex_tile.elm = hex_tile.getElm()
        new_hex_tile.surface_type = hex_tile.getSurfaceType()
        new_hex_tile.is_vine = hex_tile.isVine()

        return new_hex_tile
    }

    static isCertainType(tile: AbstractHexTile): tile is MineHexTile {
        return tile.type === TileType.MINE
    }

    click() { }

    hover() { }
}

class HexTileList<T extends AbstractHexTile = AbstractHexTile> implements Iterable<T> {
    private items: T[]

    constructor() {
        this.items = []
    }

    push(value: T) {
        this.items.push(value)
    }

    getById(id: string): T | undefined {
        for (const hex_tile of this.items) {
            if (hex_tile.getId() === id) {
                return hex_tile
            }
        }

        return undefined
    }

    getByIdx(idx: number): T | undefined {
        if (idx < 0 || idx >= this.items.length) {
            return undefined
        }

        return this.items[idx]
    }

    findIdx(id: string): number {
        for (let i = 0; i < this.items.length; i += 1) {
            if (this.items[i].getId() === id) {
                return i
            }
        }

        return -1
    }

    clear() {
        this.items = []
    }

    getLen(): number {
        return this.items.length
    }

    set(idx: number, value: T) {
        if (idx < 0 || idx >= this.items.length) { return }

        this.items[idx] = value
    }

    reset(value_list: T[]) {
        this.items = value_list
    }

    clone(): T[] {
        return Array.from(this.items)
    }

    *[Symbol.iterator](): Generator<T> {
        for (const item of this.items) {
            yield item
        }
    }
}

class MineBoard {
    accessor size: number // The number of hex tiles on a radius of the board.
    private hex_tile_list: HexTileList
    private mine_hex_tile_list: HexTileList<MineHexTile>
    private number_hex_tile_list: HexTileList<NumHexTile>
    static readonly HEX_TILE_RADIUS: number = 26 // The radius length of a hex tile.
    static readonly HEX_TILE_SPACING: number = 1 // The spacing between two hex tiles.

    constructor(size: number) {
        this.size = size
        this.hex_tile_list = new HexTileList()
        this.mine_hex_tile_list = new HexTileList<MineHexTile>()
        this.number_hex_tile_list = new HexTileList<NumHexTile>()
    }

    findHexTile(hex_tile_id: string): AbstractHexTile | undefined {
        return this.hex_tile_list.getById(hex_tile_id)
    }

    isBlankBoard(): boolean {
        return this.mine_hex_tile_list.getLen() === 0
    }

    clear() { }

    init() { }

    getHexTiles(): AbstractHexTile[] {
        return this.hex_tile_list.clone()
    }

    /**
     * Generate a mine board by BFS.
     */
    genBlankBoard(center_plane_x: number, center_plane_y: number) {
        const center_hex_tile: AbstractHexTile = new BlankHexTile(0, 0, 0, center_plane_x, center_plane_y, 0)
        const hex_tile_queue: AbstractHexTile[] = []
        const hex_tile_visited_dict: Record<string, boolean> = {} // Determine whether a hex tile has been visited or not.

        function isHexTileVisited(hex_tile_id: string) {
            if (hex_tile_id in hex_tile_visited_dict) {
                return hex_tile_visited_dict[hex_tile_id]
            } else {
                hex_tile_visited_dict[hex_tile_id] = false
                return false
            }
        }

        hex_tile_visited_dict[center_hex_tile.getId()] = true
        hex_tile_queue.push(center_hex_tile)

        while (hex_tile_queue.length !== 0) {
            const cur_hex_tile: AbstractHexTile = hex_tile_queue.shift()!

            cur_hex_tile.createElm(MineBoard.HEX_TILE_RADIUS)
            this.hex_tile_list.push(cur_hex_tile)

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
    }

    /**
     * Find safe hex tiles around the origin hex tile.
     */
    getSafeTiles(origin_hex_tile_id: string): HexTileList {
        const safe_hex_tile_list: HexTileList = new HexTileList()
        const cur_hex: HexVector = HexVector.parseId(origin_hex_tile_id)
        const rnd_direction_idx: number = rollRange(0, HEX_DIRECTION_LIST.length - 1)
        const opposite_direction_idx: number = (rnd_direction_idx + Math.floor(HEX_DIRECTION_LIST.length / 2)) % HEX_DIRECTION_LIST.length
        const extra_extended_num: number = 2
        let cur_extended_cnt: number = 0

        // Iterate the 6 directions from the origin hex tile.
        for (let i = 0; i < HEX_DIRECTION_LIST.length; i += 1) {
            let tmp_hex_pos: HexVector = cur_hex

            // On each direction, step forward for the curtain extended number.
            for (let j = 0; j < extra_extended_num; j += 1) {
                tmp_hex_pos = tmp_hex_pos.plus(HEX_DIRECTION_LIST[i])

                const tmp_hex_tile: AbstractHexTile | undefined = this.hex_tile_list.getById(tmp_hex_pos.getId())

                if (tmp_hex_tile && tmp_hex_tile.isClickable()) {
                    safe_hex_tile_list.push(tmp_hex_tile)
                }

                // If the current direction is the selected random direction or
                // the opposite one, extend extra 2 hex tiles.
                if (
                    cur_extended_cnt < extra_extended_num &&
                    (i === rnd_direction_idx || i === opposite_direction_idx) &&
                    j === 0
                ) {
                    const extra_direction_idx_list: number[] = [
                        (i + 1) % HEX_DIRECTION_LIST.length,
                        (i + HEX_DIRECTION_LIST.length - 1) % HEX_DIRECTION_LIST.length
                    ]

                    cur_extended_cnt += 1

                    for (const direction_idx of extra_direction_idx_list) {
                        const extra_hex_pos: HexVector = tmp_hex_pos.plus(HEX_DIRECTION_LIST[direction_idx])
                        const extra_hex_tile: AbstractHexTile | undefined = this.hex_tile_list.getById(extra_hex_pos.getId())

                        if (extra_hex_tile && extra_hex_tile.isClickable()) {
                            safe_hex_tile_list.push(extra_hex_tile)
                        }
                    }
                }
            }
        }

        return safe_hex_tile_list
    }

    genMines(mine_num: number, origin_hex_tile_id: string) {
        const rnd_list: number[] = []
        const safe_hex_tile_list: HexTileList = this.getSafeTiles(origin_hex_tile_id)
        const origin_hex_tile: AbstractHexTile | undefined = this.hex_tile_list.getById(origin_hex_tile_id)

        if (!origin_hex_tile) { return }

        safe_hex_tile_list.push(origin_hex_tile)

        for (let i = 0; i < this.mine_hex_tile_list.getLen(); i += 1) {
            const hex_tile: AbstractHexTile | undefined = this.hex_tile_list.getByIdx(i)

            if (hex_tile && safe_hex_tile_list.findIdx(hex_tile.getId()) === -1) {
                rnd_list.push(i)
            }
        }

        for (let i = 0; i < mine_num; i += 1) {
            const rnd_num: number = rollRange(0, rnd_list.length - 1)
            const rnd_idx: number = rnd_list[rnd_num]
            const selected_hex_tile: AbstractHexTile | undefined = this.hex_tile_list.getByIdx(rnd_idx)

            if (!selected_hex_tile) { continue }

            const new_mine_hex_tile: MineHexTile = MineHexTile.constructFrom(selected_hex_tile)

            this.hex_tile_list.set(rnd_idx, new_mine_hex_tile)
            this.mine_hex_tile_list.push(new_mine_hex_tile)
            rnd_list.splice(rnd_num, 1)
        }
    }

    markNum() {
        for (const mine_hex_tile of this.mine_hex_tile_list) {
            // Iterate the 6 directions from a mine hex tile.
            for (const hex_direction of HEX_DIRECTION_LIST) {
                const tmp_hex_tile_id: string = hex_direction.plus(mine_hex_tile.hex_coord).getId()
                const tmp_hex_tile: AbstractHexTile | undefined = this.hex_tile_list.getById(tmp_hex_tile_id)

                // If the hex tile is not a mine hex tile.
                if (
                    tmp_hex_tile &&
                    this.mine_hex_tile_list.findIdx(tmp_hex_tile_id) === -1
                ) {
                    const tmp_num_hex_tile: NumHexTile | undefined = this.number_hex_tile_list.getById(tmp_hex_tile_id)

                    // If the hex tile is already a number hex tile, increase the number.
                    if (tmp_num_hex_tile) {
                        tmp_num_hex_tile.num += 1
                    } else { // Otherwise, create a new number hex tile.
                        const new_num_hex_tile: NumHexTile = NumHexTile.constructFrom(tmp_hex_tile, 1)

                        this.number_hex_tile_list.push(new_num_hex_tile)
                    }
                }
            }
        }

        // Replace the number hex tiles in the hex tile list.
        for (const num_hex_tile of this.number_hex_tile_list) {
            const hex_tile_idx: number = this.hex_tile_list.findIdx(num_hex_tile.getId())

            if (hex_tile_idx !== -1) {
                this.hex_tile_list.set(hex_tile_idx, num_hex_tile)
            }
        }
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
