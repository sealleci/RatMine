function loadImage(src) {
    let p = new Promise(function(resolve, reject) {
        let img = new Image();
        img.onload = function() { resolve(img); }
        img.onerror = function() { reject(src); }
        img.src = src;
    })
    return p;
}
async function imgAsync() {
    for (let i of head_img_names) {
        await loadImage(`${img_root_dir}/` + i).then(img => {
            head_imgs.push(img);
        });
    }
    for (let i of tailmid_img_names) {
        await loadImage(`${img_root_dir}/` + i).then(img => {
            tailmid_imgs.push(img);
        });
    }
    for (let i of tailend_img_names) {
        await loadImage(`${img_root_dir}/` + i).then(img => {
            tailend_imgs.push(img);
        });
    }
    for (let i of turn_img_names) {
        await loadImage(`${img_root_dir}/` + i).then(img => {
            turn_imgs.push(img);
        });
    }
    for (let i of warp_tail_img_names) {
        await loadImage(`${img_root_dir}/` + i).then(img => {
            warp_tail_imgs.push(img);
        });
    }
    await loadImage(`${img_root_dir}/` + warp_img_name).then(img => {
        warp_img = img;
    });
    for (let i of food_img_names) {
        await loadImage(`${img_root_dir}/` + i).then(img => {
            food_imgs.push(img);
        });
    }
    await loadImage(`${img_root_dir}/` + dot_img_name).then(img => {
        dot_img = img;
    });
    await loadImage(`${img_root_dir}/` + death_img_name).then(img => {
        death_img = img;
    });
}

class Rect {
    constructor(x, y, w, h, c) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = c;
    }

    draw() {
        context_cici.beginPath();
        context_cici.fillStyle = this.c;
        context_cici.rect(this.x, this.y, this.w, this.h);
        context_cici.fill();
        context_cici.stroke();
    }
}

class Food {
    constructor(x, y, w, h, t) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.t = t;
        this.cstep = 0;
        this.edge = rangeRandom_cici(2, Math.round(Math.min(stage_cols, stage_rows)) / 2);
        this.rndc = rangeRandom_cici(1, 4);
        this.dots = [];
    }
    drawpath() {
        if (this.t == 1) {
            for (let i in this.dots) {
                context_cici.drawImage(dot_img, this.dots[i].x, this.dots[i].y);
            }
            if (this.dots.length >= 5) {
                this.dots.splice(4, this.dots.length - 4);
            }
        }
    }
    draw() {
        context_cici.drawImage(food_imgs[this.t], this.x, this.y);
    }

    move() {
        if (this.t == 1) {
            let ix = 0;
            let iy = 0;
            let base = this.rndc <= 2 ? 1 : -1;
            switch (Math.floor(this.cstep / this.edge)) {
                case 0:
                    ix = multip_cici * base;
                    break;
                case 1:
                    iy = multip_cici * base;
                    break;
                case 2:
                    ix = -multip_cici * base;
                    break;
                case 3:
                    iy = -multip_cici * base;
                    break;
                case 4:
                    ix = multip_cici * base;
                    this.cstep = 0;
                    break;
                default:
                    ix = multip_cici * base;
                    break;
            }
            this.dots.unshift({ 'x': this.x, 'y': this.y });
            this.x += ix;
            this.y += iy;
            this.x = (this.x + stage_cols * multip_cici) % (stage_cols * multip_cici);
            this.y = (this.y + stage_rows * multip_cici) % (stage_rows * multip_cici);
            this.cstep += 1;
        }
    }
}

class Snake {
    constructor() {
        this.body = [];
        for (let i = 0; i < init_len_cici; ++i) {
            this.body.splice(0, 0,
                new Rect(
                    ((i + Math.floor(stage_cols / 2)) * multip_cici + stage_cols * multip_cici) % (stage_cols * multip_cici),
                    (Math.floor(stage_rows / 2) * multip_cici + stage_rows * multip_cici) % (stage_rows * multip_cici),
                    multip_cici, multip_cici, body_color));
        }
        this.body[0].c = head_color;
        this.head = this.body[0];
        this.direction = keys_cici['r'];
    }

