<template>
	<div>
		<van-field v-model="formData.userName" required clearable label="用户名" placeholder="请输入用户名" :error-message="config.errMessage.name"/>
		<van-field v-model="formData.userPass" required clearable label="密码" placeholder="请输入密码" :error-message="config.errMessage.pass" />
		<van-button type="primary" size="normal" style="width:100%;position:fixed;bottom:3.125rem;" @click="onSubmit()">
			添加用户
		</van-button>
	</div>
</template>
<script>
	import { Button, Field, Toast } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[Toast.name]: Toast,
		},
		data(){
			return {
				config:{
					errMessage:{
						name:'',
						pass:''
					}
				},
				formData:{
					userName : '',
					userPass : ''
				}
			}
		},
		methods:{
			onSubmit(){
				let self = this;
				if( !( /^[0-9a-zA-Z]{6,12}$/.test( this.formData.userName ) ) ){
					this.config.errMessage.name = '用户名不符合规则';
					return ;
				}
				if( !( /^[0-9a-zA-Z]{6,12}$/.test( this.formData.userPass ) ) ){
					this.config.errMessage.pass = '密码不符合规则';
					return ;
				}
				this.$request.admin.user.addUser( this.formData ).then(res=>{
					if( res.errorCode === '00000' ){
						Toast.success('添加成功!');
						Object.keys( this.formData ).forEach((item,index)=>{
							this.formData[item] = '';
						});
					}
				});
			}
		},
		created(){
			this.$store.commit('admin/setHeaderTitle','添加用户');
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