//类
class HexCoord { //六边形座标
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    plus(coord) {
        return new HexCoord(this.x + coord.x, this.y + coord.y, this.z + coord.z);
    }
    equal(coord) {
        if (this.x == coord.x &&
            this.y == coord.y &&
            this.z == coord.z) {
            return true;
        } else {
            return false;
        }
    }
    mapping(size) {
        return (this.x + size) * 10000 + (this.y + size) * 100 + (this.z + size);
    }
    toString() {
        return `(${this.x}, ${this.y}, ${this.z})`
    }
}

class PlainCoord { //平面座标
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    plus(coord) {
        return new PlainCoord(this.x + coord.x, this.y + coord.y);
    }
    dot(coord) {
        return this.x * coord.x + this.y * coord.y;
    }
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

class Hex { //六边形格子
    constructor(x, y, z, px, py, step) {
        this.hexc = new HexCoord(x, y, z);
        this.plnc = new PlainCoord(px, py);
        this.step = step;
        this.type = 0; //0空，1数字，2雷
        this.surface = 0; //0普通，1激活，2旗子，3藤蔓
        this.vine = 0; //0无藤蔓，1有藤蔓
    }
    draw(base) {
        let $hex_ele = $(`<div class="hex" id="${this.hexc.mapping(size)}"></div>`);
        $($hex_ele).css({
            'height': `${base*2}px`,
            'width': `${base*sqrt3}px`,
            'left': `${this.plnc.x}px`,
            'top': `${this.plnc.y}px`
        });
        $('#mine-field').append($($hex_ele));
    }
}

class Rat {
    constructor(type, speed, tar_hexs, spawn, hihexs, ele) {
        this.type = type;
        this.speed = speed;
        this.tar_hexs = tar_hexs;
        this.spawn = spawn;
        this.hihexs = hihexs;
        this.ele = ele;
        this.dist = new PlainCoord(
            this.tar_hexs[0].plnc.x - this.spawn.x + base - $(this.ele).find('img').width() / 2,
            this.tar_hexs[0].plnc.y - this.spawn.y + base - $(this.ele).find('img').height() / 2
        );
        //console.log(this.ele);
        this.center_hex = this.tar_hexs[0];
        this.cosx = this.dist.x / Math.sqrt(Math.pow(this.dist.x, 2) + Math.pow(this.dist.y, 2));
        this.siny = this.dist.y / Math.sqrt(Math.pow(this.dist.x, 2) + Math.pow(this.dist.y, 2));
        this.cnt = 0;
        this.finished = false;
        this.pre_clicked = -1;
        //console.log(this.cosx, this.siny)
        // console.log('tar', this.tar_hexs[0].plnc.x, this.tar_hexs[0].plnc.y);
        // console.log('spawn', this.spawn.x, this.spawn.y);
        // console.log('dist', this.dist.x, this.dist.y);
    }

    click() {
        for (let i in this.tar_hexs) {
            let t_id = this.tar_hexs[i].hexc.mapping(size);
            if (this.tar_hexs[i].surface == 2) {
                unsetFlag(t_id);
            }
            if (isClickable(t_id)) {
                clickCell(t_id);
            }
        }

    }

    remove() {
        for (let i in this.hihexs) {
            $(this.hihexs[i]).remove();
        }
        $(this.ele).remove();
    }

