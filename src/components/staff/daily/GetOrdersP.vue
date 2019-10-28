<template>
	<div>
		<van-sticky :offset-top="46">
			<div class="van-row">
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%" @click="config.popup.leftPopup.show = true">客户信息信息</van-button>
				</div>
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%"  @click="config.popup.rightFilter.show = true">筛选</van-button>
				</div>
			</div>
		</van-sticky>
		<prev-next-daily @radioConfirm="radioConfirm" :radioData="radioData">
			
		</prev-next-daily>
		<van-popup v-model="config.popup.leftPopup.show" position="left"  :style="{ height: '100%', width:'100%' }">
			<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom">
				<div class="van-nav-bar__title van-ellipsis">
					员工信息
				</div>
			</div>
			<div  style="margin-top:46px">
				<van-field v-model="leftPopupData.CusShortName" readonly label="客户简称" input-align="center"/>
				<van-field v-model="leftPopupData.Merchandiser" readonly label="跟单员" input-align="center"/>
				<van-field v-model="leftPopupData.TaskName" readonly label="业务员" input-align="center"/>
				<van-field v-model="form.beginDate" readonly label="开始日期" input-align="center"/>
				<van-field v-model="form.endDate" readonly label="结束日期" input-align="center"/>
				<van-field v-model="leftPopupData.OrdCount" readonly label="下单笔数" input-align="center"/>
				<van-field v-model="leftPopupData.UnSelCount" readonly label="未排笔数" input-align="center"/>
				<van-field v-model="leftPopupData.SelCount" readonly label="已排笔数" input-align="center"/>
				<van-field v-model="leftPopupData.TOrdVol" readonly label="下单立方" input-align="center"/>
				<van-field v-model="leftPopupData.TProVol" readonly label="生产立方" input-align="center"/>
				<van-field v-model="leftPopupData.TStockVol" readonly label="库存立方" input-align="center"/>
				<van-field v-model="leftPopupData.TUnDeliVol" readonly label="未送立方" input-align="center"/>
				<van-button type="primary" size="normal" style="width:100%;" @click=" config.popup.leftPopup.show = false ">关闭</van-button>
			</div>
		</van-popup>
	</div>
</template>
<script>
	import { Button, Sticky, Popup, Field } from 'vant';
	import PrevNextDaily from '@/components/subject/daily/PrevNextDaily.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Sticky.name]: Sticky,
			[Popup.name]: Popup,
			[Field.name]: Field,

			PrevNextDaily
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
				form:{
					cusId:'',
				},
				leftPopupData:{

				},
				radioData:[],
				filterForm:{

				}
			}
		},
		methods:{
			getCusInfo( data ){
				let self = this;
				this.$request.staff.daily.getCusInfo( data ).then(res=>{
					self.leftPopupData = res.result;
				});
			},
			getDailyDetail( data ){
				let self = this;
				this.$request.staff.daily.getOrderDeatil( data ).then(res=>{
					console.log(res.result);
				});
			},
			getCountOrder(){
				this.$request.staff.daily.getCountOrder().then(res=>{
					console.log(res.result);
				});
			},
			radioConfirm( val ){
				console.log(val);
			}
		},
		mounted(){
			this.getCusInfo( this.form );
			this.getDailyDetail( this.filterForm );
			this.getCountOrder();
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','每日订单详细信息');
			if( sessionStorage.getItem('daily/wGetCusOrder/info') !== null ){
				this.form = JSON.parse(sessionStorage.getItem('daily/wGetCusOrder/info'));
			}else{
				this.$router.go(-1);
			}
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>