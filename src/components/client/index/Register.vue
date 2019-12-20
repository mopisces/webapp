<template>
	<div>
		<van-field v-model="value" label="账号" placeholder="大写字母,小写字母,数字,长度2-10位" required input-align="center" maxlength="10" show-word-limit/>
		<van-field v-model="value" label="密码" placeholder="请输入密码" type="password" required input-align="center" maxlength="20" show-word-limit/>
		<van-field v-model="value" label="确认密码" placeholder="请确认密码" type="password" required input-align="center" maxlength="20" show-word-limit/>
		<van-field v-model="value" label="客户全称" placeholder="请输入客户全称" required input-align="center" maxlength="20" show-word-limit/>
		<van-field v-model="value" label="客户简称" placeholder="请输入客户简称" required input-align="center" maxlength="20" show-word-limit/>
		<van-field v-model="value" label="客户编号" placeholder="大写字母,数字,长度2-6位" required input-align="center" maxlength="6" show-word-limit/>
		<van-field v-model="value" label="送货地址" placeholder="请输入送货地址" required input-align="center" maxlength="50" show-word-limit/>
		<van-field v-model="value" label="联系人" placeholder="请输入联系人" required input-align="center" maxlength="10" show-word-limit/>
		<van-field v-model="value" label="联系电话" placeholder="请输入联系电话" required input-align="center"/>
		<van-field v-model="value" label="联系传真" placeholder="请输入联系传真" input-align="center"/>
		<van-button type="primary" style="width:100%;margin-top:1.25rem;">注册</van-button>
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
				formData:{

				},
				value:''
			}
		},
		methods:{

		},
		created(){
			this.$store.commit('client/setHeaderTitle','注册页面');
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