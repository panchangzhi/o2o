<!--
    /**
     * Description: store list
     * author: panchanzhi
     * date: 2017/4/1
     */
-->

<template>
    <list class="all-store" id="storeList" @loadmore="fetch" loadmoreoffset="800">
        <cell v-if="isPage == 'home'" class="header-wrapper cell">
            <!-- 附近商家类型选择  -->
            <keep-alive>
                <home-header class="header"></home-header>
            </keep-alive>
            <div class="title">
                <text class="title-text">附近商铺</text>
            </div>

        </cell>

        <!-- 商家列表 -->
        <keep-alive>
            <cell v-if="lists.length" class="list cell">
                <template v-for="item in lists">
                    <!-- 数据不为空 列表-->
                    <keep-alive>
                        <store-list :store="item" :type="true"></store-list>
                    </keep-alive>
                </template>


                <!-- 加载提弹层 -->
                <div v-if="loadMore" class="load-wrapper">
                    <div class="load-more">
                        <text class="load-text">{{loadText}}</text>
                    </div>
                </div>

                <!-- 返回顶部 -->
                <back-top></back-top>
            </cell>
        </keep-alive>

        <cell v-if="emptyList && !Loading" class="empty-list cell">
            <keep-alive>
                <!-- 数据为空 -->
                <empty></empty>
            </keep-alive>

            <check-in-footer v-if="isPage != 'home'" class="check-in" :isRadius="true" :isListView="true"></check-in-footer>
        </cell>

        <cell v-if="lists.length > 10 && !Loading && emptyData" class="cell no-more">
            <!--//没有更多数据-->
            <keep-alive>
                <no-more></no-more>
            </keep-alive>
        </cell>

        <!-- 加载中 -->
        <cell v-if="Loading">
            <keep-alive>
                <loading></loading>
            </keep-alive>
        </cell>

    </list>
</template>

<style scoped>
    .all-store {
        flex: 1;
        background-color: #f5f5f5;
    }

    .header-wrapper {
        margin-bottom: -30px;
        background-color: #f5f5f5;
    }

    .title {
        padding-top: 30px;
        padding-bottom: 30px;
        margin-top: 20px;

        justify-content: flex-end;
        background-color: #fff;
    }

    .title-text {
        font-size: 36px;
        text-align: center;
    }

    .empty-list {
        background-color: #fff;
        align-items: center;
        justify-content: flex-start;
        flex: 1;
    }
    .list{
        z-index: 9;
    }

    .load-more {
        padding-left: 10px;
        padding-right: 10px;
        height: 64px;
        justify-content: center;
        align-items: center;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        background-color: rgba(0, 0, 0, 0.7);
    }

    .load-wrapper {
        position: fixed;
        bottom: 200px;
        width: 750px;
        justify-content: center;
        align-items: center;
        z-index: 9;
    }

    .load-text {
        font-size: 32px;
        color: #fff;
    }

    .no-more {
        height: 40px;
    }
</style>

