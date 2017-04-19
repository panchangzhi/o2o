<!--
    /**
     * Description: 店主已经注册 弹层
     * author: panchanzhi
     * date: 2017/3/31
     */
-->

<template>
    <div class="tip">
        <div class="inner">
            <text class="tip-text">您的店铺已入驻</text>
            <div class="button-wrapper" @click="more">
                <text class="button-text">去看看</text>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .tip {
        position:fixed;
        top:0;
        left:0;
        bottom:0;
        right:0;
        justify-content: center;
        align-items: center;
        background-color: rgba(0,0,0,0.6);
        z-index:99
    }

    .inner {
        padding-top: 80px;
        padding-bottom: 44px;
        padding-left: 130px;
        padding-right: 130px;

        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;

        background-color: #fff;
    }

    .tip-text {
        margin-bottom: 60px;
        font-size: 40px;
        color: #000;
    }

    .button-wrapper {
        width: 300px;
        height: 88px;

        justify-content: center;
        align-items: center;

        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;

        background-color: #09BB07;
    }

    .button-text {
        font-size: 32px;
        color: #fff;
    }
</style>

<script type="text/babel">
    import router from '../router/router.js'

    const storage = weex.requireModule('storage');

    export default{
        data: function () {
            return {}
        },
        created: function () {

        },
        methods: {
            more(){
                router.push('/myDetail');
            }
        }
    }

</script>


 