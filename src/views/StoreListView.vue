<template lang="html">
    <div class="store-list">
        <!-- 商家列表 -->
        <keep-alive>
            <all-store :typeId = 'typeId' :isPage="isPage"></all-store>
        </keep-alive>
        <!-- 返回上一页 -->
        <back></back>
    </div>
</template>

<script type="text/babel">
    import CheckInFooter from '../components/CheckInFooter.vue'
    import Tools from '../common/js/Tools'
    import back from '../components/back.vue'
    import allStore from '../components/allStore.vue'


    const storage = weex.requireModule('storage');
    let stream = weex.requireModule('stream');

    export default {
        data(){
            return {
                lists: [],
                isPage: this.$route.params.typeId==9? 'dealer':'other',
                typeId: this.$route.params.typeId
            }
        },
        components: {
            CheckInFooter,
            back,
            allStore
        },
        created () {
            try {
                //清除商家入驻页面缓存
                storage.removeItem('DataAll');
                storage.removeItem('City');
                storage.removeItem('location');
            } catch (err) {
                console.log(err)
            }
        },
        mounted(){
            Tools.scrollTop();
        }
    }
</script>

<style lang="css" scoped>
    .store-list {
        flex: 1;
        background-color: #fff;
    }
</style>
