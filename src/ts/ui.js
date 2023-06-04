var min_edge_size = 3;
var max_edge_size = 50;
var ui_state = 0;
var is_edge_size = false;
var is_mine_num = false;
var cur_edge_size = 3;
var cur_mine_num = 1;

function changeUiState(cur_state) {
    ui_state = cur_state;
    if (ui_state != 0) {
        $('#l-tool-bar').show();
    } else {
        $('#l-tool-bar').hide();
    }
}

function changePerc(p) {
    if (p === '') {
        $('#mine-perc').removeClass('set-wrong');
        $('#mine-perc').removeClass('set-right');
        $('#mine-perc').text('');
        $('#mine-perc').hide();
        is_mine_num = false;
    } else if (p == '?') {
        $('#mine-perc').addClass('set-wrong');
        $('#mine-perc').removeClass('set-right');
        $('#mine-perc').text('?');
        $('#mine-perc').show();
        is_mine_num = false;
    } else {
        if (p <= 0.0 || p >= 1.0) {
            $('#mine-perc').addClass('set-wrong');
            $('#mine-perc').removeClass('set-right');
            $('#mine-perc').text((p * 100).toFixed(1) + '%');
            $('#mine-perc').show();
            is_mine_num = false;
        } else {
            $('#mine-perc').removeClass('set-wrong');
            $('#mine-perc').addClass('set-right');
            $('#mine-perc').text((p * 100).toFixed(1) + '%');
            $('#mine-perc').show();
            is_mine_num = true;
        }
    }
}

function initPlaySetMenu() {
    $('#edge-size').attr('value', '');
    $('#edge-size').val('');
    $('#edge-size').siblings('.set-right').hide();
    $('#edge-size').siblings('.set-wrong').hide();

    $('#mine-num').attr('value', '');
    $('#mine-num').val('');
    changePerc('');
    is_edge_size = false;
    is_mine_num = false;
}

function menuStateInit() {
    $('#title').show();
    $('#r-tool-bar').hide();

    initPlaySetMenu();

    $('#sub-menus').children().each(function() {
        if ($(this).attr('id') == 'init-menu') {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

$(function() {
    $(window).on('dragstart', function() {
        return false;
    });
    $('html').on('contextmenu', function() {
        return false;
    });
    $(document).keydown(function(e) {
        // console.log('key' + e.keyCode);
        if (e.keyCode == 82) {
            destroyLevel();
            init(cur_edge_size, cur_mine_num);
        }
    });
    $('img').mousedown(function(e) {
        e.preventDefault();
    });
    $('#play-btn').click(function() {
        $('#init-menu').hide();
        $('#play-menu').show();
        changeUiState(100);
    });
    $('#set-btn').click(function() {
        $('#init-menu').hide();
        $('#set-menu').show();
        changeUiState(200);
    });
    $('#baike-btn').click(function() {
        $('#init-menu').hide();
        $('#baike-menu').show();
        changeUiState(300);
    });
    $('#dev-btn').click(function() {
        $('#init-menu').hide();
        $('#dev-menu').show();
        changeUiState(400);
    });

    $('#chuang-btn').click(function() {
        $('#play-menu').hide();
        $('#play-set-menu').show();
        changeUiState(101);
    });
    $('#sandbox-btn').click(function() {
        changeUiState(502);
    });
    $('#ratcici-btn').click(function() {
        changeUiState(503);
    });
    $('#edge-size').on('blur', function() {
        let text = $(this).val();
        if (text === '') {
            $(this).siblings('.set-right').hide();
            $(this).siblings('.set-wrong').hide();
            is_edge_size = false;
            if ($('#mine-num').val() !== '') {
                changePerc('?');
            }
            return;
        }
        let edge_size = parseInt(text);
        if (edge_size < min_edge_size || edge_size > max_edge_size) {
            $(this).siblings('.set-right').hide();
            $(this).siblings('.set-wrong').show();
            is_edge_size = false;
            if ($('#mine-num').val() !== '') {
                changePerc('?');
            }
        } else {
            $(this).siblings('.set-wrong').hide();
            $(this).siblings('.set-right').show();
            is_edge_size = true;
            if ($('#mine-num').val() !== '') {
                changePerc(parseInt($('#mine-num').val()) / calcHexCnt(edge_size));
            }
        }
    });

    $('#mine-num').on('blur', function() {
        let text = $(this).val();
        if (text === '') {
            changePerc('');
            return;
        }
        let mine_num = parseInt(text);
        if (is_edge_size) {
            changePerc(
                mine_num / calcHexCnt(parseInt($('#edge-size').val())));
        } else {
            changePerc('?');
        }
    });

    $('#conf-set-btn').click(function() {
        if (is_edge_size && is_mine_num) {
            let edge_size = parseInt($('#edge-size').val());
            let mine_num = parseInt($('#mine-num').val());
            setSize(edge_size - 1);
            setMineCnt(mine_num);
            cur_edge_size = edge_size;
            cur_mine_num = mine_num;
            init(edge_size, mine_num);
            changeUiState(501);
            $('#menu').hide();
            $('#level').show();
            $('#r-tool-bar').show();
        }
    });
    $(`input[type="text"]`).keypress(function(e) {
        if (e.which == 13) {
            $(this).trigger('blur');
        }
    });
    $('.perc-btn').click(function() {
        let perc = parseFloat($(this).data('perc'));
        if (is_edge_size) {
            let t_mine_num = Math.round(
                calcHexCnt(
                    parseInt($('#edge-size').val())
                ) * perc
            );
            $('#mine-num').attr('value', t_mine_num);
            $('#mine-num').val(t_mine_num);
            changePerc(perc);
        }
    });
    $('#back-btn').click(function() {
        /* 
            主界面 0
            |-开始游戏 100
              |-闯关模式 101
                |-游戏 501
              |-沙盘模式 102
                |-游戏 502
              |-贪吃鼠 103
                |-游戏 503
            |-设置 200
            |-百科 300
            |-开发者信息 400
        */
        switch (Math.floor(ui_state / 100)) {
            case 1:
                switch (ui_state % 100) {
                    case 0:
                        changeUiState(0);
                        $('#play-menu').hide();
                        $('#init-menu').show();
                        break;
                    case 1:
                        changeUiState(100);
                        initPlaySetMenu();
                        $('#play-set-menu').hide();
                        $('#play-menu').show();
                        break;
                    case 2:
                        changeUiState(100);
                        break;
                    case 3:
                        changeUiState(100);
                        break;
                }
                break;
            case 2:
                $('#set-menu').hide();
                $('#init-menu').show();
                changeUiState(0);
                break;
            case 3:
                $('#baike-menu').hide();
                $('#init-menu').show();
                changeUiState(0);
                break;
            case 4:
                $('#dev-menu').hide();
                $('#init-menu').show();
                changeUiState(0);
                break;
            case 5:
                changeUiState(0);
                $('#level').hide();
                $('#menu').show();
                destroyLevel();
                menuStateInit();
                break;
            default:
                break;
        }
    });
});