<script type="text/babel">
    import storeList from './StoreList.vue'
    import HomeHeader from './HomeHeader.vue'
    import noMore from './noMore.vue'
    import empty from './empty.vue'
    import CheckInFooter from './CheckInFooter.vue'
    import Tools from '../common/js/Tools.js'
    import loading from  './Loading.vue'
    import justList from './justList.vue'
    import backTop from './backTop.vue'


    const modal = weex.requireModule('modal');
    const storage = weex.requireModule('storage');
    const stream = weex.requireModule('stream');


    export default{
        data: function () {
            return {
                lists: [],
                more: true,//分页加载更多
                emptyData: false,//是否还有分页,
                Loading: false,//初始加载
                loadMore: false,//提示框
                loadText: '',//下拉加载文案
                emptyList: false,//列表为空
                page: 0
            }
        },
        props: ['isPage', 'typeId'],
        components: {
            storeList,
            HomeHeader,
            empty,
            noMore,
            loading,
            CheckInFooter,
            justList,
            backTop
        },

        created() {

            if (this.isPage == 'home') {//首页附近商家
                let StoreList = sessionStorage.getItem('StoreList');
                if (StoreList && StoreList != null) {
                    let data = JSON.parse(StoreList);
                    this.lists = data.lists;
                    this.page = data.page;
                    this.emptyList = this.lists.length <= 0 ? true : false;
                }
                else {
                    this.fetch();
                }
            }
            else {//各类型附近商家
                let ShopType = sessionStorage.getItem('ShopType');
                if (ShopType && JSON.parse(ShopType)[this.typeId]) {

                    let data = JSON.parse(ShopType);
                    this.lists = data[this.typeId].lists;
                    this.page = data[this.typeId].page;
                    this.emptyList = this.lists.length <= 0 ? true : false;
                }
                else {
                    this.fetch();
                }
            }
        },
        methods: {
            dataHandle(res, data){
                if(res.ok){
                    data = this.isPage == 'dealer' ? res.data.datalist : res.data;
                    if (data.length > 0)//当数据存在
                    {
                        for (let i = 0; i < data.length; i++) {

                            data[i].photo = Tools.defaultPic(data[i].photo, data[i].shoptypeid, false);//设置默认图片

                            data[i].distanceKM = this.isPage == 'dealer' ? (data[i].distanceKM * 1000).toFixed(2) : data[i].distanceKM;//经销商数据转换，和1.0接口一致

                            this.$nextTick(function () {//添加数据
                                this.lists.push(data[i])
                            })
                        }
                        if (data.length < 20) {//数据不满一页
                            this.emptyData = true;
                        }
                        this.$nextTick(function () {
                            this.more = true;
                        })
                    }
                    else {//没有数据的时候
                        this.emptyData = true;
                    }
                }
                else {
                    this.Loading = false;
                    this.loadText = '网络有问题！！！';
                    this.loadMore = true;
                    setTimeout(function () {
                        this.loadMore = false;
                    }, 300)
                }

            },
            fetch (event) {
                let _this = this;
                storage.getItem('nowLocation', ele => {
                    if (ele.data != "undefined") {

                        let location = JSON.parse(ele.data);

                        if (_this.more && !_this.emptyData) {

                            _this.page++;
                            _this.more = false;

                            _this.loadText = '正在加载。。。';
                            _this.Loading = true;
                            let data = [],
                                longitude = location.lng ? location.lng : location.longitude, // 经度
                                latitude  = location.lat ? location.lat : location.latitude;  // 维度

                            switch (_this.isPage) {
                                case 'home':
                                    //首页加载数据
                                    _this.getStarCount(`shopout/shoplist.aspx?lng=${longitude}&lat=${latitude}&page=${_this.page}&ts=${+new Date()}`, res => {

                                        _this.dataHandle(res, data);//获取数据
                                        _this.$nextTick(function () {
                                            _this.emptyList = _this.lists.length <= 0 ? true : false;
                                            //缓存附近商家的数据
                                            let StoreList = sessionStorage.getItem('StoreList');

                                            let data = StoreList ? JSON.parse(StoreList) : {};

                                            data.lists = _this.lists;
                                            data.page = _this.page;

                                            _this.Loading = false;

                                            sessionStorage.setItem('StoreList', JSON.stringify(data))
                                        })
                                    },pos =>{
                                    });
                                    break;
                                case 'other':
                                    //各类型商家加载数据
                                    _this.getStarCount(`shopout/shoplist.aspx?lng=${longitude}&lat=${latitude}&shoptypeid=${_this.typeId}&page=${_this.page}&ts=${+new Date()}`, res => {
                                        _this.dataHandle(res, data);//获取数据

                                        _this.$nextTick(function () {
                                            _this.Loading = false;
                                            _this.setStorage();//缓存数据
                                        })

                                    });
                                    break;
                                case 'dealer':
                                    stream.fetch(
                                            {
                                                method: 'GET',
                                                type: 'json',
                                                url: 'https://dealer-api.360che.com/NearbyBusiness/DealerSubList.aspx?lng=' + longitude + '&lat=' + latitude + '&pageSize=20' + '&pageIndex=' + _this.page
                                                //url: 'https://dealer-api.360che.com/NearbyBusiness/DealerSubList.aspx?lng=120.272064&lat=31.648750&pageSize=20' + '&pageIndex=' + _this.page+'&ts='+ (+new Date())
                                            }, res => {
                                                //alert(JSON.stringify(res));
                                                _this.dataHandle(res, data);//获取数据

                                                _this.$nextTick(function () {
                                                    _this.Loading = false;
                                                    _this.setStorage();//缓存数据
                                                    //alert(_this.lists[0]);
                                                })
                                            });
                                    break;
                            }
                        }
                    }
                    else {
                        if (Tools.isWx()) {
                            wx.ready(function () {
                                wx.getLocation({
                                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                                    success: function (res) {
                                        let wxLocation = {};
                                        wxLocation.lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                        wxLocation.lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。

                                        //缓存当前的经纬度
                                        storage.setItem('nowLocation', JSON.stringify(wxLocation));
                                        _this.$nextTick(function () {
                                            _this.fetch();
                                        })
                                    },
                                    cancel: function () {
                                        let wxLocation = {};
                                        wxLocation.lat = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                                        wxLocation.lng = res.longitude; // 经度，浮点数，范围为180 ~ -180。

                                        //缓存当前的经纬度
                                        storage.setItem('nowLocation', JSON.stringify(wxLocation));
                                        _this.$nextTick(function () {
                                            _this.fetch();
                                        })
                                    }
                                });
                            });
                        }
                    }
                });
            },
            setStorage(){

                this.emptyList = this.lists.length <= 0 ? true : false;

                let ShopType = sessionStorage.getItem('ShopType');

                let data = ShopType ? JSON.parse(ShopType) : {};

                data[this.typeId] = {};
                (data[this.typeId]).lists = this.lists;
                (data[this.typeId]).page = this.page;
                sessionStorage.setItem('ShopType', JSON.stringify(data))

            },
            getStarCount (repo, callback,progressCallback) {
               stream.fetch({
                    method: 'GET',
                    type: 'json',
                    headers:{
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    url: 'https://nearby-api.360che.com/' + repo
                }, callback,progressCallback)
            }
        },

        mounted(){
            let ScrollTop = sessionStorage.getItem('ScrollTop');
            let storeList = document.querySelector('#storeList');
            if (ScrollTop) {
                ScrollTop = JSON.parse(ScrollTop);
                if (ScrollTop[window.location.href]) {
                    storeList.scrollTop = ScrollTop[window.location.href];
                }
            }
        }
    }

</script>


 