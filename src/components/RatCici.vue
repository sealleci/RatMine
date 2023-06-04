<script lang="ts" setup>

</script>

<template>
    <div id="head-bar">
        <div id="l-bar">
            <div id="score-block">
                <div class="label">
                    <span><i class="bi bi-star-fill"></i></span>
                    <span>分数</span>
                </div>
                <span id="score">0</span>
            </div>
            <div id="time-block">
                <div class="label">
                    <span><i class="bi bi-stopwatch-fill"></i></span>
                    <span>计时</span>
                </div>
                <span id="time">00:00</span>
            </div>
        </div>
        <div id="r-bar">
            <div>
                <span id="pause" style="display:none;"><i class="bi bi-pause-circle"></i></span>
                <span id="play"><i class="bi bi-play-circle" style="display:inline;"></i></span>
            </div>
            <div>
                <span id="replay"><i class="bi bi-bootstrap-reboot"></i></span>
            </div>
            <div>
                <span data-toggle="modal" data-target="#tips">
                    <i class="bi bi-question-circle"></i>
                </span>
            </div>
        </div>
    </div>
    <div id="init-title">
        <h1></h1>
        <div class="key-promt">按Z键开始</div>
    </div>
    <div id="over-info" style="display:none;">
        <h1></h1>
        <div id="final-stat">
            <span id="final-score">0</span>
            <span id="final-time">0</span>
        </div>
        <div class="key-promt">按X键重开</div>
    </div>
    <div id="main-canvas">
        <canvas id="stage-cici" width="660" height="400"></canvas>
    </div>

    <div class="modal fade" id="tips" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">贪吃鼠游戏规则</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <ul>
                        <li>按键：
                            <ul>
                                <li>方向键-移动</li>
                                <li>空格键-闪现</li>
                                <li>Z键-切换暂停与继续</li>
                                <li>X键-重开</li>
                            </ul>
                        </li>
                        <li>得分规则：
                            <ul>
                                <li>初始分数500</li>
                                <li>每移动一步<span style="color:rgb(102, 175, 29)">减1分</span></li>
                                <li>每闪现一次<span style="color:rgb(102, 175, 29)">减2分</span></li>
                                <li>吃狗<span style="color:rgb(187, 34, 34)">增100分</span></li>
                                <li>吃猫<span style="color:rgb(187, 34, 34)">增250分</span></li>
                            </ul>
                        </li>
                        <li>游戏舞台的四个方向互相连通</li>
                        <li>鼠鼠碰到自己的身体会爆炸</li>
                    </ul>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-dismiss="modal">确认</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="less">
body {
    height: 570px;
    margin: 0;
    padding: 0;
    display: flex;
    padding-top: 0;
    flex-direction: column;
    /* justify-content: center; */
    vertical-align: middle;
    /* background-color: rgb(208, 208, 208); */
    background-image: linear-gradient(50deg, #e9defa 0%, #fbfcdb 100%);
}

canvas {
    background-color: rgb(255, 255, 255);
    margin-top: 3%;
    border-width: 5px;
    border-style: solid;
    border-color: rgb(255, 91, 214);
    border-radius: 10px;
    ;
    /*rgb(127, 228, 118)*/
}

#init-title,
#over-info {
    width: 175px;
    height: 100px;
    position: absolute;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
}

#init-title>h1:before {
    content: "贪吃鼠";
    animation: ratslip 2.5s linear infinite;
}

#over-info>h1:before {
    content: "游戏结束";
    animation: deathlip 2.5s linear infinite;
}

@keyframes deathlip {
    0% {
        opacity: 1;
    }

    16% {
        opacity: 0.6;
    }

    32% {
        opacity: 0.3;
    }

    48% {
        opacity: 0;
    }

    64% {
        opacity: 0.3;
    }

    80% {
        opacity: 0.6;
    }

    100% {
        opacity: 1;
    }
}

@keyframes ratslip {
    0% {
        content: "贪吃鼠";
    }

    16% {
        content: "吃　鼠";
    }

    32% {
        content: "　吃鼠";
    }

    48% {
        content: "　　吃";
    }

    64% {
        content: "　吃　";
    }

    80% {
        content: "　吃鼠";
    }

    100% {
        content: "贪吃鼠";
    }
}

.key-promt {
    width: 100%;
    text-align: center;
    border: 1px solid slateblue;
    border-radius: 8px;
    color: white;
    background-color: slateblue;
    font-size: 20px;
}

#final-stat {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    font-size: 25px;
    color: rgb(72, 145, 40);
    font-weight: 500;
    width: 100%;
}

#main-canvas {
    display: flex;
    justify-content: center;
}

#head-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 3%;
    margin-left: 8%;
    margin-right: 8%;
}

#l-bar {
    font-family: 'Monospace';
    width: 54%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 20px;
}

#score-block {
    display: flex;
    flex-direction: row;
}

#time-block {
    display: flex;
    flex-direction: row;
}

.label {
    border: 1px solid rgb(218, 161, 55);
    border-radius: 8px 0 0 8px;
    background-color: rgb(218, 161, 55);
    color: white;
    vertical-align: middle;
    padding-top: 10px;
    padding-left: 5px;
    padding-right: 5px;
}

#score,
#time {
    border: 3px solid rgb(218, 161, 55);
    border-radius: 0 8px 8px 0;
    padding-top: 8px;
    padding-left: 8px;
    padding-right: 8px;
    background: rgb(255, 255, 255);
    font-weight: 600;
    color: rgb(137, 98, 27);
}

#r-bar {
    width: 18%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size: 35px;
    color: rgb(196, 44, 168);
    padding-right: 0px;
}

#r-bar span {
    cursor: pointer;
}

#r-bar span:hover {
    color: dodgerblue;
    box-shadow: 0px 5px 0px dodgerblue;
}

#r-bar span:active {
    color: rgb(38, 103, 169);
    box-shadow: 0px 5px 0px rgb(38, 103, 169);
}

#r-bar>div:active {
    transform: translate(0, 2px);
}

@keyframes turn {
    0% {
        transform: rotate(0deg);
    }

    25% {
        transform: rotate(90deg);
    }

    100% {
        transform: rotate(180deg);
    }

    75% {
        transform: rotate(270deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
