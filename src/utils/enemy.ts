import BIG_RAT_IMG from '@/assets/img/big_rat.svg'
import LIL_RAT_IMG from '@/assets/img/lil_rat.svg'
import { PlaneVector } from "@/utils/geometry.ts"
import { AbstractHexTile, TileSurfaceType, HighlightHexTile, MineBoard } from "@/utils/tile.ts"
import { rollRange } from '@/utils/util.ts'
import { calcRotationAngle } from '@/utils/math.ts'

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
    protected readonly origin_pos: PlaneVector
    protected highlight_hex_tile_list: HighlightHexTile[]
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
        origin_pos: PlaneVector,
        target_hex_tile_list: AbstractHexTile[],
        highlight_hex_tile_list: HighlightHexTile[]
    ) {
        super(type, img_url)
        this.speed = speed
        this.required_click_cnt = required_click_cnt
        this.target_hex_tile_num = target_hex_tile_num
        this.size_multiplier = size_multiplier
        this.target_hex_tile_list = target_hex_tile_list
        this.origin_pos = origin_pos
        this.highlight_hex_tile_list = highlight_hex_tile_list
        this.center_hex_tile = this.target_hex_tile_list[0]
        this.tick = 0
        this.is_done = false
        this.prev_click_cnt = -1
        this.cur_click_cnt = 0

        this.elm = document.createElement('div')
        this.img_elm = document.createElement('img')

        const img_width: number = (AbstractHexTile.HEX_TILE_RADIUS * Math.sqrt(3) + AbstractHexTile.HEX_TILE_SPACING * 8) * this.size_multiplier
        const img_height: number = (AbstractHexTile.HEX_TILE_RADIUS * 2 + AbstractHexTile.HEX_TILE_SPACING * 8) * this.size_multiplier

        this.elm.classList.add('run-rat')
        this.elm.style.width = `${img_width}px`
        this.elm.style.height = `${img_height}px`
        this.elm.style.left = `${this.origin_pos.x}px`
        this.elm.style.top = `${this.origin_pos.y}px`
        this.img_elm.setAttribute('type', 'image/svg+xml')
        this.img_elm.src = this.img_url
        this.img_elm.style.transform = `rotate(${calcRotationAngle(
            this.origin_pos,
            this.center_hex_tile.plane_coord,
            new PlaneVector(img_width, img_height),
            new PlaneVector(AbstractHexTile.HEX_TILE_RADIUS * 2, AbstractHexTile.HEX_TILE_RADIUS * 2),
            new PlaneVector(0, 1)
        )}deg)`
        this.elm.appendChild(document.createElement('span'))
        this.elm.appendChild(this.img_elm)
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
        for (const highlight_hex_tile_elm of this.highlight_hex_tile_list) {
            highlight_hex_tile_elm.remove()
        }

        this.elm.remove()
    }

    isArrived(cur_pos: PlaneVector): boolean {
        return Math.abs(cur_pos.x + this.img_elm.width / 2 - this.center_hex_tile.plane_coord.x - AbstractHexTile.HEX_TILE_RADIUS) <= this.img_elm.width / 2 &&
            Math.abs(cur_pos.y + this.img_elm.height / 2 - this.center_hex_tile.plane_coord.y - AbstractHexTile.HEX_TILE_RADIUS) <= this.img_elm.height / 2
    }

    updateCntText() {
        const span_elm: HTMLElement | null = this.elm.querySelector('span')

        if (span_elm) {
            span_elm.textContent = `${this.required_click_cnt - this.cur_click_cnt}`
        }
    }

    run(run_interval: number) {
        const distance: PlaneVector = new PlaneVector(
            this.center_hex_tile.plane_coord.x - this.origin_pos.x + AbstractHexTile.HEX_TILE_RADIUS - this.img_elm.width / 2,
            this.center_hex_tile.plane_coord.y - this.origin_pos.y + AbstractHexTile.HEX_TILE_RADIUS - this.img_elm.height / 2
        )
        const cos_x: number = distance.x / Math.sqrt(Math.pow(distance.x, 2) + Math.pow(distance.y, 2))
        const sin_y: number = distance.y / Math.sqrt(Math.pow(distance.x, 2) + Math.pow(distance.y, 2))
        const cur_pos: PlaneVector = new PlaneVector(
            this.origin_pos.x + (this.speed * cos_x) * run_interval / 1000 * this.tick,
            this.origin_pos.y + (this.speed * sin_y) * run_interval / 1000 * this.tick
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

    getElm(): HTMLElement {
        return this.elm
    }
}

class LilRat extends AbstractMovingRat {
    constructor(
        target_hex_tile_list: AbstractHexTile[],
        origin_pos: PlaneVector,
        highlight_hex_tile_list: HighlightHexTile[],
    ) {
        super(
            RatType.LIL_RAT, LIL_RAT_IMG, 120, 3, 1, 1.5,
            origin_pos, target_hex_tile_list, highlight_hex_tile_list
        )
    }
}

class BigRat extends AbstractMovingRat {
    constructor(
        target_hex_tile_list: AbstractHexTile[],
        origin_pos: PlaneVector,
        highlight_hex_tile_list: HighlightHexTile[],
    ) {
        super(
            RatType.BIG_RAT, BIG_RAT_IMG, 150, 10, 7, 2.5,
            origin_pos, target_hex_tile_list, highlight_hex_tile_list
        )
    }
}

function genMovingRat(type: RatType, mine_board: MineBoard): AbstractMovingRat | null {
    let target_hex_tile_list: AbstractHexTile[] = []
    let new_moving_rat: AbstractMovingRat | null = null

    function selectTargetHexTiles(is_include_hover_tiles: boolean = false): AbstractHexTile[] {
        const candidate_hex_tile_list: AbstractHexTile[] = mine_board.getNormalSurfaceHexTiles().concat(mine_board.getFlagHexTiles())
        const selected_hex_tile_list: AbstractHexTile[] = []
        const rnd_idx: number = rollRange(0, candidate_hex_tile_list.length - 1)
        const center_hex_tile: AbstractHexTile = candidate_hex_tile_list[rnd_idx]

        selected_hex_tile_list.push(center_hex_tile)

        if (is_include_hover_tiles) {
            for (const hover_hex_tile of mine_board.getHoverTiles(center_hex_tile.getId(), true)) {
                selected_hex_tile_list.push(hover_hex_tile)
            }
        }

        return selected_hex_tile_list
    }

    function getOriginPos(): PlaneVector {
        const stage_elm: HTMLElement | null = document.querySelector('#main-stage')

        return new PlaneVector(
            (stage_elm ? stage_elm.clientWidth : 1500) / 2 - 150,
            rollRange(0, 0 + 14 * AbstractHexTile.HEX_TILE_RADIUS)
        )
    }

    switch (type) {
        case RatType.LIL_RAT:
            target_hex_tile_list = selectTargetHexTiles(false)
            break
        case RatType.BIG_RAT:
            target_hex_tile_list = selectTargetHexTiles(true)
            break
        default:
            break
    }

    if (target_hex_tile_list.length > 0) {
        const origin_pos: PlaneVector = getOriginPos()
        const highlight_hex_tile_list: HighlightHexTile[] = []

        for (const selected_hex_tile of target_hex_tile_list) {
            highlight_hex_tile_list.push(new HighlightHexTile(
                selected_hex_tile.plane_coord.x,
                selected_hex_tile.plane_coord.y
            ))
        }

        switch (type) {
            case RatType.LIL_RAT:
                new_moving_rat = new LilRat(
                    target_hex_tile_list,
                    origin_pos,
                    highlight_hex_tile_list
                )
                break
            case RatType.BIG_RAT:
                new_moving_rat = new BigRat(
                    target_hex_tile_list,
                    origin_pos,
                    highlight_hex_tile_list
                )
                break
            default:
                break
        }
    }

    return new_moving_rat
}

export { BigRat, LilRat }