    isArrived(cur_p) {
        let img = this.ele.find('img');
        if (Math.abs(cur_p.x + $(img).width() / 2 - this.center_hex.plnc.x - base) <= $(img).width() / 2 &&
            Math.abs(cur_p.y + $(img).height() / 2 - this.center_hex.plnc.y - base) <= $(img).height() / 2
        ) {
            return true;
        } else {
            return false;
        }
    }
    run(run_intv) {
        this.cnt++;

        let cur_p = new PlainCoord(
            this.spawn.x + (this.speed * this.cosx) * run_intv / 1000 * this.cnt,
            this.spawn.y + (this.speed * this.siny) * run_intv / 1000 * this.cnt
        );

        // console.log(this.cosx, this.siny);

        $(this.ele).css({
            'left': `${cur_p.x}px`,
            'top': `${cur_p.y}px`,
        });

        let remain_hexs = 0;
        for (let i in this.tar_hexs) {
            if (this.tar_hexs[i].surface != 1) {
                remain_hexs++;
            }
        }

        let clicked_flag = false;
        let cur_clicked = parseInt($(this.ele).data('clicked'));
        switch (this.type) {
            case 0:
                if (this.pre_clicked != cur_clicked) {
                    this.pre_clicked = cur_clicked;
                    $(this.ele).find('span').text(lilrat_clicks - cur_clicked);
                }
                if (cur_clicked >= lilrat_clicks) {
                    clicked_flag = true;
                }
                break;
            case 1:
                if (this.pre_clicked != cur_clicked) {
                    this.pre_clicked = cur_clicked;
                    $(this.ele).find('span').text(bigrat_clicks - cur_clicked);
                }
                if (cur_clicked >= bigrat_clicks) {
                    clicked_flag = true;
                }
                break;
            default:
                break;
        }
        if (remain_hexs == 0 || clicked_flag) {
            this.finished = true;
        }

        if (this.isArrived(cur_p)) {
            this.click();
            this.finished = true;
        }

        if (this.finished) {
            this.remove();
        }
    }
}

class Hint {
    constructor(id) {
        this.id = id;
        this.idx = hexs_mp.indexOf(this.id);
        this.cnt = 0;
        this.finished = false;
    }
    run() {
        if (this.cnt >= hint_long / hint_tick_intv || hexs[this.idx].surface != 0) {
            $(`#${this.id}`).removeClass('hex-shake');
            this.finished = true;
        } else {
            this.cnt++;
        }
    }
}

function bfs(px, py, size) { //生成棋盘
    let cent = new Hex(0, 0, 0, px, py, 0);
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
                    q.push(new Hex(hexc.x, hexc.y, hexc.z, plnc.x, plnc.y, step));
                }
            }
        }
    }

    return cells;
}

function getInitMineFreeArea(id) {
    let cells = [];
    let cur_cell = parseId(id, size);
    let ext = 2;
    let rnd_dir = rangeRnd(0, 5);
    let opp_dir = (rnd_dir + Math.floor(hex_dirs.length / 2)) % hex_dirs.length;
    let isfill = 0;
    for (let i in hex_dirs) {
        let t_cell = cur_cell;
        for (let j = 0; j < ext; ++j) {
            t_cell = t_cell.plus(hex_dirs[i]);
            let t_id = t_cell.mapping(size);
            let t_idx = hexs_mp.indexOf(t_id);
            if (t_idx != -1) {
                if (isClickable(t_id)) {
                    cells.push(t_id);
                }

            }
            let ii = parseInt(i);
            if (
                isfill < 2 &&
                (ii == rnd_dir || ii == opp_dir) &&
                j == 0
            ) {
                isfill++;
                let fdirs = [(ii + 1) % hex_dirs.length, (ii + 5) % hex_dirs.length];
                for (let k in fdirs) {
                    let f_cell = t_cell.plus(hex_dirs[fdirs[k]]);
                    let f_id = f_cell.mapping(size);
                    let f_idx = hexs_mp.indexOf(f_id);
                    if (f_idx != -1) {
                        if (isClickable(f_id)) {
                            cells.push(f_id);
                        }
                    }
                }
            }
        }
    }

    return cells;
}

function rndMines(cnt, id) { //随机雷
    let mask = [];
    let rnd_arr = [];
    let mine_hexs = [];
    let adj = getInitMineFreeArea(id);
    adj.push(id);
    // console.log(adj);
    for (let i = 0; i < hexs.length; ++i) {
        if (adj.indexOf(hexs[i].hexc.mapping(size)) == -1) {
            rnd_arr.push(i);
        }
    }

    for (let i = 0; i < cnt; ++i) {
        let rnd_i = rangeRnd(0, rnd_arr.length - 1);
        mine_hexs.push(hexs[rnd_arr[rnd_i]].hexc);
        hexs[rnd_arr[rnd_i]].type = 2;
        rnd_arr.splice(rnd_i, 1);
    }

    return mine_hexs;
}

function signNumber() { //标数字
    let num_map = {};

    for (let i in mines_mp) {
        for (let j in hex_dirs) {
            let t_hex_mp = hex_dirs[j].plus(
                parseId(mines_mp[i], size)
            ).mapping(size);

            if (hexs_mp.indexOf(t_hex_mp) != -1 &&
                mines_mp.indexOf(t_hex_mp) == -1
            ) {
                if (t_hex_mp in num_map) {
                    num_map[t_hex_mp] += 1;
                } else {
                    num_map[t_hex_mp] = 1;
                }
            }
        }
    }

    for (let i in num_map) {
        let idx = hexs_mp.indexOf(parseInt(i));

        if (idx != -1) {
            hexs[idx].type = 1;
        }
    }

    return num_map;
}

