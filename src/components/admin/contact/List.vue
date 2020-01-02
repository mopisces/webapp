<template>
	<div>
		<van-swipe-cell>
			<template slot="left">
				<van-button square type="primary" text="选择" />
			</template>
			<van-cell :border="false" title="单元格" value="详情" is-link>
				<div slot="title" style="text-align:right;">事实上</div>
				<van-icon class-prefix="iconfont" name="weixin" size="24" slot="icon"/>
			</van-cell>
			<template slot="right">
				<van-button square type="danger" text="删除" />
				<van-button square type="primary" text="收藏"/>
			</template>
		</van-swipe-cell>
	</div>
</template>
<script>
	import { Button, Cell, Icon, SwipeCell } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[Icon.name]: Icon,
			[SwipeCell.name]: SwipeCell,
		},
		data(){
			return {
				value:''
			}
		},
		methods:{

		},
		created(){
			this.$store.commit('admin/setHeaderTitle','联系方式列表');
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