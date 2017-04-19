<!--
    /**
     * Description: 返回上一页
     * author: panchanzhi
     * date: 2017/3/23
     */
-->

<template>
    <div class="back" @click="back">
        <image style="width: 28px;height: 24px;" src="https://s.kcimg.cn/wap/images/detail/o2oImg/settled_return@2x.png"></image>
        <text class="text">返回</text>
    </div>
</template>

<style scoped>
    .back{
        position: fixed;
        right: 0;
        bottom: 100px;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 140px;
        height: 70px;
        border-top-left-radius: 70px;
        border-bottom-left-radius: 70px;
        background-color: #FFBC2E;
        z-index: 1;
    }
    .text{
        margin-left: 12px;
        font-size: 32px;
        color: #fff;
    }
</style>

<script type="text/babel">
    export default{
        name: 'back',
        data: function () {
            return {}
        },
        created: function () {

        },
        methods: {
            back(){
                history.go(-1);
            }
        }
    }
</script>


 