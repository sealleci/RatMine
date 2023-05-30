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

class HexTileList<T extends AbstractHexTile = AbstractHexTile> implements Iterable<T>{
    private items: T[]

    constructor() {
        this.items = []
    }

    push(hex_tile: T) {
        this.items.push(hex_tile)
    }

    getById(hex_tile_id: string): T | null {
        for (const hex_tile of this.items) {
            if (hex_tile.getId() === hex_tile_id) {
                return hex_tile
            }
        }

        return null
    }

    getIdxById(hex_tile_id: string): number {
        for (let i = 0; i < this.items.length; i += 1) {
            if (this.items[i].getId() === hex_tile_id) {
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

    set(value: T, idx: number) {
        this.items[idx] = value
    }

    [Symbol.iterator](): Iterator<T> {
        let idx = 0

        return {
            next: (): IteratorResult<T> => {
                if (idx < this.items.length) {
                    const cur_value = this.items[idx]

                    idx += 1

                    return { done: false, value: cur_value }
                } else {
                    return { done: true, value: undefined }
                }
            }
        }
    }
}

class MineBoard {
    accessor size: number // The number of hex tiles on a radius of the board.
    public readonly hex_tile_list: HexTileList
    private mine_hex_tile_list: HexTileList<MineHexTile>
    static readonly HEX_TILE_RADIUS: number = 26 // The radius length of a hex tile.
    static readonly HEX_TILE_SPACING: number = 1 // The spacing between two hex tiles.

    constructor(size: number) {
        this.size = size
        this.hex_tile_list = new HexTileList()
        this.mine_hex_tile_list = new HexTileList<MineHexTile>()
    }

    findHexTile(hex_tile_id: string): AbstractHexTile | null {
        return this.hex_tile_list.getById(hex_tile_id)
    }

    isBlankBoard(): boolean {
        return this.mine_hex_tile_list.getLen() === 0
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
    }

    getInitMineFreeArea(hex_tile_id: string): AbstractHexTile[] {
        let cells = []
        let cur_cell = parseId(id, size)
        let ext = 2
        let rnd_dir = rangeRnd(0, 5)
        let opp_dir = (rnd_dir + Math.floor(hex_dirs.length / 2)) % hex_dirs.length
        let isfill = 0
        for (let i in hex_dirs) {
            let t_cell = cur_cell
            for (let j = 0; j < ext; ++j) {
                t_cell = t_cell.plus(hex_dirs[i])
                let t_id = t_cell.getId(size)
                let t_idx = hexs_mp.indexOf(t_id)
                if (t_idx != -1) {
                    if (isClickable(t_id)) {
                        cells.push(t_id)
                    }

                }
                let ii = parseInt(i)
                if (
                    isfill < 2 &&
                    (ii == rnd_dir || ii == opp_dir) &&
                    j == 0
                ) {
                    isfill++
                    let fdirs = [(ii + 1) % hex_dirs.length, (ii + 5) % hex_dirs.length]
                    for (let k in fdirs) {
                        let f_cell = t_cell.plus(hex_dirs[fdirs[k]])
                        let f_id = f_cell.getId(size)
                        let f_idx = hexs_mp.indexOf(f_id)
                        if (f_idx != -1) {
                            if (isClickable(f_id)) {
                                cells.push(f_id)
                            }
                        }
                    }
                }
            }
        }

        return cells
    }

    generateMines(mine_num: number, first_hex_tile_id: string) {
        let mask = []
        let rnd_arr = []
        let adj = this.getInitMineFreeArea(first_hex_tile_id)
        adj.push(id)

        for (let i = 0; i < hexs.length; i += 1) {
            if (adj.indexOf(hexs[i].hexc.mapping(size)) == -1) {
                rnd_arr.push(i)
            }
        }

        for (let i = 0; i < mine_num; i += 1s) {
            let rnd_i = rangeRnd(0, rnd_arr.length - 1)
            this.mine_hex_tile_list.push(hexs[rnd_arr[rnd_i]].hexc)
            hexs[rnd_arr[rnd_i]].type = 2
            rnd_arr.splice(rnd_i, 1)
        }
    }

    signNum() {
        let num_map = {};

        for (let i in mines_mp) {
            for (let j in hex_dirs) {
                let t_hex_mp = hex_dirs[j].plus(
                    parseId(mines_mp[i], size)
                ).getId(size);

                if (hexs_mp.indexOf(t_hex_mp) != -1 &&
                    mines_mp.indexOf(t_hex_mp) == -1
                ) {
                    if (t_hex_mp in num_map) {
                        num_map[t_hex_mp] += 1;
                    } else {
                        num_map[t_hex_mp] = 1;
                    }
                }
            }
        }

        for (let i in num_map) {
            let idx = hexs_mp.indexOf(parseInt(i));

            if (idx != -1) {
                hexs[idx].type = 1;
            }
        }
    }

    generateNumberHexTiles(): NumberHexTile[] {
        const number_hex_tile_list: NumberHexTile[] = []
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
