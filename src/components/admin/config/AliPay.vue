<template>
	<div v-if="show">
		<van-cell-group title="支付宝支付信息">
			<van-field v-model="formData.AliAppId" required label="支付宝AppId" right-icon="question-o" placeholder="支付宝AppId" @click-right-icon="$toast('支付宝AppId')"/>
			<van-field v-model="formData.AliPublicKey" required label="支付宝公钥" right-icon="question-o" placeholder="请输入支付宝公钥" @click-right-icon="$toast('支付宝公钥')" type="textarea" rows="5" />
			<van-field v-model="formData.AliRsaPrivateKey" required label="支付宝商户私钥" right-icon="question-o" placeholder="请输入支付宝商户私钥" @click-right-icon="$toast('支付宝商户私钥')" type="textarea" rows="5"/>
		</van-cell-group>
		<van-button round type="primary" style="width:50%;" @click="saveConfig()">
			保存
		</van-button>
		<van-button round type="info" style="width:50%;" @click="getConfig()">
			重置
		</van-button>
	</div>
</template>
<script>
	import { Button, CellGroup, Field, Dialog } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[CellGroup.name]: CellGroup,
			[Field.name]: Field,
		},
		data(){
			return {
				formData:{
					AliAppId         : '',
					AliPublicKey     : '',
					AliRsaPrivateKey : ''
				},
				show:false
			}
		},
		methods:{
			getConfig(){
				let self = this;
				this.$request.admin.config.getConfig().then((res)=>{
					self.formData.AliAppId         = res.result.AliAppId;
					self.formData.AliPublicKey     = res.result.AliPublicKey;
					self.formData.AliRsaPrivateKey = res.result.AliRsaPrivateKey;
					if( (Number(res.result.UseBoardGroup) || Number(res.result.UseBoxGroup)) && Number(res.result.UseAliPay) ){
						self.show = true;
					}else{
						Dialog.alert({
							title   : '支付参数信息',
							message : '暂无修改支付宝支付信息权限'
						}).then(()=>{
							Dialog.close();
							self.$router.push('/admin/index/menu');
						});
					}
				});
			},
			saveConfig(){
				let jsonData = JSON.stringify( this.formData );
				this.$request.admin.config.saveConfig( jsonData ).then((res)=>{
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
				});;
			}
		},
		created(){
			this.$store.commit('admin/setHeaderTitle','支付宝支付信息');
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