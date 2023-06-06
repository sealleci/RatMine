import { removeElmChildren } from '@/ts/dom.ts'
import { HEX_DIRECTION_LIST, HexVector, PlaneVector, convertHexVectorToPlaneVector } from '@/ts/geometry.ts'
import { AbstractHexTile, BlankHexTile, HexTileHint, HexTileList, MineHexTile, NumHexTile, TileSurfaceType, TileType } from '@/ts/tile.ts'
import { rollRange } from '@/ts/util.ts'

class MineBoard {
    accessor size: number // The number of hex tiles on a radius of the board.
    private hex_tile_list: HexTileList
    private mine_hex_tile_list: HexTileList<MineHexTile>
    private number_hex_tile_list: HexTileList<NumHexTile>
    private detonated_hex_tile_list: HexTileList<MineHexTile>
    private revealed_hex_tile_list: HexTileList
    private hover_center_hex_tile_list: HexTileList
    private vine_hex_tile_list: HexTileList
    accessor marked_mine_cnt: number // The number of marked mines, which is same as the number of flags.
    private elm: HTMLElement

    constructor(size: number) {
        this.size = size
        this.hex_tile_list = new HexTileList()
        this.mine_hex_tile_list = new HexTileList<MineHexTile>()
        this.number_hex_tile_list = new HexTileList<NumHexTile>()
        this.detonated_hex_tile_list = new HexTileList<MineHexTile>()
        this.revealed_hex_tile_list = new HexTileList()
        this.hover_center_hex_tile_list = new HexTileList()
        this.vine_hex_tile_list = new HexTileList()
        this.marked_mine_cnt = 0
        this.elm = document.querySelector('#mine-field')!
    }

    findHexTile(hex_tile_id: string): AbstractHexTile | undefined {
        return this.hex_tile_list.getById(hex_tile_id)
    }

    isHexTileHoverCenter(hex_tile_id: string): boolean {
        return this.hover_center_hex_tile_list.findIdx(hex_tile_id) !== -1
    }

    isBlankBoard(): boolean {
        return this.mine_hex_tile_list.getLen() === 0
    }

    pushDetonatedMine(mine_hex_tile: MineHexTile) {
        this.detonated_hex_tile_list.push(mine_hex_tile)
    }

    pushRevealedHexTile(hex_tile: AbstractHexTile) {
        this.revealed_hex_tile_list.push(hex_tile)
    }

    getElm(): HTMLElement {
        return this.elm
    }

    init() {
        this.hex_tile_list.clear()
        this.mine_hex_tile_list.clear()
        this.number_hex_tile_list.clear()
        this.detonated_hex_tile_list.clear()
        this.revealed_hex_tile_list.clear()
        this.hover_center_hex_tile_list.clear()
        this.vine_hex_tile_list.clear()
        this.marked_mine_cnt = 0
        removeElmChildren(this.elm)
    }

    getHexTiles(): AbstractHexTile[] {
        return this.hex_tile_list.clone()
    }

    getHexTileNum(): number {
        return this.hex_tile_list.getLen()
    }

    getRevealedHexTileNum(): number {
        this.revealed_hex_tile_list.unique()
        return this.revealed_hex_tile_list.getLen()
    }

    getDetonatedMineNum(): number {
        this.detonated_hex_tile_list.unique()
        return this.detonated_hex_tile_list.getLen()
    }

    getNormalSurfaceHexTiles(): AbstractHexTile[] {
        const normal_hex_tile_list: AbstractHexTile[] = []

        for (const hex_tile of this.hex_tile_list) {
            if (hex_tile.getSurfaceType() === TileSurfaceType.NORMAL) {
                normal_hex_tile_list.push(hex_tile)
            }
        }

        return normal_hex_tile_list
    }

    getFlagHexTiles(): AbstractHexTile[] {
        const flag_hex_tile_list: AbstractHexTile[] = []

        for (const hex_tile of this.hex_tile_list) {
            if (hex_tile.isHaveFlag()) {
                flag_hex_tile_list.push(hex_tile)
            }
        }

        return flag_hex_tile_list
    }

