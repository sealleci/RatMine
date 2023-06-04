import LECI_IMG_0 from '@/assets/img/leci_0.svg'
import LECI_IMG_1 from '@/assets/img/leci_1.svg'
import LECI_IMG_2 from '@/assets/img/leci_2.svg'
import LECI_IMG_3 from '@/assets/img/leci_3.svg'
import { MineBoard } from '@/ts/board.ts'
import { AbstractMovingRat, RatType, createMovingRat } from '@/ts/enemy.ts'
import { AbstractHexTile, BlankHexTile, HexTileHint, MineHexTile, NumHexTile, TileSurfaceType, TileType } from '@/ts/tile.ts'
import { convertTicksToTime, rollRange } from '@/ts/util.ts'

class RatMineGame {
    private mine_board: MineBoard
    accessor mine_set_num: number
    private cur_tick: number
    private tick_interval: number
    private moving_rat_list: AbstractMovingRat[]
    private hint_list: HexTileHint[]
    private hint_gen_interval: number
    private hint_gen_interval_compensation: number
    private moving_rat_gen_interval: number
    private moving_rat_gen_interval_compensation: number
    private moving_rat_timer_tick_interval: number
    private mine_detonated_penalty: number
    private mine_swept_reward: number
    private blank_hex_tile_reward: number
    private number_hex_tile_reward_multiplier: number
    private time_reward_multiplier: number
    private total_score: number
    private cur_level: number
    private cur_time_lim: number
    private main_timer: number | undefined
    private moving_rat_timer: number | undefined
    private hint_timer: number | undefined

    constructor() {
        this.mine_board = new MineBoard(6)
        this.mine_set_num = 10
        this.cur_tick = 0
        this.tick_interval = 100
        this.moving_rat_list = []
        this.hint_list = []
        this.hint_gen_interval = 3000
        this.hint_gen_interval_compensation = 0
        this.moving_rat_gen_interval = 20000
        this.moving_rat_gen_interval_compensation = 0
        this.moving_rat_timer_tick_interval = 25
        this.mine_detonated_penalty = -50
        this.mine_swept_reward = 5
        this.blank_hex_tile_reward = 0
        this.number_hex_tile_reward_multiplier = 1
        this.time_reward_multiplier = 2
        this.total_score = 0
        this.cur_level = 1
        this.cur_time_lim = 1000 * 60
        this.main_timer = undefined
        this.moving_rat_timer = undefined
        this.hint_timer = undefined
    }

    updateMineNumDisplay() {
        const elm: HTMLElement | null = document.querySelector<HTMLElement>('#mine-block>.info')

        if (elm) {
            elm.textContent = (this.mine_board.getMineNum() - this.mine_board.marked_mine_cnt - this.mine_board.getDetonatedMineNum()).toString()
        }
    }

    updateScoreDisplay() {
        const elm: HTMLElement | null = document.querySelector<HTMLElement>('#score-block>.info')

        if (elm) {
            elm.textContent = this.total_score.toString()
        }
    }

    updateTimeDisplay() {
        const elm: HTMLElement | null = document.querySelector<HTMLElement>('#time-block>.info')

        if (elm) {
            elm.textContent = convertTicksToTime(this.cur_tick, this.tick_interval)
        }
    }

    updateTimeLimDisplay() {
        const elm: HTMLElement | null = document.querySelector<HTMLElement>('#time-lim-block>.info')

        if (elm) {
            elm.textContent = convertTicksToTime(this.cur_time_lim / this.tick_interval, this.tick_interval)
        }
    }

    calcTimeReward() {
        const time_lim_tick_num: number = this.cur_time_lim / this.tick_interval
        const tick_per_second: number = 1000 / this.tick_interval

        if (this.cur_tick < time_lim_tick_num) {
            this.total_score += Math.ceil(
                Math.abs(
                    Math.floor(time_lim_tick_num / tick_per_second) - Math.floor(this.cur_tick / tick_per_second)
                ) * this.time_reward_multiplier
            )
        }
    }


    private hookOnClickingNumHexTile(num_hex_tile: NumHexTile) {
        this.mine_board.pushRevealedHexTile(num_hex_tile)
        this.total_score += num_hex_tile.num * this.number_hex_tile_reward_multiplier + this.blank_hex_tile_reward
        this.updateScoreDisplay()
        this.judgeFinish()
    }

