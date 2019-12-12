<template>
	<van-popup v-model="show" :style="{ width: '100%',height:'100%' }" position="top">
		<van-sticky>
			<div class="van-nav-bar van-hairline--bottom" style="z-index: 1;">
				<div class="van-nav-bar__left">
					<span class="van-nav-bar__text">详细信息</span>
				</div>
				<div class="van-nav-bar__title van-ellipsis"></div>
				<div class="van-nav-bar__right" @click="closeClick">
					<i class="van-icon van-icon-cross" style="font-size: 16px;"><!----></i>
				</div>
			</div>
		</van-sticky>
		<van-field label="客户" readonly v-model="info.data.Cus"  input-align="center" />
		<van-field label="业务员" readonly v-model="info.data.Task"  input-align="center" />
		<van-field label="是否停单" readonly v-model="info.data.Stopped" input-align="center" />
		<van-field label="是否为月结客户" readonly v-model="info.data.SettleDay" input-align="center"/>
		<van-field label="下单未送金额" readonly v-model="info.data.OrdNeedAmt" input-align="center" />
		<van-field label="信用额" readonly v-model="info.data.MinAmtCond"  input-align="center" />
		<van-field label="当前欠款" readonly v-model="info.data.CurAmt" input-align="center" />
		<van-field label="信用余额" readonly v-model="info.data.LeftMinAmtCond" input-align="center" />
		<van-field label="查询时间" readonly v-model="info.data.QueryTime" input-align="center" />
		<van-button type="primary" size="normal" style="width:100%" @click="refresh()">刷新</van-button>
	</van-popup>
</template>
<script>
	import { Button, Popup, Field, Sticky } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Popup.name]: Popup,
			[Field.name]: Field,
			[Sticky.name]: Sticky,
		},
		props:['detailCusId','detailShow'],
		data(){
			return {
				info:{
					data:{
						Cus            : '',
						Task           : '',
						Stopped        : '',
						SettleDay      : '',
						OrdNeedAmt     : '',
						MinAmtCond     : '',
						CurAmt         : '',
						LeftMinAmtCond : '',
						QueryTime      : '',
					}
				},
				show : this.detailShow
			}
		},
		methods:{
			getInitData(){
				let self = this;
				let postData = {
					cusId : this.detailCusId,
				};
				this.$request.staff.cred.cusAmtDetail( postData ).then(res=>{
					self.info.data           = res.result;
					self.info.data.Stopped   = ( res.result.Stopped == 1 ) ? '是' : '否';
					self.info.data.SettleDay = ( res.result.SettleDay == 1 ) ? '是' : '否';
				});
			},
			refresh(){
				this.getInitData();
			},
			closeClick(){
				this.show = false;
			}
		},
		mounted(){
			
		},
		created(){
			
		},
		computed:{
			
		},
		watch:{
			detailShow(newV,oldV){
				this.show = newV;
			},
			show(newV,oldV){
				if( newV == true ){
					this.getInitData();
				}
				this.$emit("update:detailShow", newV);
			}
		}
	}
</script>
