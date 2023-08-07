<template>
	<div style="padding-top:0.1rem;">
		<template>
			<van-button plain hairline type="info" style="width:50%" @click="config.add.show = true">添加</van-button>
			<van-button plain hairline type="info" style="width:50%" @click="config.popup.filterShow = true">筛选</van-button>
		</template>
		
		<v-table 
			is-horizontal-resize 
			:is-vertical-resize="true" 
			:columns="config.table.columns" 
			:table-data="table.data" 
			:height="config.table.height"
			style="width:100%;" 
			row-hover-color="#eee" 
			row-click-color="#edf7ff" 
			even-bg-color="#fafafa"
			@on-custom-comp="customCompFunc" >
		</v-table>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-cell>
					<van-checkbox slot="icon" v-model="filterForm.showPack" shape="square">已准备</van-checkbox>
				</van-cell>
				<van-cell>
					<van-checkbox slot="icon" v-model="filterForm.showSign" shape="square">已回签</van-checkbox>
				</van-cell>
				<van-switch-cell v-model="config.switchCell.checked" title="记住筛选条件" />
			</div>
		</popup-filter>
		<!--修改界面-->
		<van-dialog 
			v-model="config.modify.show" 
			show-cancel-button 
			@confirm="modifyConfirm"
		>
			<car-picker :carCode.sync="modifyForm.carCode" @modifyPId="modifyPId"></car-picker>
			<carperson-picker :carPId.sync="modifyForm.carPId"></carperson-picker>
			<van-field 
				v-model="modifyForm.remark" 
				placeholder="输入备注" 
				input-align="center" 
				label="备注" 
			></van-field>
			<shipper-picker :taskName.sync="modifyForm.taskName"></shipper-picker>
		</van-dialog>
		<!--新增界面-->
		<van-dialog 
			v-model="config.add.show" 
			show-cancel-button 
			title="新增装货单"
			confirmButtonText="添加"
			:before-close="beforeClose"
		>	
			<stowadd-picker :buildType.sync="addForm.type"></stowadd-picker>
			<new-time-picker 
				v-if="config.popup.timePicker.isFinishLoad" 
				:dateTime.sync="addForm.addDate" 
				:minDate="pageConfig.addMinDate" 
				:maxDate="pageConfig.addMaxDate" 
				label="日期">
			</new-time-picker>
			<car-picker 
				:carCode.sync="addForm.carCode" 
				@modifyPId="addPId">
			</car-picker>
			<carperson-picker 
				:carPId.sync="addForm.carPId">
			</carperson-picker>
			<!-- <van-field 
				v-model="addForm.loader" 
				placeholder="装货员" 
				input-align="center" 
				label="装货员" 
			></van-field> -->
			<loader-checkbox :loader.sync="addForm.loader"></loader-checkbox>
			<van-field 
				v-model="addForm.remark" 
				placeholder="输入备注" 
				input-align="center" 
				label="备注" 
			></van-field>
			<van-field 
				v-model="addForm.carFee" 
				type="number" 
				input-align="center" 
				label="车资"
				@input="floatInput"
			/>
			<shipper-picker 
				:taskName.sync="addForm.taskName">
			</shipper-picker>
		</van-dialog>
	</div>
