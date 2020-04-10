<template>
	<div>
		<div class="van-cell" style="">
			<div class="van-cell__title">
				<span>退款金额</span>
			</div>
			<div class="van-cell__value" style="text-align:left;">
				<span style="color: red;">￥{{ formData.cost }}</span>
				<van-tag type="success" size="medium" v-if="config.tag.show">{{ config.tag.text }}</van-tag>
			</div>
		</div>
		<van-field v-model="formData.reason" error rows="5" autosize label="退款原因" type="textarea" maxlength="50" placeholder="退款原因必须填写" show-word-limit required :disabled="config.field.disabled"/>
		<div style="text-align:center;" v-if=" config.button.show ">
			<van-button type="primary" style="width:60%;" @click="submitCheck()">提交</van-button>
		</div>
	</div>
</template>
<script>
	import { Button, Field, Toast, Tag  } from 'vant';
	import schema from 'async-validator';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[Toast.name]: Toast,
			[Tag.name]: Tag,
		},
		data(){
			return {
				config:{
					tag:{
						text : '',
						show : false
					},
					field:{
						disabled : false
					},
					button:{
						show:true
					}
				},
				formData:{
					orderId : '',
					cost    : '',
					reason  : '',
					onApply : 0,
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
				this.validator.validate(this.formData).then(()=>{
					self.submit();
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},
			submit(){
				let self = this;
				this.$request.client.paymentAll.applyRefund( this.formData ).then(res=>{
					if( res.errorCode == '00000' ){
						self.config.tag.text      = '申请退款中';
						self.config.tag.show      = true;
						self.config.button.show   = false;
						self.config.field.disabled= true;
					}
				});
			},
			checkApply(){
				let self = this;
				this.$request.client.paymentAll.checkApply( this.formData ).then(res=>{
					if( res.errorCode == '00000' ){
						self.formData.reason      = res.result.ApplyReason == null ? '' : res.result.ApplyReason;
						if( res.result.Apply == '1' ){
							self.config.tag.show      = true;
							self.config.field.disabled= true;
							if( res.result.Refund == '1' ){
								self.config.tag.text  = '已退款';
							}else{
								self.config.tag.text  = '申请退款中';
							}
							self.config.button.show   = false;
						}
					}
				});
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','申请退款');
			if( typeof(this.$route.params.orderId) == 'undefined' || typeof(this.$route.params.cost) == 'undefined' || typeof(this.$route.params.onApply) == 'undefined'){
				this.$router.go(-1);	
				return ;
			}else{
				this.formData.orderId = this.$route.params.orderId;
				this.formData.cost    = this.$route.params.cost;
				this.formData.onApply = this.$route.params.onApply;
				this.checkApply();
				this.validator = new schema( this.rules );
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
