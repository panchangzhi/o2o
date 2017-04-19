<template lang="html">
    <div :class="['check-in',isRadius ? 'radius':'']" id="footer">
        <div class="content">
            <!-- 没有登录 或者卡友 -->
            <div v-if="checkShow" class="button-wrapper kayou">
                <div class="button go-check" @click="goAddStore">
                    <image style="width: 32px;height: 32px;"
                           src="https://s.kcimg.cn/wap/images/detail/o2oImg/settled_add@2x.png"></image>
                    <text class="text">商家入驻</text>
                </div>
                <div v-if="!isListView" class="border"></div>
                <div v-if="!isListView" class="button my-upload" @click="goMyUpload">
                    <image style="width: 32px;height: 34px;"
                           src="https://s.kcimg.cn/wap/images/detail/o2oImg/settled_mine@2x.png"></image>
                    <text class="text">我的上传</text>
                </div>
            </div>

            <!-- 店主登录 -->
            <div v-if="!checkShow" class="button-wrapper host">
                <div class=" button" @click="goMyStoreDetail">
                    <image style="width: 36px;height: 34px;"
                           src="https://s.kcimg.cn/wap/images/detail/o2oImg/settled_myshop@2x.png"></image>
                    <text class="text">我的店铺</text>
                </div>
            </div>

        </div>
        <div class="tip" v-if="loginShow">
            <div class="toast">
                <text class="text-tip">登录上传店铺信息才会有卡路里奖励哦~</text>
                <div class="footer">
                    <div class="cancel" @click="checkIn">
                        <text class="cancel-text">直接上传</text>
                    </div>
                    <div class="ok" @click="login">
                        <text class="ok-text">去登录</text>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script type="text/babel">
    import router from "../router/router"
    import Tools from "../common/js/Tools.js"

    var storage = weex.requireModule('storage');

    export default {
        props: ['isRadius','isListView'],
        data(){
            return {
                loginShow: false,
                checkShow: true,
                data: {
                    ajaxuid: [],
                    nameid: []
                }
            }
        },
        created(){
            //判断用户是否登录和是否是店家
            let _this = this;
            Tools.loginInfor();
            this.$nextTick(function(){
            });
            this.data.ajaxuid = document.cookie.match(/AbcfN_ajaxuid=([^;$]+)/);
            this.data.nameid = document.cookie.match(/AbcfN_nickname=([^;$]+)/);
            if (this.data.ajaxuid && this.data.ajaxuid[1]) {
                storage.setItem('AbcfN_bbsInfo', JSON.stringify(this.data));
            }
            else {
                let script2 = document.createElement('script');
                script2.src = "https://s.kcimg.cn/public/m/js/wechat.accout.binding.min.js";
                document.body.appendChild(script2);

                let link1 = document.createElement('link');
                let head = document.querySelector('head');
                let head1 = document.querySelector('head style');
                link1.rel = 'stylesheet';
                link1.href = "https://res.wx.qq.com/open/libs/weui/0.4.3/weui.min.css";
                head.insertBefore(link1, head1)
            }

            setTimeout(function () {
                //判断是否是店家登录
                storage.getItem('loginInfor', res=>{
                    if(res.data != 'undefined' && JSON.parse(res.data).type){
                        _this.checkShow = false;
                    }
                })
            },3)

        },
        methods: {
            goAddStore(){
                this.isLogin('/addStore');
            },
            checkIn(){
                router.push('/addStore')
            },
            login(){
                truckhomeAccountBinding.show()
            },
            goMyUpload(){
                if (this.data.ajaxuid && this.data.ajaxuid[1]) {
                    router.push('/myUpload');
                }
                else {
                    truckhomeAccountBinding.show();
                }
            },
            goMyStoreDetail(){
                router.push('/myDetail')//进入我的店铺
            },
            isLogin(url){//判断是否登录
                if (this.data.ajaxuid && this.data.ajaxuid[1]) {
                    router.push(url)
                }
                else {
                    this.loginShow = true
                }
            }
        },
        mounted(){
            document.querySelector('#footer').addEventListener('touchmove', function (event) {
                event.preventDefault();
            });
        }
    }
</script>

<style lang="css" scoped>
    .check-in {
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 100px;
        background-color: #09BB07;
    }

    .radius {
        width: 520px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    .content {
        flex: 1;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .text {
        margin-left: 10px;
        font-size: 36px;
        color: #fff;
    }

    .button-wrapper {
        flex: 1;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .button {
        flex: 1;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }

    .border {
        width: 1px;
        height: 40px;
        background-color: rgba(249, 249, 249, .5);
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

    .footer {
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }

    .cancel {
        flex: 1;
        height: 100px;
        border-right-width: 1px;
        border-right-style: solid;
        border-right-color: #e5e5e5;
        justify-content: center;
        align-items: center;
    }

    .cancel-text {
        font-size: 32px;
        color: #333;
    }

    .ok {
        flex: 1;
        height: 100px;
        justify-content: center;
        align-items: center;
    }

    .ok-text {
        font-size: 32px;
        color: #02BB00;
    }
</style>
<style>
    /*<!-- 论坛登录-->*/
    .weui_cells_title {
        font-size: 28px !important;
        padding-left: 30px !important;
        padding-right: 30px !important;
        margin-top: 30px !important;
        margin-bottom: 10px !important;
    }

    .weui_cell {
        padding-top: 20px !important;
        padding-bottom: 20px !important;
        padding-left: 30px !important;
        padding-right: 30px !important;
    }

    .weui_label {
        font-size: 32px !important;
    }

    .weui_input {
        height: 48px !important;
        font-size: 32px !important;
    }

    .weui_btn_area {
        margin-top: 30px !important;
        margin-bottom: 30px !important;
        margin-left: 30px !important;
        margin-right: 30px !important;
    }

    .weui_btn {
        height: 90px !important;
        line-height: 90px !important;
        font-size: 32px !important;
    }

    .account_switch {
        flex: 1 !important;
        text-align: center !important;
        font-size: 28px !important;
    }

    .weui_cell_hd {
        width: 130px !important;
    }

    .weui_label {
        width: 130px !important;
    }

    .weui_vcode .weui_cell_ft .vcode {
        width: 214px !important;
        font-size: 28px !important;
        height: 88px !important;
        line-height: 88px !important;
    }

    .weui_extra_area {
        align-items: center !important;
        justify-content: center !important;
    }

    .weui_toptips {
        height: 100px !important;
        font-size: 28px !important;
    }
</style>
