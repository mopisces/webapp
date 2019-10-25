<template>
	<div>
		<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		<van-tabs v-model="active">
			<van-tab title="全部">
				
			</van-tab>
			<van-tab title="按日期">
				
			</van-tab>
		</van-tabs>
	</div>
</template>
<script>
	import { Button, Tab, Tabs } from 'vant';
	export default {
		components:{
			[Button.name]: Button,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
		},
		data(){
			return {
				active:0,
				config:{
					popup:{
						filterShow:false
					}
				}
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