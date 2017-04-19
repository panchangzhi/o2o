<template>
    <div class="app">
        <router-view class="router" style="flex:1"></router-view>
    </div>
</template>

<script type="text/babel">
    import router from './router/router.js'
    import Tools from './common/js/Tools.js'

    var stream = weex.requireModule('stream');
    var storage = weex.requireModule('storage');

    export default {
        name: 'app',
        router,
        beforeCreate(){
            //清除地理位置
            try {
                storage.removeItem('nowLocation');
            } catch (err) {
                console.log(err)
            }
        },
        created(){

                if(Tools.isWx()){
                    console.log('是微信')
                    //获取商家类别选项
                    this.getStarCount('cm/Wxconfig.aspx?url=' + encodeURIComponent(window.location.href.split('#')[0]), res => {
                        if(res.ok){
                            wx.config({
                                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                                appId: res.data.appId, // 必填，公众号的唯一标识
                                timestamp: res.data.timestamp, // 必填，生成签名的时间戳
                                nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
                                signature: res.data.signature,// 必填，签名，见附录1
                                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','menuItem:favorite','showAllNonBaseMenuItem','hideMenuItems','getLocation','getLocalImgData','chooseImage','uploadImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                            });
                            wx.ready(function(){
                                wx.showAllNonBaseMenuItem();

                                wx.hideMenuItems({
                                    menuList: ["menuItem:editTag","menuItem:delete","menuItem:copyUrl","menuItem:share:qq","menuItem:share:QZone","menuItem:openWithQQBrowser","menuItem:openWithSafari","menuItem:share:email","menuItem:share:weiboApp"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                                });
                            });
                        }
                    });
                    let Animation = sessionStorage.getItem('Animation')
                }
                else{
                    console.log('不是微信')
                }
        },
        methods: {
            //请求微信接口注入信息
            getStarCount (repo, callback) {
                return stream.fetch({
                    method: 'GET',
                    type: 'json',
                    url: 'https://didi.360che.com/nearby-api/' + repo
                }, callback)
            }
        }
    }

</script>
<style scoped>
    @import "./common/css/reset.css";
</style>