</template>
<script>
	import { Button, Cell, Checkbox, Field, RadioGroup, Radio, SwitchCell, Dialog, Toast } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import CarPicker from '@/components/subject/picker/CarPicker.vue';
	import CarpersonPicker from '@/components/subject/picker/CarpersonPicker.vue';
	import ShipperPicker from '@/components/subject/picker/ShipperPicker.vue';
	import StowaddPicker from  '@/components/subject/picker/StowaddPicker.vue';
	import LoaderCheckbox from '@/components/subject/checkbox/LoaderCheckbox.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	import schema from 'async-validator';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[Checkbox.name]: Checkbox,
			[Field.name]: Field,
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio,
			[SwitchCell.name]: SwitchCell,
			[Dialog.Component.name]: Dialog.Component,
			[Toast.name]: Toast,

			PopupFilter,
			NewTimePicker,
			CarPicker,
			CarpersonPicker,
			ShipperPicker,
			StowaddPicker,
			LoaderCheckbox
		},
		data(){
			return {
				config:{
					getConfig: true,
					popup:{
						filterShow: false,
						timePicker: {
							isFinishLoad: false
						}
					},
					table:{
						columns:[
							{field: 'CarState', title: '状态', width: 70, titleAlign: 'center', columnAlign: 'center',formatter:(rowData)=>{
								if( rowData.CarState == 0 ){
									return '<span style="color:red;font-weight: bold;">装货中</span>';
								}
								if( rowData.CarState == 1 ){
									return '<span style="color:blue;font-weight: bold;">已准备</span>';
								}
								if( rowData.CarState == 2 ){
									return '<span style="color:#1a991d;font-weight: bold;">已回签</span>';
								}
							},isResize:true,isFrozen: true},
							{field: 'OrderTypeName', title: '类型', width: 70, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'PListNo', title: '装货单号', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'CarNo', title: '车辆编号', width: 100, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'CarPName', title: '司机', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'TVolume', title: '体积', width: 60, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'To5Area', title: '折5面积', width: 80, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'CusNames', title: '拼车客户', width: 120, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'Remark', title: '备注', width: 150, titleAlign: 'center', columnAlign: 'center',isResize:true},
							{field: 'stowListModify', title: '修改',width: 100, titleAlign: 'center',columnAlign:'center',componentName:'table-operate',isResize:true},
							{field: 'stowDelivery', title: '送货单',width: 100, titleAlign: 'center',columnAlign:'center',componentName:'table-operate',isResize:true},
							{field: 'stowDetail', title: '明细',width: 100, titleAlign: 'center',columnAlign:'center',componentName:'table-operate',isResize:true},
							{field: 'stowLoading', title: '装货',width: 100, titleAlign: 'center',componentName:'table-operate',columnAlign:'center',isResize:true}
						],
						height : 0
					},
					switchCell:{
						checked:false
					},
					modify: {
						show: false
					},
					add: {
						show: false
					},
					carPerson: {
						show: false,
						carNo: '',
						carPerson: '',
					},
					rules:{
						strFactoryId: [
							{ required : true , message : '请刷新页面获取厂商ID' },
						],
						strFactoryId: [
							{ required : true , message : '请刷新页面获取厂商ID' },
						],
						strOrderId: [
							{ required : true , message : '请选择装货单类型' },
						],
						strCarCode: [
							{ required : true , message : '请选择车辆编号' },
						],
						strCarPId: [
							{ required : true , message : '请选择司机' },
						],
						strAPPerson: [
							{ required : true , message : '请选择发货员' },
						],
						PackDate: [
							{ required : true , message : '请选择日期' },
						]
					}
				},
				table:{
					data:[]
				},
				filterForm:{
					beginDate : '',
					endDate   : '',
					showPack  : false,
					showSign  : false
				},
				pageConfig:{
					maxDate : '',
					minDate : '',
					addMaxDate: '',
					addMinDate: ''
				},
				modifyForm: {
					pListNo: '',
					orderType: '',
					factoryId: '',
					subFacId: '',
					date: '',
					carCode: '',
					carPId: '',
					loader: '',
					carFee: 0,
					taskName: '',
					remark: '',
				},
				addForm: {
					type: 'b',
					addDate: null,
					carCode: '',
					carPId: '',
					loader: '',
					remark: '',
					carFee: 0,
					taskName: '',
					erpId: '',
					factoryId: '',
				},
				validator:{}
			}
		},
		methods:{
			customCompFunc(params){
				if( params.type == 'modify' ){
					this.modifyForm = this.$options.data().modifyForm;
					this.modifyCarPerson(params.rowData);
					return 
				}
				let data = {
					pListNo      : params.rowData.PListNo,
					strFactoryId : params.userInfo.strFactoryId,
					strUserId    : params.userInfo.strUserId,
					index        : params.index
				};
				if( params.type === 'prepare' ){
					this.preparePack( data );
				}
				if( params.type === 'cancelPre' ){
					this.unPreparePack( data );
				}
			},
			modifyCarPerson( rowData ){
				this.modifyForm.pListNo = rowData.PListNo;
				this.modifyForm.orderType = rowData.OrderType;
				this.modifyForm.factoryId = rowData.FactoryId;
				this.modifyForm.subFacId = rowData.SubFacId;
				this.modifyForm.date = rowData.PackDate;
				this.modifyForm.carCode = rowData.CarCode ? rowData.CarCode : '';
				this.modifyForm.carPId = rowData.CarPId ?  rowData.CarPId : '';
				this.modifyForm.taskName = rowData.APPerson ? rowData.APPerson : '';
				this.modifyForm.remark = rowData.Remark ? rowData.Remark : '';
				this.config.modify.show = true;
			},
			modifyPId( data ){
				this.modifyForm.carPId = data.pId;
			},
			addPId( data ){
				this.addForm.carPId = data.pId;
			},
			modifyConfirm(){
				this.$request.staff.stow.stowListUpdate( this.modifyForm ).then((res)=>{
					if( res.errorCode == '00000' ){
						this.getConfig();
					}
				})
			},
			preparePack( data ){
				let self = this;	
				this.$request.staff.connecterp.preparePack( data ).then(res=>{
					if( res.data.result[1] === false ){
						Dialog.alert({
							title   : '准备失败',
							message : res.data.result[0]
						}).then(() => {
							Dialog.close();
						});
					}else{
						self.table.data[data.index].CarState = 1;
						Toast.success('准备成功');
					}
				}).catch((err)=>{
					Toast.fail('准备失败');
				});
			},
			unPreparePack( data ){
				let self = this;	
				this.$request.staff.connecterp.unPreparePack( data ).then(res=>{
					if( res.data.result[1] === false ){
						Dialog.alert({
							title   : '取消准备失败',
							message : res.data.result[0]
						}).then(() => {
							Dialog.close();
						});
					}else{
						self.table.data[data.index].CarState = 0;
						Toast.success('取消准备成功');
					}
				}).catch((err)=>{
					Toast.fail('取消准备失败');
				});
			},
			switchChange( checked ){
				if( checked ){
					setStorage('stow/lists',this.filterForm);
				}else{
					removeStorage('stow/lists');
				}
			},
			resetClick(){
				this.config.getConfig = true;
				this.filterForm.showPack = false;
				this.filterForm.showSign = false;
				this.config.switchCell.checked = false;
				this.getConfig();
			},
			filterClick(){
				this.config.popup.filterShow = false;
				this.getTableData( this.filterForm );
			},
			getConfig( isResize = false ){ 
				let self = this;	
				this.$request.staff.stow.stowListConfig().then(res=>{
					if( self.config.getConfig ){
						self.filterForm.beginDate = res.result.StowBeginDate;
						self.filterForm.endDate   = res.result.StowEndDate;
					}
					self.pageConfig.maxDate = res.result.StowMaxDate;
					self.pageConfig.minDate = res.result.StowMinDate;
					self.pageConfig.addMaxDate = res.result.StowAddMaxDate;
					self.pageConfig.addMinDate = res.result.StowAddMinDate;
					self.addForm.addDate = res.result.StowAddDate;
					self.addForm.erpId = res.result.ERPId;
					self.addForm.factoryId = res.result.FactoryId;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					});
				}).then(()=>{
					if( isResize ){
						return 
					}
					this.getTableData( this.filterForm );
				});
			},
			getTableData( data ){
				let self = this;
				this.$request.staff.stow.stowList( data ).then(res=>{
					self.table.data = res.result;
				});
			},
			beforeunloadHandler(){
				if( this.config.switchCell.checked ){
					setStorage('stow/lists',this.filterForm);
				}else{
					removeStorage('stow/lists');
				}
			},
			beforeClose( action, done ){
				if( action !== 'confirm' ){
					done();
					return ;
				}
				let postData = {
					strFactoryId: this.addForm.factoryId,
					strUserId: this.addForm.erpId,
					strOrderId: this.addForm.type,
					strPCarType: '',
					strPCarArea: '',
					strCarCode: this.addForm.carCode,
					strCarPId: this.addForm.carPId,
					strPackPerson: this.addForm.loader,
					strAPPerson: this.addForm.taskName,
					strRemark: this.addForm.remark,
					strTransFeeId: '',
					dChargeAdjust: this.addForm.carFee,
					PackDate: this.addForm.addDate,
					iPCarANum: 0
				}
				this.validator.validate(postData).then(()=>{
					this.$request.staff.connecterp.addPackageList(postData).then((res)=>{
						if( res.data.result[1] === false ){
							Toast.fail('新增装货单失败 /n' + res.data.result[0]);
							done(false);
						}else{
							Toast.success('新增装货单成功')
							done();
							this.config.getConfig = true;
							this.getConfig();
						}
					}).catch((err)=>{
						Toast.fail('请稍后再试')
						done(false);
					});
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
					done(false);
				});
			},
			/*addConfirm(){
				let postData = {
					strFactoryId: this.addForm.factoryId,
					strUserId: this.addForm.erpId,
					strOrderId: this.addForm.type,
					strPCarType: '',
					strPCarArea: '',
					strCarCode: this.addForm.carCode,
					strCarPId: this.addForm.carPId,
					strPackPerson: this.addForm.loader,
					strAPPerson: this.addForm.taskName,
					strRemark: this.addForm.remark,
					strTransFeeId: '',
					dChargeAdjust: this.addForm.carFee,
					PackDate: this.addForm.addDate,
					iPCarANum: 0
				}
				this.validator.validate(postData).then(()=>{
					this.$request.staff.connecterp.addPackageList(postData).then((res)=>{
						if( res.data.result[1] === false ){
							Dialog.alert({
								title   : '装货出错',
								message : res.data.result[0]
							}).then(()=>{
								Dialog.close();
							});
						}else{
							Dialog.alert({
								message:'新增装货单成功'
							}).then(()=>{
								Dialog.close();
							});
						}
					});
				}).catch(({ errors, fields })=>{
					Toast.fail(errors[0].message);
				});
			},*/
			floatInput(val){
				let checkPlan = "" + val;
				checkPlan = checkPlan
				.replace(/[^\d.]/g, "")
				.replace(/\.{2,}/g, ".")
				.replace(/^\./g, "")
				.replace(".", "$#$")
				.replace(/\./g, "")
				.replace("$#$", ".");
				if (checkPlan.indexOf(".") < 0 && checkPlan !== "") {
					checkPlan = parseFloat(checkPlan) + "";
				} else if (checkPlan.indexOf(".") >= 0) {
					checkPlan = checkPlan.replace(/^()*(\d+)\.(\d\d).*$/, "$1$2.$3");
				}
				this.$nextTick(() => (this.addForm.carFee = checkPlan * 1));
				return checkPlan;
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','扫描装货');
			if( getStorage('stow/lists') ){
				let storageData = JSON.parse(getStorage('stow/lists'));
				this.filterForm                = storageData;
				this.config.getConfig          = false;
				this.config.switchCell.checked = true;
			}
		},
		mounted(){
			this.getConfig();
			this.config.table.height = window.screen.height - 144;
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
			this.validator = new schema( this.config.rules );
		},
		destroyed(){
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		computed:{
			addDialogClose(){
				return this.config.add.show;
			}
		},
		watch:{
			addDialogClose( newV, oldV ){
				//新增界面关闭,数据重置
				if( !newV ){
					this.addForm.type = 'b';
					this.addForm.carCode = '';
					this.addForm.carPId ='';
					this.addForm.loader = '';
					this.addForm.remark = '';
					this.addForm.carFee = 0;
					this.addForm.taskName = '';
				}
			}
		}
	}
</script>
<style>
	.v-table-title-class{
		color:#1a991d;
		font-size: 0.8125rem;
	}
</style>
