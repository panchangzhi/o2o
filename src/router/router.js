import Router from 'vue-router'
import HomeView from "../views/HomeView.vue"
import ChooseMapView from "../views/ChooseMapView.vue"
import StoreDetailView from "../views/StoreDetailView.vue"
import StoreListView from "../views/StoreListView.vue"
import SiteMapView from "../views/SiteMapView.vue"
import AddStore from "../views/AddStore.vue"
import SearchArea from "../views/SearchArea.vue"
import myStoreDetailView from '../views/myStoreDetailView.vue'
import editMyStoreView from '../views/editMyStore.vue'
import myUploadView from '../views/myUploadView.vue'
import myUpLoadDetail from '../views/myUploadDetail.vue'







Vue.use(Router)

export default new Router({
    routes: [{
        path: '/home',
        component: HomeView
    },
        {
            path: '/chooseMap/:type',
            name: 'chooseMap',
            component: ChooseMapView
        },
        {
            path: '/detail/:shopid/:shoptypeid',
            name: 'detail',
            component: StoreDetailView
        },
        {
            path: '/storeList/:typeId',
            name: 'storeList',
            component: StoreListView
        },
        {
            path: '/siteMap/:longitude/:latitude',
            name: 'siteMap',
            component: SiteMapView
        },

        {
            path: '/addStore',
            component: AddStore
        },
        {
            path: '/searchArea',
            component: SearchArea
        },
        {
            path: '/myDetail',
            name: 'myDetail',
            component: myStoreDetailView
        },
        {
            path: '/editMyStore',
            name: 'editMyStore',
            component: editMyStoreView
        },
        {
            path:'/myUpload',
            name:'myUpload',
            component: myUploadView
        },
        {
            path: '/myUpLoadDetail/:shopid',
            name: 'myUpLoadDetail',
            component: myUpLoadDetail
        },
        {
            path: '/',
            redirect: '/home'
        }
    ]
})