<script setup lang="ts">
</script>

<template>
    <div id="tool-bar">
        <div id="l-tool-bar" style="display:none;">
            <div id="back-btn">
                <span>返回</span>
            </div>
        </div>
        <div id="r-tool-bar" style="display:none;">
            <div id="pause-btn">
                <span>暂停</span>
                <span>继续</span>
            </div>
            <div id="music-btn">
                <span>音乐</span>
            </div>
            <div id="sfx-btn">
                <span>音效</span>
            </div>
            <div id="help-btn">
                <span>帮助</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
#tool-bar,
#l-tool-bar,
#r-tool-bar {
    display: flex;
}

#tool-bar {
    justify-content: space-between;
    margin-top: 15px;
}

#l-tool-bar,
#r-tool-bar {
    margin: 0 50px;
}

#back-btn {
    background-color: #67C286;
    color: #37423B;
    font-size: 18px;
    font-weight: 600;
    border-radius: 0 10px 10px 0;
    cursor: pointer;
    width: 80px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    clip-path: polygon(0% 50%, 20% 0%, 100% 0%, 100% 100%, 20% 100%);
}

#back-btn:hover {
    background-color: #C26966;
    color: #eee;
}
</style>
