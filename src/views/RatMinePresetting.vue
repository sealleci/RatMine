<script setup lang="ts">
</script>

<template>
    <div id="play-set-menu" style="display:none">
        <div id="play-set-title">闯关模式</div>
        <div class="set-item">
            <span class="play-set-label">边格数</span>
            <input id="edge-size" type="text" autocomplete="off" onkeyup="value=value.replace(/[^0-9]/g,'')"
                onpaste="value=value.replace(/[^0-9]/g,'')" oncontextmenu="value=value.replace(/[^0-9]/g,'')" />
            <span class="set-wrong" style="display:none;">非</span>
            <span class="set-right" style="display:none;">是</span>
        </div>
        <div class="set-item">
            <span class="play-set-label">雷数</span>
            <input id="mine-num" type="text" autocomplete="off" onkeyup="value=value.replace(/[^0-9]/g,'')"
                onpaste="value=value.replace(/[^0-9]/g,'')" oncontextmenu="value=value.replace(/[^0-9]/g,'')" />
            <span id="mine-perc" style="display:none;"></span>
        </div>
        <div id="mine-default">
            <div class="play-set-label">雷占比</div>

            <div id="default-btns" class="btn-group" role="group">
                <button type="button" class="btn perc-btn" data-perc="0.1">10%</button>
                <button type="button" class="btn perc-btn" data-perc="0.15">15%</button>
                <button type="button" class="btn perc-btn" data-perc="0.2">20%</button>
                <button type="button" class="btn perc-btn" data-perc="0.25">25%</button>
            </div>
        </div>
        <div id="conf-set-btn">确认</div>
    </div>
</template>

<style scoped lang="less">
#play-set-menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

#play-set-title {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #37423B;
    background-color: #67C286;
    border: 2px solid white;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    line-height: 75px;
    margin-bottom: 20px;
    transition: transform 1.5s;
}

#play-set-title:hover {
    transform: rotateY(360deg);
}

.set-item {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin: 16px 0;
    height: 35px;
}

.play-set-label {
    background-color: #9E7AC2;
    color: white;
    border-radius: 10px 0 0 10px;
    padding: 0 8px;
    text-align: center;
    font-size: 18px;
    line-height: 35px;
}

.set-item>.play-set-label {
    width: 100%;
}

.set-item>input {
    background-color: transparent;
    outline-style: none;
    border: 2px solid #9E7AC2;
    border-radius: 0 10px 10px 0;
    font-size: 18px;
    font-weight: 600;
    transition: box-shadow 0.8s;
}

.set-item>input:focus {
    box-shadow: 0 0 6px 2px #CF9AC7;
}

.set-wrong {
    text-align: center;
    background-color: darkred;
    color: white;
    height: 35px;
    padding: 0 8px;
    border-radius: 10px;
    line-height: 35px;
    font-size: 20px;
    font-weight: 700;
    margin-left: 10px;
}

.set-right {
    text-align: center;
    background-color: #58962F;
    color: white;
    height: 35px;
    padding: 0 8px;
    border-radius: 10px;
    line-height: 35px;
    font-size: 20px;
    font-weight: 700;
    margin-left: 10px;
}

#mine-default {
    display: flex;
    /* width: 100%; */
    margin: 16px 0;
}

#default-btns {
    opacity: 1;
}

.perc-btn {
    height: 35px;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    line-height: 17px;
    border: 2px solid #C2AD8D;
    border-radius: 0px;
    background-color: #C2AD8D;
}

.perc-btn:last-child {
    border-radius: 10px;
}

.perc-btn:hover {
    background-color: #A8967B;
    border-color: #A8967B;
}

#default-options {
    display: flex;
    border: 2px solid #9E7AC2;
    justify-content: space-around;
    /* width: 280px; */
    border-radius: 0 10px 10px 0;
    height: 35px;
}

#default-options label {
    padding: 0;
    margin: 0;
    padding-top: 5px;
    margin: 0 10px;
}

#conf-set-btn {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #37423B;
    background-color: #67C286;
    width: 225px;
    height: 50px;
    line-height: 50px;
    border-radius: 20px;
    margin: 30px 0;
    cursor: pointer;
    transition: background-color 0.8s, color 0.8s;
}

.disabled-input {
    background-color: #e0c1ff !important;
}

#conf-set-btn:hover {
    background-color: #C26966;
    color: #eee;
}
</style>
