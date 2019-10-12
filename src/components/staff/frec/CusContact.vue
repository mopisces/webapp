<template>
	<div>
		<van-button plain hairline type="info" size="small" style="width:100%" @click="showFilter()">筛选</van-button>
		<van-popup v-model="config.popup.filterShow" position="right" :style="{ width: '80%' , height: '100%'}">
			<div class="van-nav-bar van-nav-bar--fixed van-hairline--bottom" style="z-index: 1;">
				<div class="van-nav-bar__title van-ellipsis">
					筛选条件
				</div>
			</div>
			<div style="margin-top:46px;">
				<van-field readonly clickable label="客户名称" :value="filterForm.cusName" placeholder="选择客户名称" input-align="center" @click="fieldClick()"></van-field>
				<van-field label="业务员" v-model="filterForm.taskId" placeholder="精确查询" input-align="center" />
				<van-switch-cell v-model="info.switch.checked" title="记住筛选条件(本次登录有效)" />
				<div class="van-hairline--top-bottom van-tabbar van-tabbar--fixed">
					<div class="van-tabbar-item">
						<van-button type="danger" style="width:60%" @click="resetClick()">重置</van-button>
					</div>
					<div class="van-tabbar-item">
						<van-button type="primary" style="width:60%" @click="filterClick()">筛选</van-button>
					</div>
				</div>
			</div>
			
		</van-popup>
		<van-popup v-model="config.popup.show" position="bottom">
			<van-picker show-toolbar  :columns="info.cusPicker.columns" :default-index="info.cusPicker.defaultIndex" @cancel="cusPickerCancel()" @confirm="cusPickerConfirm">
				<van-search slot="title" v-model="filterForm.cusName" @search="cusPickerSearch"> </van-search>
			</van-picker>
		</van-popup>
   		<template>
   			<div  class="container">
   				<v-table is-horizontal-resize is-horizontal-resize style="width:100%;"  :columns="config.table.columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" :height="500"></v-table>
   			</div>
   		</template>

	</div>
</template>
<script>
	import { Field, Popup, Picker, Search, Button, Tabbar, TabbarItem, SwitchCell } from 'vant';
	import { VTable, VPagination } from 'vue-easytable';
	export default {
		components:{
			[Field.name]: Field,
			[Popup.name]: Popup,
			[Picker.name]: Picker,
			[Search.name]: Search,
			[Button.name]: Button,
			[Tabbar.name]: Tabbar,
			[TabbarItem.name]: TabbarItem,
			[SwitchCell.name]: SwitchCell,

			[VTable.name]: VTable,
			[VPagination.name]: VPagination,
		},
		data(){
			return {
				config:{
					popup:{
						show:false,
						filterShow:false
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
					},
					switch:{
						checked:false
					}
				},
				tableData: [],
				filterForm:{
					cusName:'',
					taskId:''
				}
                
			}
		},
		methods:{
			showFilter(){
				this.config.popup.filterShow = true;
			},
			
			fieldClick(){
				this.config.popup.show = true;
				if( this.info.cusPicker.columns.length == 0 ){
					this.cusPickerSearch()
				}
			},
			cusPickerSearch(){
				let self = this;
				this.$request.staff.frec.cusPicker( this.filterForm.cusName ).then(res=>{
					self.info.cusPicker.columns = [];
					res.result.forEach((item,index)=>{
						self.info.cusPicker.columns.push({text:item.CusName + '--' +item.CusId ,key:item.CusId});
					});
				});
			},
			cusPickerConfirm( value, index ){
				this.config.popup.show = false;
				this.filterForm.cusName = '';
				this.info.cusPicker.defaultIndex = -1;
				if( JSON.stringify(value) !== '[]' ){
					this.info.cusPicker.defaultIndex = index;
					this.filterForm.cusName = value.key;
				}
			},
			cusPickerCancel(){
				this.config.popup.show = false;
				this.filterForm.cusName = '';
			},
			cusContact(){
				let self = this;
				this.$request.staff.frec.cusContact( this.filterForm ).then(res=>{
					self.tableData = res.result
				});
			},
			resetClick(){
				this.filterForm.cusName = '';
				this.filterForm.taskId = '';
				this.config.popup.filterShow = false;
			},
			filterClick(){
				this.config.popup.filterShow = false;
				this.cusContact();
			}
		},
		mounted(){

		},
		created(){
			if( sessionStorage.getItem('frec/cusContact') !== null ){
				try{
					this.filterForm = Object.assign(this.filterForm,JSON.parse(sessionStorage.getItem('frec/cusContact')));
				}catch(err){
					console.log(err.message);
				}
			}
			this.cusContact();
			this.$store.commit('staff/setHeaderTitle','客户来往统计');
		},
		computed:{
			fliterSave(){
				return this.info.switch.checked
			}
		},
		watch:{
			fliterSave( val ){
				sessionStorage.setItem('frec/cusContact', '');
				if( val === true ){
					sessionStorage.setItem('frec/cusContact', JSON.stringify(this.filterForm));
				}
			}
		}
	}
</script>
<style>
	.van-search {
		width:60%;
	}
</style>