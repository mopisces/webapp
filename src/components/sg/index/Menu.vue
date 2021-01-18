<template>
	<div>
		<van-grid square :gutter="10" :column-num="3">
			<van-grid-item text="修改" to="/sg/alter/index" v-if="showAlter">
				<van-icon slot="icon" class-prefix="iconfont" name="xiugai" size="35" color="#1a991d"/>
			</van-grid-item>
			<van-grid-item text="用户管理" to="/sg/user/index">
				<van-icon slot="icon" name="friends-o" size="35" color="#1a991d"/>
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
				showAlter:false
			}
		},
		methods:{

		},
		created(){
			this.$store.commit('sg/setHeaderTitle','菜单');
		},
		mounted(){
			if( sessionStorage.getItem('jpdn-sg-root') && sessionStorage.getItem('jpdn-sg-root') == 0){
				this.showAlter = true;
			}
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