    draw() {
        for (let i = 0; i < this.body.length; ++i) {
            if (i == 0) {
                let head_img = undefined;
                switch (this.direction) {
                    case keys_cici['u']:
                        head_img = head_imgs[0];
                        break;
                    case keys_cici['d']:
                        head_img = head_imgs[2];
                        break;
                    case keys_cici['l']:
                        head_img = head_imgs[3];
                        break;
                    case keys_cici['r']:
                        head_img = head_imgs[1];
                        break;
                    default:
                        head_img = head_imgs[0];
                        break;
                }
                context_cici.drawImage(head_img, this.body[i].x, this.body[i].y);
            } else if (i == this.body.length - 1) {
                let tailend_img = tailend_imgs[0];
                let diff_x = (this.body[i - 1].x - this.body[i].x) / multip_cici;
                let diff_y = (this.body[i - 1].y - this.body[i].y) / multip_cici;
                if (diff_x == 0) {
                    if (diff_y == -2 || diff_y == -1 || diff_y == stage_rows - 1 || diff_y == stage_rows - 2) {
                        tailend_img = tailend_imgs[0];
                    } else if (diff_y == 1 || diff_y == 2 || diff_y == -stage_rows + 1 || diff_y == -stage_rows + 2) {
                        tailend_img = tailend_imgs[2];
                    }
                } else {
                    if (diff_x == -2 || diff_x == -1 || diff_x == stage_cols - 2 || diff_x == stage_cols - 1) {
                        tailend_img = tailend_imgs[3];
                    } else if (diff_x == 2 || diff_x == 1 || diff_x == -stage_cols + 2 || diff_x == -stage_cols + 1) {
                        tailend_img = tailend_imgs[1];
                    }
                }
                context_cici.drawImage(tailend_img, this.body[i].x, this.body[i].y);
            } else {
                let tailmid_img = tailmid_imgs[0];
                let diff_x1 = (this.body[i - 1].x - this.body[i].x) / multip_cici;
                let diff_y1 = (this.body[i - 1].y - this.body[i].y) / multip_cici;
                let diff_x2 = (this.body[i].x - this.body[i + 1].x) / multip_cici;
                let diff_y2 = (this.body[i].y - this.body[i + 1].y) / multip_cici;
                if (diff_x1 == 0 && diff_x2 == 0) {
                    tailmid_img = tailmid_imgs[1];
                } else if (diff_y1 == 0 && diff_y2 == 0) {
                    tailmid_img = tailmid_imgs[0];
                } else if ((diff_x1 == 1 || diff_x1 == 2 || diff_x1 == -stage_cols + 1 || diff_x1 == -stage_cols + 2) &&
                    diff_x2 == 0 &&
                    diff_y1 == 0 &&
                    (diff_y2 == 1 || diff_y2 == 2 || diff_y2 == -stage_rows + 1 || diff_y2 == -stage_rows + 2) ||
                    diff_x1 == 0 &&
                    (diff_x2 == -1 || diff_x2 == -2 || diff_x2 == stage_cols - 1 || diff_x2 == stage_cols - 2) &&
                    (diff_y1 == -1 || diff_y1 == -2 || diff_y1 == stage_rows - 1 || diff_y1 == stage_rows - 2) &&
                    diff_y2 == 0) {
                    tailmid_img = turn_imgs[0];
                } else if ((diff_x1 == 1 || diff_x1 == 2 || diff_x1 == -stage_cols + 1 || diff_x1 == -stage_cols + 2) &&
                    diff_x2 == 0 &&
                    diff_y1 == 0 &&
                    (diff_y2 == -1 || diff_y2 == -2 || diff_y2 == stage_rows - 1 || diff_y2 == stage_rows - 2) ||
                    diff_x1 == 0 &&
                    (diff_x2 == -1 || diff_x2 == -2 || diff_x2 == stage_cols - 1 || diff_x2 == stage_cols - 2) &&
                    (diff_y1 == 1 || diff_y1 == 2 || diff_y1 == -stage_rows + 1 || diff_y1 == -stage_rows + 2) &&
                    diff_y2 == 0) {
                    tailmid_img = turn_imgs[1];
                } else if (diff_x1 == 0 &&
                    (diff_x2 == 1 || diff_x2 == 2 || diff_x2 == -stage_cols + 1 || diff_x2 == -stage_cols + 2) &&
                    (diff_y1 == 1 || diff_y1 == 2 || diff_y1 == -stage_rows + 1 || diff_y1 == -stage_rows + 2) &&
                    diff_y2 == 0 ||
                    (diff_x1 == -1 || diff_x1 == -2 || diff_x1 == stage_cols - 1 || diff_x1 == stage_cols - 2) &&
                    diff_x2 == 0 &&
                    diff_y1 == 0 &&
                    (diff_y2 == -1 || diff_y2 == -2 || diff_y2 == stage_rows - 1 || diff_y2 == stage_rows - 2)) {
                    tailmid_img = turn_imgs[2];
                } else if (diff_x1 == 0 &&
                    (diff_x2 == 1 || diff_x2 == 2 || diff_x2 == -stage_cols + 1 || diff_x2 == -stage_cols + 2) &&
                    (diff_y1 == -1 || diff_y1 == -2 || diff_y1 == stage_rows - 1 || diff_y1 == stage_rows - 2) &&
                    diff_y2 == 0 ||
                    (diff_x1 == -1 || diff_x1 == -2 || diff_x1 == stage_cols - 1 || diff_x1 == stage_cols - 2) &&
                    diff_x2 == 0 &&
                    diff_y1 == 0 &&
                    (diff_y2 == 1 || diff_y2 == 2 || diff_y2 == -stage_rows + 1 || diff_y2 == -stage_rows + 2)) {
                    tailmid_img = turn_imgs[3];
                }
                context_cici.drawImage(tailmid_img, this.body[i].x, this.body[i].y);
            }
        }
    }