    getMineNum(): number {
        return this.mine_hex_tile_list.getLen()
    }

    /**
     * Generate a mine board by BFS.
     */
    genBlankBoard() {
        const center_hex_pos: PlaneVector = new PlaneVector(
            -(AbstractHexTile.HEX_TILE_RADIUS * Math.sqrt(3) / 2),
            (AbstractHexTile.HEX_TILE_RADIUS + AbstractHexTile.HEX_TILE_SPACING) * 1.5 * this.size
        )
        const center_hex_tile: AbstractHexTile = new BlankHexTile(0, 0, 0, center_hex_pos.x, center_hex_pos.y, 0)
        const hex_tile_queue: AbstractHexTile[] = []
        const hex_tile_visited_dict: Record<string, boolean> = {} // Determine whether a hex tile has been visited or not.

        function isHexTileVisited(hex_tile_id: string): boolean {
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

            this.hex_tile_list.push(cur_hex_tile)

            for (const hex_direction of HEX_DIRECTION_LIST) {
                const hex_pos: HexVector = cur_hex_tile.hex_coord.plus(hex_direction)

                if (!isHexTileVisited(hex_pos.getId())) {
                    const step: number = cur_hex_tile.step + 1

                    if (step <= this.size) {
                        const plane_pos: PlaneVector = cur_hex_tile.plane_coord.plus(
                            convertHexVectorToPlaneVector(hex_direction, AbstractHexTile.HEX_TILE_RADIUS)
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
    getSafeTiles(origin_hex_tile: AbstractHexTile): HexTileList {
        const safe_hex_tile_list: HexTileList = new HexTileList()
        const cur_hex_pos: HexVector = origin_hex_tile.hex_coord
        const rnd_direction_idx: number = rollRange(0, HEX_DIRECTION_LIST.length - 1)
        const opposite_direction_idx: number = (rnd_direction_idx + Math.floor(HEX_DIRECTION_LIST.length / 2)) % HEX_DIRECTION_LIST.length
        const extra_expanded_num: number = 2
        let cur_expanded_cnt: number = 0

        // Iterate the 6 directions from the origin hex tile.
        for (let i = 0; i < HEX_DIRECTION_LIST.length; i += 1) {
            let tmp_hex_pos: HexVector = cur_hex_pos

            // On each direction, step forward for the curtain expanded number.
            for (let j = 0; j < extra_expanded_num; j += 1) {
                tmp_hex_pos = tmp_hex_pos.plus(HEX_DIRECTION_LIST[i])

                const tmp_hex_tile: AbstractHexTile | undefined = this.hex_tile_list.getById(tmp_hex_pos.getId())

                if (tmp_hex_tile && tmp_hex_tile.isClickable()) {
                    safe_hex_tile_list.push(tmp_hex_tile)
                }

                // If the current direction is the selected random direction or
                // the opposite one, expand extra 2 hex tiles.
                if (
                    cur_expanded_cnt < extra_expanded_num &&
                    (i === rnd_direction_idx || i === opposite_direction_idx) &&
                    j === 0
                ) {
                    const extra_direction_idx_list: number[] = [
                        (i + 1) % HEX_DIRECTION_LIST.length,
                        (i + HEX_DIRECTION_LIST.length - 1) % HEX_DIRECTION_LIST.length
                    ]

                    cur_expanded_cnt += 1

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

    genMines(mine_num: number, origin_hex_tile: AbstractHexTile) {
        const rnd_list: number[] = []
        const safe_hex_tile_list: HexTileList = this.getSafeTiles(origin_hex_tile)

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

    getHoverAdjacentTiles(origin_hex_tile: AbstractHexTile, is_choose_flag_settable: boolean = false): HexTileList {
        const hover_hex_tile_list: HexTileList = new HexTileList()
        const cur_hex_pos: HexVector = origin_hex_tile.hex_coord

        for (const hex_direction of HEX_DIRECTION_LIST) {
            const tmp_hex_pos: HexVector = cur_hex_pos.plus(hex_direction)
            const tmp_hex_tile: AbstractHexTile | undefined = this.hex_tile_list.getById(tmp_hex_pos.getId())

            if (tmp_hex_tile) {
                if (!is_choose_flag_settable) { // Choose the clickable hex tiles.
                    if (tmp_hex_tile.isClickable()) {
                        hover_hex_tile_list.push(tmp_hex_tile)
                    }
                } else { // Choose the hex tiles that can be set or unset flag.
                    if (tmp_hex_tile.isFlagSettable()) {
                        hover_hex_tile_list.push(tmp_hex_tile)
                    }
                }
            }
        }

        return hover_hex_tile_list
    }

    releaseHover(origin_hex_tile: NumHexTile) {
        this.hover_center_hex_tile_list.unique()

        if (
            origin_hex_tile.getSurfaceType() !== TileSurfaceType.REVEALED ||
            this.hover_center_hex_tile_list.findIdx(origin_hex_tile.getId()) === -1
        ) { return }

        const hover_hex_tile_list: HexTileList = this.getHoverAdjacentTiles(origin_hex_tile)

        origin_hex_tile.removeElmClass('hex-active-press')

        for (const hover_hex_tile of hover_hex_tile_list) {
            hover_hex_tile.removeElmClass('hex-hover')
        }

        this.hover_center_hex_tile_list.removeById(origin_hex_tile.getId())
    }

    hoverOn(origin_hex_tile: NumHexTile) {
        if (
            origin_hex_tile.getSurfaceType() !== TileSurfaceType.REVEALED
        ) { return }

        const hover_hex_tile_list: HexTileList = this.getHoverAdjacentTiles(origin_hex_tile)

        this.hover_center_hex_tile_list.push(origin_hex_tile)
        origin_hex_tile.addElmClass('hex-active-press')

        for (const hover_hex_tile of hover_hex_tile_list) {
            hover_hex_tile.addElmClass('hex-hover')
        }
    }

    render() {
        for (const hex_tile of this.hex_tile_list) {
            this.elm.appendChild(hex_tile.getElm())
        }
    }

    createHint(): HexTileHint | null {
        const rnd_list: number[] = []

        for (let i = 0; i < this.mine_hex_tile_list.getLen(); i += 1) {
            const mine_hex_tile: AbstractHexTile | undefined = this.mine_hex_tile_list.getByIdx(i)

            if (
                mine_hex_tile &&
                !mine_hex_tile.isHaveFlag() &&
                mine_hex_tile.isClickable()
            ) {
                rnd_list.push(i)
            }
        }

        if (rnd_list.length > 0) {
            const rnd_idx: number = rollRange(0, rnd_list.length - 1)
            const rnd_hex_tile: AbstractHexTile | undefined = this.mine_hex_tile_list.getByIdx(rnd_list[rnd_idx])

            if (rnd_hex_tile) {
                return new HexTileHint(rnd_hex_tile)
            }
        }

        return null
    }

    selectTargetHexTiles(is_include_hover_tiles: boolean = false): AbstractHexTile[] {
        const candidate_hex_tile_list: AbstractHexTile[] = this.getNormalSurfaceHexTiles().concat(this.getFlagHexTiles())
        const selected_hex_tile_list: AbstractHexTile[] = []
        const rnd_idx: number = rollRange(0, candidate_hex_tile_list.length - 1)
        const center_hex_tile: AbstractHexTile = candidate_hex_tile_list[rnd_idx]

        selected_hex_tile_list.push(center_hex_tile)

        if (is_include_hover_tiles) {
            for (const hover_hex_tile of this.getHoverAdjacentTiles(center_hex_tile, true)) {
                selected_hex_tile_list.push(hover_hex_tile)
            }
        }

        return selected_hex_tile_list
    }

    revealAll() {
        for (const mine_hex_tile of this.mine_hex_tile_list) {
            mine_hex_tile.setElmText('鼠雷')
            mine_hex_tile.addElmClass('hex-active')
        }
    }
}

export { MineBoard }
