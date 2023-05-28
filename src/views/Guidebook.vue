<script setup lang="ts">
</script>

<template>
    <div id="baike-menu" style="display:none;">
        <div id="baike-tab">
            <div>道具图鉴</div>
            <div>角色图鉴</div>
            <div>随机事件</div>
            <div>对话记录</div>
            <div>游戏说明</div>
        </div>
        <div id="baike-body">
            <div id="baike-item-list">
                <!-- <div class="baike-item">
                    <div class="baike-item-img">
                        <img src="./img/rat_curse.svg" />
                        <div class="baike-item-name">哈哈</div>
                    </div>
                    <div class="baike-item-info">
                        <div class="item-type">
                            <span>类型</span>
                            <span>被动</span>
                        </div>
                        <div class="item-stack">
                            <span>能否堆叠</span>
                            <span>是</span>
                        </div>
                        <div class="item-desc">超级大鼠哈哈哈哈哈1111111111111111111111111111111111111122222222222222222222222222222222222222222<br><br>222222222222222222</div>
                    </div>
                </div> -->
            </div>
            <div id="baike-chara-list" style="display:none;">
                <div class="baike-chara">
                    <div class="baike-chara-img"></div>
                    <div class="baike-chara-info">
                        <div class="chara-type">
                            <span>类型</span>
                            <span></span>
                        </div>
                        <div class="chara-desc">超级大鼠</div>
                        <div class="chara-life">
                            <span>生命值</span>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
            <div id="baike-dialog-list" style="display:none;">
                <div class="baike-dialog">
                    <div class="baike-dialog-item-img"></div>
                    <div class="baike-dialog-info"></div>
                </div>
            </div>
            <div id="baike-event-list" style="display:none;">
                <div class="baike-event">
                    <div class="baike-event-name"></div>
                    <div class="baike-event-desc"></div>
                </div>
            </div>
            <div id="baike-manual" style="display:none;">
                嘿嘿
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
#baike-tab {
    display: flex;
    justify-content: space-around;
    width: 500px;
}

#baike-tab>div {
    border: 2px solid dodgerblue;
    border-radius: 10px 0 0 0;
}

#baike-item-list {
    overflow-y: scroll;
    border: 2px solid black;
    width: 500px;
    height: 400px;
}

.baike-item {
    display: flex;
    margin: 10px 0;
    width: 100%;
    justify-content: center;
    border: 2px solid darkolivegreen;
}

.baike-item-img {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    margin-right: 5px;
}

.baike-item-img>img {
    height: 100px;
    width: 100px;
}

.item-type>span:first-child {
    border: 2px solid dodgerblue;
}

.item-stack>span:first-child {
    border: 2px solid dodgerblue;
}

.item-use>span:first-child {
    border: 2px solid dodgerblue;
}

.item-desc {
    width: 350px;
    border: 2px solid darkmagenta;
    word-wrap: break-word;
    white-space: normal;
}
</style>
