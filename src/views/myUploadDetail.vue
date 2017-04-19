<!--
    /**
     * Description: 我的上传店铺的详情
     * author: panchanzhi
     * date: 2017/3/22
     */
-->

<template>
    <div class="my">
        <list class="my-store">
            <cell class="cell">
                <!-- 商家图片 -->
                <image style="width: 750px;height: 420px;" :src="store.photo"></image>

                <!-- 驳回原因-->
                <div v-if="store.faildescription" class="reason">
                    <image style="width: 28px;height: 28px;"
                           src="https://s.kcimg.cn/wap/images/detail/o2oImg/settled_error@2x.png"></image>
                    <text class="reason-text">驳回原因：{{store.faildescription}}</text>
                </div>
                <!-- 店铺名 -->
                <div class="name-wrapper">
                    <text class="name">{{store.name}}</text>
                    <text v-if="store.auditstate == 0" class="state wait">待审核</text>
                    <text v-if="store.auditstate == 1" class="state passed" >已通过</text>
                    <text v-if="store.auditstate == 2" class="state refuse" >已驳回</text>
                </div>

                <!-- 店铺类型 -->
                <div class="type-wrapper">
                    <div :class="['type-item','type-item'+ (index%3)]" v-for="(value,index) in typeShow">
                        <text :class="['type-text','type-text' + (index%3)]">{{value}}</text>
                    </div>
                </div>

                <!-- 地址 -->
                <div class="contact location" @click="goMap">
                    <text class="title">地址</text>
                    <image class="site-tag" style="width:20px;height:26px"
                           src="https://s.kcimg.cn/wap/images/detail/o2oImg/settled_location@2x.png"></image>
                    <text class="contact-text site-text">{{store.address}}</text>
                    <image class="map" style="width: 16px;height: 26px;"
                           src="https://s.kcimg.cn/wap/images/detail/o2oImg/settled_into@2x.png"></image>
                </div>
                <!-- 联系人-->
                <div class="contact linkman">
                    <text class="title">联系人</text>
                    <text class="contact-text linkman-text">{{store.linkman}}</text>
                </div>
                <!-- 手机号 -->
                <div class="contact linkCall">
                    <text class="title">手机号</text>
                    <text class="contact-text linkman-text">{{store.linkcall}}</text>
                </div>
            </cell>
        </list>

        <!-- 返回上一页 -->
        <back></back>
    </div>

</template>


<script type="text/babel">
    import back from '../components/back.vue'
    import Tools from '../common/js/Tools.js'
    import router from '../router/router.js'

    const stream = weex.requireModule('stream');

    export default{
        data: function () {
            return {
                store: {},
                show: false,
                typeShow: [],
                serviceCall: '111111222222'
            }
        },
        components: {
            back
        },
        created: function () {
            stream.fetch({
                method: 'GET',
                type: 'json',
                url: 'https://nearby-api.360che.com/shopout/waiterinfo.aspx?bbsid=' +Tools.getCookie('AbcfN_ajaxuid') +'&waiterid=' + this.$route.params.shopid //  //this.$route.params.[]
            }, res => {
                this.store = res.ok ? res.data : '(network error)';

                //店铺类型显示
                this.typeShow = Tools.typeShow(this.store.typeshow);


                //默认图片
                console.log(this.store);
                this.store.photo = Tools.defaultPic(this.store.photo,this.store.typeid, true)
            })
        },
        methods: {
            goMap(){
                router.push({name: 'siteMap', params: {longitude: this.store.Lng, latitude: this.store.Lat}})
            }
        }
    }
</script>

<style scoped>
    .my{
        flex: 1;
    }
    .my-store {
        flex: 1;
    }

    .cell {
        background-color: #f5f5f5;
    }

    .reason {
        padding-left: 30px;
        flex-direction: row;
        align-items: center;
        height: 72px;
        background-color: #F63711;
    }

    .reason-text {
        margin-left: 10px;
        font-size: 28px;
        color: #fff;
    }

    .name-wrapper {
        flex-direction: row;
        justify-content: center;
        padding-left: 30px;
        padding-right: 30px;
        background-color: #fff;
    }

    .name {
        flex: 1;
        font-size: 36px;
        font-weight: 600;
        color: #333;
        word-wrap: break-word;
        word-break: break-all;
        padding-right: 32px;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .state {
        font-size: 28px;
        padding-top: 20px;
    }
    .wait{
        color: #FEA802;
    }
    .passed{
        color: #09BB07;
    }
    .refuse{
        color:#FD4C29;
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
        border-top-color: #FEA802;
        border-right-color: #FEA802;
        border-bottom-color: #FEA802;
        border-left-color: #FEA802;
    }

    .type-item1 {
        border-top-color: #FE7302;
        border-right-color: #FE7302;
        border-bottom-color: #FE7302;
        border-left-color: #FE7302;
    }

    .type-item2 {
        border-top-color: #028DFE;
        border-right-color: #028DFE;
        border-bottom-color: #028DFE;
        border-left-color: #028DFE;
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

    .contact {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        padding-left: 30px;
        height: 88px;
        overflow: hidden;
        background-color: #fff;
        border-bottom-width: 1px;
        border-bottom-color: #e5e5e5;
        border-bottom-style: solid;
    }

    .title {
        margin-right: 30px;
        font-size: 32px;
        color: #666;
    }

    .site-tag {
        margin-right: 10px;
    }

    .contact-text {
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
        margin-right: 30px;
    }

    .service-text {
        margin-right: 30px;
        font-size: 28px;
        color: #028DFE;
    }

    .button {
        margin-bottom: 30px;
        margin-top: 62px;
        margin-left: 30px;
        margin-right: 30px;
        justify-content: center;
        align-items: center;
        height: 90px;
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


 