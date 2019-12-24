<template>
	<van-popup v-model="show" position="bottom" :style="{ height: '100%' }">
		<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom">
			<div class="van-nav-bar__title van-ellipsis">
				下单结果
			</div>
		</div>
		<div style="margin:80px 0;text-align:center;" v-if="isSuccess">
			<van-icon name="checked" color="#0bf147" size="100" />
			<div style="font-size:20px;">
				下单成功!
			</div>
		</div>
		<div style="margin:80px 0;text-align:center;" v-else>
			<van-icon name="clear" color="hsl(14, 91%, 49%)" size="100" />
			<div style="font-size:20px;">
				下单失败!
			</div>
		</div>
		<van-button type="primary" style="width:100%;" v-if=" isGroup " @click="goPay()">去付款</van-button>
		<van-button plain type="default" style="width:100%;margin-top:10px;" @click="wxOrderClick()
		">查看微信订单</van-button>
		<van-button plain type="primary" style="width:100%;margin-top:10px;" @click="continueOrder()">继续下单</van-button>
	</van-popup>
</template>
<script>
	import { Button, Icon, Popup } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Icon.name]: Icon,
			[Popup.name]: Popup,
		},
		props : ['resultShow','isGroup','isSuccess','cusOrderId'],
		data(){
			return {
				show : this.resultShow,
			}
		},
		methods:{
			wxOrderClick(){
				this.$router.push('/client/wxorder/lists');
			},
			continueOrder(){
				this.show = false;
				this.$emit('clearFormData');
			},
			goPay(){
				this.$router.push({ name : 'payWay' , params : { cusOrderId : this.cusOrderId } })
			}
		},
		created(){
			
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
			resultShow(newV,oldV){
				this.show = newV;
			},
			show(newV,oldV){
				this.$emit("update:resultShow", newV);
			},

		}
	}
</script>