function clickMine(id) {
    hexs[hexs_mp.indexOf(id)].surface = 1;
    deaths_mp.push(id);

    //$(`#${id}`).text('鼠雷');
    $(`#${id}`).append(`<img src="./img/mine_death.svg"/>`);
    $(`#${id}>img`).css({
        'height': base * 1.5,
        'width': base * 1.5
    });
    $(`#${id}`).addClass('hex-death');

    total_score += mine_penalty;

    updateScoreInfo();
    updateMinesInfo();

    judgeFinish();
}

function clickNum(id) {
    hexs[hexs_mp.indexOf(id)].surface = 1;
    actives_mp.push(id);

    $(`#${id}`).text(nums_dic[id]);
    $(`#${id}`).addClass('hex-active');
    $(`#${id}`).css('color', num_colors[nums_dic[id] % 3]);

    total_score += nums_dic[id] * number_reward + space_reward;

    updateScoreInfo();

    judgeFinish();
}

function setFlag(id) {
    let idx = hexs_mp.indexOf(id);
    if (idx == -1) {
        return;
    }

    cur_mines++;

    flags_mp.push(id);

    hexs[idx].surface = 2;
    //$(`#${id}`).text('鼠旗');
    $(`#${id}`).append(`<img src="./img/flag.svg"/>`);
    $(`#${id}>img`).css({
        'height': base * 1.5,
        'width': base * 1.5
    });

    updateMinesInfo();

    judgeFinish();
}

function unsetFlag(id) {
    let idx = hexs_mp.indexOf(id);
    if (idx == -1) {
        return;
    }

    cur_mines--;

    let f_idx = flags_mp.indexOf(id);
    if (f_idx != -1) {
        flags_mp.splice(f_idx, 1);
    }

    hexs[idx].surface = 0;
    //$(`#${id}`).text('');
    $(`#${id}`).empty();

    updateMinesInfo();

    judgeFinish();
}

function expandSpaces(id) { //点空白扩展
    let chexc = parseId(id, size);
    let q = [];
    let map = {};

    q.push(chexc);
    map[chexc.mapping(size)] = 1;

    while (q.length != 0) {
        let t = q.shift();
        let mp = t.mapping(size);

        if (hexs[hexs_mp.indexOf(mp)].surface == 1) { //跳过点过的格子
            continue;
        } else {
            if (hexs[hexs_mp.indexOf(mp)].surface == 2) { //如果插着旗子，把旗子去掉，数值减减
                hexs[hexs_mp.indexOf(mp)].surface = 1;
                cur_mines -= 1;
            }

            if (nums_mp.indexOf(mp) != -1) { //如果是数值格子
                clickNum(mp);
                continue;
            } else { //空白格子
                $(`#${mp}`).text('');
                $(`#${mp}`).addClass('hex-active');
                hexs[hexs_mp.indexOf(mp)].surface = 1;
                total_score += space_reward;
                actives_mp.push(mp);
            }
        }

        for (let i in hex_dirs) { //向六个方向搜
            let hexc = t.plus(hex_dirs[i]);

            if (!isin(hexc, map)) {
                let t_mp = hexc.mapping(size);
                if (
                    hexs_mp.indexOf(t_mp) != -1 &&
                    mines_mp.indexOf(t_mp) == -1
                ) { //搜不是雷的格子
                    map[t_mp] = 1;
                    q.push(hexc);
                }
            }
        }
    }

    updateScoreInfo();
    updateMinesInfo();
    judgeFinish();
}

function clickCell(id) {
    if (!isClickable(id)) {
        return;
    }

    let idx = hexs_mp.indexOf(id);
    switch (hexs[idx].type) {
        case 0:
            expandSpaces(id);
            break;
        case 1:
            clickNum(id);
            break
        case 2:
            clickMine(id);
            break
        default:
            break;
    }
}

function hoverArea(id, isflag = false) {
    let cells = [];
    let cur_cell = parseId(id, size);

    for (let i in hex_dirs) {
        let t_cell = cur_cell.plus(hex_dirs[i]);
        let t_id = t_cell.mapping(size);
        let t_idx = hexs_mp.indexOf(t_id);

        if (t_idx != -1) { //&& isClickable(t_id)
            if (!isflag) {
                if (isClickable(t_id)) {
                    cells.push(t_cell);
                }
            } else {
                if (isFlagable(t_id)) {
                    cells.push(t_cell);
                }
            }
        }
    }

    return cells;
}

