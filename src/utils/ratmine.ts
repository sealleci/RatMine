import { MineBoard } from "@/utils/tile.ts"

class Game {
    private mine_board: MineBoard
    accessor mine_num: number

    constructor() {
        this.mine_board = new MineBoard(6)
        this.mine_num = 10
    }

    init() { }

    initTimers() {

    }

    processAfterFirstClick(first_hex_tile_id: string) {
        this.mine_board.generateMines(this.mine_num, first_hex_tile_id)
        this.mine_board.signNum()
        this.initTimers()
    }

    render() {
        this.mine_board.generateBlankBoard(0, 0)

        for (const hex_tile of this.mine_board.hex_tile_list) {
            const hex_tile_elm = hex_tile.getElm()

            if (!hex_tile_elm) { continue }

            hex_tile_elm.addEventListener('mousedown', () => {
                if (this.mine_board.isBlankBoard()) {
                    this.processAfterFirstClick(hex_tile.getId())
                }
            })
            hex_tile_elm.addEventListener('mouseup', () => {

            })
            hex_tile_elm.addEventListener('mouseleave', () => {

            })

            // document.querySelector('#mine-field')?.appendChild(new_hex_elm)
        }
    }
}

export { Game }
