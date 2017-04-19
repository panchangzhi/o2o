<template>
    <div class="container">
        <list id="storeList">
            <cell>
                <!--添加照片-->
                <add-photo :shootSrc="shootSrc" @shoot="shoot"></add-photo>
            </cell>
            <cell>
                <!--店铺信息-->
                <store-info :shopName="shopName" :shopType="shopType" :shopCity="shopCity"
                            :shopCityDetail="shopCityDetail" @StoreTypeShow="StoreTypeShow" @locationPop="locationPop"
                            @pieceData="pieceData" :locationSelected="locationSelected" @goMap="goMap"></store-info>
            </cell>
            <cell>
                <!--个人信息-->
                <div class="user-info">
                    <user-info :identity="identity" :loadImgSrc="loadImgSrc" :UContactsName="UContactsName"
                               :UContactsPhone="UContactsPhone" :shopUserCode="shopUserCode" @selectThe="selectThe"
                               @upLoadImg="upLoadImg" @writeUserInfo="writeUserInfo" @getCode="getCode"></user-info>
                    <user-store-info v-if="identity==1" :identity="identity" :loadImgSrc="loadImgSrc"
                                     :UContactsName="UContactsName" :UContactsPhone="UContactsPhone"
                                     :shopUserCode="shopUserCode" :codeDisabled="codeDisabled" :second="second"
                                     :codeText="codeText" @selectThe="selectThe" @upLoadImg="upLoadImg"
                                     @writeUserInfo="writeUserInfo" @getCode="getCode"></user-store-info>
                </div>
            </cell>
            <cell>
                <!--提交按钮-->
                <div :class="['submit-button',submit?'':'disabled']" @click="submitData">
                    <text class="submit-text">提交</text>
                </div>
            </cell>
        </list>
        <!-- 返回上一页 -->
        <back></back>

        <!--店铺类型选项-->
        <store-type v-if="storeTypeShow" :storeList="storeList" :maintainList="maintainList" @selectType="selectType"
                    @maintainSelected="maintainSelected"></store-type>

        <!--店铺类型弹窗-->
        <pop v-if="popShow" @popHide="popHide" @submitPop="submitPop"></pop>

        <success-pop v-if="successShow" @clickSuccess="clickSuccess" text="添加成功"></success-pop>
        <defeated-pop v-if="defeatedShow" :errorText="errorText"></defeated-pop>

        <!-- 加载中 -->
        <loading v-if="Loading"></loading>

        <!--店主手机号已经注册-->
        <registered v-if="registered"></registered>


    </div>
</template>
<script type="text/babel">
    import router from '../router/router'
    import registered from '../components/registered.vue'
    import back from '../components/back.vue'
    import qs from 'qs'

    import AddPhoto from '../components/AddPhoto.vue'
    import StoreInfo from '../components/StoreInfo.vue'
    import UserInfo from '../components/UserInfo.vue'
    import UserStoreInfo from '../components/UserStoreInfo.vue'
    import StoreType from '../components/StoreType.vue'
    import Pop from '../components/Pop.vue'
    import successPop from '../components/successPop.vue'
    import defeatedPop from '../components/defeatedPop.vue'
    import Tools from '../common/js/Tools'

    var storage = weex.requireModule('storage')
    var modal = weex.requireModule('modal')
    var stream = weex.requireModule('stream')
    export default {
        data(){
            return {
                Data: {},                //定义最终提交时候发送的内容
                submit: false,           //定义提交按钮的状态
                storeList: [],           //定义商铺类型列表
                maintainList: [],        //定义维修类型列表
                storeTypeShow: false,     //定义是否显示选择商铺类型
                locationSelected: false,  //定义是否选择完城市
                Loading: false,            //点击提交后显示loading

                //定义最终提交成功弹出框
                successShow: false,
                //定义最终提交失败弹出框
                defeatedShow: false,
                errorText: '',

                //定义拍照
                shootSrc: "",            //拍照的路径

                //定义上传图片
                loadImgSrc: '',

                //定义弹窗
                popShow: false,
                popContent: '',
                isMaintainPop: false,

                //定义渲染到页面上的内容
                shopName: '',                //店铺名称
                shopType: '',                //商铺类型
                shopCity: '',                //商铺位置
                shopCityDetail: '',          //详细地址
                identity: '2',                //选择身份信息
                UContactsName: '',           //联系人名字
                UContactsPhone: '',          //手机号
                shopUserCode: '',            //店铺联系人验证码

                //定义code

                codeDisabled: false,        //获取验证码按钮状态
                second: 0,                  //验证码倒计时
                codeText: '获取验证码'

            }
        },
        components: {
            AddPhoto,
            StoreInfo,
            UserInfo,
            StoreType,
            Pop,
            successPop,
            defeatedPop,
            UserStoreInfo,
            back,
            registered
        },
        methods: {
            AlertTo(name){
                modal.alert({
                    message: name,
                    duration: 0.3
                })
            },
            //拍摄照片
            shoot(){
                let _this = this;
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        _this.Data.shootSrc = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        _this.shootSrc = res.localIds;
                        let UA = navigator.userAgent;
                        if (UA.match(/iphone/gi)) {
                            wx.getLocalImgData({
                                localId: res.localIds[0], // 图片的localID
                                success: function (ele) {
                                    _this.Data.shootSrc = ele.localData;
                                    _this.shootSrc = ele.localData; // localData是图片的base64数据，可以用img标签显示
                                }
                            });
                        }
                        wx.uploadImage({
                            localId: res.localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (el) {
                                _this.Data.shopimg = el.serverId; // 返回图片的服务器端ID
                                _this.submitState()//判断提交按钮状态
                            }
                        });
                    }
                });
            },
            //存储信息，进入选择城市页面
            locationPop(){
                router.push('/searchArea');
                storage.setItem('DataAll', JSON.stringify(this.Data), function (e) {

                })
            },
            //调出选择店铺类型的弹层
            StoreTypeShow(){
                this.storeTypeShow = true;
            },
