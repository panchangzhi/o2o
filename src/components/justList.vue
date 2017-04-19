<!--
    /**
     * Description: 所有商家列表组件
     * author: panchanzhi
     * date: 2017/4/11
     */
-->

<template>
    <list class="lists">
        <cell v-for="item in lists">
            <!-- 数据不为空 列表-->
            <keep-alive>
                <store-list :store="item" :type="true"></store-list>
            </keep-alive>
        </cell>
    </list>
</template>

<style scoped>
</style>

<script type="text/babel">
    import storeList from './StoreList.vue'
    export default{
        data: function(){
            return {}
        },
        props:['lists'],
        components:{
            storeList
        },
        created: function(){
        },
        methods:{

        }
    }

</script>


 