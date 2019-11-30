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
		<van-button type="primary" size="normal" style="width:100%" @click="refresh()">刷新</van-button>
	</div>
</template>
<script>
	import { Button, Field } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
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
			},
			refresh(){
				this.getInitData(  this.form );
			}
		},
		mounted(){
			this.getInitData(  this.form );
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','客户信用余额/详细信息');
			this.$store.commit('staff/setBackPath','/staff/cred/WGetCusAmt');
			if( sessionStorage.getItem('cred/wGetCusAmt/cusId') !== null ){
				this.form.cusId = sessionStorage.getItem('cred/wGetCusAmt/cusId');
			}else{
				this.$router.push( this.$store.state.staff.backPath );
			}
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>
