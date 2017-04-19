<!--
    /**
     * Description: 我的上传列表
     * author: panchanzhi
     * date: 2017/3/22
     */
-->

<template>
    <div class="my-upload">
        <div class="nav">
            <div class="item-wrapper wrapper-wait" :class="[current==1? 'wrapper-current':'']" @click="clickCurrent(1)">
                <text class="nav-item" :class="[current==1?'item-current':'']">待审核（{{lists.audit.length}}）</text>
            </div>
            <div class="item-wrapper wrapper-passed" :class="[current==2? 'wrapper-current':'']" @click="clickCurrent(2)">
                <text class="nav-item" :class="[current==2?'item-current':'']">已通过（{{lists.passed.length}}）</text>
            </div>
            <div class="item-wrapper wrapper-refuse" :class="[current==3? 'wrapper-current':'']" @click="clickCurrent(3)">
                <text class="nav-item" :class="[current==3?'item-current':'']">已驳回（{{lists.refuse.length}}）</text>
            </div>
        </div>

        <!-- 待审核列表 -->
        <list v-if="current == 1" class="list">

            <cell class="list-wrapper" v-for="item in lists.audit">
                <store-list :store="item" :type="false"></store-list>
            </cell>

            <!-- 列表为空-->
            <cell v-if="!lists.audit.length && empty" class="empty">
                <empty :type="true"></empty>
            </cell>

            <!-- 没有更多数据-->
            <cell v-else class="no-more">
                <no-more></no-more>
            </cell>

        </list>

        <!-- 已通过列表 -->
        <list v-if="current == 2" class="list">
            <cell class="list-wrapper" v-for="item in lists.passed">
                <store-list :store="item" :type="false"></store-list>
            </cell>

            <!-- 列表为空-->
            <cell v-if="!lists.passed.length && empty" class="empty">
                <empty :type="true"></empty>
            </cell>

            <!-- 没有更多数据-->
            <cell v-else class="no-more">
                <no-more></no-more>
            </cell>
        </list>

        <!-- 已驳回列表 -->
        <list v-if="current == 3" class="list">
            <cell class="list-wrapper" v-for="item in lists.refuse">
                <store-list :store="item" :type="false"></store-list>
            </cell>
            <!-- 列表为空-->
            <cell v-if="!lists.refuse.length && empty" class="empty">
                <empty :type="true"></empty>
            </cell>

            <!-- 没有更多数据-->
            <cell v-else class="no-more">
                <no-more></no-more>
            </cell>
        </list>


        <!-- 加载中 -->
        <loading v-if="Loading"></loading>


        <!-- 返回上一页 -->
        <back></back>
    </div>
</template>

<style scoped>
    .my-upload {
        flex: 1;
        background-color: #f5f5f5;
    }

    .list {
        flex: 1;
    }

    .weex-list-inner {
        background-color: #f5f5f5;
    }

    .empty {
        flex: 1;
        justify-content: flex-start;
        background-color: #fff;
    }

    .no-more{
        height: 40px;
    }
    .nav {
        flex-direction: row;
        padding-left: 30px;
        padding-right: 30px;
        padding-top: 30px;
        padding-bottom: 30px;
    }

    .empty {

    }

    .item-wrapper {
        flex: 1;
        justify-content: center;
        height: 60px;
        border-top-color: #848484;
        border-top-width: 1px;
        border-top-style: solid;

        border-bottom-color: #848484;
        border-bottom-width: 1px;
        border-bottom-style: solid;
    }

    .wrapper-wait {
        border-left-color: #848484;
        border-left-width: 1px;
        border-left-style: solid;

        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
    }

    .wrapper-passed {
        border-left-color: #848484;
        border-left-width: 1px;
        border-left-style: solid;

        border-right-color: #848484;
        border-right-width: 1px;
        border-right-style: solid;
    }

    .wrapper-refuse {
        border-right-color: #848484;
        border-right-width: 1px;
        border-right-style: solid;

        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
    }

    .wrapper-current {
        height: 60px;
        border-width: 0;
        background-color: #848484;
    }

    .nav-item {
        font-size: 24px;
        text-align: center;
        color: #333;

    }

    .item-current {
        font-size: 28px;
        color: #fff;
    }

</style>

<script type="text/babel">
    import back from '../components/back.vue'
    import empty from '../components/empty.vue'
    import loading from  '../components/Loading.vue'
    import storeList from '../components/StoreList.vue'
    import router from '../router/router.js'
    import Tools from '../common/js/Tools.js'
    import noMore from '../components/noMore.vue'

    const storage = weex.requireModule('storage');
    const stream = weex.requireModule('stream');


    export default{
        data: function () {
            return {
                current: 1,//当前选择的类表
                lists: {},//列表数据
                Loading: true,
                empty: false//空
            }
        },
        components: {
            back,
            empty,
            loading,
            storeList,
            noMore
        },
        created: function () {
            let data = sessionStorage.getItem('myUploadView');
            if (data) {//当存在缓存的时候
                data = JSON.parse(data);
                this.current = data.current;
            }
            this.getStarCount();
        },
        methods: {
            getStarCount () {
                stream.fetch({
                    method: 'GET',
                    type: 'json',
                    url: 'https://nearby-api.360che.com/shopout/recommendlist.aspx?bbsid=' + Tools.getCookie('AbcfN_ajaxuid')//_this.$route.params.bbsid
                }, res => {
                    this.lists = res.ok ? res.data : '(network error)';

                    this.defaultPic(this.lists,'audit');
                    this.defaultPic(this.lists,'passed');
                    this.defaultPic(this.lists,'refuse');

                    this.$nextTick(function(){
                        this.Loading = false;
                        this.empty = true;
                        let data = {};
                        data.current = 1;//存储当前展示的类型
                        sessionStorage.setItem('myUploadView', JSON.stringify(data))
                    })
                })
            },
            defaultPic(object,key){//设置默认图片
                for(let i=0;i<this.lists[key].length;i++){
                    object[key][i].photo = Tools.defaultPic(object[key][i].photo,object[key][i].shoptypeid,false);
                }
            },
            clickCurrent(index){
                this.current = index;
                sessionStorage.setItem('myUploadView',JSON.stringify({current:index}));
            }
        },
        mounted(){
        }
    }
</script>


 