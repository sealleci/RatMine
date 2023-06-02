<script setup lang="ts">
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

function bindHex() {
    $('.hex').each(function () {
        $(this).mousedown(function (e) {
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

        $(this).mouseup(function (e) {
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

        $(this).mouseleave(function (e) {
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
    $('.hex').each(function () {
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
                let t_idx = hexs_mp.indexOf(hover_hexs[i].getId(size));
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
            'height': `${base * 2 + gap * 4}px`,
            'width': `${base * sqrt3 + gap * 4}px`,
            'left': `${plnc.x - gap * 2}px`,
            'top': `${plnc.y - gap * 2}px`
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
        $($rat).children('img').css('transform', `rotate(${getRotaRotateImgAng(defaultImgDir, tar, spwn, new PlaneVectorinate(base * 2, base * 2), new PlaneVectorinate(w, h))}deg)`);
        $($rat).data('clicked', 0);
        $($rat).on('click', function () {
            let cur = parseInt($($rat).data('clicked'));
            $($rat).data('clicked', cur + 1);
        });
        $('#mine-field').append($($rat));

        return $rat;
    }

    function getSpawn(tar) {
        //let spwn = new PlaneVector(5, 5);
        // let org_id = (new HexVector(0, 0, 0)).mapping(size);
        // let ohex = hexs[hexs_mp.indexOf(org_id)];
        // let sym = new PlaneVector(Math.max(2 * (ohex.plnc.x - tar.x) + tar.x, 0), Math.max(2 * (ohex.plnc.y - tar.y) + tar.y, 0));
        //let stage_top = $('#whole-stage').offset().top;
        let l = -$('#main-stage').width() / 2 - 150;
        let t = rangeRnd(0, 0 + 14 * draw_base);
        return new PlaneVectorinate(l, t);
    }
    let this_rat = rat_type_dic[type];
    let diff = draw_base - base;
    let tar = new PlaneVectorinate(5, 5);
    let spwn = new PlaneVectorinate(5, 5);
    let s_hex = selectHexs(this_rat['tars'] === 1 ? false : true);
    if (s_hex.length > 0) {
        tar = new PlaneVectorinate(s_hex[0].plnc.x, s_hex[0].plnc.y);
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
    main_timer = setInterval(function () {
        tick();
    }, intv);

    rat_timer = setInterval(function () {
        runRats();
    }, run_intv);

    hint_timer = setInterval(function () {
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
    new HexVectorinate(-1, 0, 1),
    new HexVectorinate(0, -1, 1),
    new HexVectorinate(1, -1, 0),
    new HexVectorinate(1, 0, -1),
    new HexVectorinate(0, 1, -1),
    new HexVectorinate(-1, 1, 0)
];
var plane_dirs = [
    new PlaneVectorinate(-sqrt3 / 2 * draw_base, -3 / 2 * draw_base),
    new PlaneVectorinate(sqrt3 / 2 * draw_base, -3 / 2 * draw_base),
    new PlaneVectorinate(sqrt3 * draw_base, 0),
    new PlaneVectorinate(sqrt3 / 2 * draw_base, 3 / 2 * draw_base),
    new PlaneVectorinate(-sqrt3 / 2 * draw_base, 3 / 2 * draw_base),
    new PlaneVectorinate(-sqrt3 * draw_base, 0)
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
var defaultImgDir = new PlaneVectorinate(0, 1);
var rat_type_dic = {
    0: { 'img_file': 'lil_rat.svg', 'speed': 120, 'tars': 1, 'mul': 1.5 },
    1: { 'img_file': 'big_rat.svg', 'speed': 150, 'tars': 7, 'mul': 2.5 }
};

$(function () {
    //init();
});
//     var cnt_leci = 0;
//     var timer_leci = setInterval(function() {
//         $('#leci').attr('src', `./img/leci_${cnt_leci}.svg`);
//         cnt_leci++;
//         cnt_leci %= 4;
//     }, 20);
//     var pos_dic = {
//         'l': [0, 700, 1300, 700],
//         't': [500, 1000, 500, 0],
//         'deg': [-45, -135, -225, -315]
//     };
//     var cnt_pos = 1;
//     var timer_leci2 = setInterval(function() {
//         $('#leci').removeAttr('style');
//         $('#leci').css({
//             'left': pos_dic['l'][cnt_pos],
//             'top': pos_dic['t'][cnt_pos],
//             'transform': `rotate(${pos_dic['deg'][cnt_pos]}deg)`
//         });
//         cnt_pos++;
//         cnt_pos %= 4;
//     }, 3000);
//
</script>

<template>
    <div id="menu">
        <div id="sub-menus">
        </div>
    </div>
    <div id="level" style="display:none;">
        <div id="head-bar">
            <div id="level-bar">
                <span id="level-label">关卡鼠</span>
                <span id="level-num">1</span>
            </div>
            <div id="info-bar">
                <div id="mine-block" class="info-block">
                    <div class="label">鼠雷</div>
                    <div class="info"></div>
                </div>
                <div id="time-block" class="info-block">
                    <div class="label">鼠时</div>
                    <div class="info"></div>
                    <div id="time-lim"></div>
                </div>
                <div id="score-block" class="info-block">
                    <div class="label">鼠分</div>
                    <div class="info"></div>
                    <div id="score-multip">
                        <span>x</span>
                        <span id="score-multip-num">1.0</span>
                    </div>
                </div>
            </div>
        </div>
        <div id="main-stage">
            <div id="drone-field" style="display:none;">
                <img id="leci" src="./img/leci_1.svg" />
            </div>
            <div id="mine-field"></div>
            <div id="item-bar">
                <div id="item-tab">
                    <div id="active-item">主动</div>
                    <div id="passive-item">被动</div>
                </div>
                <div id="item-list">
                    <div class="item"><img src="./img/rat_curse.svg" /></div>
                    <div class="item"><img src="./img/puxi_mop.svg" /></div>
                    <div class="item"><img src="./img/vine_fiber.svg" /></div>
                    <div class="item"><img src="./img/rat_pounder.svg" /></div>
                    <div class="item"><img src="./img/rat_baobasin.svg" /></div>
                    <div class="item"><img src="./img/rat_hulu.svg" /></div>
                    <div class="item"><img src="./img/rat_rigui.svg" /></div>
                    <div class="item"><img src="./img/jiao_tv.svg" /></div>
                    <div class="item"><img src="./img/leci_controller.svg" /></div>
                    <div class="item"><img src="./img/pug_bone.svg" /></div>
                    <div class="item"><img src="./img/rat_yutou.svg" /></div>
                    <div class="item"><img src="./img/comego_que.svg" /></div>
                    <div class="item"><img src="./img/rat_taofu.svg" /></div>
                    <div class="item"><img src="./img/fur_chip.svg" /></div>
                    <div class="item"><img src="./img/rat_candua.svg" /></div>
                    <div class="item"><img src="./img/fox_plaster.svg" /></div>
                    <div class="item"><img src="./img/tazi_nose.svg" /></div>
                    <div class="item"><img src="./img/tusun_sachet.svg" /></div>
                </div>
            </div>
            <div id="puxi-field" style="display:none;">
                <img src="./img/puxi.svg" />
                <img src="./img/puxi_paw_z.svg" />
            </div>
        </div>
    </div>
    <div id="shop" style="display:none;">
        <div id="shop-head-bar">
            <div class="shop-info-block">
                <div class="shop-label">鼠分</div>
                <div class="shop-info"></div>
            </div>
            <div class="shop-info-block">
                <div class="shop-label">可购数量</div>
                <div class="shop-info">2</div>
            </div>
        </div>
        <div id="shop-paibian">
            日进斗金
        </div>
        <div id="shop-body">
            <div id="shop-npc">
                <div>
                    <img id="dian-rat" src="./img/rat_shop_keeper.svg" />
                </div>
                <div class="dialog">
                    <div class="dialog-body">
                        来的都是客，卖的都是货
                    </div>
                    <div class="dialog-tail">
                    </div>
                </div>
            </div>
            <div id="shop-shelve">
                <div id="shop-item-list">
                    <div class="shop-item">
                        <div class="shop-item-img"><img /></div>
                        <div class="shop-item-name"></div>
                        <div class="shop-item-price"></div>
                    </div>
                </div>
                <div id="shelve-img">
                </div>
            </div>
        </div>
        <div id="shop-btm">
            <div id="next-btn">前往下一关</div>
        </div>
        <div id="help-model">
        </div>
    </div>
</template>

<style scoped lang="less">
body {
    /* display: flex; */
    /* flex-direction: column; */
    margin: 0;
    user-select: none;
    background: rgb(240, 240, 240);
    overflow-x: scroll;
    /*justify-content: space-between;*/
    /* height: 700px; */
}

.hex {
    cursor: pointer;
    font-size: 20px;
    font-weight: 600;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    /* width: 86.6px;
    height: 100px;
    left: 100px;
    top: 100px; */
    margin: 0;
    text-align: center;
    background-color: rgb(53, 169, 169);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

.hex:hover {
    background-color: rgb(93, 223, 223);
    /* color: rgb(248, 123, 150); */
}

.hex-hover {
    background-color: rgb(103, 228, 228);
}

.hex-active {
    background-color: #f7acbc;
}

.hex-active:hover {
    background-color: #f7acbc;
}

.hex-activer-press {
    background-color: rgb(248, 123, 150);
}

.hex-active-press:hover {
    background-color: rgb(248, 123, 150);
}

.hex-death {
    color: white;
    background-color: rgb(211, 53, 53);
    ;
}

.hex-death:hover {
    background-color: rgb(211, 53, 53);
}

.hex-wrong {
    color: white !important;
    background-color: rgb(211, 53, 53);
}

.hex-wrong:hover {
    background-color: rgb(211, 53, 53);
}

.mask-hex {
    position: absolute;
    z-index: 5;
    margin: 0;
    padding: 10px 0;
    pointer-events: none;
    opacity: .4;
    background: rgb(212, 221, 39);
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

.hex-shake {
    animation: shake 1.5s linear 3;
}

@keyframes shake {
    0% {
        transform: rotate(0deg);
    }

    15% {
        transform: rotate(30deg);
    }

    30% {
        transform: rotate(60deg);
    }

    45% {
        transform: rotate(90deg);
    }

    60% {
        transform: rotate(120deg);
    }

    100% {
        transform: rotate(120deg);
    }
}

.run-rat {
    position: absolute;
    margin: 0;
    padding: 0;
    cursor: pointer;
}

.run-rat>img {
    position: absolute;
    top: 0;
    left: 0;
    width: inherit;
    height: inherit;
    /* cursor: pointer; */
    z-index: 20;
}

.run-rat>span {
    position: absolute;
    width: inherit;
    height: inherit;
    top: 30%;
    font-weight: 800;
    z-index: 5;
    font-size: 28px;
    z-index: 25;
    -webkit-text-stroke: 2.5px black;
    color: white;
    text-align: center;
}

#menu {
    height: 600px;
}

#menu,
#sub-menus,
#init-menu,
#play-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#sub-menus,
#init-menu,
#play-menu {
    height: 300px;
}





#level {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
}

#head-bar {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 25px;
    margin-bottom: 50px;
    z-index: 21;
}

#level-bar {
    font-size: 26px;
    height: 80%;
    text-align: center;
}

#info-bar {
    display: flex;
    justify-content: center;
    margin-top: 1%;
}

.info {
    padding: 0 5px;
    color: white;
    border: 2px solid rgb(41, 41, 41);
    background-color: rgb(41, 41, 41);
}

.info:last-child {
    border-radius: 0 15px 15px 0;
}

.info-block {
    font-size: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24%;
}

.label {
    padding: 0 6px;
    border: 2px solid rgb(41, 41, 41);
    border-radius: 15px 0 0 15px;
}

#time-lim {
    padding: 0 5px;
    color: white;
    border: 2px solid rgb(68, 140, 57);
    border-radius: 0 15px 15px 0;
    background-color: rgb(68, 140, 57);
}

#score-multip {
    padding: 0 5px;
    color: white;
    border: 2px solid rgb(165, 155, 15);
    border-radius: 0 15px 15px 0;
    background-color: rgb(165, 155, 15);
}

#main-stage {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

#mine-field {
    position: relative;
}

#item-bar {
    display: flex;
    flex-direction: column;
    margin-left: auto;
    margin-right: 50px;
    float: right;
    z-index: 21;
    width: 120px;
    height: 500px;
}

#item-tab {
    display: flex;
    text-align: center;
    justify-content: space-around;
}


/* img {
    border: 5px solid red;
} */

#item-list {
    font-size: 25px;
    display: flex;
    overflow-x: hidden;
    overflow-y: scroll;
    flex-direction: column;
    justify-content: space-between;
    /* width: 150px; */
    /* height: 80%; */
    border: 3px solid #1872CC;
    border-radius: 5px;
}

.item {
    margin: 5px 0px;
    width: 100%;
    display: flex;
    justify-content: center;
}

.item>img {
    height: 80px;
    width: 80px;
}

#shop {
    display: flex;
    margin-top: 20px;
}

.dialog-body {
    margin-left: 20px;
    padding: 5px;
    color: white;
    border: 2px solid dodgerblue;
    border-radius: 5px;
    background-color: dodgerblue;
}

.dialog-tail {
    width: 0;
    height: 0;
    margin-left: 45px;
    border-width: 16px;
    border-style: solid;
    border-color: dodgerblue transparent transparent;
}

#leci {
    z-index: 22;
    height: 120px;
    width: 120px;
    position: absolute;
    left: 0;
    top: 600px;
    transition: transform 2s, left 2s, top 2s;
}
</style>
