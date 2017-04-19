<!--
    /**
     * Description: edit my store
     * author: panchanzhi
     * date: 2017/3/22
     */
-->

<template>
    <div class="edit-store">
        <list>
            <cell class="cell">
                <!-- 店铺图片-->
                <image style="width: 750px;height: 420px;margin-bottom: 20px"
                       :src="store.photo"></image>

                <div class="change" @click="shoot">
                    <text class="change-text">修改</text>
                </div>

                <div class="main">
                    <div class="input-wrapper">
                        <text class="title text">商铺名称</text>
                        <input class="text input-text" v-model="store.name" @change="change"/>
                    </div>

                    <div class="input-wrapper" @click="storeTypeShow = true">
                        <text class="title text">商铺类型</text>
                        <text class="text input-text" v-model="store.shopType"></text>
                        <image class="more"
                               src="https://s.kcimg.cn/wap/images/detail/o2oImg/settled_into@2x.png"></image>
                    </div>

                    <div class="input-wrapper">
                        <text class="title text">详细地址</text>
                        <input class="text input-text" v-model="store.address" @change="change"/>

                        <div class="location" @click="goMap">
                            <image class="location-icon"
                                   src="https://s.kcimg.cn/wap/images/detail/o2oImg/settled_location@2x.png"
                                   style=""></image>
                            <text class="location-text">定位</text>
                        </div>
                    </div>

                    <div class="input-wrapper">
                        <text class="title text linkman">联系人</text>
                        <input class="text input-text" v-model="store.linkman" @change="change"/>
                    </div>
                </div>

                <!-- 编辑 提交按钮-->
                <div class="button" @click="submit">
                    <text class="button-text">提交</text>
                </div>
            </cell>
        </list>
        <!--店铺一级类型选项-->
        <store-type v-if="storeTypeShow" :storeList="storeList" :maintainList="maintainList" @selectType="selectType"
                    @maintainSelected="maintainSelected"></store-type>

        <!-- 返回上一页-->
        <back></back>

        <!--店铺维修子类型弹窗-->
        <pop v-if="popShow" @popHide="popHide" @submitPop="submitPop"></pop>

        <!-- 添加成功 弹层-->
        <success-pop v-if="successShow" @clickSuccess="clickSuccess" text="编辑成功"></success-pop>

        <!-- 添加失败 弹层 -->
        <defeated-pop v-if="defeatedShow" :errorText="errorText"></defeated-pop>



    </div>
</template>

