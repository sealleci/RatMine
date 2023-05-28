<script setup lang="ts">
</script>

<template>
    <div id="title">
        <span id="shu">鼠</span>
        <span><img id="lei-svg" src="./img/mine.svg"></span>
        <span id="lei">雷</span>
    </div>
</template>

<style scoped lang="less">
#title {
    font-size: 60px;
    font-weight: 600;
    margin: 50px 0 20px 0;
    display: flex;
    align-items: center;
}

#title>span {
    display: flex;
}

#shu {
    color: #756F65;
    transition: transform 1s;
}

#shu:hover {
    transform: rotateY(180deg);
}

#lei {
    color: #756F65;
    transition: transform 1s;
}

#lei:hover {
    transform: rotateX(180deg);
}

#lei-svg {
    height: 60px;
    width: 60px;
}

#lei-svg:hover {
    content: url('../img/mine_death.svg');
}
</style>
