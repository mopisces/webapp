<template>
	<div v-if="show">
		<van-cell-group title="微信支付信息">
			<van-field v-model="formData.WxAppSecret" required label="AppSecret" right-icon="question-o" placeholder="请输入微信AppSecret" @click-right-icon="$toast('微信AppSecret')"/>
			<van-field v-model="formData.WxMchId" required label="商户号" right-icon="question-o" placeholder="请输入商户号" @click-right-icon="$toast('商户号')"/>
			<van-field v-model="formData.WxKey" required label="商户支付密钥" right-icon="question-o" placeholder="请输入商户支付密钥" @click-right-icon="$toast('商户支付密钥')" type="textarea" :rows="1" autosize/>

			<van-field v-model="formData.WxSslcertPath" required label="apiclient_cert" right-icon="question-o" placeholder="请输入微信apiclient_cer证书绝对路径" @click-right-icon="$toast('建议与 htdocs 文件夹平级')" type="textarea" :rows="2" autosize/>
			<van-field v-model="formData.WxSslkeyPath" required label="apiclient_key" right-icon="question-o" placeholder="请输入微信apiclient_cer证书绝对路径" @click-right-icon="$toast('建议与 htdocs 文件夹平级')" type="textarea" :rows="2" autosize/>
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
					WxAppSecret   : '',
					WxMchId       : '',
					WxKey         : '',
					WxSslcertPath : '',
					WxSslkeyPath  : '',
				},
				show : false
			}
		},
		methods:{
			getConfig(){
				let self = this;
				this.$request.admin.config.getConfig().then((res)=>{
					self.formData.WxAppSecret   = res.result.WxAppSecret;
					self.formData.WxMchId       = res.result.WxMchId;
					self.formData.WxKey         = res.result.WxKey;
					self.formData.WxSslcertPath = res.result.WxSslcertPath;
					self.formData.WxSslkeyPath  = res.result.WxSslkeyPath;
					if( (Number(res.result.UseBoardGroup) || Number(res.result.UseBoxGroup)) && Number(res.result.UseWxPay) ){
						this.show = true;
					}else{

						Dialog.alert({
							title   : '支付参数信息',
							message : '暂无修改微信支付信息权限'
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
				});
			}
		},
		created(){
			this.$store.commit('admin/setHeaderTitle','微信支付信息');
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