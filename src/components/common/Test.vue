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
				}
			}
		},
		methods:{
			getBindInfo(){
				let self = this;
				this.$request.wechat.config.getBindInfo(this.openid).then(res=>{
					if( res.errorCode == '00000' ){
						self.formData.userName     = res.result.info.UserName;
						self.formData.nickName     = res.result.info.NickName;
						self.formData.userFullName = res.result.info.UserFullName;
						self.formData.telNo        = res.result.info.TelNo;
						if( res.result.info.Stopped == 0 ){
							self.config.button.disabled = true;
							self.config.button.text     = '已审核';
						}
					}
				});
			},
			verify(){
				let self = this;
				this.$request.wechat.login.wxBindVerify(this.openid).then(res=>{
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
			this.openid = this.$route.query.verifyInfo;
			this.getBindInfo();
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