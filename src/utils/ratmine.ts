import { MineBoard, MineHexTile, NumHexTile, TileSurfaceType, TileType } from "@/utils/tile.ts"

class Game {
    private mine_board: MineBoard
    accessor mine_num: number

    constructor() {
        this.mine_board = new MineBoard(6)
        this.mine_num = 10
    }

    init() {
        initGlobalVars()
        this.updateMinesInfo()
        this.updateScoreInfo()
        this.updateTimeInfo()
        this.setTimeLimInfo()

        this.mine_board.init()
    }

    initTimers() {

    }

    updateMinesInfo() {
        const elm: HTMLElement | null = document.querySelector('#mine-block>.info')

        if (elm) {
            elm.textContent = (mine_num - cur_mines - deaths_mp.length).toString()
        }
    }

    updateScoreInfo() {
        const elm: HTMLElement | null = document.querySelector('#score-block>.info')

        if (elm) {
            elm.textContent = total_score.toString()
        }
    }

    updateTimeInfo() {
        const elm: HTMLElement | null = document.querySelector('#time-block>.info')

        if (elm) {
            elm.textContent = calcTime(cur_time, intv)
        }
    }

    setTimeLimInfo() {
        const elm: HTMLElement | null = document.querySelector('#time-lim-block>.info')

        if (elm) {
            elm.textContent = calcTime(time_lim / intv, intv)
        }
    }

    processAfterFirstClick(origin_hex_tile_id: string) {
        this.mine_board.genMines(this.mine_num, origin_hex_tile_id)
        this.mine_board.markNum()
        this.initTimers()
    }

    bind() {
        for (const hex_tile of this.mine_board.getHexTiles()) {
            const hex_tile_elm = hex_tile.getElm()

            if (!hex_tile_elm) { continue }

            hex_tile_elm.addEventListener('mousedown', () => {
                if (this.mine_board.isBlankBoard()) {
                    this.processAfterFirstClick(hex_tile.getId())
                }

                hex_tile.click()

                if (hex_tile instanceof MineHexTile) {
                    total_score += mine_penalty
                    updateScoreInfo()
                    updateMinesInfo()
                    judgeFinish()
                } else if (hex_tile instanceof NumHexTile) {
                    total_score += nums_dic[id] * number_reward + space_reward
                    updateScoreInfo()
                    judgeFinish()
                }
            })
            hex_tile_elm.addEventListener('mouseup', (evt: MouseEvent) => {
                if (
                    hex_tile.getSurfaceType() !== TileSurfaceType.REVEALED ||
                    hex_tile.type !== TileType.NUMBER
                ) { return }

                switch (evt.button) {
                    case 0:
                    case 2:
                        if (this.mine_board.isHexTileHoverCenter(hex_tile.getId())) {
                            hoverRelease(id)
                            inferArea(id)
                        }
                        break
                    default:
                        break
                }
            })
            hex_tile_elm.addEventListener('mouseleave', () => {
                if (
                    hex_tile.getSurfaceType() !== TileSurfaceType.REVEALED ||
                    hex_tile.type !== TileType.NUMBER
                ) { return }

                switch (evt.button) {
                    case 0:
                    case 2:
                        if (this.mine_board.isHexTileHoverCenter(hex_tile.getId())) {
                            hoverRelease(id)
                        }
                        break
                    default:
                        break
                }
            })

            // document.querySelector('#mine-field')?.appendChild(new_hex_elm)
        }
    }

    render() {
        this.mine_board.genBlankBoard(0, 0)
        this.bind()
    }

    tick() {
        if (cur_time % Math.floor(1000 / intv) == 0) {
            updateTimeInfo()
        }
        if (cur_time % Math.floor((hint_intv - hint_intv_corr) / intv) == 0) { //&& cur_time != 0
            genHint()
        }

        if (cur_time % Math.floor((rat_intv - rat_intv_corr) / intv) == 0 && cur_time != 0) {
            let rnd = rangeRnd(1, 12)
            if (rnd <= 9) {
                genRat(0)
            } else {
                genRat(1)
            }

        }
        cur_time += 1
    }
}


export { Game }