function inferArea(id) {
    let cells = [];
    let cur_cell = parseId(id, size);
    let num = nums_dic[id];
    let flags = 0; //周围雷数

    for (let i in hex_dirs) {
        let t_cell = cur_cell.plus(hex_dirs[i]);
        let t_map = t_cell.mapping(size);
        let t_idx = hexs_mp.indexOf(t_map);
        if (t_idx == -1) {
            continue;
        }

        if (isClickable(t_map)) { //装入周围可点击的
            cells.push(t_map);
        } else if (
            hexs[t_idx].surface == 2 ||
            (hexs[t_idx].surface == 1 &&
                hexs[t_idx].type == 2)
        ) { //表面有旗子，或是已被点开的雷，都算周围旗子数
            flags += 1;
        }
    }

    if (flags == num) {
        //周围旗子数等于格子上的数
        let is_click_mine = false;

        for (let i in cells) {
            let t_idx = hexs_mp.indexOf(cells[i]);

            if (!isClickable(cells[i])) {
                continue;
            }

            if (hexs[t_idx].type == 2) {
                is_click_mine = true;
            }
            clickCell(cells[i]);
        }

        if (is_click_mine) { //若点了雷
            let flag_cells = [];

            for (let i in hex_dirs) {
                let t_cell = cur_cell.plus(hex_dirs[i]);
                let t_map = t_cell.mapping(size);
                let t_idx = hexs_mp.indexOf(t_map);
                if (t_idx == -1) {
                    continue;
                }

                if (hexs[t_idx].surface == 2) { //装入周围 有旗帜的
                    flag_cells.push(t_map);
                }
            }

            for (let i in flag_cells) { //把错误的旗子翻开
                let t_idx = hexs_mp.indexOf(flag_cells[i]);

                switch (hexs[t_idx].type) {
                    case 0:
                        hexs[t_idx].surface = 1;
                        $(`#${flag_cells[i]}`).text('');
                        $(`#${flag_cells[i]}`).addClass('hex-wrong');
                        cur_mines--;
                        actives_mp.push(flag_cells[i]);
                    case 1:
                        hexs[t_idx].surface = 1;
                        $(`#${flag_cells[i]}`).text(nums_dic[flag_cells[i]]);
                        $(`#${flag_cells[i]}`).addClass('hex-wrong');
                        cur_mines--;
                        actives_mp.push(flag_cells[i]);
                        break
                    case 2:
                        break
                    default:
                        break;
                }
            }
        }
    } else if (flags + cells.length == num) {
        //周围余下的空等于格子上的数-旗子数
        for (let i in cells) {
            setFlag(cells[i]);
        }
    }

    updateMinesInfo();
    judgeFinish();
}

function hoverRelease(id) {
    let idx = hexs_mp.indexOf(id);
    if (idx == -1) {
        return;
    }
    if (nums_mp.indexOf(id) == -1 || hexs[idx].surface != 1) {
        return;
    }
    hovercenters_md = unique(hovercenters_md);
    let idx2 = hovercenters_md.indexOf(id);
    if (idx2 == -1) {
        return;
    }
    hovercenters_md.splice(idx2, 1);

    let hover_hexs = hoverArea(id);
    $(`#${id}`).removeClass('hex-active-press');

    for (let i in hover_hexs) {
        $(`#${hover_hexs[i].mapping(size)}`).removeClass('hex-hover');
    }
}

function hoverAct(id) {
    let idx = hexs_mp.indexOf(id);
    if (idx == -1) {
        return;
    }
    hovercenters_md.push(id);

    let hover_hexs = hoverArea(id);
    $(`#${id}`).addClass('hex-active-press');

    for (let i in hover_hexs) {
        $(`#${hover_hexs[i].mapping(size)}`).addClass('hex-hover');
    }
}

