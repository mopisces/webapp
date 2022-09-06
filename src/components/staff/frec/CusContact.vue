<template>
	<div>
		<van-button plain hairline type="info" size="small" style="width:100%;height:40px;" @click="config.popup.filterShow = true">筛选</van-button>
		<popup-filter :filterShow.sync="config.popup.filterShow"  @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<cus-picker :cusName.sync="filterForm.cusName" ></cus-picker>
				<van-field label="业务员" v-model="filterForm.taskId" placeholder="精确查询" input-align="center"/>
				<van-switch-cell v-model="pageConfig.switchChecked" title="记住筛选条件(本次登录有效)"/>
			</div>
		</popup-filter>
   		<template>
   			<div class="container">
   				<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;"  :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :height="config.table.height" even-bg-color="#fafafa"></v-table>
   			</div>
   		</template>
	</div>
</template>
<script>
	import { Button, Field, SwitchCell } from 'vant';
	import CusPicker from '@/components/subject/picker/CusPicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	export default {
		components:{
			[Button.name]: Button,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,

			CusPicker,
			PopupFilter,
		},
		data(){
			return {
				config:{
					popup:{
						filterShow:false,
					},
					table:{
						columns: [],
		                height : 0
					},
				},
				tableData: [],
				filterForm:{
					cusName:'',
					taskId:'',
				},
				pageConfig:{
					switchChecked:false,
				}
			}
		},
		methods:{
			cusContact( data ){
				let self = this;
				this.$request.staff.frec.cusContact( data ).then(res=>{
					self.tableData = res.result
				});
			},
			resetClick(){
				this.filterForm.cusName = '';
				this.filterForm.taskId = '';
				this.$refs.cusPicker.cusPickerClean();
				this.pageConfig.switchChecked = false;
			},
			filterClick(){
				this.config.popup.filterShow = false;
				this.cusContact( this.filterForm );
			},
			getTableConfig(){
				this.$request.common.table.getTableConfig().then(res=>{
					this.config.table.columns = res.cusContact;
				});
			},
			beforeunloadHandler(){
				if( this.pageConfig.switchChecked ){
					setStorage('frec/cusContact',this.filterForm);
				}else{
					removeStorage('frec/cusContact');
				}
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','客户来往统计');
			if( getStorage('frec/cusContact') !== null  ){
				this.filterForm = JSON.parse(getStorage('frec/cusContact'));
				this.pageConfig.switchChecked = true;
			}
		},
		mounted(){
			this.getTableConfig();
			this.cusContact( this.filterForm );
			this.config.table.height  = window.screen.height - 136;
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		destroyed(){
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		watch:{
			
		}
	}
</script>
