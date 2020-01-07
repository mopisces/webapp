<template>
	<div>
		<van-collapse v-model="activeName" accordion>
			<van-collapse-item title="纸板团购功能" name="0">
				<van-switch-cell v-model="formData.UseBoardGroup" title="纸板团购功能" />
			</van-collapse-item>
			<template v-if=" formData.UseBoardGroup ">
				<van-collapse-item title="展示团购已结束的纸板" name="1">
					<van-switch-cell v-model="formData.ShowEdBoard" title="展示团购已结束的纸板" />
				</van-collapse-item>
				<van-collapse-item title="纸板特殊标识文字" name="2">
					<van-row justify="center">
						<van-col span="8">特殊标识文字</van-col>
						<van-col span="9">
							<input v-model="formData.BoardFlag" style="width:100%;">
						</van-col>
						<van-col span="7">
							建议2个汉字
						</van-col>
					</van-row>
				</van-collapse-item>
			</template>
			<van-collapse-item title="淘宝箱团购功能" name="3">
				<van-switch-cell v-model="formData.UseBoxGroup" title="淘宝箱团购功能" />
			</van-collapse-item>
			<template v-if=" formData.UseBoxGroup ">
				<van-collapse-item title="展示团购已结束的淘宝箱" name="4">
					<van-switch-cell v-model="formData.ShowEdBox" title="展示团购已结束的淘宝箱" />
				</van-collapse-item>
				<van-collapse-item title="淘宝箱特殊标识文字" name="5">
					<van-row justify="center">
						<van-col span="8">特殊标识文字</van-col>
						<van-col span="9">
							<input v-model="formData.BoxFlag" style="width:100%;">
						</van-col>
						<van-col span="7">
							建议2个汉字
						</van-col>
					</van-row>
				</van-collapse-item>
			</template>
			<template v-if=" formData.UseBoardGroup || formData.UseBoxGroup ">
				<van-collapse-item title="微信支付功能" name="6">
					<van-switch-cell v-model="formData.UseWxPay" title="微信支付功能" />
				</van-collapse-item>
				<van-collapse-item title="支付宝支付功能" name="7">
					<van-switch-cell v-model="formData.UseAliPay" title="微信支付功能" />
				</van-collapse-item>
			</template>
			<template v-if=" ( formData.UseBoardGroup || formData.UseBoxGroup ) && ( formData.UseWxPay || formData.UseAliPay ) ">
				<van-collapse-item title="有效支付时间(秒)" name="8">
					<van-row justify="center">
						<van-col span="9">有效支付时间(秒)</van-col>
						<van-col span="9">
							<input v-model="formData.ValidPayTime" style="width:100%;">
						</van-col>
					</van-row>
				</van-collapse-item>
			</template>
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
					UseBoardGroup : '',  //纸板团购功能
					ShowEdBoard   : '',  //展示团购已结束的纸板
					BoardFlag     : '',  //纸板特殊标识文字
					UseBoxGroup   : '',  //淘宝箱团购功能
					ShowEdBox     : '',  //展示团购已结束的淘宝箱
					BoxFlag       : '',  //淘宝箱特殊标识文字
					UseWxPay      : '',  //微信支付功能
					UseAliPay     : '',  //支付宝支付功能
					ValidPayTime  : '',  //有效支付时间(秒)
				}
			}
		},
		methods:{
			getConfig(){
				let self = this;
				this.$request.admin.config.getConfig().then((res)=>{
					Object.assign(self.formData,res.result);
				}).then(()=>{
					if( this.formData.UseBoardGroup == 1 ){
						this.formData.UseBoardGroup = true;
					}else{
						this.formData.UseBoardGroup = false;
					}

					if( this.formData.ShowEdBoard == 1 ){
						this.formData.ShowEdBoard = true;
					}else{
						this.formData.ShowEdBoard = false;
					}

					if( this.formData.UseBoxGroup == 1 ){
						this.formData.UseBoxGroup = true;
					}else{
						this.formData.UseBoxGroup = false;
					}

					if( this.formData.ShowEdBox == 1 ){
						this.formData.ShowEdBox = true;
					}else{
						this.formData.ShowEdBox = false;
					}

					if( this.formData.UseWxPay == 1 ){
						this.formData.UseWxPay = true;
					}else{
						this.formData.UseWxPay = false;
					}

					if( this.formData.UseAliPay == 1 ){
						this.formData.UseAliPay = true;
					}else{
						this.formData.UseAliPay = false;
					}
				});
			},
			saveConfig(){
				let postData = Object.assign({},this.formData);
				postData.UseBoardGroup = this.formData.UseBoardGroup ? 1 : 0;
				postData.ShowEdBoard   = this.formData.ShowEdBoard ? 1 : 0;
				postData.UseBoxGroup   = this.formData.UseBoxGroup ? 1 : 0;
				postData.ShowEdBox     = this.formData.ShowEdBox ? 1 : 0;
				postData.UseWxPay      = this.formData.UseWxPay ? 1 : 0;
				postData.UseAliPay     = this.formData.UseAliPay ? 1 : 0;
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
			},
		},
		created(){
			this.$store.commit('admin/setHeaderTitle','团购参数');
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