function bindHex() {
    $('.hex').each(function() {
        $(this).mousedown(function(e) {
            let id = parseInt($(this).attr('id'));
            let idx = hexs_mp.indexOf(id);
            if (idx == -1) {
                return;
            }

            if (mines_mp.length == 0) {
                //第一次点击后，生成雷
                initAfterClick(id);
            }

            //对于点开的数字
            if (nums_mp.indexOf(id) != -1 && hexs[idx].surface == 1) {
                switch (e.which) { //左右键都是显示范围
                    case 1:
                    case 3:
                        hoverAct(id);
                        break;
                    default:
                        break;
                }
            } else { //对于其他块
                switch (e.which) {
                    case 1: //左键点击非旗帜的可激活块，翻开格子
                        if (!isClickable(id)) {
                            return;
                        }
                        clickCell(id);
                        break;
                    case 3: //右键可激活块，若无旗帜，标旗子；若有旗帜，取消旗帜
                        if (idx == -1 || !isFlagable(id)) {
                            return;
                        }

                        if (hexs[idx].surface == 2) {
                            unsetFlag(id);
                        } else {
                            setFlag(id);
                        }
                        break;
                    default:
                        break;
                }
            }
        });

        $(this).mouseup(function(e) {
            let id = parseInt($(this).attr('id'));
            let idx = hexs_mp.indexOf(id);
            if (idx == -1) {
                return;
            }
            if (hexs[idx].surface != 1 || nums_mp.indexOf(id) == -1) {
                return;
            }
            switch (e.which) { //左右键释放，推理
                case 1:
                case 3:
                    if (hovercenters_md.indexOf(id) != -1) {
                        hoverRelease(id);
                        inferArea(id);
                    }
                    break;
                default:
                    break;
            }
        });

        $(this).mouseleave(function(e) {
            let id = parseInt($(this).attr('id'));
            let idx = hexs_mp.indexOf(id);
            if (idx == -1) {
                return;
            }
            if (hexs[idx].surface != 1 || nums_mp.indexOf(id) == -1) {
                return;
            }
            switch (e.which) { //左右键释放，推理
                case 1:
                case 3:
                    if (hovercenters_md.indexOf(id) != -1) {
                        hoverRelease(id);
                    }
                    break;
                default:
                    break;
            }
        });
    });
}

function unbindHex() {
    $('.hex').each(function() {
        $(this).off('mousedown');
        $(this).off('mouseup');
        $(this).off('mouseleave');
    });
}

function genHint() {
    let rnd_arr = [];
    for (let i in mines_mp) {
        if (flags_mp.indexOf(mines_mp[i]) == -1) { //不在flag中
            let t_idx = hexs_mp.indexOf(mines_mp[i]);
            if (t_idx != -1 && hexs[t_idx].surface != 1) { //没被点开
                rnd_arr.push(i);
            }
        }
    }

    if (rnd_arr.length > 0) {
        let rnd_i = rangeRnd(0, rnd_arr.length - 1);
        let id = mines_mp[rnd_arr[rnd_i]];
        $(`#${id}`).addClass('hex-shake');
        hints.push(new Hint(id));
        // let idx = hexs_mp.indexOf(mines_mp[rnd_arr[rnd_i]]);
        // let cnt = 0;

        // let t_timer = setInterval(function() {
        //     if (cnt >= hint_intv / hint_tick_intv ||
        //         hexs[idx].surface != 0
        //     ) {
        //         $(`#${mines_mp[rnd_arr[rnd_i]]}`).removeClass('hex-shake');
        //         clearInterval(t_timer);
        //     } else {
        //         cnt++;
        //     }
        // }, hint_tick_intv);
    }
}

function clickOfRat(id) {
    if (hexs[hexs_mp.indexOf(id)].surface == 2) {
        unsetFlag(id);
    }

    if (isClickable(id)) {
        clickCell(id);
    }
}

function getRotateImgAng(org, tar, bgn, tar_size, bgn_size) {
    let org_v = org;
    let tar_v = new PlainCoord(
        tar.x - bgn.x + tar_size.x / 2 - bgn_size.x / 2,
        tar.y - bgn.y + tar_size.y / 2 - bgn_size.y / 2
    );
    let ang = Math.acos(org_v.dot(tar_v) / (org_v.length() * tar_v.length())) * 180 / Math.PI;
    if (tar_v.x - org_v.x > 0) {
        ang = -ang;
    }
    //console.log(ang);
    return ang;
}

