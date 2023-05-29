import { PlainCoordinate, HexCoordinate } from '@/utils/geometry.ts'

enum TileType {
    EMPTY = 'empty',
    NUMBER = 'number',
    MINE = 'mine'
}

enum TileSurfaceType {
    NORMAL = 'normal',
    REVEALED = 'revealed',
    FLAG = 'flag',
    VINE = 'vine'
}

class HexTile {
    public readonly hex_coordinate: HexCoordinate
    public readonly plain_coordinate: PlainCoordinate
    public readonly step: number // Steps from the center hex tile.
    public readonly tile_type: TileType
    public tile_surface_type: TileSurfaceType
    public is_vine: boolean // Determine whether the tile has vine or not
    private readonly elm: HTMLElement

    constructor(hex_x: number, hex_y: number, hex_z: number, plain_x: number, plain_y: number, step: number) {
        this.hex_coordinate = new HexCoordinate(hex_x, hex_y, hex_z)
        this.plain_coordinate = new PlainCoordinate(plain_x, plain_y)
        this.step = step
        this.tile_type = TileType.EMPTY
        this.tile_surface_type = TileSurfaceType.NORMAL
        this.is_vine = false
        this.elm = document.createElement('div')
    }

    setFlag() {

    }

    unsetFlag() { }

    click() { }

    isClickable(): boolean {
        return true
    }

    render(base: number, size: number = 0) {
        const new_hex_elm: HTMLElement = document.createElement('div')

        new_hex_elm.className = 'hex'
        new_hex_elm.style.height = `${base * 2}px`
        new_hex_elm.style.width = `${base * Math.sqrt(3)}px`
        new_hex_elm.style.left = `${this.plain_coordinate.x}px`
        new_hex_elm.style.top = `${this.plain_coordinate.y}px`
        new_hex_elm.setAttribute('hex_id', this.hex_coordinate.getMappingId(size))

        document.querySelector('#mine-field')?.appendChild(new_hex_elm)
    }
}

class HexTileHint {
    constructor(id) {
        this.id = id;
        this.idx = hexs_mp.indexOf(this.id);
        this.cnt = 0;
        this.finished = false;
    }

    activate() {
        if (this.cnt >= hint_long / hint_tick_intv || hexs[this.idx].surface != 0) {
            $(`#${this.id}`).removeClass('hex-shake');
            this.finished = true;
        } else {
            this.cnt++;
        }
    }
}

interface MineBoardInfo {
    size: number
    base: number
}

class MineBoard {
    public size: number
    public base: number

    constructor(size: number, base: number) {
        this.size = size
        this.base = base
    }

    getMineBoardInfo(): MineBoardInfo {
        return {
            size: this.size,
            base: this.base
        }
    }

    /**
     * Generate a mine board with the given size.
     */
    bfs(plain_x: number, plain_y: number, size: number) {
        let cent = new HexTile(0, 0, 0, plain_x, plain_y, 0);
        let q = [];
        let cells = [];
        let map = {};

        q.push(cent);
        map[cent.hexc.mapping(size)] = 1;

        while (q.length != 0) {
            let t = q.shift();
            cells.push(t);
            t.draw(base);

            for (let i in hex_dirs) {
                let hexc = t.hexc.plus(hex_dirs[i]);

                if (!isin(hexc, map)) {
                    let step = t.step + 1;

                    if (step <= size) {
                        map[hexc.mapping(size)] = 1;

                        let plnc = t.plnc.plus(plain_dirs[i]);
                        q.push(new HexTile(hexc.x, hexc.y, hexc.z, plnc.x, plnc.y, step));
                    }
                }
            }
        }

        return cells;
    }
}

export type { MineBoardInfo }
export { TileType, TileSurfaceType }
export { HexTile, HexTileHint, MineBoard }
