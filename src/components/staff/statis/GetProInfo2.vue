<template>
	<div>
		<van-sticky :offset-top="46">
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="onRefresh()">刷新</van-button>
			<van-button plain hairline type="info" size="normal" style="width:50%;" @click="config.popup.filterShow = true">筛选</van-button>
			<div style="height:0.5rem;width:100%;"></div>
		</van-sticky>
		<div class="pro-info-card">
			<van-row class="card-padding">
				<van-col span="6">订单平方:</van-col>
				<van-col span="6">{{info.TOrdArea}}</van-col>
				<van-col span="6">订单米数:</van-col>
				<van-col span="6">{{info.TOrdLen}}</van-col>
			</van-row>
			<van-row class="card-padding">
				<van-col span="6">订单金额:</van-col>
				<van-col span="6">{{info.OrdAmt}}</van-col>
			</van-row>
			<van-row class="card-padding">
				<van-col span="6">排产平方:</van-col>
				<van-col span="6">{{info.SchArea}}</van-col>
				<van-col span="6">排产米数:</van-col>
				<van-col span="6">{{info.SchLen}}</van-col>
			</van-row>
			<van-row class="card-padding">
				<van-col span="6">入库平方:</van-col>
				<van-col span="6">{{info.OrdInArea}}</van-col>
				<van-col span="6">入库金额:</van-col>
				<van-col span="6">{{info.OrdInAmt}}</van-col>
			</van-row>
			<van-row class="card-padding">
				<van-col span="6">送货平方:</van-col>
				<van-col span="6">{{info.DNArea}}</van-col>
				<van-col span="6">送货金额:</van-col>
				<van-col span="6">{{info.DNAmt}}</van-col>
			</van-row>
			<van-row class="card-padding">
				<van-col span="6">退货平方:</van-col>
				<van-col span="6">{{info.ReArea}}</van-col>
				<van-col span="6">退货金额:</van-col>
				<van-col span="6">{{info.ReAmt}}</van-col>
			</van-row>
			<van-row class="card-padding">
				<van-col span="6">车资运费:</van-col>
				<van-col span="6">{{info.TransAmt}}</van-col>
			</van-row>
			<van-row class="card-padding">
				<van-col span="6">本期收款:</van-col>
				<van-col span="6">{{info.CusPayAmt}}</van-col>
				<van-col span="6">折扣调账:</van-col>
				<van-col span="6">{{info.AdjustAmt}}</van-col>
			</van-row>
			<van-row class="card-padding">
				<van-col span="6">原纸用量:</van-col>
				<van-col span="6">{{info.SUseWt}}</van-col>
				<van-col span="6">原纸金额:</van-col>
				<van-col span="6">{{info.SUseAmt}}</van-col>
			</van-row>
			<van-row class="card-padding">
				<van-col span="14" style="display: flex;align-items: center;" @click="clickQuestion()">
					<van-icon name="question" color="#1989fa" size="16"/>入库重量比例(%):
				</van-col>
				<van-col span="10">{{info.SInWtRate}}</van-col>
			</van-row>
		</div>
		<popup-filter :filterShow.sync="config.popup.filterShow" @resetClick="resetClick" @filterClick="filterClick">
			<div slot="filter-field-1">
				<radio-cell :radioInfo.sync="filterForm.dateType" :radioColumns="config.radio.options" title="日期类型"></radio-cell>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.beginDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="开始日期"></new-time-picker>
				<new-time-picker v-if="config.popup.timePicker.isFinishLoad" :dateTime.sync="filterForm.endDate" :minDate="pageConfig.minDate" :maxDate="pageConfig.maxDate" label="结束日期"></new-time-picker>
				<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)" />
			</div>
		</popup-filter>
	</div>
