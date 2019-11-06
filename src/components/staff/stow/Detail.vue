<template>
	<div>
		<div v-if=" config.isEdit == 1 ">
			<van-field v-model="formData.value" placeholder="请输入订单号" label="条形码编号" input-align="center">
			 	<van-icon class-prefix="iconfont" size="18" name="saomiao4" slot="right-icon" color="#0bf147" />
			</van-field>
			<van-field readonly v-model="formData.value" placeholder="订单信息" label="条形码编号" input-align="center">
			</van-field>
			<div class="van-row" style="text-align:left;">
				<div class="van-col van-col--12">
					<van-field v-model="formData.value" placeholder="附加费" label="附加费" input-align="center" type="number" :maxlength="8">
					</van-field>
				</div>
				<div class="van-col van-col--12">
					<van-field v-model="formData.value" placeholder="库存数" label="库存数" input-align="center" type="number" :maxlength="10">
					</van-field>
				</div>
			</div>
			<div class="van-row" style="text-align:left;">
				<div class="van-col van-col--12">
					<van-field v-model="formData.value" placeholder="送货数" label="送货数" input-align="center" type="number" :maxlength="8">
					</van-field>
				</div>
				<div class="van-col van-col--12">
					<van-field v-model="formData.value" placeholder="赠品数" label="赠品数" input-align="center" type="number" :maxlength="10">
					</van-field>
				</div>
			</div>
			<van-field readonly clickable label="送货公司" v-model="filterForm.value" placeholder="选择送货公司" input-align="center">
				<van-icon slot="right-icon" size="16" name="arrow"/>
			</van-field>
			<van-field v-model="formData.value1" placeholder="送货备注" label="送货备注" input-align="center"  type="textarea" autosize rows="2"  maxlength="50" show-word-limit>
			</van-field>
			<div class="van-row van-row--flex van-row--justify-end">
				<div class="van-col van-col--6">
					<van-button type="primary">主要按钮</van-button>
				</div>
				<div class="van-col van-col--6">
					<van-button plain type="primary">朴素按钮</van-button>
				</div>
			</div>
		</div>
		<div role="separator" class="van-divider van-divider--hairline van-divider--content-center" style="border-color: rgb(25, 137, 250); color: rgb(25, 137, 250); padding: 0px 16px;" v-else>
			明细
		</div>
		<v-table is-horizontal-resize :is-vertical-resize="true" style="width:100%;" :columns="config.table.columns" :table-data="table.data" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc">
		</v-table>
	</div>
</template>
<script>
	import { VTable, VPagination } from 'vue-easytable';
	import { Button, Icon, Field } from 'vant';
	export default {
		components:{
			[VTable.name]: VTable,
			[VPagination.name]: VPagination,

			[Button.name]: Button,
			[Icon.name]: Icon,
			[Field.name]: Field,
		},
		data(){
			return {
				config:{
					table:{
						columns:[
							{field: 'OrderId', title: '订单编号', width: 100, titleAlign: 'center', titleCellClassName:'table-title-class',columnAlign: 'center',isResize:true,isFrozen: true},
							{field: 'CusSubName', title: '子公司', width: 100, titleAlign: 'center',titleCellClassName:'table-title-class', columnAlign: 'center',isResize:true},
							{field: 'DeliQty', title: '送货数', width: 80, titleAlign: 'center', titleCellClassName:'table-title-class',columnAlign: 'center',isResize:true},
							{field: 'StockArea', title: '库区', width: 80, titleAlign: 'center',titleCellClassName:'table-title-class', columnAlign: 'center',isResize:true},
							{field: 'Length', title: '板长', width: 80, titleAlign: 'center', titleCellClassName:'table-title-class',columnAlign: 'center',isResize:true},
							{field: 'Width', title: '板宽', width: 80, titleAlign: 'center',titleCellClassName:'table-title-class', columnAlign: 'center',isResize:true},
						]
					},
					isEdit:0
				},
				table:{
					data:[]
				},
				filterForm:{
					listNo:'',
					orderType:'',
				},
				formData:{
					value:'',
					value1:''
				}
			}
		},
		methods:{
			getPDNDetail( data ){
				let self = this;
				this.$request.staff.stow.getPDNDetail( data ).then(res=>{
					self.table.data = res.result;
				});
			},
			customCompFunc( params ){
				if( params.type === 'edit' ){
					this.rowEdit( params.index, params.rowData )
				}else if( params.type === 'delete' ){
					this.rowDelete( params.index, params.rowData )
				}
			},
			rowEdit( index, rowData ){
				
			},
			rowDelete( index, rowData ){

			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','扫描装货详情');
			if( this.$route.query.listNo !== undefined && this.$route.query.orderType !== undefined && this.$route.query.isEdit !== undefined ){
				this.filterForm.listNo = this.$route.query.listNo;
				this.filterForm.orderType = this.$route.query.orderType;
				this.config.isEdit = this.$route.query.isEdit;
				if( this.config.isEdit == 1 ){
					this.config.table.columns.push({field: 'custome-adv', title: '操作', width: 150, titleAlign: 'center',titleCellClassName:'table-title-class',componentName:'stow-detail-handle', columnAlign: 'center',isResize:true})
				}
			}else{
				this.$router.go(-1);
			}
		},
		mounted(){
			this.getPDNDetail( this.filterForm );
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
<style>
	.van-field__word-limit{
		line-height: 1rem;
	}
	.table-title-class{
		color:#0bf147;
	}
</style>