//      选择一级分类
            selectType(id, IsExtend, name, isMaintain){
                if (name != 'write' && name != 'cancel') {
                    //把选择的内容展示在页面
                    this.shopType = name;
                    this.Data.shopType = name;
                    //把选择的内容赋值给Data
                    this.Data.shoptypeid = id;
                    this.Data.shoptypeshow = name;
                    this.submitState()//判断提交按钮状态
                }
                if (IsExtend == 0 && (name != 'write' || name != 'cancel')) {
                    this.storeTypeShow = false;
                    if (name == 'write') {
                        this.popShow = true;
                        //判断是否是维修的二级弹层
                        if (isMaintain) {
                            this.isMaintainPop = true;
                        } else {
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
                this.Data.shoptypeshow = this.shopType + '|' + name;
                this.storeTypeShow = false;
                this.submitState()//判断提交按钮状态
            },
            //隐藏填写店铺类型弹窗
            popHide(){
                this.popShow = false;
            },
            //确定自定义店铺内容
            submitPop(name){
                //如果维修的弹层，name就不修改一级的值
                if (this.isMaintainPop) {
                    this.Data.shoptypeshow = this.shopType + '|' + name;
                } else {
                    this.shopType = name;
                    this.Data.shopType = name;
                    this.Data.shoptypeshow = name;
                }
                this.popShow = false;

                this.$nextTick(res=>{
                    this.submitState()//判断提交按钮状态
                })
            },
            //发送请求
            getStarCount (repo, callback) {
                return stream.fetch({
                    method: 'GET',
                    type: 'json',
                    url: 'https://nearby-api.360che.com/' + repo
                }, callback)
            },
            //发送请求
            postData (data, callback) {
                return stream.fetch({
                    headers: {'Content-Type':'application/x-www-form-urlencoded'},
                    method: 'POST',
                    type: 'json',
                    body: qs.stringify(data),
                    url: 'https://nearby-api.360che.com/shopin/shopin.aspx?'
                }, callback)
            },
            //拼接数据对象
            pieceData(value, type){
                if (type == 'name') {
                    this.Data.name = value;
                } else if (type == 'address') {
                    this.Data.address = value;
                }
                this.submitState();
            },
            //最终提交数据
            submitData(){
                if (!this.submit) {
                    return
                }

                this.submit = false;

//            判断手机号码格式
                let phone = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                if (!phone.test(this.Data.linkcall)) {
                    this.defatedPopShow('手机号码格式不正确');
                    this.submit = true;
                    return;
                }

                this.Loading = true;

                let _this = this;

                //如果选择的是卡友推荐，把店主上传的图片置空
                if (this.Data.recommendertype == 2) {
                    this.Data.certificatesimg = ''
                }

                this.postData(this.Data, res => {
                    if (res.ok) {
                        _this.Loading = false;
                        if (res.data.state == 'success') {
                            _this.successShow = true;
                        }
                        else {
                            if (res.data.errorcode == '14')//如果店主手机号已经注册显示弹层
                            {
                                let loginInfor = {
                                    shopid: res.data.shopid,
                                    waiterid: (res.data.waiterid ? res.data.waiterid : false),
                                    type: true
                                };
                                res.data.bbsid ? document.cookie = 'AbcfN_ajaxuid=' + res.data.bbsid : document.cookie = 'AbcfN_ajaxuid=""; expires=-1';//设置bbsid
                                storage.setItem('loginInfor', JSON.stringify(loginInfor));
                                _this.submit = true;
                                _this.registered = true;
                            }
                            else {
                                _this.defatedPopShow(res.data.errordescription);
                                _this.submit = true;
                                storage.setItem('DataAll', _this.Data)
                            }
                        }
                    }
                    else{

                    }
                })
            },
            defaultPic(object, key){//设置默认图片
                for (let i = 0; i < object[key].length; i++) {
                    object[key][i].photo = Tools.defaultPic(object[key][i].photo, object[key][i].shoptypeid, false);
                }
            },
            defatedPopShow(errText){
                let _this = this;
                this.defeatedShow = true;
                this.errorText = errText;
                let time = setTimeout(function () {
                    _this.defeatedShow = false;
                    clearTimeout(time)
                }, 2000);
            },
            //上传图片
            upLoadImg(){

                this.identity = 1;
                let _this = this;


                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        _this.Data.loadImgSrc= res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        _this.loadImgSrc = res.localIds;

                        let UA = navigator.userAgent;
                        if (UA.match(/iphone/gi)) {
                            wx.getLocalImgData({
                                localId: res.localIds[0], // 图片的localID
                                success: function (ele) {
                                    _this.Data.loadImgSrc = ele.localData;
                                    _this.loadImgSrc = ele.localData; // localData是图片的base64数据，可以用img标签显示
                                }
                            });
                        }
                        wx.uploadImage({
                            localId: res.localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function (el) {
                                _this.Data.certificatesimg = el.serverId; // 返回图片的服务器端ID
                                _this.submitState()//判断提交按钮状态
                            }
                        });
                    }
                });
            },
            //选择商家入驻还是卡友推荐
            selectThe(type){
//            this.AlertTo(11)
                //切换选择类型
                this.identity = type;
                this.Data.recommendertype = type;
                this.submitState()//判断提交按钮状态
            },
            //跳转到地图页，存储对象
            goMap(){
                storage.setItem('DataAll', JSON.stringify(this.Data), function (e) {
                    router.push({name: 'chooseMap', params: {type: 'checkIn'}})
                })
            },
            //输入联系人信息
            writeUserInfo(value, type, name){
                if (name == 'phone') {
                    let phone = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                    if (phone.test(value) && this.second <= 0) {
                        this.codeDisabled = true;
                    } else {
                        this.codeDisabled = false;
                    }
                }
                if (name == 'name') {
                    this.UContactsName = value;
                    this.Data.recommendername = value;
                    this.Data.linkman = value;
                } else if (name == 'phone') {
                    this.UContactsPhone = value;
                    this.Data.recommendertel = value;
                    this.Data.linkcall = value;
                } else {
                    this.shopUserCode = value;
                    this.Data.vcode = value
                }
                this.submitState()//判断提交按钮状态
            },

            //获取验证码
            getCode(){
                if (!this.codeDisabled) {
                    return;
                }
                let _this = this;
                this.codeDisabled = false;
                this.second = 60;
                _this.codeText = _this.second + '秒后 重新获取';
                var time = setInterval(function () {
                    if (_this.second <= 0) {
                        clearInterval(time);
                        _this.codeText = "获取验证码";
                        _this.codeDisabled = true;
                    } else {
                        _this.second = parseInt(_this.second);
                        _this.second--;
                        _this.codeText = _this.second + '秒后 重新获取';
                    }
                }, 1000);

                this.getStarCount('cm/SMSVerification.aspx?tel=' + this.UContactsPhone, res => {
                    if (res.ok) {
                        if (res.data.state == 'success') {

                        } else {
                            _this.defatedPopShow(res.data.errordescription);
                        }
                    }
                })


            },
            //点击最终提交成功的弹层
            clickSuccess(){
                this.successShow = false;
                router.push('/home');
            },
            submitState(){
                if (this.Data.shopimg && this.Data.name && this.Data.shoptypeshow && this.Data.citysn && this.Data.address && this.Data.linkman && this.Data.linkcall && this.Data.recommendertype && this.Data.recommendername && this.Data.recommendertel) {
                    if (this.Data.recommendertype == 1 && this.Data.certificatesimg && this.Data.vcode) {
                        this.submit = true;
                    } else if (this.Data.recommendertype == 2) {
                        this.submit = true
                    } else {
                        this.submit = false;
                    }
                } else {
                    this.submit = false
                }
            }
        },
        created(){

            let _this = this;
            //进入页面获取存储对象，并且赋值
            storage.getItem('DataAll', function (e) {
                if (e.result == "success") {
                    let data = JSON.parse(e.data);

                    //获取到存储内容，给Data对象赋值渲染到页面上
                    _this.Data.shootSrc = _this.shootSrc = data.shootSrc;         //店铺照片路径
                    _this.Data.shopimg = data.shopimg;   //店铺照片的serverId

                    _this.Data.name = _this.shopName = data.name;                   //店铺名称
                    _this.Data.shopType = _this.shopType = data.shopType;                                 //店铺种类名称
                    _this.Data.shoptypeid = data.shoptypeid;                        //店铺类型id
                    _this.Data.shoptypeshow = data.shoptypeshow;                    //店铺种类
                    _this.Data.address = _this.shopCityDetail = data.address;       //店铺地址

                    //营业执照
                    _this.Data.loadImgSrc = _this.loadImgSrc = data.loadImgSrc;
                    _this.Data.certificatesimg = data.certificatesimg;

                    //选择是个人还是店铺
                    if (data.recommendertype) {
                        _this.Data.recommendertype = _this.identity = data.recommendertype;
                    } else {
                        _this.Data.recommendertype = 2;
                        _this.identity = 2;
                    }

                    _this.Data.linkman = _this.Data.recommendername = _this.UContactsName = data.recommendername;
                    _this.Data.linkcall = _this.Data.recommendertel = _this.UContactsPhone = data.recommendertel;
                    _this.Data.vcode = _this.shopUserCode = data.vcode;


                    //            判断手机号码格式
                    let phone = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
                    if (phone.test(_this.Data.linkcall)) {
                        _this.codeDisabled = true;
                    }

                    _this.submitState()//判断提交按钮状态
                }
            });
            //进入页面获取存储对象，并且赋值
            storage.getItem('City', function (e) {
                if (e.result == "success") {
                    let data = JSON.parse(e.data);

                    //获取到存储内容，渲染到页面上
                    _this.shopCity = data.name;
                    _this.Data.citysn = data.id;
                    _this.locationSelected = true;
                    _this.submitState()//判断提交按钮状态
                }
            });

            //进入页面获取详细位置，并且赋值
            storage.getItem('location', function (e) {
                if (e.result == "success") {
                    let data = JSON.parse(e.data);
                    _this.Data.address = _this.shopCityDetail = data.address;   //详细位置
                    _this.Data.lng = data.longitude;       //经度
                    _this.Data.lat = data.latitude;        //纬度

                    _this.submitState()//判断提交按钮状态
                }
                else {
                    storage.getItem('nowLocation', ele => {
                        if (ele.data != "undefined") {
                            let data = JSON.parse(ele.data);
                            _this.Data.lng = data.lng || data.longitude;
                            _this.Data.lat = data.lat || data.latitude;
                        }
                    })
                }
            });

            //进入页面，判断是否登录，获取论坛ID和论坛名称

            storage.getItem('AbcfN_bbsInfo', ele => {
                if (ele.result == "success") {
                    let data = JSON.parse(ele.data);
                    _this.Data.bbsid = data.ajaxuid[1]
                    _this.Data.bbsname = data.nameid[1]
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

        }
    }
</script>

<style scoped>
    .container {
        flex: 1;
    }

    .submit-button {
        height: 90px;
        margin-top: 60px;
        margin-left: 30px;
        margin-bottom: 60px;
        margin-right: 30px;
        background-color: rgba(9, 187, 7, 1);
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
    }

    .submit-text {
        font-size: 32px;
        color: #fff;
    }

    .disabled {
        background-color: rgba(9, 187, 7, .4);
    }

    .user-info {
        border-top-width: 20px;
        border-top-style: solid;
        border-top-color: #f5f5f5;
        padding-left: 30px;
        background-color: #fff;
    }
</style>
