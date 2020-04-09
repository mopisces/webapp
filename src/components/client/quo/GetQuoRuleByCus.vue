<template>
	<div>
		<van-tabs v-model="config.tabs.active">
			<van-tab title="公共规则" name="1"></van-tab>
			<van-tab title="特别规则" name="0"></van-tab>
		</van-tabs>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" even-bg-color="#fafafa">
		</v-table>
	</div>
</template>
<script>
	import { Tab, Tabs } from 'vant';
	export default {
		components:{
			[Tab.name]: Tab,
			[Tabs.name]: Tabs,
		},
		data(){
			return {
				config:{
					tabs:{
						active:1
					},
					table:{
						columns:[
							{field: 'Flutes', title: '坑型', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'LayerCount', title: '层数', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
							{field: 'DisType', title: '折扣方式', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'ValueType', title: '增减类型', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'ValueBegin', title: '起始值', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'ValueEnd', title: '终止值', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'Value', title: '增减', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true},
						],
						height:0
					}
				},
				tableData : []
			}
		},
		methods:{
			makeOffersRule( isCus ){
				let self = this;
				this.$request.client.makeOffers.makeOffersRule( isCus ).then(res=>{
					self.tableData = res.result;
				});
			}
		},
		created(){
			this.$store.commit('client/setHeaderTitle','报价规则');
		},
		mounted(){
			this.makeOffersRule(this.config.tabs.active);
			this.config.table.height  = window.screen.height - 140;
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			tabsActiveChange(){
				return this.config.tabs.active;
			}
		},
		watch:{
			tabsActiveChange( newV, oldV ){
				this.makeOffersRule( newV );
			}
		}
	}
</script>