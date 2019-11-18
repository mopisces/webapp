<template>
	<div style="height:100%;width:100%;">
		<div class="van-nav-bar van-hairline--bottom" style="z-index: 1;">
			<div class="van-nav-bar__title van-ellipsis">绍兴合润</div>
		</div>
		<div style="width: 100%;height:40%;position: fixed;top: 30%;text-align:center;">
			<van-grid>
				<van-image src="https://img.yzcdn.cn/vant/cat.jpeg" width="30%" height="80%" solt="icon"/>
				<span solt="text">客户登录</span>
			</van-grid>
		</div>
		<div class="footer" style="width: 100%;position: fixed;bottom: 0;">
			<van-row type="flex" justify="center" style="text-align:center;">
				<van-col span="18">杭州利鹏科技有限公司 提供技术支持</van-col>
			</van-row>
			<van-row type="flex" justify="center" style="text-align:center;">
				<van-col span="18">联系电话：18768443628</van-col>
			</van-row>
		</div>
	</div>
</template>
<script>
	import { Image, Row, Col, Grid, GridItem } from 'vant';
	export default {
		components:{
			[Image.name]: Image,
			[Row.name]: Row,
			[Col.name]: Col,
			[Grid.name]: Grid,
			[GridItem.name]: GridItem,
		},
		data(){
			return {

			}
		},
		methods:{

		},
		created(){
			this.$store.commit('staff/setHeaderTitle','用户登录');
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