</template>
<script>
	import {  Button, Col, Row, Cell, Icon, Field, SwitchCell, Dialog, Sticky } from 'vant';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	import NewTimePicker from '@/components/subject/time/NewTimePicker.vue';
	import RadioCell from '@/components/subject/RadioCell.vue';
	import { getStorage, setStorage, removeStorage } from '@/util/storage';
	export default {
		components:{
			[Button.name]: Button,
			[Col.name]: Col,
			[Row.name]: Row,
			[Icon.name]: Icon,
			[Cell.name]: Cell,
			[Field.name]: Field,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,

			PopupFilter,
			NewTimePicker,
			RadioCell,
		},
		data(){
			return {
				config:{
					getConfig:true,
					pull:{
						isLoading : false
					},
					popup:{
						filterShow : false,
						timePicker:{
							isFinishLoad : false
						}
					},
					switch:{
						checked : false
					},
					radio:{
						options:[
							{title:'退货日期',value:3},
							{title:'生效日期',value:4},
						]
					}
				},
				info:{
					TOrdArea:null,  //订单平方
					TOrdLen:null,   //订单米数
					OrdAmt:null,    //订单金额
					SchArea:null,   //排产平方
					SchLen:null,    //排产米数
					OrdInArea:null, //入库平方
					OrdInAmt:null,  //入库金额
					DNArea:null,    //送货平方
					DNAmt:null,     //送货金额
					ReArea:null,    //退货平方
					ReAmt:null,     //退货金额
					TransAmt:null,  //车资运费
					CusPayAmt:null, //本期收款
					AdjustAmt:null, //折扣调账
					SUseWt:null,    //原纸用量
					SUseAmt:null,   //原纸金额
					SInWtRate:null, //入库重量比例
				},
				pageConfig:{
					maxDate : null,
					minDate : null
				},
				filterForm:{
					beginDate : '',
					endDate   : '',
					dateType  : 3
				}
			}
		},
		methods:{
			onRefresh(){
				this.getProInfo( this.filterForm );
			},
			getProInfoConfig( isReset = false ){
				let self = this;
				this.$request.staff.statis.getProInfoConfig().then(res=>{
					if( this.config.getConfig ){
						self.filterForm.beginDate = res.result.GetProInfoBeginDate;
						self.filterForm.endDate = res.result.GetProInfoEndDate;
					}
					self.pageConfig.maxDate = res.result.GetProInfoMaxDate;
					self.pageConfig.minDate = res.result.GetProInfoMinDate;
				}).then(()=>{
					this.$nextTick(()=>{
						this.config.popup.timePicker.isFinishLoad = true;
					});
				}).then(()=>{
					if( isReset ){
						return ;
					}
					this.getProInfo(this.filterForm);
				});
			},
			getProInfo( data ){
				let self = this;
				this.$request.staff.statis.getProInfo2( data ).then(res=>{
					if( res.errorCode == '00000' ){
						self.info = res.result
					}
				});
			},
			resetClick(){
				this.config.getConfig = true;
				this.filterForm.dateType = this.$options.data().filterForm.dateType
				getProInfoConfig( true );
			},
			filterClick(){
				this.getProInfo( this.filterForm );
				this.config.popup.filterShow = false;	
			},
			beforeunloadHandler(){
				if( this.config.switch.checked ){
					setStorage('statis/getProInfo2',JSON.stringify(this.filterForm));
				}else{
					removeStorage('statis/getProInfo2');
				}
			},
			clickQuestion(){
				Dialog.alert({
					message : '注:入库重量比例=(纸板入库重量+半成品入库重量)/原纸用量'
				}).then(()=>{
					Dialog.close();
				});
			}
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','生产分析总计2');
			if( getStorage('statis/getProInfo2') !== null ){
				let storageData = JSON.parse(getStorage('statis/getProInfo2'));
				this.filterForm = storageData;
				this.config.getConfig      = false;
				this.config.switch.checked = true;
			}
		},
		mounted(){
			this.getProInfoConfig();
			window.addEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		destroyed(){
			this.beforeunloadHandler();
			window.removeEventListener('beforeunload', e => this.beforeunloadHandler());
		},
		computed:{
			
		},
		watch:{
			
		}
	}
</script>
<style>
	.van-dropdown-menu__title{
		line-height: 0.9rem;
	}
	.pro-info-card{
		height: 20rem;
		font-size:0.8rem;
		margin: 0 0.5rem 0 0.5rem;
		padding: 0.5rem 0.5rem 0 0.5rem;
		background-color: #e9ecf0;
		border-radius: 0.4rem;
		box-sizing: border-box;
		box-shadow: 0 0 0.4rem #efefef;
	}
	.card-padding{
		padding-top: 0.5rem;
	}
</style>