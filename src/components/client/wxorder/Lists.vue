<template>
	<div>
		<van-sticky :offset-top="46">
			<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
			<van-tabs v-model="filterForm.orderState">
				<van-tab title="未审核" name="1"></van-tab>
				<van-tab title="已审核" name="2"></van-tab>
				<van-tab title="已删除" name="3"></van-tab>
			</van-tabs>
		</van-sticky>

	</div>
</template>
<script>
	import { Button,  PullRefresh, Toast, List, Sticky, Tab, Tabs } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[PullRefresh.name]: PullRefresh,
			[Toast.name]: Toast,
			[List.name]: List,
			[Sticky.name]: Sticky,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
		},
		data(){
			return {
				config:{
					popup : {
						filterShow : false
					}
				},
				filterForm : {
					orderState : '1'
				}
			}
		},
		methods:{

		},
		created(){
			this.$store.commit('client/setHeaderTitle','微信订单');
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