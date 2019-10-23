<template>
	<div>
		<van-tabs v-model="active">
			<van-tab title="全部"></van-tab>
			<van-tab title="未审核"></van-tab>
			<van-tab title="已审核"></van-tab>
			<van-tab title="已传单"></van-tab>
			<van-tab title="已送货"></van-tab>
			<van-tab title="有退货"></van-tab>
		</van-tabs>
	</div>
</template>
<script>
	import { Tab, Tabs, Button } from 'vant';
	export default {
		components:{
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
			[Button.name]: Button,
		},
		data(){
			return {
				active:'0'
			}
		},
		methods:{

		},
		mounted(){

		},
		created(){
			
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>