<template>
	<div>
		<van-field label="客户" readonly v-model="info.data.Cus"  input-align="center" />
		<van-field label="业务员" readonly v-model="info.data.Task"  input-align="center" />
		<van-field label="是否停单" readonly v-model="info.data.Stopped" input-align="center" />
		<van-field label="是否为月结客户" readonly v-model="info.data.SettleDay" input-align="center"/>
		<van-field label="下单未送金额" readonly v-model="info.data.OrdNeedAmt" input-align="center" />
		<van-field label="信用额" readonly v-model="info.data.MinAmtCond"  input-align="center" />
		<van-field label="当前欠款" readonly v-model="info.data.CurAmt" input-align="center" />
		<van-field label="信用余额" readonly v-model="info.data.LeftMinAmtCond" input-align="center" />
		<van-field label="查询时间" readonly v-model="info.data.QueryTime" input-align="center" />
	</div>
</template>
<script>
	import {  Field } from 'vant';
	export default {
		components:{
			[Field.name]: Field,
		},
		data(){
			return {
				info:{
					data:{
						Cus:'',
						Task:'',
						Stopped:'',
						SettleDay:'',
						OrdNeedAmt:'',
						MinAmtCond:'',
						CurAmt:'',
						LeftMinAmtCond:'',
						QueryTime:'',
					}
				},
				form:{
					cusId:''
				}
			}
		},
		methods:{
			getInitData( data ){
				let self = this;
				this.$request.staff.cred.cusAmtDetail( data ).then(res=>{
					self.info.data = res.result;
					self.info.data.Stopped = ( res.result.Stopped == 1 ) ? '是' : '否';
					self.info.data.SettleDay = ( res.result.SettleDay == 1 ) ? '是' : '否';
				});
			}
		},
		mounted(){
			this.getInitData(  this.form );
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','客户信用余额/详细信息');	
			if( sessionStorage.getItem('cred/wGetCusAmt/cusId') !== null ){
				this.form.cusId = sessionStorage.getItem('cred/wGetCusAmt/cusId');
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
