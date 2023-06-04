import FLAG_IMG from '@/assets/img/flag.svg'
import { addElmClass, removeElmChildren, removeElmClass } from '@/ts/dom.ts'
import { HexVector, PlaneVector } from '@/ts/geometry.ts'
import MINE_DETONATED_IMG from '@/assets/img/mine_detonated.svg'

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
    protected elm: HTMLElement
    static readonly HEX_TILE_RADIUS: number = 26 // The radius length of a hex tile.
    static readonly HEX_TILE_SPACING: number = 1 // The spacing between two hex tiles.

    constructor(type: TileType, hex_x: number, hex_y: number, hex_z: number, plane_x: number, plane_y: number, step: number) {
        this.type = type
        this.hex_coord = new HexVector(hex_x, hex_y, hex_z)
        this.plane_coord = new PlaneVector(plane_x, plane_y)
        this.step = step
        this.type = TileType.BLANK
        this.surface_type = TileSurfaceType.NORMAL
        this.is_vine = false
        this.elm = document.createElement('div')

        this.elm.className = 'hex'
        this.elm.style.height = `${AbstractHexTile.HEX_TILE_RADIUS * 2}px`
        this.elm.style.width = `${AbstractHexTile.HEX_TILE_RADIUS * Math.sqrt(3)}px`
        this.elm.style.left = `${this.plane_coord.x}px`
        this.elm.style.top = `${this.plane_coord.y}px`
        this.elm.setAttribute('hex_tile_id', this.getId())
    }

    abstract click(): void

    reveal() {
        this.surface_type = TileSurfaceType.REVEALED
    }

    revealWrong() {
        this.surface_type = TileSurfaceType.REVEALED
        this.elm.classList.add('hex-wrong')
    }

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
        addElmClass(this.elm, class_name)
    }

    removeElmClass(class_name: string) {
        removeElmClass(this.elm, class_name)
    }

    setElmText(text: string) {
        this.elm.textContent = text
    }

    setFlag() {
        const img_elm: HTMLImageElement = document.createElement('img')

        this.surface_type = TileSurfaceType.FLAG
        img_elm.src = FLAG_IMG
        img_elm.style.height = `${AbstractHexTile.HEX_TILE_RADIUS * 1.5}px`
        img_elm.style.width = `${AbstractHexTile.HEX_TILE_RADIUS * 1.5}px`
        this.elm.appendChild(img_elm)
    }

    unsetFlag() {
        this.surface_type = TileSurfaceType.NORMAL
        removeElmChildren(this.elm)
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

    getElm(): HTMLElement {
        return this.elm
    }
}

class BlankHexTile extends AbstractHexTile {
    constructor(hex_x: number, hex_y: number, hex_z: number, plane_x: number, plane_y: number, step: number) {
        super(TileType.BLANK, hex_x, hex_y, hex_z, plane_x, plane_y, step)
    }

    revealWrong() {
        super.revealWrong()
        this.setElmText('')
    }

    click() {
        this.reveal()
        this.setElmText('')
        this.addElmClass('hex-active')
    }
}

class NumHexTile extends AbstractHexTile {
    accessor num: number
    private static readonly NUM_COLOR_LIST: string[] = ['#845538', '#426ab3', '#1d953f']

    constructor(hex_x: number, hex_y: number, hex_z: number, plane_x: number, plane_y: number, step: number, num: number) {
        super(TileType.NUMBER, hex_x, hex_y, hex_z, plane_x, plane_y, step)
        this.num = num
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

    updateElmText() {
        this.elm.textContent = this.num.toString()
    }

    revealWrong() {
        super.revealWrong()
        this.updateElmText()
    }

    click() {
        this.updateElmText()
        this.elm.classList.add('hex-active')
        this.elm.style.color = NumHexTile.NUM_COLOR_LIST[this.num % 3]
    }
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

    click() {
        const img_elm: HTMLImageElement = document.createElement('img')

        img_elm.src = MINE_DETONATED_IMG
        img_elm.classList.add('hex-death')
        img_elm.style.height = `${AbstractHexTile.HEX_TILE_RADIUS * 1.5}px`
        img_elm.style.width = `${AbstractHexTile.HEX_TILE_RADIUS * 1.5}px`
        this.elm.appendChild(img_elm)
    }
}

class HexTileHint {
    private hex_tile: AbstractHexTile | null
    private cur_tick: number
    private is_done: boolean
    private static readonly DURATION: number = 4500 // The duration of a hint animation.
    public static readonly TICK_INTERVAL: number = 10 // The interval between ticks of a hint animation.

    constructor(hex_tile: AbstractHexTile) {
        this.hex_tile = hex_tile
        this.cur_tick = 0
        this.is_done = false

        this.hex_tile.addElmClass('hex-shake')
    }

    isDone(): boolean {
        return this.is_done
    }

    init(hex_tile_elm: AbstractHexTile) {
        this.hex_tile = hex_tile_elm
        this.cur_tick = 0
        this.is_done = false
    }

    activate() {
        if (!this.hex_tile) {
            this.is_done = true
            return
        }

        if (
            this.cur_tick >= HexTileHint.DURATION / HexTileHint.TICK_INTERVAL ||
            this.hex_tile.getSurfaceType() !== TileSurfaceType.NORMAL
        ) {
            this.hex_tile.removeElmClass('hex-shake')
            this.is_done = true
        }
        else {
            this.cur_tick += 1
        }
    }
}

class HighlightHexTile {
    private elm: HTMLElement

    constructor(plane_x: number, plane_y: number) {
        const new_elm: HTMLElement = document.createElement('div')

        new_elm.className = 'mask-hex'
        new_elm.style.height = `${AbstractHexTile.HEX_TILE_RADIUS * 2 + AbstractHexTile.HEX_TILE_SPACING * 4}px`
        new_elm.style.width = `${AbstractHexTile.HEX_TILE_RADIUS * Math.sqrt(3) + AbstractHexTile.HEX_TILE_SPACING * 4}px`
        new_elm.style.left = `${plane_x - AbstractHexTile.HEX_TILE_SPACING * 2}px`
        new_elm.style.top = `${plane_y - AbstractHexTile.HEX_TILE_SPACING * 2}px`
        this.elm = new_elm
    }

    getElm(): HTMLElement {
        return this.elm
    }

    remove() {
        this.elm.remove()
    }
}

class HexTileList<T extends AbstractHexTile = AbstractHexTile> implements Iterable<T> {
    private items: T[]

    constructor(value_list: T[] = []) {
        this.items = value_list
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

    removeById(id: string) {
        const idx: number = this.findIdx(id)

        if (idx === -1) {
            return
        }

        this.items.splice(idx, 1)
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

    unique() {
        this.items = Array.from(new Set(this.items))
    }

    *[Symbol.iterator](): Generator<T> {
        for (const item of this.items) {
            yield item
        }
    }
}

export { AbstractHexTile, BlankHexTile, HexTileHint, HexTileList, HighlightHexTile, MineHexTile, NumHexTile, TileSurfaceType, TileType }
