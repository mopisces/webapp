<template>
	<div>
		<van-field v-model="formData.userName" label="账号" placeholder="大写字母,小写字母,数字,长度2-10位" required input-align="center" maxlength="10" show-word-limit/>
		<van-field v-model="formData.passWord" label="密码" placeholder="请输入密码" type="password" required input-align="center" maxlength="20" show-word-limit/>
		<van-field v-model="formData.confirmPass" label="确认密码" placeholder="请确认密码" type="password" required input-align="center" maxlength="20" show-word-limit/>
		<van-field v-model="formData.chiName" label="客户全称" placeholder="请输入客户全称" required input-align="center" maxlength="20" show-word-limit/>
		<van-field v-model="formData.shortName" label="客户简称" placeholder="请输入客户简称" required input-align="center" maxlength="20" show-word-limit/>
		<van-field v-model="formData.erpId" label="客户编号" placeholder="大写字母,数字,长度2-6位" required input-align="center" maxlength="6" show-word-limit/>
		<van-field v-model="formData.dnAddress" label="送货地址" placeholder="请输入送货地址" required input-align="center" maxlength="50" show-word-limit/>
		<van-field v-model="formData.contactPerson" label="联系人" placeholder="请输入联系人" required input-align="center" maxlength="10" show-word-limit/>
		<van-field v-model="formData.contactPhone" label="联系电话" placeholder="请输入联系电话" required input-align="center"/>
		<van-field v-model="formData.faxNo" label="联系传真" placeholder="请输入联系传真" input-align="center"/>
		<van-button type="primary" style="width:100%;margin-top:1.25rem;" @click="checkData()">注册</van-button>
	</div>
</template>
<script>
	import { Button, Field, Toast } from 'vant';
	import schema from 'async-validator';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[Toast.name]: Toast,
		},
		data(){
			return {
				formData:{
					userName      : '',  //账号
					passWord      : '',  //密码
					confirmPass   : '',  //确认密码
					chiName       : '',  //客户全称
					shortName     : '',  //客户简称
					erpId         : '',  //客户编号
					dnAddress     : '',  //送货地址
					contactPerson : '',  //联系人
					contactPhone  : '',  //联系电话
					faxNo         : '',  //联系传真
				},
				rules:{
					userName : [
						{required : true , message:'请填写账号'},
						{validator: (rule, value, callback, source, options)=>{
							let errors;
							if( !(/(^[a-zA-Z][A-Za-z0-9]{1,5}$)/.test(this.formData.ordQty) ) ){
								errors = '账号只能字母开头且只能有数字和字母';
							}
							callback(errors);
						}}
					],
					passWord : [{required : true , message:'请填写密码'}],
					confirmPass : [
						{required : true , message:'请确认密码'},
						{validator: (rule, value, callback, source, options)=>{
							let errors;
							if( value != this.formData.passWord ){
								errors = '两次密码输入不同';
							}
							callback(errors);
						}},
					],
					chiName:[{required : true , message:'请填写客户全称'}],
					shortName:[{required : true , message:'请填写客户简称'}],
					erpId:[{required : true , message:'请填写客户编号'}],
					dnAddress:[{required : true , message:'请填写送货地址'}],
					contactPerson:[{required : true , message:'请填写联系人'}],
					contactPhone:[{required : true , message:'请填写联系电话'}],
				},
				validator:{}
			}
		},
		methods:{
			checkData(){
				let self = this;
				this.validator.validate(this.formData).then(()=>{
					self.register();
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			register(){
				let self = this;
				this.$request.client.other.register( this.formData ).then(res=>{
					if( res.errorCode == '00000' ){
						Toast.success('注册成功');
						self.$router.push('/group/client/login');
					}
				});
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','注册页面');
		},
		mounted(){
			this.validator = new schema(this.rules);
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