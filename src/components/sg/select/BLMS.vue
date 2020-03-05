<template>
	<div>
		<van-dropdown-menu>
			<van-dropdown-item v-model="formData.index" :options="config.dropDown.indexOption" />
			<van-dropdown-item v-model="formData.active" :options="config.dropDown.activeOption" />
		</van-dropdown-menu>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff"  :height="config.table.height" even-bg-color="#fafafa">
		</v-table>
	</div>
</template>
<script>
	import { DropdownMenu, DropdownItem } from 'vant';
	import { VTable, VPagination } from 'vue-easytable';
	export default {
		components:{
			[DropdownMenu.name]: DropdownMenu,
			[DropdownItem.name]: DropdownItem,

			[VTable.name]: VTable,
			[VPagination.name]: VPagination,
		},
		data(){
			return {
				config:{
					dropDown:{
						indexOption  : [],
						activeOption : [
							{
								text  : '按长度',
								value : '0'
							},
							{
								text  : '按重量',
								value : '1'
							}
						]
					},
					table:{
						columns:[],
						height : 0
					}
				},
				formData:{
					index  : 0,
					active : 0
				},
				tableData : []
			}
		},
		methods:{

		},
		created(){
			this.$store.commit('sg/setHeaderTitle','备料查看');
		},
		mounted(){
			this.config.table.height = window.screen.height - 126;
		},
		updated(){
			
		},
		destroyed(){
			
		},
		computed:{
			indexChange(){
				return this.formData.index;
			}
		},
		watch:{
			indexChange( newV, oldV ){

			}
		}
	}
</script>