function genRat(type) {
    function selectHexs(isHover) {
        let rnd_arr = [];
        let slt_hexs = [];
        for (let i in hexs) {
            if (hexs[i].surface == 0 || hexs[i].surface == 2) {
                rnd_arr.push(i);
            }
        }

        if (rnd_arr.length < 1) {
            return [];
        }
        let rnd_i = rangeRnd(0, rnd_arr.length - 1);
        slt_hexs.push(hexs[rnd_arr[rnd_i]]);
        //console.log(isHover)
        if (isHover) {
            let hover_hexs = hoverArea(hexs[rnd_arr[rnd_i]].hexc.mapping(size), true);
            for (let i in hover_hexs) {
                let t_idx = hexs_mp.indexOf(hover_hexs[i].mapping(size));
                if (t_idx != -1) {
                    slt_hexs.push(hexs[t_idx]);
                }
            }
        }

        return slt_hexs;
    }

    function drawHighlightHex(plnc, gap) {
        let $b_hex = $(`<div class="mask-hex"></div>`);
        $($b_hex).css({
            'height': `${base*2+gap*4}px`,
            'width': `${base*sqrt3+gap*4}px`,
            'left': `${plnc.x-gap*2}px`,
            'top': `${plnc.y-gap*2}px`
        });
        $('#mine-field').append($($b_hex));
        return $b_hex;
    }

    function drawRat(tar, spwn, gap, img_file, mul) {
        let $rat = $(`<div class="run-rat"><span></span><img type="image/svg+xml" src="${img_base_root}/${img_file}" /></div>`);
        let w = (base * sqrt3 + gap * 8) * mul;
        let h = (base * 2 + gap * 8) * mul;
        $($rat).css({
            'width': `${w}px`,
            'height': `${h}px`,
            'left': `${spwn.x}px`,
            'top': `${spwn.y}px`
        });
        $($rat).children('img').css('transform', `rotate(${getRotateImgAng(defaultImgDir,tar,spwn,new PlainCoord(base*2,base*2),new PlainCoord(w,h))}deg)`);
        $($rat).data('clicked', 0);
        $($rat).on('click', function() {
            let cur = parseInt($($rat).data('clicked'));
            $($rat).data('clicked', cur + 1);
        });
        $('#mine-field').append($($rat));

        return $rat;
    }

    function getSpawn(tar) {
        //let spwn = new PlainCoord(5, 5);
        // let org_id = (new HexCoord(0, 0, 0)).mapping(size);
        // let ohex = hexs[hexs_mp.indexOf(org_id)];
        // let sym = new PlainCoord(Math.max(2 * (ohex.plnc.x - tar.x) + tar.x, 0), Math.max(2 * (ohex.plnc.y - tar.y) + tar.y, 0));
        //let stage_top = $('#whole-stage').offset().top;
        let l = -$('#main-stage').width() / 2 - 150;
        let t = rangeRnd(0, 0 + 14 * draw_base);
        return new PlainCoord(l, t);
    }
    let this_rat = rat_type_dic[type];
    let diff = draw_base - base;
    let tar = new PlainCoord(5, 5);
    let spwn = new PlainCoord(5, 5);
    let s_hex = selectHexs(this_rat['tars'] === 1 ? false : true);
    if (s_hex.length > 0) {
        tar = new PlainCoord(s_hex[0].plnc.x, s_hex[0].plnc.y);
        spwn = getSpawn(tar);
        let $hihex = [];
        for (let i in s_hex) {
            $hihex.push(drawHighlightHex(s_hex[i].plnc, diff));
        }
        let $rat = drawRat(tar, spwn, diff, this_rat['img_file'], this_rat['mul']);
        //console.log($rat);
        let the_rat = new Rat(type, this_rat['speed'], s_hex, spwn, $hihex, $rat);
        rats.push(the_rat);
    }
}

function tick() {
    if (cur_time % Math.floor(1000 / intv) == 0) {
        updateTimeInfo();
    }
    if (cur_time % Math.floor((hint_intv - hint_intv_corr) / intv) == 0) { //&& cur_time != 0
        genHint();
    }

    if (cur_time % Math.floor((rat_intv - rat_intv_corr) / intv) == 0 && cur_time != 0) {
        let rnd = rangeRnd(1, 12);
        if (rnd <= 9) {
            genRat(0);
        } else {
            genRat(1);
        }

    }
    cur_time++;
}

//工具函数
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function rangeRnd(a, b) {
    return Math.abs(Math.floor(Math.random() * (b - a + 1) + a));
}

function unique(arr) {
    return Array.from(new Set(arr))
}

function calcTime(cur, base) {
    let mins = Math.floor((cur * base) / (1000 * 60));
    let secs = Math.floor((cur * base) / 1000) % 60;
    return `${mins<10?0:''}${mins}:${secs<10?0:''}${secs}`;
}

function calcHexCnt(e_size) {
    if (e_size < 1) {
        return 0;
    }
    if (e_size == 1) {
        return 1;
    }
    if (e_size == 2) {
        return 7;
    }
    let sums = 1;
    sums += Math.round((6 + (e_size - 1) * 6) * (e_size - 1) / 2);
    return sums;
}

