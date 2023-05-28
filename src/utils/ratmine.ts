import { PlainCoordinate, HexCoordinate } from '@/utils/geometry.ts'

enum TileType {
    EMPTY = 'empty',
    NUMBER = 'number',
    MINE = 'mine'
}

enum TileSurface {
    NORMAL = 'normal',
    ACTIVE = 'active',
    FLAG = 'flag',
    VINE = 'vine'
}

/**
 * 六边形格子
 */
class Hex {
    public hex_coordinate: HexCoordinate
    public plain_coordinate: PlainCoordinate
    public step: number
    public tile_type: TileType
    public tile_surface: TileSurface
    public is_vine: boolean // 有无藤蔓

    constructor(hex_x: number, hex_y: number, hex_z: number, plain_x: number, plain_y: number, step: number) {
        this.hex_coordinate = new HexCoordinate(hex_x, hex_y, hex_z)
        this.plain_coordinate = new PlainCoordinate(plain_x, plain_y)
        this.step = step
        this.tile_type = TileType.EMPTY
        this.tile_surface = TileSurface.NORMAL
        this.is_vine = false
    }

    render(base: number, size: number = 0) {
        const new_hex_elm = document.createElement('div')

        new_hex_elm.className = 'hex'
        new_hex_elm.style.height = `${base * 2}px`
        new_hex_elm.style.width = `${base * Math.sqrt(3)}px`
        new_hex_elm.style.left = `${this.plain_coordinate.x}px`
        new_hex_elm.style.top = `${this.plain_coordinate.y}px`
        new_hex_elm.setAttribute('hex_id', this.hex_coordinate.getMappingId(size))

        document.querySelector('#mine-field')?.appendChild(new_hex_elm)
    }
}

class HexHint {
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
