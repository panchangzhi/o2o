<template>
    <div class="home">
        <!-- 附近商家列表 -->
        <all-store isPage="home" class="store-list"></all-store>

        <!-- 商家入驻按钮 -->
        <check-in-footer></check-in-footer>


    </div>
</template>

<script type="text/babel">
    import StoreList from '../components/StoreList.vue'
    import CheckInFooter from '../components/CheckInFooter.vue'
    import empty from '../components/empty.vue'
    import Tools from '../common/js/Tools'
    import allStore from '../components/allStore.vue'


    const storage = weex.requireModule('storage');
    const stream = weex.requireModule('stream');
    const modal = weex.requireModule('modal');

    export default {
        data() {
            return {
                lists: [],
                emptyList: false
            }
        },
        components: {
            StoreList,
            CheckInFooter,
            empty,
            allStore
        },
        methods: {
        },
        created () {

            let _this = this;

            //清除商家入驻页面缓存
            try {
                storage.removeItem('DataAll');
                storage.removeItem('City');
            } catch (err) {
                console.log(err)
            }

            if (Tools.isWx()) {
                wx.ready(function () {

                    // 分享到朋友圈
                    wx.onMenuShareTimeline({
                        title: '卡车之家，所有卡车人温暖的家！',
                        link: window.location.href,
                        imgUrl: "https://s.kcimg.cn/wap/images/bbs/defaults.jpg",
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                    //分享给朋友
                    wx.onMenuShareAppMessage({
                        title: '附近商家',
                        desc: '无兄弟，不卡车！进入卡车之家，兄弟们都等着你',
                        link: window.location.href,
                        imgUrl: "https://s.kcimg.cn/wap/images/bbs/defaults.jpg",
                        success: function () {
                            // 用户确认分享后执行的回调函数
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                });
            }
        },
        mounted(){
            Tools.scrollTop();
        }
    }
</script>


<style scoped>
    .home {
        height: 100%;
        background-color: #f5f5f5;
    }

    .store-list {
        flex: 1;
    }
    .tip {
        position: fixed;
        z-index: 1000;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        justify-content: center;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.6);
    }

    .toast {
        width: 560px;
        background-color: #fff;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }

    .text-tip {
        padding-top: 50px;
        padding-right: 50px;
        padding-bottom: 50px;
        padding-left: 50px;
        font-size: 32px;
        color: #333;
        border-bottom-width: 1px;
        border-bottom-color: #e5e5e5;
        border-bottom-style: solid;
    }
</style>
<style>
    .weex-list-wrapper {
        position: relative;
        z-index: 1;
        -webkit-overflow-scrolling: touch;
    }

    .weex-scroller-wrapper {
        position: relative;
        z-index: 1;
        -webkit-overflow-scrolling: touch;
    }

</style>
