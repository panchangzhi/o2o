<template>
    <div>
        <div class="allmap" id="allmap">

        </div>

        <!-- 返回上一页 -->
        <back></back>

    </div>
</template>

<script type="text/babel">
    import back from '../components/back.vue'
    import Tools from '../common/js/Tools'

export default {
     created(){

     },
    components:{
        back
    },
    mounted(){

        let lng = this.$route.params.longitude;
        let lat = this.$route.params.latitude;

        // 百度地图API功能
        let map = new BMap.Map("allmap");
        let point = new BMap.Point(lng,lat);
        map.centerAndZoom(point,19);
        let geoc = new BMap.Geocoder();

        geoc.getLocation(point, function(rs){
            map.addOverlay(new BMap.Marker(point));
		});
    }
}
</script>

<style scoped>
    .allmap{
        flex: 1;
        transform: scale(2);
    }
</style>