    private hookOnClickingHexTile(hex_tile: AbstractHexTile) {
        if (hex_tile.isClickable()) {
            hex_tile.click()

            if (hex_tile.type === TileType.MINE && hex_tile instanceof MineHexTile) {
                this.mine_board.pushDetonatedMine(hex_tile)
                this.total_score += this.mine_detonated_penalty
                this.updateScoreDisplay()
                this.updateMineNumDisplay()
                this.judgeFinish()
            } else if (hex_tile.type === TileType.NUMBER && hex_tile instanceof NumHexTile) {
                this.hookOnClickingNumHexTile(hex_tile)
            } else if (hex_tile.type === TileType.BLANK && hex_tile instanceof BlankHexTile) {
                const num_hex_tile_list: NumHexTile[] = this.mine_board.expandBlanks(hex_tile)

                for (const num_hex_tile of num_hex_tile_list) {
                    if (num_hex_tile.isClickable()) {
                        num_hex_tile.click()
                        this.hookOnClickingNumHexTile(num_hex_tile)
                    }
                }

                this.updateScoreDisplay()
                this.updateMineNumDisplay()
                this.judgeFinish()
            }
        }
    }

    private hookOnUnsettingFlag(hex_tile: AbstractHexTile) {
        hex_tile.unsetFlag()
        this.mine_board.marked_mine_cnt -= 1
    }

    private hookOnSettingFlag(hex_tile: AbstractHexTile) {
        hex_tile.setFlag()
        this.mine_board.marked_mine_cnt += 1
    }

    private tick() {
        if (this.cur_tick % Math.floor(1000 / this.tick_interval) === 0) {
            this.updateTimeDisplay()
        }

        if (this.cur_tick % Math.floor((this.hint_gen_interval - this.hint_gen_interval_compensation) / this.tick_interval) === 0) {
            this.mine_board.createHint()
        }

        if (
            this.cur_tick % Math.floor((this.moving_rat_gen_interval - this.moving_rat_gen_interval_compensation) / this.tick_interval) === 0 &&
            this.cur_tick != 0
        ) {
            const rnd: number = rollRange(1, 12)
            let new_moving_rat: AbstractMovingRat | null = null

            if (rnd <= 9) {
                new_moving_rat = createMovingRat(RatType.LIL_RAT, this.mine_board.selectTargetHexTiles(false))
            } else {
                new_moving_rat = createMovingRat(RatType.BIG_RAT, this.mine_board.selectTargetHexTiles(true))
            }

            if (new_moving_rat) {
                new_moving_rat.getElm().addEventListener('click', () => {
                    new_moving_rat?.onClick()
                })
                this.moving_rat_list.push(new_moving_rat)
                this.mine_board.getElm().appendChild(new_moving_rat.getElm())
            }
        }

        this.cur_tick += 1
    }

    private tickMovingRats() {
        if (this.moving_rat_list.length !== 0) { return }

        for (let i = this.moving_rat_list.length - 1; i >= 0; i -= 1) {
            this.moving_rat_list[i].run(this.moving_rat_timer_tick_interval)

            if (this.moving_rat_list[i].isDone()) {
                for (const target_hex_tile of this.moving_rat_list[i].getTargetHexTileList()) {
                    if (target_hex_tile.getSurfaceType() === TileSurfaceType.FLAG) {
                        this.hookOnUnsettingFlag(target_hex_tile)
                    }

                    this.hookOnClickingHexTile(target_hex_tile)
                }
                this.moving_rat_list.splice(i, 1)
            }
        }
    }

    private tickHints() {
        if (this.hint_list.length === 0) { return }

        for (let i = this.hint_list.length - 1; i >= 0; i -= 1) {
            this.hint_list[i].activate()

            if (this.hint_list[i].isDone()) {
                this.hint_list.splice(i, 1)
            }
        }
    }

    initTimers() {
        this.main_timer = window.setInterval(this.tick, this.tick_interval)
        this.moving_rat_timer = window.setInterval(this.tickMovingRats, this.moving_rat_timer_tick_interval)
        this.hint_timer = window.setInterval(this.tickHints, HexTileHint.TICK_INTERVAL)
    }

    clearTimers() {
        window.clearInterval(this.main_timer)
        window.clearInterval(this.moving_rat_timer)
        window.clearInterval(this.hint_timer)
    }

    clearLevel() {
        this.clearTimers()
        this.mine_board.init()
        this.cur_tick = 0
        this.moving_rat_list = []
        this.hint_list = []
        this.updateMineNumDisplay()
        this.updateScoreDisplay()
        this.updateTimeDisplay()
        this.updateTimeLimDisplay()
    }

    judgeFinish() {
        if (this.mine_board.getRevealedHexTileNum() === this.mine_board.getHexTileNum() - this.mine_board.getMineNum()) {
            this.total_score += (this.mine_board.getMineNum() - this.mine_board.getDetonatedMineNum()) * this.mine_swept_reward
            this.calcTimeReward()
            this.updateScoreDisplay()
            this.updateMineNumDisplay()
            this.clearLevel()
        }
    }

    private processAfterFirstClick(origin_hex_tile: AbstractHexTile) {
        this.mine_board.genMines(this.mine_set_num, origin_hex_tile)
        this.mine_board.markNum()
        this.initTimers()
    }

