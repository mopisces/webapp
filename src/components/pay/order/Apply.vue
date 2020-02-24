<template>
	<div>
		<div class="van-cell" style="">
			<div class="van-cell__title">
				<span>退款金额</span>
			</div>
			<div class="van-cell__value" style="text-align:left;">
				<span style="color: red;">￥{{ formData.cost }}</span>
			</div>
		</div>
		<van-field v-model="formData.reason" error rows="5" autosize label="退款原因" type="textarea" maxlength="50" placeholder="退款原因必须填写" show-word-limit required />
		<div style="text-align:center;">
			<van-button type="primary" style="width:60%;" @click="submitCheck()">提交</van-button>
		</div>
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
					orderId : '',
					cost    : '',
					reason  : ''
				},
				rules : {
					orderId : [
						{ required:true, message : '订单号无法解析,请返回上一层' }
					],
					reason : [
						{ required:true, message : '退款原因必须填写' }
					]
				}
			}
		},
		methods:{
			submitCheck(){
				let self = this;
				console.log(this.formData)
				this.validator.validate(this.formData).then(()=>{
					self.submit();
				}).catch(({ errors, fields })=>{
					console.log(errors)
					Toast.fail(errors[0].message);
				});
			},
			submit(){
				let self = this;
				this.$request.client.paymentAll.applyRefund( this.formData ).then(res=>{
					if( res.errorCode == '00000' ){

					}
				});
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','申请退款');
			if( typeof(this.$route.params.orderId) == 'undefined' || typeof(this.$route.params.cost) == 'undefined' ){
				this.$router.go(-1);	
				return ;
			}else{
				this.formData.orderId = this.$route.params.orderId;
				this.formData.cost    = this.$route.params.cost;
				this.validator        = new schema( this.rules );
			}
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
