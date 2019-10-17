<template>
	<div>
		<van-button plain hairline type="info" size="small" style="width:100%" @click="config.popup.filterShow = true">筛选</van-button>
		<van-tabs v-model="active" @click="onClick">
			<van-tab title="全部"></van-tab>
			<van-tab title="小于库存"></van-tab>
			<van-tab title="大于库存"></van-tab>
			<van-tab title="有库存的"></van-tab>
		</van-tabs>
		<popup-filter :filterShow="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick" @filterOverlayClick="filterOverlayClick">
			
		</popup-filter>
		
	</div>
</template>
<script>
	import { Button, Tab, Tabs } from 'vant';
	import { VTable, VPagination } from 'vue-easytable';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,

			PopupFilter
		},
		data(){
			return {
				active:'1',
				config:{
					popup:{
						filterShow:false
					}
				}
			}
		},
		methods:{
			resetClick(){

			},
			filterClick(){

			},
			filterOverlayClick(){
				this.config.popup.filterShow = false;
			},
			onClick(data,title){

				console.log(data)
				console.log(title)
			}
		},
		mounted(){

		},
		created(){
			this.$store.commit('staff/setHeaderTitle','安全库存');
		},
		computed:{
			
		},
		watch:{

		}
	}
</script>