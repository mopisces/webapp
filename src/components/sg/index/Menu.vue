<template>
	<div>
		<van-grid square :gutter="10" :column-num="3">
			<van-grid-item text="生产监控" to="/sg/monitor/websocket">
				<van-icon slot="icon" class-prefix="iconfont" name="shexiangtou" size="35" color="#eff30c"/>
			</van-grid-item>
			<van-grid-item text="备料" to="/sg/select/bl">
				<van-icon slot="icon" name="points" size="35" color="#1a991d"/>
			</van-grid-item>
			<van-grid-item text="备料查询" to="/sg/select/blms">
				<van-icon slot="icon" class-prefix="iconfont" name="sousuo" size="35" color="#1a991d"/>
			</van-grid-item>
			<van-grid-item text="生产订单" to="/sg/select/scdd">
				<van-icon slot="icon" name="records" size="35" color="#1a991d"/>
			</van-grid-item>
			<van-grid-item text="完工订单" to="/sg/select/wgdd">
				<van-icon slot="icon" name="completed" size="35" color="#1a991d"/>
			</van-grid-item>
			<van-grid-item text="修改" to="/sg/alter/index">
				<van-icon slot="icon" class-prefix="iconfont" name="xiugai" size="35" color="#eff30c"/>
			</van-grid-item>
		</van-grid>
	</div>
</template>
<script>
	import { Icon, Grid, GridItem } from 'vant';
	export default {
		components:{
			[Icon.name]: Icon,
			[Grid.name]: Grid,
			[GridItem.name]: GridItem,
		},
		data(){
			return {
				value:''
			}
		},
		methods:{

		},
		created(){
			this.$store.commit('sg/setHeaderTitle','菜单');
		},
		mounted(){

		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>