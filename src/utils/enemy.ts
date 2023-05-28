enum RatType {
    LIL_RAT = 'lil_rat',
    BIG_RAT = 'big_rat',
}

abstract class AbstractRat {
    constructor(type, speed, tar_hexs, spawn, hihexs, ele) {
        this.type = type;
        this.speed = speed;
        this.tar_hexs = tar_hexs;
        this.spawn = spawn;
        this.hihexs = hihexs;
        this.ele = ele;
        this.dist = new PlainCoordinate(
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

        let cur_p = new PlainCoordinate(
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
