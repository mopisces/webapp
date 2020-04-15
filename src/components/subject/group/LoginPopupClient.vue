<template>
	<van-popup v-model="show" round position="bottom" :style="{ height: '30%' }" >
		<van-field v-model="formData.clientName" type="text" label="用户名" placeholder="请输入登录名" required />
		<van-field v-model="formData.clientPass" type="password" label="密码" required placeholder="请输入密码"/>
		<van-button type="primary" style="width:100%;" size="small" :disabled=" config.disabled ">登陆</van-button>
	</van-popup>
</template>
<script>
	import { Button, Popup, Field } from 'vant';
	import schema from 'async-validator';
	export default {
		components:{
			[Button.name]: Button,
			[Popup.name]: Popup,
			[Field.name]: Field,
		},
		props:[ 'loginShow' ],
		data(){
			return {
				show:this.loginShow,
				formData:{
					clientName:'',
					clientPass:''
				},
				validator:{},
				rules : {
					clientName:[
						{ type: 'string', required: true, message: '请输入用户名'},
						{ regexp: '/^[a-zA-Z0-9]{2,12}$/', message: '用户名格式错误'},
					],
					clientPass:[
						{ type: 'string', required: true, message: '请输入密码'},
						{ regexp: '/^[a-zA-Z0-9]{2,12}$/', message: '密码格式错误'},
					]
				},
				config:{
					disabled : true
				}
			}
		},
		methods:{
			
		},
		mounted(){
			this.validator = new schema(this.rules);
		},
		created(){
			
		},
		computed:{
			
		},
		watch:{
			loginShow(newV,oldV){
				this.show = newV;
			},
			show(newV,oldV){
				this.$emit("update:loginShow", newV);
			}
		}
	}
</script>