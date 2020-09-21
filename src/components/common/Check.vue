<template>
	<div>
		<van-nav-bar title="审核账号"/>
		<van-field label="绑定账号" v-model="formData.userName" disabled />
		<van-field label="微信昵称" v-model="formData.nickName" disabled />
		<van-field label="姓名" v-model="formData.userFullName" disabled />
		<van-field label="手机号码" v-model="formData.telNo" disabled />
		<div style="text-align:center;margin-top:1rem;">
			<van-button type="primary" style="width:100%;" :disabled="config.button.disabled" block @click="verify()">{{ config.button.text }}</van-button>
		</div>
	</div>
</template>
<script>
	import { Button, Field, NavBar } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[NavBar.name]: NavBar
		},
		data(){
			return {
				config:{
					button:{
						text : '审核通过',
						disabled : false,
					}
				},
				openid:'',
				formData:{
					userName     : '',
					nickName     : '',
					userFullName : '',
					telNo        : '',
					openid : ''
				},
				postData:{
					openid:'',
					userName:''
				}
			}
		},
		methods:{
			getVerifyInfo(){
				let self = this;
				this.$request.wechat.config.getVerifyInfo(this.postData).then(res=>{
					if( res.errorCode == '00000' ){
						self.formData.userName     = res.result.UserName;
						self.formData.nickName     = res.result.NickName;
						self.formData.userFullName = res.result.UserFullName;
						self.formData.telNo        = res.result.TelNo;
						self.formData.openid       = res.result.OpenID
						if( res.result.Stopped == 0 ){
							self.config.button.disabled = true;
							self.config.button.text     = '已审核';
						}
					}
				});
			},
			verify(){
				let self = this;
				this.$request.wechat.login.wxBindVerify(this.postData.openid).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.button.disabled = true;
						self.config.button.text     = '已审核';
					}
				});
			}
		},
		created(){
			if( typeof( this.$route.query.verifyInfo ) == 'undefined' ){
				return false;
			}
			this.postData.openid = this.$route.query.verifyInfo;
			this.postData.userName = this.$route.query.userName;
			this.getVerifyInfo();
		},
		mounted(){

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