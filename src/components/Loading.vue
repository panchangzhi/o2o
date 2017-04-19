<!--
    /**
     * Description: 
     * author: panchanzhi
     * date: 2017/3/25
     */
-->

<template>
    <div class="loading">
        <div class="weui-toast">
            <div class="weui-loading weui-icon_toast">
                <image class="image" style="width: 100px;height: 100px;" src="https://s.kcimg.cn/wap/images/detail/o2oImg/loading.svg" ref="image"></image>
            </div>
            <text class="weui-toast__content">数据加载中</text>
        </div>
    </div>
</template>

<style scoped>
    .loading {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
        z-index: 5000;
    }

    .weui-toast {
        margin-top: 50px;
        padding-top: 40px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 40px;
        align-items: center;
        min-height: 7.6em;
        background-color: rgba(17, 17, 17, 0.7);

        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .weui-loading {
        width: 100px;
        height: 100px;
        -webkit-animation: weuiLoading 1s steps(12, end) infinite;
        animation: weuiLoading 1s steps(12, end) infinite;
        background-size: 100%;
    }
    .weui-toast__content {
        font-size: 30px;
        color: #fff;
    }
    @-webkit-keyframes weuiLoading {
        0% {
            transform: rotate3d(0, 0, 1, 0deg);
        }
        100% {
            transform: rotate3d(0, 0, 1, 360deg);
        }
    }
    @-webkit-keyframes weuiLoading {
        0% {
            transform: rotate3d(0, 0, 1, 0deg);
        }
        100% {
            transform: rotate3d(0, 0, 1, 360deg);
        }
    }
</style>

<script type="text/babel">

</script>


 