    private bindHexTileMouseDownEvent(hex_tile: AbstractHexTile, button: number) {
        if (this.mine_board.isBlankBoard()) {
            this.processAfterFirstClick(hex_tile)
        }

        if (
            hex_tile.type === TileType.NUMBER &&
            hex_tile instanceof NumHexTile &&
            hex_tile.getSurfaceType() === TileSurfaceType.REVEALED
        ) {
            switch (button) {
                case 0:
                case 2:
                    this.mine_board.hoverOn(hex_tile)
                    break
                default:
                    break
            }
        } else {
            switch (button) {
                case 0:
                    this.hookOnClickingHexTile(hex_tile)
                    break
                case 2:
                    if (!hex_tile.isFlagSettable()) { return }

                    if (hex_tile.getSurfaceType() === TileSurfaceType.FLAG) {
                        this.hookOnUnsettingFlag(hex_tile)
                    } else if (hex_tile.isClickable()) {
                        this.hookOnSettingFlag(hex_tile)

                    }

                    this.updateMineNumDisplay()
                    this.judgeFinish()

                    break
                default:
                    break
            }
        }
    }

    private bindHexTileMouseUpEvent(hex_tile: AbstractHexTile, button: number) {
        if (
            hex_tile.getSurfaceType() !== TileSurfaceType.REVEALED ||
            !(hex_tile.type === TileType.NUMBER && hex_tile instanceof NumHexTile)
        ) { return }

        switch (button) {
            case 0:
            case 2:
                if (this.mine_board.isHexTileHoverCenter(hex_tile.getId())) {
                    this.mine_board.releaseHover(hex_tile)
                    this.mine_board.infer(hex_tile)
                }
                break
            default:
                break
        }
    }

    private bindHexTileMouseLeaveEvent(hex_tile: AbstractHexTile, button: number) {
        if (
            hex_tile.getSurfaceType() !== TileSurfaceType.REVEALED ||
            !(hex_tile.type === TileType.NUMBER && hex_tile instanceof NumHexTile)
        ) { return }

        switch (button) {
            case 0:
            case 2:
                if (this.mine_board.isHexTileHoverCenter(hex_tile.getId())) {
                    this.mine_board.releaseHover(hex_tile)
                }
                break
            default:
                break
        }
    }

    private bindHexTileEvents() {
        for (const hex_tile of this.mine_board.getHexTiles()) {
            const hex_tile_elm = hex_tile.getElm()

            hex_tile_elm.addEventListener('mousedown', (evt: MouseEvent) => {
                this.bindHexTileMouseDownEvent(hex_tile, evt.button)
            })
            hex_tile_elm.addEventListener('mouseup', (evt: MouseEvent) => {
                this.bindHexTileMouseUpEvent(hex_tile, evt.button)
            })
            hex_tile_elm.addEventListener('mouseleave', (evt: MouseEvent) => {
                this.bindHexTileMouseLeaveEvent(hex_tile, evt.button)
            })
        }
    }

    init() {
        this.mine_board.init()
        this.cur_tick = 0
        this.total_score = 0
        this.moving_rat_list = []
        this.hint_list = []
        this.updateMineNumDisplay()
        this.updateScoreDisplay()
        this.updateTimeDisplay()
        this.updateTimeLimDisplay()
        this.mine_board.genBlankBoard()
        this.mine_board.render()
        this.bindHexTileEvents()
    }

    flyLeci() {
        const LECI_IMG_LIST: string[] = [LECI_IMG_0, LECI_IMG_1, LECI_IMG_2, LECI_IMG_3]
        const leci_elm: HTMLImageElement = document.querySelector<HTMLImageElement>('#leci')!
        let leci_tick_cnt: number = 0
        let pos_tick_cnt: number = 1
        let total_pos_tick_cnt: number = 0
        const pos_dict: { left_list: number[], top_list: number[], angle_list: number[] } = {
            left_list: [0, 700, 1300, 700],
            top_list: [500, 1000, 500, 0],
            angle_list: [-45, -135, -225, -315]
        }

        const leci_timer: number = window.setInterval(() => {
            leci_elm.src = LECI_IMG_LIST[leci_tick_cnt]
            leci_tick_cnt += 1
            leci_tick_cnt %= 4

        }, 20)
        const pos_timer: number = window.setInterval(() => {
            leci_elm.removeAttribute('style')
            leci_elm.style.left = `${pos_dict.left_list[pos_tick_cnt]}px`
            leci_elm.style.top = `${pos_dict.top_list[pos_tick_cnt]}px`
            leci_elm.style.transform = `rotate(${pos_dict.angle_list[pos_tick_cnt]}deg)`
            pos_tick_cnt += 1
            pos_tick_cnt %= 4
            total_pos_tick_cnt += 1

            if (total_pos_tick_cnt === 4 * 10) {
                window.clearInterval(leci_timer)
                window.clearInterval(pos_timer)
            }
        }, 3000)
    }
}

export { RatMineGame }