function parseId(id, size) {
    return new HexCoord(Math.floor(id / 10000) - size, (Math.floor(id / 100) % 100) - size, (id % 100) - size);
}

function isClickable(id) {
    let idx = hexs_mp.indexOf(id);
    if (idx == -1) {
        return false;
    }
    if (hexs[idx].surface == 0 || hexs[idx].surface == 3) {
        return true;
    } else {
        return false;
    }
}

function isFlagable(id) {
    let idx = hexs_mp.indexOf(id);
    if (idx == -1) {
        return false;
    }
    if (hexs[idx].surface == 0 ||
        hexs[idx].surface == 3 ||
        hexs[idx].surface == 2
    ) {
        return true;
    } else {
        return false;
    }
}

function isin(hexc, map) {
    let i = hexc.mapping(size);
    if (i in map) {
        if (map[i] == 1) {
            return true
        } else {
            return false;
        }
    } else {
        map[i] = 0;
        return false;
    }
}

function revealAll() {
    for (let i in mines_mp) {
        $(`#${mines_mp[i]}`).text('鼠雷');
        $(`#${mines_mp[i]}`).addClass('hex-active');
    }
}

function setSize(size_) {
    size = size_;
}

function setMineCnt(mine_) {
    mine_cnt = mine_;
}

function updateMinesInfo() {
    $('#mine-block>.info').text(mine_cnt - cur_mines - deaths_mp.length);
}

function updateScoreInfo() {
    $('#score-block>.info').text(total_score);
}

function updateTimeInfo() {
    $('#time-block>.info').text(calcTime(cur_time, intv));
}

function setTimeLimInfo() {
    $('#time-lim').text(calcTime(time_lim / intv, intv));
}

//分数判定
function changeScore(val) {
    total_score += val;
}

function getTimeReward() {
    let lim = time_lim / intv;
    let div = 1000 / intv;

    if (cur_time < lim) {
        total_score += Math.ceil(
            Math.abs(
                Math.floor(lim / div) - Math.floor(cur_time / div)
            ) * time_reward
        );
    }
}

//游戏
function judgeFinish() {
    actives_mp = unique(actives_mp);
    deaths_mp = unique(deaths_mp);
    //console.log(actives_mp.length, hexs.length - mine_cnt);

    if (actives_mp.length == hexs.length - mine_cnt) {
        //&& cur_mines + deaths_mp.length == mine_cnt
        total_score += (mine_cnt - deaths_mp.length) * mine_reward;
        getTimeReward();

        updateScoreInfo();
        updateMinesInfo();

        clearLevel();
    }
}

function clearLevel() {
    clearTimer();
    unbindHex();
    //alert(`clear!\nscore: ${total_score}`);
    init();
}

//init
function initGlobalVars() {
    hexs = [];
    hexs_mp = [];

    mines = [];
    mines_mp = [];

    nums_dic = {};
    nums_mp = [];

    deaths_mp = [];
    flags_mp = [];
    actives_mp = [];
    vines_mp = [];
    hovercenters_md = [];

    rats = [];
    hints = [];

    cur_time = 0;
    cur_mines = 0;

    //分数部分
    if (total_score < 0) {
        total_score = 0
    } else {
        total_score = 0;
    }
    grid_score = 0;
    mine_clear_score = 0;
    mine_death_score = 0;
    rat_score = 0;
    time_score = 0;
    extra_score = 0;
}

function init() {
    initGlobalVars();

    updateMinesInfo();
    updateScoreInfo();
    updateTimeInfo();
    setTimeLimInfo();
    // /size = 20;
    $('#mine-field').empty();
    let x2 = -(base * sqrt3 / 2);
    let y2 = draw_base * 1.5 * size;
    //hexs = bfs(x, y, size);
    hexs = bfs(x2, y2, size);
    for (let i in hexs) {
        hexs_mp.push(hexs[i].hexc.mapping(size));
    }


    bindHex();
}

function initAfterClick(id) {
    mines = rndMines(mine_cnt, id);
    for (let i in mines) {
        mines_mp.push(mines[i].mapping(size));
    }

    nums_dic = signNumber();
    for (let i in nums_dic) {
        nums_mp.push(parseInt(i));
    }

    initTimer();
}

function destroyLevel() {
    clearTimer();
    $('#mine-field').empty();
    initGlobalVars();
    updateMinesInfo();
    updateScoreInfo();
    updateTimeInfo();
}

