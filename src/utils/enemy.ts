import { PlainCoordinate } from "@/utils/geometry.ts"
import type { MineBoardInfo } from "@/utils/tile.ts"
import { HexTile, TileSurfaceType } from "@/utils/tile.ts"
import LIL_RAT_IMG from '@/assets/img/lil_rat.svg'
import BIG_RAT_IMG from '@/assets/img/big_rat.svg'

enum RatType {
    LIL_RAT = 'lil_rat',
    BIG_RAT = 'big_rat'
}

abstract class AbstractRat {
    public readonly type: RatType
    private img_url: string

    constructor(type: RatType, img_url: string) {
        this.type = type
        this.img_url = img_url
    }
}

abstract class AbstractMovingRat extends AbstractRat {
    private speed: number
    private target_hex_tile_num: number
    private size_multiplier: number
    private target_hex_tile_list: HexTile[]
    private readonly spawn_coordinate: PlainCoordinate
    private highlight_hex_tile_elm_list: HTMLElement[]
    private readonly elm: HTMLElement
    private readonly img_elm: HTMLImageElement
    private center_hex_tile: HexTile
    private tick: number
    private is_done: boolean // Determine whether the rat has reached the target hex tile or not
    private required_click_count: number
    private pre_click_count: number
    private cur_click_count: number
    private mine_board_info: MineBoardInfo

    constructor(
        type: RatType,
        img_url: string,
        speed: number,
        required_click_count: number,
        target_hex_tile_num: number,
        size_multiplier: number,
        elm: HTMLElement,
        spawn_coordinate: PlainCoordinate,
        target_hex_tile_list: HexTile[],
        highlight_hex_tile_elm_list: HTMLElement[],
        mine_board_info: MineBoardInfo
    ) {
        super(type, img_url)
        this.speed = speed
        this.required_click_count = required_click_count
        this.target_hex_tile_num = target_hex_tile_num
        this.size_multiplier = size_multiplier
        this.elm = elm
        this.img_elm = this.elm.querySelector('img') ?? document.createElement('img')
        this.target_hex_tile_list = target_hex_tile_list
        this.spawn_coordinate = spawn_coordinate
        this.highlight_hex_tile_elm_list = highlight_hex_tile_elm_list
        this.mine_board_info = mine_board_info
        this.center_hex_tile = this.target_hex_tile_list[0]
        this.tick = 0
        this.is_done = false
        this.pre_click_count = -1
        this.cur_click_count = 0
    }

    revealTargetHexTiles() {
        for (const target_hex_tile of this.target_hex_tile_list) {
            if (target_hex_tile.tile_surface_type === TileSurfaceType.FLAG) {
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

    isArrived(cur_position: PlainCoordinate): boolean {
        return Math.abs(cur_position.x + this.img_elm.width / 2 - this.center_hex_tile.plain_coordinate.x - this.mine_board_info.base) <= this.img_elm.width / 2 &&
            Math.abs(cur_position.y + this.img_elm.height / 2 - this.center_hex_tile.plain_coordinate.y - this.mine_board_info.base) <= this.img_elm.height / 2
    }

    updateCountText() {
        const span_elm: HTMLElement | null = this.elm.querySelector('span')

        if (span_elm) {
            span_elm.textContent = `${this.required_click_count - this.cur_click_count}`
        }
    }

    run(run_interval: number) {
        const distance: PlainCoordinate = new PlainCoordinate(
            this.center_hex_tile.plain_coordinate.x - this.spawn_coordinate.x + this.mine_board_info.base - this.img_elm.width / 2,
            this.center_hex_tile.plain_coordinate.y - this.spawn_coordinate.y + this.mine_board_info.base - this.img_elm.height / 2
        )
        const cos_x: number = distance.x / Math.sqrt(Math.pow(distance.x, 2) + Math.pow(distance.y, 2))
        const sin_y: number = distance.y / Math.sqrt(Math.pow(distance.x, 2) + Math.pow(distance.y, 2))
        const cur_position: PlainCoordinate = new PlainCoordinate(
            this.spawn_coordinate.x + (this.speed * cos_x) * run_interval / 1000 * this.tick,
            this.spawn_coordinate.y + (this.speed * sin_y) * run_interval / 1000 * this.tick
        )
        let remaining_hex_tile_num: number = 0
        let is_required_click_count_reached: boolean = false

        this.elm.style.left = `${cur_position.x}px`
        this.elm.style.top = `${cur_position.y}px`

        for (const target_hex_tile of this.target_hex_tile_list) {
            if (target_hex_tile.tile_surface_type !== TileSurfaceType.REVEALED) {
                remaining_hex_tile_num += 1
            }
        }

        if (this.pre_click_count !== this.cur_click_count) {
            this.pre_click_count = this.cur_click_count
            this.updateCountText()
        }

        if (this.cur_click_count >= this.required_click_count) {
            is_required_click_count_reached = true
        }

        if (remaining_hex_tile_num === 0 || is_required_click_count_reached) {
            this.is_done = true
        }

        if (this.isArrived(cur_position)) {
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
        target_hex_tile_list: HexTile[],
        spawn_coordinate: PlainCoordinate,
        highlight_hex_tile_elm_list: HTMLElement[],
        elm: HTMLElement,
        mine_board_info: MineBoardInfo
    ) {
        super(RatType.LIL_RAT, LIL_RAT_IMG, 120, 3, 1, 1.5,
            elm, spawn_coordinate, target_hex_tile_list, highlight_hex_tile_elm_list, mine_board_info)
    }
}

class BigRat extends AbstractMovingRat {
    constructor(
        target_hex_tile_list: HexTile[],
        spawn_coordinate: PlainCoordinate,
        highlight_hex_tile_elm_list: HTMLElement[],
        elm: HTMLElement,
        mine_board_info: MineBoardInfo
    ) {
        super(RatType.BIG_RAT, BIG_RAT_IMG, 150, 10, 7, 2.5,
            elm, spawn_coordinate, target_hex_tile_list, highlight_hex_tile_elm_list, mine_board_info)
    }
}
