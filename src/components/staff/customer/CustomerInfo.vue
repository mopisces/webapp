<template>
	<div>
		<van-button 
			plain 
			hairline 
			type="info" 
			style="width:100%" 
			@click="config.filter.show = true"
		>
			筛选
		</van-button>
		<v-table 
			is-horizontal-resize 
			:is-vertical-resize="true" 
			style="width:100%;" 
			:height="config.table.height" 
			:columns="config.table.columns" 
			:table-data="config.table.data" 
			row-hover-color="#eee" 
			row-click-color="#edf7ff"
			:row-click="rowClick"
		>
		</v-table>
		<popup-filter 
			:filterShow.sync="config.filter.show" 
			@resetClick="resetClick" 
			@filterClick="filterClick"
		>	
			<div slot="filter-field-1">
				<cus-picker ref="cusPicker" :cusName.sync="formData.cusId"></cus-picker>
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import { Button } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';

	export default {
		components:{
			[Button.name]: Button,
			PopupFilter,
			CusPicker
		},
		data(){
			return {
				config: {
					table: {
						height: 0,
						columns: [],
						data: []
					},
					filter: {
						show: false
					}
				},
				formData: {
					cusId: null
				},
			}
		},
		methods:{
			queryList(){
				this.config.table.data = this.$options.data().config.table.data
				this.$request.staff.customer.fetchCustomerList( this.formData ).then(res=>{
					this.config.table.data = res.result
				});
			},
			getTableConfig(){
				this.$request.common.table.getTableConfig().then(res=>{
					this.config.table.columns = res.staffCustomerInfo
				});
			},
			resetClick(){
				this.formData = this.$options.data().formData
			},
			filterClick(){
				this.queryList()
			},
			/*表格点击复制*/
			rowClick(rowIndex, rowData, column){
				var info = ''
				for (var i = 0; i < this.config.table.columns.length; i++) {
					var value = rowData[this.config.table.columns[i].field] || ''
					info += this.config.table.columns[i].title + ':' + value
					if( i <= this.config.table.columns.length ){
						info += '\n'
					}
				}
				this.$copyText(info).then(()=>{
					this.$notify({
						type: 'success',
						color: '#ad0000',
						background: '#ffe1e1',
						message: '复制成功',
						duration: 2000
					})
				}).catch((e)=>{
					this.$notify({
						type: 'fail',
						message: e.message,
						duration: 2000
					})
				})
			},
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','客户查询');
			this.config.table.height = window.screen.height - 140;
		},
		mounted(){
			this.getTableConfig();
			this.queryList();
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