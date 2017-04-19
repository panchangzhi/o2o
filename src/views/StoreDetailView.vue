<template lang="html">
    <div class="store-detail">
        <div class="content">
            <!-- 商家图片 -->
            <image style="width: 750px;height: 420px;" :src="imgSrc"></image>

            <!-- 店铺名 -->
            <div class="name-wrapper">
                <text class="name">{{store.name}}</text>
            </div>

            <!-- 店铺类型 -->
            <div class="type-wrapper">
                <div :class="['type-item','type-item'+ (index%3)]" v-for="(value,index) in typeShow">
                    <text :class="['type-text','type-text' + (index%3)]">{{value}}</text>
                </div>
            </div>

            <!-- 地址 -->
            <div class="location" @click="goSiteMap">
                <text class="site">地址</text>
                <image class="site-tag" style="width:20px;height:26px"
                       src="https://s.kcimg.cn/wap/images/detail/o2oImg/settled_location@2x.png"></image>
                <text class="site-text">{{store.address}}</text>
                <image class="map" style="width: 16px;height: 26px;"
                       src="https://s.kcimg.cn/wap/images/detail/o2oImg/settled_into@2x.png"></image>
            </div>
        </div>
        <!-- footer -->
        <div class="footer" id="footer">

                <image class="tell-tag" style="width: 66px;height: 66px;"
                       src="https://s.kcimg.cn/wap/images/detail/o2oImg/settled_tell@2x.png"></image>

                <!-- 店主 电话 -->
                <div class="owner-tell">
                    <a :href="telNumber" @click="call" class="call">
                        <text class="owner">{{store.linkman}}</text>

                        <text class="tell-text">{{store.linkcall}}</text>
                    </a>
                    <!---->
                </div>


            <!-- 分享 -->
            <div class="share-wrapper">
                <image style="width: 28px;height: 28px;"
                       src="https://s.kcimg.cn/wap/images/detail/o2oImg/settled_share@2x.png"></image>
                <text class="text-share" @click="show=true">分享</text>
            </div>
        </div>

        <!-- 分享弹层 -->
        <div v-if="show" class="shadow" @click="show=false">

        </div>

        <!-- 返回上一页 -->
        <back></back>

    </div>
</template>

