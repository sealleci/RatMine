<script setup lang="ts">
</script>

<template>
    <div id="set-menu" style="display:none;">
        <div id="set-tab">
            <div>游戏设置</div>
            <div>按键设置</div>
        </div>
        <div id="set-body">
            <div id="set-game">
                <div class="set-block">
                    <div class="set-label">语言</div>
                    <div class="set-info" id="lang"></div>
                </div>
                <div class="set-block">
                    <div class="set-label">音乐音量</div>
                    <div class="set-info" id="music-vol"></div>
                </div>
                <div class="set-block">
                    <div class="set-label">音效音量</div>
                    <div class="set-info" id="sfx-vol"></div>
                </div>
                <div class="set-block">
                    <div class="set-label">是否自动标旗</div>
                    <div class="set-info" id="is-auto-flag"></div>
                </div>
            </div>
            <div id="set-key">
                <div id="set-key-mine">
                    <div class="set-block">
                        <div class="set-label">切换主动被动</div>
                        <div class="set-info" id="tog-item-tab"></div>
                    </div>
                    <div class="set-block">
                        <div class="set-label">使用主动</div>
                        <div class="set-info" id="use-act"></div>
                    </div>
                </div>
                <div id="set-key-cici">
                    <div class="set-block">
                        <div class="set-label">闪现</div>
                        <div class="set-info" id="blink"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less"></style>
