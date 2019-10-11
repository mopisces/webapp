<template>
	<div>
		<van-field readonly clickable label="客户名称" :value="cusForm.cusName" placeholder="选择客户名称" @click="fieldClick()"></van-field>
		<van-popup v-model="config.popup.show" position="bottom">
			<van-picker show-toolbar  :columns="info.cusPicker.columns" :default-index="info.cusPicker.defaultIndex" @cancel="cusPickerCancel()" @confirm="cusConfirm">
				<van-search slot="title" v-model="cusForm.cusName" @search="cusPickerSearch"> </van-search>
			</van-picker>
		</van-popup>
   		<template>
   			<div>
   				<v-table is-horizontal-resize is-horizontal-resize style="width:100%;"  :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :height="500"></v-table>
   			</div>
   		</template>

	</div>
</template>
<script>
	import { Field, Popup, Picker, Search  } from 'vant';
	import { VTable, VPagination } from 'vue-easytable';
	export default {
		components:{
			[Field.name]: Field,
			[Popup.name]: Popup,
			[Picker.name]: Picker,
			[Search.name]: Search,

			[VTable.name]: VTable,
			[VPagination.name]: VPagination,
		},
		data(){
			return {
				config:{
					popup:{
						show:false,
					},
					table:{
						columns: [
		                    {field: 'Cus', title: '客户', width: 140, titleAlign: 'center', columnAlign: 'center',isResize:true ,isFrozen: true},
		                    {field: 'Task', title: '业务员', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
		                    {field: 'LastMBDate', title: '上次结算时间', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
		                    {field: 'LastAmt', title: '上期余额', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
		                    {field: 'ConfAmtT', title: '确收金额', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
		                    {field: 'AdjustAmt', title: '调整金额', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
		                    {field: 'CusPayAmt', title: '本期收款', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
		                    {field: 'OrdNeedAmt', title: '订单未送', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
		                    {field: 'CurAmt', title: '当前欠款', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
		                    {field: 'PreAmt', title: '预警金额', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
		                    {field: 'MinAmtCond', title: '终止金额', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
		                    {field: 'LeftMinAmtCond', title: '终止金额剩余', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
		                    {field: 'CurNeedPay', title: '当前需付总额', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true}
		                ]
					}
				},
				info:{
					cusPicker:{
						columns:[],
						defaultIndex:-1
					}
				},
				cusForm:{
					cusName:''
				},
				tableData: [],
                
			}
		},
		methods:{
			fieldClick(){
				this.config.popup.show = true;
				if( this.info.cusPicker.columns.length == 0 ){
					this.cusPickerSearch()
				}
			},
			cusPickerSearch(){
				let self = this;
				this.$request.staff.frec.cusPicker( this.cusForm.cusName ).then(res=>{
					self.info.cusPicker.columns = [];
					res.result.forEach((item,index)=>{
						self.info.cusPicker.columns.push({text:item.CusName + '--' +item.CusId ,key:item.CusId});
					});
				});
			},
			cusConfirm( value, index ){
				this.config.popup.show = false;
				this.cusForm.cusName = '';
				if( JSON.stringify(value) !== '[]' ){
					this.info.cusPicker.defaultIndex = index;
					this.cusForm.cusName = value.key;
					this.cusContact();
				}
				
			},
			cusContact(){
				let self = this;
				this.$request.staff.frec.cusContact( this.cusForm.cusName ).then(res=>{
					self.tableData = res.result
				});
			},
			cusPickerCancel(){
				this.config.popup.show = false;
				this.cusForm.cusName = '';
				this.cusContact();
			}
		},
		mounted(){

		},
		created(){
			this.cusContact();
			this.$store.commit('staff/setHeaderTitle','订单试算');
		}
	}
</script>