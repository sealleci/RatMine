import BIG_RAT_IMG from '@/assets/img/big_rat.svg'
import LIL_RAT_IMG from '@/assets/img/lil_rat.svg'
import { PlaneVector } from "@/utils/geometry.ts"
import { AbstractHexTile, MineBoard, TileSurfaceType } from "@/utils/tile.ts"

enum RatType {
    LIL_RAT = 'lil_rat',
    BIG_RAT = 'big_rat'
}

abstract class AbstractRat {
    public readonly type: RatType
    protected img_url: string

    constructor(type: RatType, img_url: string) {
        this.type = type
        this.img_url = img_url
    }
}

abstract class AbstractMovingRat extends AbstractRat {
    protected speed: number
    protected target_hex_tile_num: number
    protected size_multiplier: number
    protected target_hex_tile_list: AbstractHexTile[]
    protected readonly spawn_coord: PlaneVector
    protected highlight_hex_tile_elm_list: HTMLElement[]
    protected readonly elm: HTMLElement
    protected readonly img_elm: HTMLImageElement
    protected center_hex_tile: AbstractHexTile
    protected tick: number
    protected is_done: boolean // Determine whether the rat has reached the target hex tile or not
    protected required_click_cnt: number
    protected prev_click_cnt: number
    protected cur_click_cnt: number

    constructor(
        type: RatType,
        img_url: string,
        speed: number,
        required_click_cnt: number,
        target_hex_tile_num: number,
        size_multiplier: number,
        elm: HTMLElement,
        spawn_coord: PlaneVector,
        target_hex_tile_list: AbstractHexTile[],
        highlight_hex_tile_elm_list: HTMLElement[],
    ) {
        super(type, img_url)
        this.speed = speed
        this.required_click_cnt = required_click_cnt
        this.target_hex_tile_num = target_hex_tile_num
        this.size_multiplier = size_multiplier
        this.elm = elm
        this.img_elm = this.elm.querySelector('img') ?? document.createElement('img')
        this.target_hex_tile_list = target_hex_tile_list
        this.spawn_coord = spawn_coord
        this.highlight_hex_tile_elm_list = highlight_hex_tile_elm_list
        this.center_hex_tile = this.target_hex_tile_list[0]
        this.tick = 0
        this.is_done = false
        this.prev_click_cnt = -1
        this.cur_click_cnt = 0
    }

    revealTargetHexTiles() {
        for (const target_hex_tile of this.target_hex_tile_list) {
            if (target_hex_tile.getSurfaceType() === TileSurfaceType.FLAG) {
                target_hex_tile.unsetFlag()
            }

            if (target_hex_tile.isClickable()) {
                target_hex_tile.click()
            }
        }

    }

    removeHighlightHexTiles() {
        for (const highlight_hex_tile_elm of this.highlight_hex_tile_elm_list) {
            highlight_hex_tile_elm.remove()
        }

        this.elm.remove()
    }

    isArrived(cur_pos: PlaneVector): boolean {
        return Math.abs(cur_pos.x + this.img_elm.width / 2 - this.center_hex_tile.plane_coord.x - MineBoard.HEX_TILE_RADIUS) <= this.img_elm.width / 2 &&
            Math.abs(cur_pos.y + this.img_elm.height / 2 - this.center_hex_tile.plane_coord.y - MineBoard.HEX_TILE_RADIUS) <= this.img_elm.height / 2
    }

    updateCntText() {
        const span_elm: HTMLElement | null = this.elm.querySelector('span')

        if (span_elm) {
            span_elm.textContent = `${this.required_click_cnt - this.cur_click_cnt}`
        }
    }

    run(run_interval: number) {
        const distance: PlaneVector = new PlaneVector(
            this.center_hex_tile.plane_coord.x - this.spawn_coord.x + MineBoard.HEX_TILE_RADIUS - this.img_elm.width / 2,
            this.center_hex_tile.plane_coord.y - this.spawn_coord.y + MineBoard.HEX_TILE_RADIUS - this.img_elm.height / 2
        )
        const cos_x: number = distance.x / Math.sqrt(Math.pow(distance.x, 2) + Math.pow(distance.y, 2))
        const sin_y: number = distance.y / Math.sqrt(Math.pow(distance.x, 2) + Math.pow(distance.y, 2))
        const cur_pos: PlaneVector = new PlaneVector(
            this.spawn_coord.x + (this.speed * cos_x) * run_interval / 1000 * this.tick,
            this.spawn_coord.y + (this.speed * sin_y) * run_interval / 1000 * this.tick
        )
        let remaining_hex_tile_num: number = 0
        let is_required_click_cnt_reached: boolean = false

        this.elm.style.left = `${cur_pos.x}px`
        this.elm.style.top = `${cur_pos.y}px`

        for (const target_hex_tile of this.target_hex_tile_list) {
            if (target_hex_tile.getSurfaceType() !== TileSurfaceType.REVEALED) {
                remaining_hex_tile_num += 1
            }
        }

        if (this.prev_click_cnt !== this.cur_click_cnt) {
            this.prev_click_cnt = this.cur_click_cnt
            this.updateCntText()
        }

        if (this.cur_click_cnt >= this.required_click_cnt) {
            is_required_click_cnt_reached = true
        }

        if (remaining_hex_tile_num === 0 || is_required_click_cnt_reached) {
            this.is_done = true
        }

        if (this.isArrived(cur_pos)) {
            this.revealTargetHexTiles()
            this.is_done = true
        }

        if (this.is_done) {
            this.removeHighlightHexTiles()
        }

        this.tick += 1
    }
}

class LilRat extends AbstractMovingRat {
    constructor(
        target_hex_tile_list: AbstractHexTile[],
        spawn_coord: PlaneVector,
        highlight_hex_tile_elm_list: HTMLElement[],
        elm: HTMLElement,
    ) {
        super(
            RatType.LIL_RAT, LIL_RAT_IMG, 120, 3, 1, 1.5,
            elm, spawn_coord, target_hex_tile_list, highlight_hex_tile_elm_list
        )
    }
}

class BigRat extends AbstractMovingRat {
    constructor(
        target_hex_tile_list: AbstractHexTile[],
        spawn_coord: PlaneVector,
        highlight_hex_tile_elm_list: HTMLElement[],
        elm: HTMLElement,
    ) {
        super(
            RatType.BIG_RAT, BIG_RAT_IMG, 150, 10, 7, 2.5,
            elm, spawn_coord, target_hex_tile_list, highlight_hex_tile_elm_list
        )
    }
}

export { BigRat, LilRat }
