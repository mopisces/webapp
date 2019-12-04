<template>
	<div>
		<van-sticky :offset-top="46">
			<van-tabs v-model="filterForm.orderType">
				<van-tab title="简单纸板" name="s"></van-tab>
				<van-tab title="纸箱纸板" name="c"></van-tab>
				<van-tab title="纸箱"     name="x"></van-tab>
			</van-tabs>
		</van-sticky>
		<van-pull-refresh v-model="config.list.pullRefresh.reloading" @refresh="pullOnRefresh">
			<van-list v-model="config.list.pushLoading.loading" :finished="config.list.pushLoading.finished"  finished-text="没有更多" @load="onLoad" :offset="100">

			</van-list>
		</van-pull-refresh>
	</div>
</template>
<script>
	import { PullRefresh, List, Sticky, Tab, Tabs } from 'vant';
	export default {
		components:{
			[PullRefresh.name]: PullRefresh,
			[List.name]: List,
			[Sticky.name]: Sticky,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
		},
		data(){
			return {
				config:{
					list:{
						pullRefresh : {
							reloading : false,
							isInit    : true
						}
						pushLoading : {
							loading  : false,
							finished : false
						}
					}
				},
				filterForm : {
					orderType : 's'
				}
			}
		},
		methods:{

		},
		created(){
			this.$store.commit('client/setHeaderTitle','常用订单');
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