<template>
	<div>
		<van-sticky :offset-top="46">
			<div class="van-row">
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%" @click="config.popup.leftPopup.show = true">员工信息</van-button>
				</div>
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%"  @click="config.popup.rightFilter.show = true">筛选</van-button>
				</div>
			</div>
		</van-sticky>
		<van-popup ref="staffInfo" v-model="config.popup.leftPopup.show" position="left"  :style="{ width: '100%', height:'100%' }">
			<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom">
				<div class="van-nav-bar__title van-ellipsis">
					员工信息
				</div>
			</div>
			<div style="margin-top:46px">
				<!-- <van-field v-model="staffInfo." readonly label="员工" input-align="center"/>
				<van-field v-model="staffInfo." readonly label="开始日期" input-align="center"/>
				<van-field v-model="staffInfo." readonly label="结束日期" input-align="center"/> -->
				<van-field v-model="staffInfo.ordAmt" readonly label="下单金额" input-align="center"/>
				<van-field v-model="staffInfo.tLength" readonly label="下单米数" input-align="center"/>
				<van-field v-model="staffInfo.tSalesArea" readonly label="下单平方" input-align="center"/>
			</div>
			<van-button type="primary" size="normal" style="width:100%;" @click="config.popup.leftPopup.show = false">关闭</van-button>
		</van-popup>
	</div>
</template>
<script>
	import { Button, Sticky, Popup, Field  } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Sticky.name]: Sticky,
			[Popup.name]: Popup,
			[Field.name]: Field,
		},
		data(){
			return {
				config:{
					popup:{
						leftPopup:{
							show :false,
						},
						rightFilter:{
							show :false,
						}
					}
				},
				staffInfo:{
					ordAmt:'',
					tLength:'',
					tSalesArea:'',
				}
			}
		},
		methods:{

		},
		mounted(){

		},
		created(){
			this.$store.commit('staff/setHeaderTitle','客户每日订单');
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>