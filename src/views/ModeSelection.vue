<script setup lang="ts">
</script>

<template>
    <div id="play-menu" style="display:none;">
        <div id="chuang-btn">闯关模式</div>
        <div id="sandbox-btn">沙盘模式</div>
        <div id="ratcici-btn">贪吃鼠</div>
    </div>
</template>

<style scoped lang="less">
#play-menu {
    margin-top: 50px;
}

#play-menu>div {
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #37423B;
    background-color: #67C286;
    width: 250px;
    height: 50px;
    line-height: 50px;
    border-radius: 50px;
    margin: 20px 0;
    cursor: pointer;
    transition: color 0.4s, background-color 0.4s;
}

#play-menu>div:hover {
    background-color: #C26966;
    color: #eee;
}
</style>