    move(steps) {
        this.body.splice(1, 0, new Rect(this.head.x, this.head.y, this.head.w, this.head.h, body_color));
        let t = hasEaten();
        if (t != -1) {
            food = genFood();
        } else {
            this.body.pop();
        }
        score_cici = Math.max(score_cici - steps, 0);
        switch (this.direction) {
            case keys_cici['u']:
                if (steps > 1) {
                    warps.push([
                        { 'x': this.head.x, 'y': this.head.y, 'dir': 2 },
                        { 'x': this.head.x, 'y': this.head.y - this.head.h * steps, 'dir': 0 }
                    ]);
                }
                this.head.y -= this.head.h * steps;
                break;
            case keys_cici['d']:
                if (steps > 1) {
                    warps.push([
                        { 'x': this.head.x, 'y': this.head.y, 'dir': 0 },
                        { 'x': this.head.x, 'y': this.head.y + this.head.h * steps, 'dir': 2 }
                    ]);
                }
                this.head.y += this.head.h * steps;
                break;
            case keys_cici['l']:
                if (steps > 1) {
                    warps.push([
                        { 'x': this.head.x, 'y': this.head.y, 'dir': 1 },
                        { 'x': this.head.x - this.head.w * steps, 'y': this.head.y, 'dir': 3 }
                    ]);
                }
                this.head.x -= this.head.w * steps;
                break;
            case keys_cici['r']:
                if (steps > 1) {
                    warps.push([
                        { 'x': this.head.x, 'y': this.head.y, 'dir': 3 },
                        { 'x': this.head.x + this.head.w * steps, 'y': this.head.y, 'dir': 1 }
                    ]);
                }
                this.head.x += this.head.w * steps;
                break;
            default:
                break;
        }
        this.head.x = (this.head.x + stage_cols * multip_cici) % (stage_cols * multip_cici);
        this.head.y = (this.head.y + stage_rows * multip_cici) % (stage_rows * multip_cici);

        for (let i = 1; i < this.body.length; ++i) {
            if (this.body[i].x == this.head.x &&
                this.body[i].y == this.head.y) {
                gameover_cici();
                break;
            }
        }
    }
}