<style scoped>
    .edit-store {
        flex: 1;
        background-color: #f5f5f5;
    }

    .cell {
        background-color: #f5f5f5;
    }

    .change {
        position: absolute;
        top: 30px;
        right: 30px;
        width: 138px;
        height: 60px;
        justify-content: center;
        align-items: center;
        border-bottom-left-radius: 30px;
        border-bottom-right-radius: 30px;
        border-top-left-radius: 30px;
        border-top-right-radius: 30px;
        background-color: rgba(0, 0, 0, 0.6)

    }

    .change-text {
        color: #fff;
        font-size: 32px;
    }

    .main {
        padding-left: 30px;
        background-color: #fff;
    }

    .input-wrapper {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        height: 88px;
        border-bottom-width: 1px;
        border-bottom-style: solid;
        border-bottom-color: #e5e5e5;
    }

    .text {
        font-size: 32px;
    }

    .title {
        width: 130px;
        color: #666;
    }
    .linkman{
        width: 96px;
    }

    .input-text {
        flex: 1;
        padding-left: 30px;
        padding-right: 30px;
        height: 48px;
    }

    .more {
        margin-left: 30px;
        margin-right: 30px;
        width: 16px;
        height: 26px;
    }

    .location {
        width: 138px;
        border-left-width: 1px;
        border-left-style: solid;
        border-left-color: #e5e5e5;
        flex-direction: row;
        align-items: center;
    }

    .location-icon {
        width: 20px;
        height: 26px;
        margin-right: 10px;
        margin-left: 28px;
    }

    .location-text {
        color: #09BB07;
        font-size: 28px;
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

<script type="text/babel">
    import back from '../components/back.vue'
    import router from '../router/router.js'
    import StoreType from '../components/StoreType.vue'
    import Pop from '../components/Pop.vue'
    import Tools from '../common/js/Tools.js'
    import successPop from '../components/successPop.vue'
    import defeatedPop from '../components/defeatedPop.vue'

    const storage = weex.requireModule('storage');
    const stream = weex.requireModule('stream');


    export default{
        data: function () {
            return {
                store: {},
                imgSrc: '',
                storeList: [],           //定义商铺类型列表
                maintainList: [],        //定义维修类型列表
                storeTypeShow: false,   //商铺一级类型选择
                popShow: false,         //维修类型选择
                isMaintainPop: false,   //自定义弹窗是否是二级类型的
                url: '',                 //请求接口
                successShow: false,     //修改成功弹层
                defeatedShow: false,    //修改失败
                errorText: '修改失败'             //错误提示信息
            }
        },
        components: {
            back,
            StoreType,
            Pop,
            successPop,
            defeatedPop
        },
        created: function () {

            storage.getItem('editData', res => {
                if (res.data != 'undefined') {
                    this.store = JSON.parse(res.data);
                    console.log(this.store)
                }
                else {//请求数据

                    this.url = Tools.hostFetch();//判断请求那个接口

                    this.$nextTick(function () {
                        stream.fetch({
                            method: 'GET',
                            type: 'json',
                            url: this.url
                        }, res=> {
                            this.store = res.ok ? res.data : '(network error)';
                            console.log('111', this.store);
                            //店铺类型显示
                            if (this.store.typeshow.indexOf('|') != -1) {
                                this.store.shopType = '\u7ef4\u4fee';
                            }
                            else {
                                this.store.shopType = this.store.typeshow;
                            }

                            this.store.photo = Tools.defaultPic(this.store.photo, this.store.typeid, true);//默认图片
                            this.store.shopimg = '';

                            storage.setItem('editData', JSON.stringify(this.store));//缓存数据
                        });
                    })
                }
            })


            //获取商家类别选项
            this.getStarCount('cm/GetShoptypes.aspx', res => {
                this.storeList = res.ok ? res.data : '(network error)'
            });

            //获取维修类型列表
            this.getStarCount('cm/GetServiceitems.aspx?shoptypeid=1', res => {
                this.maintainList = res.ok ? res.data : '(network error)'
            });

        },
        methods: {
            getStarCount (repo, callback) {
                return stream.fetch({
                    method: 'GET',
                    type: 'json',
                    url: 'https://nearby-api.360che.com/' + repo
                }, callback)
            },
            shoot(){//微信拍摄照片
                let _this = this;
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        _this.store.photo = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片

                        let UA = navigator.userAgent;
                        if (UA.match(/iphone/gi)) {
                            wx.getLocalImgData({
                                localId: res.localIds[0], // 图片的localID
                                success: function (ele) {
                                    _this.store.photo = ele.localData; // localData是图片的base64数据，可以用img标签显示
                                }
                            });
                        }

                        wx.uploadImage({
                            localId: res.localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (el) {
                                _this.store.shopimg = el.serverId; // 返回图片的服务器端ID

                                storage.setItem('editData', JSON.stringify(_this.store));//存储数据
                            }
                        });


                    }
                });
            },
            //去获取地理位置地图页面
            goMap(){
                router.push({name: 'chooseMap', params: {type: 'my'}});//进去我的店铺获取地理位置
            },
            //提交表单
            submit(){

                if (this.store.auditstate != 1) {//待审核、已驳回提交表单
                    storage.getItem('loginInfor', res=> {
                        if (res.data != 'undefined') {
                            this.store.waiterid = JSON.parse(res.data).waiterid;
                            console.log('storage',this.store.waiterid);
                        }
                    })

                    this.$nextTick(function(){
                        console.log('$nextTick',this.store.waiterid);
                        let data = '?recommenderid=' + Tools.getCookie('AbcfN_ajaxuid') + '&id=' + this.store.waiterid + '&name=' + this.store.name + '&shopimg=' + this.store.shopimg + '&shoptypeid=' + this.store.typeid + '&shoptypeshow=' + this.store.typeshow + '&linkman=' + this.store.linkman + '&address=' + this.store.address + '&Lng=' + this.store.Lng + '&Lat=' + this.store.Lat;
                        this.getStarCount('shopin/waitermodify.aspx' + data, res => {
                            this.submitState(res.data);
                        })
                    })
                }
                else {//已通过提交表单
                    let data = '?shopid=' + this.store.id + '&bbsid=' + Tools.getCookie('AbcfN_ajaxuid') + '&name=' + this.store.name + '&shopimg=' + this.store.shopimg + '&shoptypeid=' + this.store.typeid + '&shoptypeshow=' + this.store.typeshow + '&linkman=' + this.store.linkman + '&address=' + this.store.address + '&Lng=' + this.store.lng + '&Lat=' + this.store.lat;
                    this.getStarCount('shopin/shopmodify.aspx' + data, res => {
                        this.submitState(res.data);
                    })
                }
            },
            //判断提交状态
            submitState(data){
                if (data == '1') {
                    this.successShow = true;
                }
                else {
                    this.defatedPopShow()
                }
            },
            //提交成功确认按钮
            clickSuccess(){
                this.successShow = false;
                storage.removeItem('editData');//提交成功后清楚缓存
                router.push('/myDetail');
            },
            //提交失败
            defatedPopShow(){
                let _this = this;
                this.defeatedShow = true;
                //this.errorText = errText;
                let time = setTimeout(function () {
                    _this.defeatedShow = false;
                    clearTimeout(time)
                }, 2000);
            },
            //表单输入内容发生改变后缓存数据
            change(){
                console.log('缓存数据');
                if (event.value == '') {
                    console.log('提交不能用');
                }
                storage.setItem('editData', JSON.stringify(this.store));
            },
            //调出选择店铺类型的弹层
            StoreTypeShow(){
                this.storeTypeShow = true;
            },
            //选择一级分类
            selectType(id, IsExtend, name, isMaintain){
                if (name != 'write' && name != 'cancel') {
                    //把选择的内容展示在页面
                    this.store.shopType = name;
                    //把选择的内容赋值给Data
                    this.store.typeid = id;
                    this.store.typeshow = name;

                    console.log('缓存数据');
                    storage.setItem('editData', JSON.stringify(this.store));//缓存数据
                    //this.submitState()//判断提交按钮状态
                }
                if (IsExtend == 0 && (name != 'write' || name != 'cancel')) {
                    this.storeTypeShow = false;
                    if (name == 'write') {
                        this.popShow = true;
                        //判断是否是维修的二级弹层
                        if (isMaintain) {
                            this.isMaintainPop = true;
                        }
                        else {
                            this.isMaintainPop = false;
                        }
                    }
                }
            },
            //选择维修二级分类
            maintainSelected(names){
                let name = names.join(',');
                name = name.replace(/^,+/, '');
                name = name.replace(/,+/g, ',');
                this.store.typeshow = this.store.shopType + '|' + name;
                this.storeTypeShow = false;

                storage.setItem('editData', JSON.stringify(this.store));//缓存数据
            },
            //隐藏填写店铺类型弹窗
            popHide(){
                this.popShow = false;
            },
            //确定自定义店铺内容
            submitPop(name){
                //如果维修的弹层，name就不修改一级的值
                if (this.isMaintainPop) {
                    this.store.typeshow = this.store.shopType + '|' + name;
                } else {
                    this.store.shopType = name;
                    this.store.typeshow = name;
                }
                this.popShow = false;

                storage.setItem('editData', JSON.stringify(this.store));//缓存数据
            }
        }
    }
</script>


 