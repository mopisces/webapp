<template>
	<div>
		<van-field v-model="pageData.cusName" input-align="center" readonly label="客户" placeholder="客户名称"/>
		<van-field v-model="pageData.taskInfo" input-align="center" readonly label="业务员" placeholder="业务员"/>
		<van-field v-model="pageData.isStopped" input-align="center" readonly label="是否停单" placeholder="是否停单"/>
		<van-field v-model="pageData.isSettleDay" input-align="center" readonly label="是否为月结客户" placeholder="是否为月结客户"/>
		<template v-if="showRestCred == 1">
			<van-field v-model="pageData.ordNeedAmt" input-align="center" readonly label="下单未送金额" placeholder="下单未送金额"/>
			<van-field v-model="pageData.minAmtCond" input-align="center" readonly label="信用额" placeholder="信用额"/>
			<van-field v-model="pageData.curAmt" input-align="center" readonly label="当前欠款" placeholder="当前欠款"/>
		</template>
		<van-field v-model="pageData.leftMinAmtCond" input-align="center" readonly label="信用余额" placeholder="信用余额"/>
		<van-field v-model="pageData.queryTime" input-align="center" readonly label="查询时间" placeholder="查询时间"/>
		<van-button type="primary" size="normal" style="width:100%;" @click="creditBalanceAmt()">刷新</van-button>
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
				pageData:{
					cusName        : '',    //客户名称
					taskInfo       : '',    //业务员
					isStopped      : '',    //是否停单
					isSettleDay    : '',    //是否为月结客户
					ordNeedAmt     : '',    //下单未送金额
					minAmtCond     : '',    //信用额
					curAmt         : '',    //当前欠款
					leftMinAmtCond : '',    //信用余额
					queryTime      : '',    //查询时间
				},
				showRestCred: 0
			}
		},
		methods:{
			creditBalanceAmt(){
				this.$request.client.cred.creditBalanceAmt().then(res=>{
					if( res.errorCode == '00000' ){
						this.showRestCred = Number(res.have_right)
						this.pageData.cusName        = res.result.cus;
						this.pageData.taskInfo       = res.result.task;
						this.pageData.isStopped      = res.result.Stopped == '1' ? '是' : '否'; 
						this.pageData.isSettleDay    = ( typeof(res.result.SettleDay) !== 'undefined' && res.result.SettleDay == '0' ) ? '否' : '是';
						this.pageData.ordNeedAmt     = res.result.OrdNeedAmt;
						this.pageData.minAmtCond     = res.result.MinAmtCond;
						this.pageData.curAmt         = res.result.CurAmt;
						this.pageData.leftMinAmtCond = res.result.LeftMinAmtCond;
						this.pageData.queryTime      = res.result.query_time;
					}
				});
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','信用余额');
		},
		mounted(){
			this.creditBalanceAmt();
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