<script type="text/babel">
    import router from "../router/router"
    import back from '../components/back.vue'
    import Tools from '../common/js/Tools'

    let stream = weex.requireModule('stream');


    export default {
        data(){
            return {
                store: {},
                show: false,
                imgSrc: '',
                typeShow: [],
                telNumber: 'javascript:;'
            }
        },
        components: {
            back
        },
        created () {
            if (this.$route.params.shoptypeid == '9') {
                stream.fetch({
                    method: 'GET',
                    type: 'json',
                    url: 'https://dealer-api.360che.com/NearbyBusiness/DealerSubinfo.aspx?id=' + this.$route.params.shopid
                }, res=> {
                    this.store = res.ok ? res.data : '(network error)';
                    this.showData();
                    this.share();
                })
            }
            else {
                this.getStarCount('shopout/shopinfo.aspx?shopid=' + this.$route.params.shopid, res => {
                    this.store = res.ok ? res.data : '(network error)';
                    this.showData();
                    this.share();
                })
            }

        },
        methods: {
            getStarCount (repo, callback) {
                return stream.fetch({
                    method: 'GET',
                    type: 'json',
                    url: 'https://nearby-api.360che.com/' + repo
                }, callback)
            },
            goSiteMap(){
                router.push({name: 'siteMap', params: {longitude: this.store.lng, latitude: this.store.lat}})
            },
            call(){
                let _this = this;
                var time = setTimeout(function () {
                    window.location.href = 'tel:' + _this.store.linkcall;
                }, 500)
            },
            showData(){

                this.imgSrc = Tools.defaultPic(this.store.photo,this.store.shoptypeid||this.store.typeid,true);


                //店铺类型展示
                this.typeShow = Tools.typeShow(this.store.typeshow);
            },
            share(){
                let _this = this;
                wx.ready(function () {
                    // 分享到朋友圈
                    wx.onMenuShareTimeline({
                        title: _this.store.name,
                        link: window.location.href,
                        imgUrl: _this.imgSrc,
                        success: function () {
                            ga('send', 'event', "分享附近商家", "朋友圈", _this.store.typeshow);
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                    //分享给朋友
                    wx.onMenuShareAppMessage({
                        title: _this.store.name,
                        desc: _this.store.address,
                        link: window.location.href,
                        imgUrl: _this.imgSrc,
                        success: function () {
                            ga('send', 'event', "分享附近商家", "微信好友", _this.store.typeshow);
                        },
                        cancel: function () {
                            // 用户取消分享后执行的回调函数
                        }
                    });
                })
            }
        },

        mounted(){
            Tools.scrollTop();
            document.querySelector('#footer').addEventListener('touchmove', function (event) {
                event.preventDefault();
            });
        }
    }
</script>

<style lang="css" scoped>
    .store-detail {
        height: 100%;
        background-color: #e5e5e5;
    }

    .content {
        flex: 1;
    }

    .name-wrapper {
        justify-content: center;
        padding-left: 30px;
        background-color: #fff;
    }

    .name {
        font-size: 36px;
        color: #333;
        word-wrap: break-word;
        word-break: break-all;
        padding-right: 30px;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .call{
        justify-content: center;
        /*align-items: center;*/
    }

    .type-wrapper {
        flex-direction: row;
        flex-wrap: wrap;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 30px;
        margin-bottom: 20px;
        text-align: center;
        background-color: #fff;
    }

    .type-item {
        justify-content: center;
        align-items: center;
        padding-left: 8px;
        padding-right: 8px;
        margin-right: 20px;
        margin-top: 20px;
        height: 44px;

        border-top-style: solid;
        border-right-style: solid;
        border-bottom-style: solid;
        border-left-style: solid;

        border-top-color: #FEA802;
        border-right-color: #FEA802;
        border-bottom-color: #FEA802;
        border-left-color: #FEA802;

        border-top-width: 2px;
        border-right-width: 2px;
        border-bottom-width: 2px;
        border-left-width: 2px;

        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }

    .type-item0 {
        /*border-top-color: #FEA802;*/
        /*border-right-color: #FEA802;*/
        /*border-bottom-color: #FEA802;*/
        /*border-left-color: #FEA802;*/
        border-color: #FEA802;
    }

    .type-item1 {
/*        border-top-color: #FE7302;
        border-right-color: #FE7302;
        border-bottom-color: #FE7302;
        border-left-color: #FE7302;*/
        border-color: #FE7302;

    }

    .type-item2 {
 /*       border-top-color: #028DFE;
        border-right-color: #028DFE;
        border-bottom-color: #028DFE;
        border-left-color: #028DFE;*/
        border-color: #028DFE;
    }

    .type-text {
        font-size: 28px;
    }

    .type-text0 {
        color: #FEA802;
    }

    .type-text1 {
        color: #FE7302;
    }

    .type-text2 {
        color: #028DFE;
    }

    .location {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin-top: 20px;
        padding-left: 30px;
        height: 88px;
        overflow: hidden;
        background-color: #fff;
    }

    .site {
        margin-right: 30px;
        font-size: 32px;
        color: #666;
    }

    .site-tag {
        margin-right: 10px;
    }

    .site-text {
        flex: 1;
        margin-right: 10px;
        font-size: 32px;
        color: #333;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        lines: 1;
        display: block;
    }

    .map {
        margin-right: 26px;
    }

    .footer {
        flex-direction: row;
        align-items: center;
        width: 750px;
        height: 100px;
        background-color: #09BB07;
    }

    .tell-tag {
        margin-left: 20px;
        margin-right: 20px;
    }

    .owner-tell {
        flex: 1;
    }

    .owner {
        margin-bottom: 5px;
        font-size: 24px;
        color: #fff;
    }

    .tell-text {
        font-size: 32px;
        color: #fff;
    }

    .share-wrapper {
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 180px;
        height: 100px;
        background-color: #0AAA08;
    }

    .text-share {
        margin-left: 16px;
        font-size: 28px;
        color: #fff;
    }

    .shadow {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url(https://s.kcimg.cn/wap/images/detail/o2oImg/share_guide.png);
        background-repeat: no-repeat;
        background-size: cover;
    }

</style>
