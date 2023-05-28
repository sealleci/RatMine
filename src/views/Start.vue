<script setup lang="ts">
</script>

<template>
    <div id="init-menu">
        <!-- style="display:none;" -->
        <div id="play-btn">开始游戏</div>
        <div id="set-btn">设置</div>
        <div id="baike-btn">百科</div>
        <div id="dev-btn">开发者信息</div>
    </div>
</template>

<style scoped lang="less">
#init-menu {
    position: relative;
    width: 64px;
    margin-top: 100px;
    /*    height: 400px;*/
}

#init-menu>div {
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    height: 86.6px;
    margin: 0;
    text-align: center;
    color: #37423B;
    background-color: #67C286;
    clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
    transition: background-color 0.4s, color 0.4s;
}

#init-menu>div:hover {
    background-color: #C26966;
    color: #eee;
}

#play-btn {
    left: -18px;
    top: 0;
}

#set-btn {
    left: -101.66px;
    top: 48.3px;
}

#baike-btn {
    left: 65.66px;
    top: 48.3px;
}

#dev-btn {
    left: -18px;
    top: 96.6px;
}
</style>
