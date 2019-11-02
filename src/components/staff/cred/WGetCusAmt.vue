<template>
	<div>
		<van-sticky :offset-top="46">
			<div class="van-row">
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%" @click="config.popup.leftPopup.show = true">员工信息</van-button>
				</div>
				<div class="van-col van-col--12">
					<van-button plain hairline type="info" style="width:100%"  @click="config.popup.rightFilter.show = true">筛选</van-button>
				</div>
			</div>
		</van-sticky>
		<van-cell-group>
			<van-cell :title="item.CusShortName + '(' + item.CusId + ')' " is-link :value="item.LeftMinAmtCond + '/' + item.MinAmtCond " v-for="(item,index) in info.cell.data" :key="index" @click="cellClick(item.CusId)"/>
		</van-cell-group>
		<left-popup :leftShow.sync="config.popup.leftPopup.show" :title="config.popup.leftPopup.title">
			<van-field label="员工" readonly v-model="info.leftPopup.data.taskId" placeholder="员工" input-align="center" slot="left-popup-1"/>
			<van-field label="欠款合计" readonly v-model="info.leftPopup.data.realAmt" placeholder="欠款合计" input-align="center" slot="left-popup-2"/>
			<van-field label="查询时间" readonly v-model="info.leftPopup.data.queryTime" placeholder="查询时间" input-align="center" slot="left-popup-3"/>
		</left-popup>
		<popup-filter :filterShow.sync="config.popup.rightFilter.show" @resetClick="resetClick" @filterClick="filterClick">
			<van-field readonly clickable label="客户名称" v-model="filterForm.cusId" placeholder="选择客户名称" input-align="center" @click="config.popup.cusPicker.show = true" slot="filter-field-1"></van-field>
			<van-radio-group v-model="filterForm.isStopped" slot="filter-field-2">
				<van-cell-group title="是否停单">
					<van-cell title="全部" clickable @click="filterForm.isStopped = '2'">
						<van-radio slot="right-icon" name="2" />
					</van-cell>
					<van-cell title="是" clickable @click="filterForm.isStopped = '0'">
						<van-radio slot="right-icon" name="0" />
					</van-cell>
					<van-cell title="否" clickable @click="filterForm.isStopped = '1'">
						<van-radio slot="right-icon" name="1" />
					</van-cell>
				</van-cell-group>
			</van-radio-group>
			<van-radio-group v-model="filterForm.isSettleDay" slot="filter-field-3">
				<van-cell-group title="是否月结">
					<van-cell title="全部" clickable @click="filterForm.isSettleDay = '2'">
						<van-radio slot="right-icon" name="2" />
					</van-cell>
					<van-cell title="是" clickable @click="filterForm.isSettleDay = '0'">
						<van-radio slot="right-icon" name="0" />
					</van-cell>
					<van-cell title="否" clickable @click="filterForm.isSettleDay = '1'">
						<van-radio slot="right-icon" name="1" />
					</van-cell>
				</van-cell-group>
			</van-radio-group>
			<van-switch-cell v-model="config.switch.checked" title="记住筛选条件(本次登录有效)"  slot="filter-field-7" @change="filterRemClick" />
		</popup-filter>
		<cus-picker :show.sync="config.popup.cusPicker.show" :searchData.sync="cusPicker.searchData" :index.sync="cusPicker.defaultIndex" @cusPickerCancel="cusPickerCancel" @cusPickerConfirm="cusPickerConfirm" >
		</cus-picker>
	</div>
</template>
<script>
	import { Button, Cell, CellGroup, Field, RadioGroup, Radio,  SwitchCell, Sticky } from 'vant';
	import LeftPopup from '@/components/subject/LeftPopup.vue';
	import CusPicker from '@/components/subject/CusPicker.vue';
	import PopupFilter from '@/components/subject/PopupFilter.vue';
	export default {
		components:{
			[Button.name]: Button,
			[Cell.name]: Cell,
			[CellGroup.name]: CellGroup,
			[Field.name]: Field,
			[RadioGroup.name]: RadioGroup,
			[Radio.name]: Radio,
			[SwitchCell.name]: SwitchCell,
			[Sticky.name]: Sticky,

			LeftPopup,
			CusPicker,
			PopupFilter,
		},
		data(){
			return {
				config:{
					popup:{
						leftPopup:{
							show:false,
							title:'员工信息'
						},
						rightFilter:{
							show:false
						},
						cusPicker:{
							show:false
						}
					},
					switch:{
						checked:false
					}
				},
				info:{
					leftPopup:{
						data:{
							taskId:'该数据暂缺',
							realAmt:'',
							queryTime:''
						}
					},
					cell:{
						data:[]
					}
				},
				filterForm:{
					cusId:'',
					isStopped:'2',
					isSettleDay:'2'
				},
				cusPicker:{
					searchData:'',
					defaultIndex:-1,
				}
			}
		},
		methods:{
			getInitData( data ){
				let self = this;
				this.$request.staff.cred.wGetCusAmt( data ).then(res=>{

					self.info.leftPopup.data.realAmt = res.result.real_amt;
					self.info.leftPopup.data.queryTime = res.result.query_time;
					self.info.cell.data = res.result.result;
				});
			},
			cellClick( cusId ){
				sessionStorage.setItem('cred/wGetCusAmt/cusId',cusId);
				this.$router.push('/staff/cred/cusAmtDetail');
			},

			resetClick(){
				this.filterForm = {
					cusId:'',
					isStopped:'2',
					isSettleDay:'2'
				};
			},
			filterClick(){
				this.config.popup.rightFilter.show = false;
				this.getInitData( this.filterForm );
			},

			cusPickerCancel(){
				this.config.popup.cusPicker.show = false;
				this.filterForm.cusId = '';
			},
			cusPickerConfirm( result ){
				this.config.popup.cusPicker.show = false;
				this.filterForm.cusId = result.key;
			},
			getPageName(){
				return 'cred/wGetCusAmt';
			},
			filterRemClick( checked ){
				if( checked === false ){
					this.config.switch.checked = false;
					this.removeItem();
				}else{
					this.config.switch.checked = true;
					let save = JSON.stringify(Object.assign(this.filterForm,this.cusPicker));
					sessionStorage.setItem('cred/wGetCusAmt---pageConfig',save);
				}
			},
			removeItem(){
				sessionStorage.removeItem('cred/wGetCusAmt---pageConfig');
			}
		},
		mounted(){
			this.getInitData( this.filterForm );
		},
		created(){
			this.$store.commit('staff/setHeaderTitle','客户信用余额');
			if( sessionStorage.getItem('cred/wGetCusAmt---pageConfig') !== null  ){
				try{
					let config = JSON.parse(sessionStorage.getItem('cred/wGetCusAmt---pageConfig'));
					this.filterForm = {
						cusId: config.cusId,
						isStopped:config.isStopped,
						isSettleDay:config.isSettleDay
					};
					this.cusPicker = {
						searchData:config.searchData,
						defaultIndex:config.defaultIndex
					};
				}catch(err){
					sessionStorage.removeItem('cred/wGetCusAmt---pageConfig');
				}
			}	
		},
		computed:{
			
		},
		watch:{
			filterForm:{
				handler( val, oldVal ){
					this.config.switch.checked = false;
				},
				deep:true
			}
		}
	}
</script>