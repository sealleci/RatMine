<script setup lang="ts">
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