function runRats() {
    if (rats.length != 0) {
        for (let i in rats) {
            rats[i].run(run_intv);
            if (rats[i].finished) {
                rats.splice(i, 1);
            }
        }
    }
}

function runHints() {
    if (hints.length != 0) {
        for (let i in hints) {
            hints[i].run();
            if (hints[i].finished) {
                hints.splice(i, 1);
            }
        }
    }
}

function initTimer() {
    main_timer = setInterval(function() {
        tick();
    }, intv);

    rat_timer = setInterval(function() {
        runRats();
    }, run_intv);

    hint_timer = setInterval(function() {
        runHints();
    }, hint_tick_intv);
}

//重置
function clearTimer() {
    clearInterval(main_timer);
    clearInterval(rat_timer);
    clearInterval(hint_timer);
}

//颜色
var normal_color = 'rgb(53, 169, 169)';
var active_color = '#f7acbc';
var hover_color = 'rgb(103, 228, 228)';
var press_color = 'rgb(248, 123, 150)';
var death_color = '#594c6d';
var num_colors = ['#845538', '#426ab3', '#1d953f'];

//棋盘属性
var base = 26; //棋盘格子大小
var draw_base = base + 1; //算上间隙的格子大小
var mine_cnt = 30; //雷数

//数学常量
var sqrt3 = Math.sqrt(3);
var sqrt2 = Math.sqrt(2);

//方向
var hex_dirs = [
    new HexCoord(-1, 0, 1),
    new HexCoord(0, -1, 1),
    new HexCoord(1, -1, 0),
    new HexCoord(1, 0, -1),
    new HexCoord(0, 1, -1),
    new HexCoord(-1, 1, 0)
];
var plain_dirs = [
    new PlainCoord(-sqrt3 / 2 * draw_base, -3 / 2 * draw_base),
    new PlainCoord(sqrt3 / 2 * draw_base, -3 / 2 * draw_base),
    new PlainCoord(sqrt3 * draw_base, 0),
    new PlainCoord(sqrt3 / 2 * draw_base, 3 / 2 * draw_base),
    new PlainCoord(-sqrt3 / 2 * draw_base, 3 / 2 * draw_base),
    new PlainCoord(-sqrt3 * draw_base, 0)
];

//时间
var intv = 100; //帧率

var hint_intv = 30000; //提示间隔
var hint_intv_corr = 0;
var hint_long = 4500; //提示动画时长
var hint_tick_intv = 10; //提示的动画灵敏度

var rat_intv = 20000; //耗子出现间隔
var rat_intv_corr = 0;
var run_intv = 25; //耗子计时器间隔

//分数
var mine_penalty = -50; //点雷惩罚
var mine_reward = 5; //扫雷奖励

var space_reward = 0; //空格倍率
var number_reward = 1; //数字倍率
var time_reward = 2; //时间奖励倍率

//各类格子
var hexs = [];
var hexs_mp = [];
var mines = [];
var mines_mp = [];
var nums_dic = {};
var nums_mp = [];
var deaths_mp = [];
var flags_mp = [];
var actives_mp = [];
var vines_mp = [];
var hovercenters_md = [];

var rats = [];
var hints = [];

//flags

//全局
var cur_level = 1; //当前关卡
var time_lim = 1000 * 60; //当前时限
var size = 6; //从中心向外扩展格数
var cur_mines = 0; //标上的旗帜数

var cur_time = 0; //当前时间
var total_score = 0; //当前分数
var grid_score = 0; //翻开格子的分

var mine_clear_score = 0; //清理雷的分
var mine_death_score = 0; //误踩雷的分
var rat_score = 0; //老鼠奖励分
var time_score = 0; //时间奖励分
var extra_score = 0; //额外分

var lilrat_clicks = 3; //小鼠点击次数
var bigrat_clicks = 10; //大鼠点击次数

//计时器
var main_timer = undefined; //主要计时器
var rat_timer = undefined; //老鼠计时器
var hint_timer = undefined; //提示计时器

//图像
var img_base_root = './img';
var defaultImgDir = new PlainCoord(0, 1);
var rat_type_dic = {
    0: { 'img_file': 'lil_rat.svg', 'speed': 120, 'tars': 1, 'mul': 1.5 },
    1: { 'img_file': 'big_rat.svg', 'speed': 150, 'tars': 7, 'mul': 2.5 }
};

$(function() {
    //init();
});