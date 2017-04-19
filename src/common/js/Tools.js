const storage = weex.requireModule('storage');
let stream = weex.requireModule('stream');

//判断url入口，发送ga
export default{
    //跳页面统计
    postGaPage(){
        let openId = this.getCookie("udstatistics");
        let url = window.location.href;
        storage.getItem('GAUrl', ele => {
            if(ele.result == 'success'){
                if(ele.data != url){
                    stream.fetch({
                        method: 'post',
                        type: 'json',
                        data:'{v:1,tid:UA-64002767-18,cid:'+ openId +'t:pageview,dp:'+ url.substring(url.indexOf('#')-1) + '}',
                        url:'https://www.google-analytics.com/collect'
                    })

                    storage.setItem('GAUrl',url);
                }
            }else{
                storage.setItem('GAUrl',url);
            }
        });
    },
    //事件统计
    postGaEvent(ec,ea,el){
        let openId = this.getCookie("udstatistics");
        stream.fetch({
            method: 'post',
            type: 'json',
            data:'{v:1,tid:UA-64002767-18,cid:'+ openId +'t:event,ec:'+ ec + 'ea:'+ ea + 'el:'+ el +'}',
            url:'https://www.google-analytics.com/collect'
        })
    },
    //获取cookie
    getCookie(key){
        let t;
        let n = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
        return (t = document.cookie.match(n)) ? unescape(t[2]) : null
    },
    //判断是不是微信
    isWx(){
        let ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
                return true;
            }
        else {
            return false;
        }
    },
    //默认图片
    defaultPic(photo,shoptypeid,large){
        shoptypeid = shoptypeid.toString();
        if(shoptypeid == '9' && photo){
            return photo;
        }
        if(large){//商家详情默认图片
            if(photo){
                if(photo.indexOf('https://img1.kcimg.cn/') != -1 || photo.indexOf('https://s.kcimg.cn/wap/images/detail/o2oImg/') != -1){
                    return photo;
                }
                return 'https://img1.kcimg.cn/' + photo+ '!600'
            }
            else{
                switch (shoptypeid){
                    case '1'://维修
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_repair_large@2x.png';
                    case '2'://配件
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_parts_large@2x.png';
                    case '3'://停车站
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_parking_large@2x.png';
                    case '4'://住宿
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_hotel_large@2x.png';
                    case '5'://服务区
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_service_large@2x.png';
                    case '6'://物流配货
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_logistics_large@2x.png';
                    case '7'://加油站
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_gasstation_large@2x.png';
                    case '8'://服务站
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_servicestation_large@2x.png';
                    case '9'://经销商
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_distributor_large@2x.png';
                    default:
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_nonel@2x.png';
                }
            }

        }
        else{//附近商家列表
            if(photo){
                if(photo.indexOf('https://img1.kcimg.cn/') != -1 || photo.indexOf('https://s.kcimg.cn/wap/images/detail/o2oImg/') != -1){
                    return photo;
                }
                return 'https://img1.kcimg.cn/' + photo+ '!200'
            }
            else{
                switch (shoptypeid){
                    case '1'://维修
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_repair@2x.png';
                    case '2'://配件
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_parts@2x.png';
                    case '3'://停车站
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_parking@2x.png';
                    case '4'://住宿
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_hotel@2x.png';
                    case '5'://服务区
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_service@2x.png';
                    case '6'://物流配货
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_logistics@2x.png';
                    case '7'://加油站
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_gasstation@2x.png';
                    case '8'://服务站
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_servicestation@2x.png';
                    case '9'://经销商
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none_distributor@2x.png';
                    default:
                        return 'https://s.kcimg.cn/wap/images/detail/o2oImg/settled_none@2x.png';
                }
            }

        }
    },
    //判断用户登录没有，登录后是卡友  还是店主
    loginInfor(){
        let bbsid = this.getCookie('AbcfN_ajaxuid');
        if(bbsid){
            storage.getItem('loginInfor',res=>{
                if( res.data == 'undefined' || bbsid != JSON.parse(res.data).bbsid || !JSON.parse(res.data).bbsid){//当存在缓存且cookie存在和缓存和cookie的值不同时
                    stream.fetch({
                        method: 'GET',
                        type: 'json',
                        url: 'https://nearby-api.360che.com/shopout/shopinfo_bbsid.aspx?bbsid=' + bbsid
                    },res=>{
                        let loginInfor = res.ok ? res.data : '(network error)';
                        if(loginInfor.shopid >0)//店主且店铺通过审核
                        {
                            loginInfor.type = true;
                            storage.setItem('loginInfor',JSON.stringify(loginInfor));//有店铺（店主登录）
                        }
                        else{//卡友登录
                            if(loginInfor.waiterid){//店主且店铺未通过审核

                                loginInfor.type = true;
                                storage.setItem('loginInfor',JSON.stringify(loginInfor));
                            }
                            else{
                                loginInfor.type = false;
                                storage.setItem('loginInfor',JSON.stringify(loginInfor));
                            }
                        }
                    })
                }

            })

        }
        else{
/*            storage.getItem('loginInfor', res=>{//判断是否通过商家入驻登录的店家
                if(res.data != 'undefined' && JSON.parse(res.data).type){
                    return ;
                }
            });*/
            storage.setItem('loginInfor',JSON.stringify({type: false}))//没有登录
        }
    },
    //店家登录，判断请求那个数据接口
    hostFetch(){
        let data = '';
        storage.getItem('loginInfor', res=> {
            if (res.data != 'undefined') {
                let loginInfor = JSON.parse(res.data);
                if(loginInfor.shopid > 0){
                    console.log('已通过');
                    data = 'https://nearby-api.360che.com/shopout/shopinfo.aspx?shopid=' + loginInfor.shopid;
                }
                else{
                    console.log('未通过');
                    data ='https://nearby-api.360che.com/shopout/waiterinfo.aspx?waiterid=' + loginInfor.waiterid + '&bbsid=' + this.getCookie('AbcfN_ajaxuid')
                }
                //data = loginInfor.waiterid ? ('https://nearby-api.360che.com/shopout/waiterinfo.aspx?waiterid=' + loginInfor.waiterid + '&bbsid=' + this.getCookie('AbcfN_ajaxuid')) : ('https://nearby-api.360che.com/shopout/shopinfo.aspx?shopid=' + loginInfor.shopid);
            }
        });

        return data;
    },
    //店铺类型的展示
    typeShow(typeshow){
        //店铺类型显示
        let t = [];
        if (typeshow.indexOf('|') != -1) {
            let index =typeshow.split('|')[1];
            if (index) {
                if(index.indexOf(',') != -1){
                    index = index.split(',');
                    t = index;
                }
                else {
                    t.push(index)
                }
            }
            else {
                t.push(typeshow.split('|')[0]);
            }
        } else {
            t.push(typeshow);
        }
        return t;
    },
    scrollTop(){
        let storeList = document.querySelector('#storeList');
        let start = '';
        let move = '';
        let starX = '';
        let moveX = '';

        if(storeList){
            storeList.addEventListener('touchstart',function(event){
                start = event.targetTouches[0].clientY;
                starX = event.targetTouches[0].clientX;
            });

            storeList.addEventListener('touchmove', function(event) {
                move = event.targetTouches[0].clientY;
                moveX = event.targetTouches[0].clientX;
                if(Math.abs(starX-moveX) > 100){
                    event.preventDefault();
                }
                if(storeList.scrollTop == 0 &&  start - move < 0){
                    event.preventDefault();
                }
            });
        }else{
            document.body.firstElementChild.addEventListener('touchstart',function(event){
                start = event.targetTouches[0].clientY;
                starX = event.targetTouches[0].clientX;
            });

            document.body.firstElementChild.addEventListener('touchmove', function(event) {
                move = event.targetTouches[0].clientY;
                moveX = event.targetTouches[0].clientX;
                if(Math.abs(starX-moveX) > 100){
                    event.preventDefault();
                }
                if(start - move < 0){
                    event.preventDefault();
                }
            });
        }
    },
    pageAnimation(){
        let sessionRouter = sessionStorage.getItem('routerList');
        let routerList = sessionRouter ? JSON.parse(sessionRouter):[];
        let routerListL = routerList.length;

        if( routerListL > 0){
            if(location.href != routerList[routerListL-1]){//判断不是刷新

                if(routerList[routerListL-2] && location.href == routerList[routerListL-2]){
                    routerList.pop();
                    sessionStorage.setItem('routerList', JSON.stringify(routerList))
                    console.log('后退',JSON.parse(sessionStorage.getItem('routerList')));
                    return ;
                }
                else{
                    routerList.push(location.href);
                    sessionStorage.setItem('routerList',JSON.stringify(routerList))
                    console.log('前进',JSON.parse(sessionStorage.getItem('routerList')));
                    return ;
                }
            }
            else{//是刷新
                console.log('刷新',JSON.parse(sessionStorage.getItem('routerList')))
                return ;
            }
        }
        else{
            sessionStorage.setItem('routerList',JSON.stringify([location.href]))
            console.log('首次加载',JSON.parse(sessionStorage.getItem('routerList')))
            return ;
        }
    }
}

