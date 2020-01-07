<template>
	<div>
		<van-collapse v-model="activeName" accordion>
			<van-collapse-item title="用户权限" name="0">
				<van-switch-cell v-model="formData.Wap0Right" title="用户权限" />
			</van-collapse-item>
			<van-collapse-item title="微信订单" name="1">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.WeborderBeginDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.WeborderEndDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.WeborderMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.WeborderMaxDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="7">默认删除原因</van-col>
					<van-col span="13">
						<input v-model="formData.WeborderDefaultDelRemark" style="width:100%;">
					</van-col>
					<van-col span="4">用,隔开</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="ERP订单" name="2">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.Wap0GetOrdersBeginDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.Wap0GetOrdersEndDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.Wap0GetOrdersMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.Wap0GetOrdersMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="每日订单" name="3">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrdersPBeginDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrdersPEndDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrdersPMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.GetOrdersPMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
			<van-collapse-item title="对账单" name="4">
				<van-row justify="center">
					<van-col span="5">默认日期</van-col>
					<van-col span="9">
						<input v-model="formData.GetCusFreeMBBeginDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.GetCusFreeMBEndDate" style="width:100%;">
					</van-col>
				</van-row>
				<van-row justify="center" style="margin-top:0.125rem;">
					<van-col span="5">日期范围</van-col>
					<van-col span="9">
						<input v-model="formData.GetCusFreeMBMinDate" style="width:100%;">
					</van-col>
					<van-col span="1">~</van-col>
					<van-col span="9">
						<input v-model="formData.GetCusFreeMBMaxDate" style="width:100%;">
					</van-col>
				</van-row>
			</van-collapse-item>
		</van-collapse>
		<div style="width:100%;height:3.125rem;"></div>
		<div style="width:100%;position:fixed;bottom:3.125rem;">
			<van-button round type="primary" style="width:50%;" @click="saveConfig()">
				保存
			</van-button>
			<van-button round type="info" style="width:50%;" @click="getConfig()">
				重置
			</van-button>
		</div>
	</div>
</template>
<script>
	import {  Button, Row, Col, SwitchCell, Dialog, Collapse, CollapseItem  } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Row.name]: Row,
			[Col.name]: Col,
			[SwitchCell.name]: SwitchCell,
			[Collapse.name]: Collapse,
			[CollapseItem.name]: CollapseItem,
		},
		data(){
			return {
				activeName:'',
				formData : {
					Wap0Right                : '',  //用户权限
					WeborderBeginDate        : '',  //微信订单(默认日期)
					WeborderEndDate          : '',  //微信订单
					WeborderMinDate          : '',  //微信订单(日期范围)
					WeborderMaxDate          : '',  //微信订单
					WeborderDefaultDelRemark : '',  //微信订单(默认删除原因)
					Wap0GetOrdersBeginDate   : '',  //ERP订单(默认日期)
					Wap0GetOrdersEndDate     : '',  //ERP订单
					Wap0GetOrdersMinDate     : '',  //ERP订单(日期范围)
					Wap0GetOrdersMaxDate     : '',  //ERP订单
					GetOrdersPBeginDate      : '',  //每日订单(默认日期)
					GetOrdersPEndDate        : '',  //每日订单
					GetOrdersPMinDate        : '',  //每日订单(日期范围)
					GetOrdersPMaxDate        : '',  //每日订单
					GetCusFreeMBBeginDate    : '',  //对账单(默认日期)
					GetCusFreeMBEndDate      : '',  //对账单
					GetCusFreeMBMinDate      : '',  //对账单(日期范围)
					GetCusFreeMBMaxDate      : '',  //对账单
				}
			}
		},
		methods:{
			getConfig(){
				let self = this;
				this.$request.admin.config.getConfig().then((res)=>{
					Object.assign(self.formData,res.result);
				}).then(()=>{
					if( this.formData.Wap0Right == 1 ){
						this.formData.Wap0Right = true;
					}else{
						this.formData.Wap0Right = false;
					}
				});
			},
			saveConfig(){
				let postData = Object.assign({},this.formData);
				postData.Wap0Right = this.formData.Wap0Right ? 1 : 0;
				this.$request.admin.config.saveConfig( JSON.stringify( postData ) ).then(res=>{
					let message = ''
					if( res.errorCode == '00000' ){
						message = '修改成功!';
					}else{
						message = '修改失败!';
					}
					Dialog.alert({
						message : message
					}).then(()=>{
						Dialog.close();
					});
				}).then(()=>{
					this.getConfig();
				});
			}
		},
		created(){
			this.$store.commit('admin/setHeaderTitle','外部参数修改');
		},
		mounted(){
			this.getConfig();
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