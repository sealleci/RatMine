<script setup lang="ts">
</script>

<template>
    <div id="dev-menu" style="display:none;">
        <div class="dev-block">
            <span>所用依赖项</span>
            <span>JQuery, BootStrap</span>
        </div>
        <div class="dev-block">
            <span>绘图工具</span>
            <span>draw.io</span>
        </div>
        <div class="dev-block">
            <span>开发工具</span>
            <span>VS Code, Chrome</span>
        </div>
        <div class="dev-block">
            <span>鸣谢</span>
            <span>pdfrvr, YueLeng_M</span>
        </div>
        <div id="cr">
            <span>Copyright (c) 2021 @</span>
        </div>
    </div>
</template>

<style scoped lang="less">
@keyframes name-change {
    0% {
        content: "Sealleci";
    }

    12.5% {
        content: "Seal Leci";
    }

    25% {
        content: "Seal Lezi";
    }

    37.5% {
        content: "Seal Lazi";
    }

    50% {
        content: "Seal Tazi";
    }

    62.5% {
        content: "Seal Taci";
    }

    75% {
        content: "Seal Teci";
    }

    87.5% {
        content: "Seal Leci";
    }

    100% {
        content: "Sealleci";
    }
}

#cr {
    /* position: absolute; */
    text-align: center;
    font-size: 20px;
    /* margin-top: 100px; */
    /* margin-bottom: 20px; */
    font-weight: 600;
    /* bottom: 0; */
    /* left: 30%; */
    /* right: 30%; */
    /*    left: 50%;*/
    /* animation: name-change 2s linear infinite; */
}

#cr:after {
    content: "Sealleci";
    color: black;
    animation: name-change 4s linear infinite;
}
</style>