function gameover_cici() {
    clearInterval(timer_cici_main);
    clearInterval(timer_cici_clock);
    isover_cici = true;
    isdeath_cici = true;
    let i = 0;
    let timer_death = setInterval(function() {
        if (i == 0) {
            context_cici.clearRect(0, 0, stage_cols * multip_cici, stage_rows * multip_cici);
            food.draw();
            snake.draw();
        }
        if (i != 0) {
            context_cici.clearRect(snake.body[i - 1].x, snake.body[i - 1].y, snake.head.w, snake.head.h);
        }
        if (i < snake.body.length) {
            context_cici.clearRect(snake.body[i].x, snake.body[i].y, snake.head.w, snake.head.h);
            if (i < snake.body.length - 1) {
                context_cici.drawImage(death_img, snake.body[i].x, snake.body[i].y);
            }
            i++;
        }

        if (i >= snake.body.length) {
            $('#over-info').css('display', 'inline');
            $('#final-score').text(score_cici + '分');
            let mins = Math.floor(times_cici / 600);
            let secs = Math.floor((times_cici % 600) / 10);
            $('#final-time').text((mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs);
            i = 0;
            isdeath_cici = false;
            clearInterval(timer_death);
        }
    }, 100);

}

function restart_cici() {
    if (isdeath_cici) {
        return;
    }
    $('#init-title').css('display', 'none');
    $('#over-info').css('display', 'none');
    isover_cici = false;
    snake = new Snake();
    food = genFood();
    score_cici = 500;
    times_cici = 0;
    warps = [];
    clearInterval(timer_cici_main);
    clearInterval(timer_cici_clock);
    $('#score').text(500);
    $('#time').text('00:00');
    $('#pause').css('display', 'inline');
    $('#play').css('display', 'none');
    timer_cici_main = setInterval(function() { exeFrame_cici(); }, frame_inerval_cici);
    timer_cici_clock = setInterval(function() { tick_cici() }, 100);
}

function pasuse_cici() {
    if (isover_cici) { return; }
    $('#init-title').css('display', 'none');
    $('#over-info').css('display', 'none');
    $('#pause').css('display', 'none');
    $('#play').css('display', 'inline');
    clearInterval(timer_cici_main);
    clearInterval(timer_cici_clock);
}

function play_cici() {
    if (isover_cici) { return; }
    $('#init-title').css('display', 'none');
    $('#over-info').css('display', 'none');
    $('#play').css('display', 'none');
    $('#pause').css('display', 'inline');
    timer_cici_main = setInterval(function() {
        exeFrame_cici();
    }, frame_inerval_cici);
    timer_cici_clock = setInterval(function() {
        tick_cici();
    }, 100);
}

function rangeRandom_cici(a, b) {
    return Math.abs(Math.floor(Math.random() * (b - a + 1) + a));
}

function genFood() {
    let mask = [];
    for (let i in snake.body) {
        mask.push(snake.body[i].x / multip_cici + snake.body[i].y * stage_cols / multip_cici);
    }
    let rnd_arr = [];
    for (let i = 0; i < stage_cols * stage_rows; ++i) {
        if (mask.indexOf(i) == -1) {
            rnd_arr.push(i);
        }
    }
    let i = rangeRandom_cici(0, rnd_arr.length - 1);
    let p = rnd_arr[i];
    let t = rangeRandom_cici(1, 10);
    return new Food((p % stage_cols) * multip_cici, Math.floor(p / stage_cols) * multip_cici, multip_cici, multip_cici, t >= 8 ? 1 : 0);
}

function hasEaten() {
    for (let i in snake.body) {
        if (snake.body[i].x == food.x && snake.body[i].y == food.y) {
            score_cici += food.t == 0 ? 100 : 250;
            return food.t;
        }
    }
    return -1;

}

var keyQueue = [];
$(document).keydown(function(e) {
    switch (e.keyCode) {
        case keys_cici['tog']:
            if ($('#pause').css('display') != 'none') {
                pasuse_cici();
            } else if ($('#play').css('display') != 'none') {
                play_cici();
            }
            break;
        case keys_cici['re']:
            restart_cici();
            break;
        default:
            keyQueue.unshift(e.which);
            break;
    }

});

function handleKey_cici() {
    let flag_moved = false;
    while (keyQueue.length != 0) {
        let k = keyQueue.shift();
        let flag_valid_key = false;
        flag_moved = false;
        for (let dict_key in keys_cici) {
            if (keys_cici[dict_key] == k) {
                flag_valid_key = true;
                break;
            }
        }
        if (!flag_valid_key) {
            continue;
        } else {
            switch (k) {
                case keys_cici['u']:
                    if (snake.direction != keys_cici['d']) {
                        snake.direction = keys_cici['u'];
                        keyQueue.length = 0;
                        snake.move(1);
                        flag_moved = true;
                    }
                    break;
                case keys_cici['d']:
                    if (snake.direction != keys_cici['u']) {
                        snake.direction = keys_cici['d'];
                        keyQueue.length = 0;
                        snake.move(1);
                        flag_moved = true;
                    }
                    break;
                case keys_cici['l']:
                    if (snake.direction != keys_cici['r']) {
                        snake.direction = keys_cici['l'];
                        keyQueue.length = 0;
                        snake.move(1);
                        flag_moved = true;
                    }
                    break;
                case keys_cici['r']:
                    if (snake.direction != keys_cici['l']) {
                        snake.direction = keys_cici['r'];
                        keyQueue.length = 0;
                        snake.move(1);
                        flag_moved = true;
                    }
                    break;
                case keys_cici['space']:
                    keyQueue.length = 0;
                    snake.move(2);
                    flag_moved = true;
                    break;
                default:
                    break;
            }
        }
    }
    if (!flag_moved) {
        snake.move(1);
    }
}

function drawWarp() {
    for (let i in warps) {
        let x1 = (warps[i][0].x + stage_cols * multip_cici) % (stage_cols * multip_cici);
        let y1 = (warps[i][0].y + stage_rows * multip_cici) % (stage_rows * multip_cici);
        switch (warps[i][1].dir) {
            case 0:
                context_cici.drawImage(warp_img,
                    x1 - 5,
                    y1 - 25);
                if (y1 - 25 < -15) {
                    context_cici.drawImage(warp_img,
                        x1 - 5,
                        y1 - 25 + stage_rows * multip_cici);
                }
                break;
            case 1:
                context_cici.drawImage(warp_img,
                    x1 + 15,
                    y1 - 5);
                if (x1 + 15 > stage_cols * multip_cici - 15) {
                    context_cici.drawImage(warp_img, -5,
                        y1 - 5);
                }
                break;
            case 2:
                context_cici.drawImage(warp_img,
                    x1 - 5,
                    y1 + 15);
                if (y1 + 15 > stage_rows * multip_cici - 15) {
                    context_cici.drawImage(warp_img,
                        x1 - 5, -5);
                }
                break;
            case 3:
                context_cici.drawImage(warp_img,
                    x1 - 25,
                    y1 - 5);
                if (x1 - 25 < -15) {
                    context_cici.drawImage(warp_img,
                        x1 - 25 + stage_cols * multip_cici,
                        y1 - 5);
                }
                break;
            default:
                break;
        }
    }
    for (let i in warps) {
        let x2 = (warps[i][1].x + stage_cols * multip_cici) % (stage_cols * multip_cici);
        let y2 = (warps[i][1].y + stage_rows * multip_cici) % (stage_rows * multip_cici);
        if (snake.body[snake.body.length - 1].x == x2 &&
            snake.body[snake.body.length - 1].y == y2) {
            warps.splice(i, 1);
        }
    }
}

function changeLineColor() {
    let lines = [0, 0, 0, 0];
    let border_colors = '';
    for (let i in snake.body) {

        switch (snake.body[i].x) {
            case 0:
                lines[3] = 1;
                break;
            case (stage_cols - 1) * multip_cici:
                lines[1] = 1;
                break;
            default:
                break;
        }
        switch (snake.body[i].y) {
            case 0:
                lines[0] = 1;
                break;
            case (stage_rows - 1) * multip_cici:
                lines[2] = 1;
                break;
            default:
                break;
        }

    }
    for (let i in lines) {
        if (lines[i] == 0) {
            border_colors += norm_line_color + ' ';
        } else {
            border_colors += activ_line_color + ' ';
        }
    }
    $(stage_cici).css('border-color', border_colors);
}

function exeFrame_cici() {
    handleKey_cici();
    context_cici.clearRect(0, 0, stage_cols * multip_cici, stage_rows * multip_cici);
    food.move();
    food.drawpath();
    snake.draw();
    drawWarp();

    food.draw();
    changeLineColor();
    $('#score').text(score_cici);
}

function tick_cici() {
    times_cici++;
    if (times_cici % 10 == 0) {
        let mins = Math.floor(times_cici / 600);
        let secs = Math.floor((times_cici % 600) / 10);
        $('#time').text((mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs);
    }
}

var stage_cici = $('#stage-cici')[0];
var context_cici = stage_cici.getContext('2d');
var multip_cici = 20;
var stage_cols = Math.round($(stage_cici).width() / multip_cici);
var stage_rows = Math.round($(stage_cici).height() / multip_cici);

var keys_cici = { 'u': 38, 'd': 40, 'l': 37, 'r': 39, 'space': 32, 'tog': 90, 're': 88 };
var init_len_cici = 6;

var body_color = 'gray';
var head_color = 'red';
var food_color = 'green';
var warp_color = 'yellow'
var norm_line_color = 'rgb(255, 91, 214)';
var activ_line_color = 'rgb(127, 228, 118)';

var img_root_dir = './img/ratcici';
var head_img_names = ['head-u.png', 'head-r.png', 'head-d.png', 'head-l.png'];
var tailmid_img_names = ['tailmid-h.png', 'tailmid-v.png'];
var tailend_img_names = ['tailend-u.png', 'tailend-r.png', 'tailend-d.png', 'tailend-l.png'];
var turn_img_names = ['turn-ru.png', 'turn-rd.png', 'turn-ld.png', 'turn-lu.png'];
var warp_tail_img_names = ['warp-tail-u.png', 'warp-tail-r.png', 'warp-tail-d.png', 'warp-tail-l.png'];
var warp_img_name = 'warp.png'
var food_img_names = ['food.png', 'food-s.png'];
var dot_img_name = 'dot.png';
var death_img_name = 'death.png';

var head_imgs = [];
var tailmid_imgs = [];
var tailend_imgs = [];
var turn_imgs = [];
var warp_tail_imgs = [];
var warp_img = undefined;
var food_imgs = [];
var dot_img = undefined;
var death_img = undefined;

var warps = [];
var score_cici = 501;
var times_cici = 0;
var frame_inerval_cici = 150;

var isover_cici = false;
var isdeath_cici = false;

var snake = new Snake();
var food = genFood();
var timer_cici_main = undefined;
var timer_cici_clock = undefined;

imgAsync().then(function() {
    $(function() {
        $('#pause').on('click', function() { pasuse_cici(); });
        $('#play').on('click', function() { play_cici(); });
        $('#replay').on('click', function() { restart_cici(); });
    });
});